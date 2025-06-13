
import { TripStop } from '../../types/TripStop';
import { DailySegment, DriveTimeCategory } from './TripPlanBuilder';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DestinationCityValidator } from '../validation/DestinationCityValidator';

export class DailySegmentCreator {
  /**
   * Create balanced daily segments ensuring only destination cities are used for overnight stops
   */
  static createBalancedDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🏗️ Creating ${totalDays} daily segments with destination city validation`);
    
    // FIXED: Filter to only use destination cities for overnight stops
    const destinationCities = DestinationCityValidator.filterDestinationCities(
      allStops, 
      'overnight_stop_selection'
    );
    
    console.log(`🏛️ Available destination cities for overnight stops: ${destinationCities.length}`);
    
    // Calculate average distance per day
    const avgDistancePerDay = totalDistance / totalDays;
    console.log(`📏 Target average distance per day: ${Math.round(avgDistancePerDay)} miles`);
    
    // Find intermediate overnight stops (destination cities only)
    const overnightStops = this.selectOvernightStops(
      startStop,
      endStop,
      destinationCities,
      totalDays,
      totalDistance
    );
    
    // Validate all selected overnight stops
    const warnings = DestinationCityValidator.validateOvernightStops(overnightStops);
    if (warnings.length > 0) {
      console.warn('🛡️ Overnight stop validation warnings:', warnings);
    }
    
    // Create segments
    const segments: DailySegment[] = [];
    let currentStop = startStop;
    
    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      const dayEndStop = isLastDay ? endStop : overnightStops[day - 1];
      
      if (!dayEndStop) {
        console.error(`❌ No end stop found for day ${day}`);
        continue;
      }
      
      // Create segment with validation
      const segment = this.createSingleSegment(
        currentStop,
        dayEndStop,
        allStops, // Use all stops for attractions, but destinations for overnight
        day,
        totalDistance
      );
      
      if (segment) {
        segments.push(segment);
        currentStop = dayEndStop;
      }
    }
    
    console.log(`✅ Created ${segments.length} validated daily segments`);
    return segments;
  }
  
  private static selectOvernightStops(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    totalDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🎯 Selecting overnight stops from ${destinationCities.length} destination cities`);
    
    // Filter out start and end stops
    const availableStops = destinationCities.filter(stop => 
      stop.id !== startStop.id && stop.id !== endStop.id
    );
    
    // Sort by distance from start to ensure geographic progression
    const sortedStops = availableStops.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, b.latitude, b.longitude
      );
      return distA - distB;
    });
    
    const overnightStops: TripStop[] = [];
    const neededStops = totalDays - 1; // Don't count the final day
    
    console.log(`🏛️ Need ${neededStops} overnight destination cities from ${sortedStops.length} available`);
    
    // Select stops based on ideal spacing
    for (let i = 1; i <= neededStops; i++) {
      const idealDistance = (totalDistance * i) / totalDays;
      
      // Find the destination city closest to the ideal distance
      let bestStop: TripStop | null = null;
      let bestStopDiff = Number.MAX_VALUE;
      
      for (const stop of sortedStops) {
        // Skip already selected stops
        if (overnightStops.some(s => s.id === stop.id)) continue;
        
        const stopDistance = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude, stop.latitude, stop.longitude
        );
        
        const diff = Math.abs(stopDistance - idealDistance);
        
        if (diff < bestStopDiff) {
          bestStop = stop;
          bestStopDiff = diff;
        }
      }
      
      if (bestStop) {
        console.log(`🏛️ Selected overnight destination: ${bestStop.name} (${bestStop.category})`);
        overnightStops.push(bestStop);
      } else {
        console.warn(`⚠️ Could not find suitable destination city for day ${i + 1}`);
      }
    }
    
    // Sort overnight stops by distance from start for proper sequence
    return overnightStops.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, b.latitude, b.longitude
      );
      return distA - distB;
    });
  }
  
  private static createSingleSegment(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    day: number,
    totalDistance: number
  ): DailySegment {
    // Calculate segment distance
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude
    );
    
    // Calculate drive time (Route 66 average speed: 50 mph)
    const driveTimeHours = segmentDistance / 50;
    
    // Find attractions along this segment (not destination cities for overnight)
    const segmentAttractions = this.findAttractionsForSegment(
      startStop, endStop, allStops, 3
    );
    
    // Determine drive time category
    const driveTimeCategory = this.getDriveTimeCategory(driveTimeHours);
    
    // Create city display names
    const startCityDisplay = CityDisplayService.getCityDisplayName(startStop);
    const endCityDisplay = CityDisplayService.getCityDisplayName(endStop);
    
    return {
      day,
      title: `Day ${day}: ${startCityDisplay} to ${endCityDisplay}`,
      startCity: startCityDisplay,
      endCity: endCityDisplay,
      distance: segmentDistance,
      approximateMiles: Math.round(segmentDistance),
      drivingTime: driveTimeHours,
      driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops: segmentAttractions.map(stop => ({
        id: stop.id,
        name: stop.name,
        description: stop.description,
        latitude: stop.latitude,
        longitude: stop.longitude,
        category: stop.category,
        city_name: stop.city_name,
        state: stop.state,
        city: stop.city || stop.city_name || 'Unknown'
      })),
      attractions: segmentAttractions.map(stop => ({
        name: stop.name,
        title: stop.name,
        description: stop.description,
        city: stop.city || stop.city_name || 'Unknown'
      })),
      driveTimeCategory: driveTimeCategory,
      routeSection: day <= Math.ceil(3) ? 'Early Route' : 
                   day <= Math.ceil(6) ? 'Mid Route' : 'Final Stretch'
    };
  }
  
  private static findAttractionsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    maxAttractions: number
  ): TripStop[] {
    const directDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude
    );
    
    // Find stops along the route - exclude destination cities for attractions
    const attractions = allStops.filter(stop => {
      // Skip start and end stops
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      // FIXED: Don't use destination cities as attractions in segments
      if (stop.category === 'destination_city') return false;
      
      // Calculate if stop is along the route
      const distFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, stop.latitude, stop.longitude
      );
      const distToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude, endStop.latitude, endStop.longitude
      );
      
      const routeDeviation = (distFromStart + distToEnd) - directDistance;
      const isOnRoute = routeDeviation < (directDistance * 0.2);
      const isBetween = distFromStart < directDistance && distToEnd < directDistance;
      
      return isOnRoute && isBetween;
    });
    
    // Sort by priority - attractions first, then historic sites
    const sortedAttractions = attractions.sort((a, b) => {
      if (a.category === 'attraction' && b.category !== 'attraction') return -1;
      if (b.category === 'attraction' && a.category !== 'attraction') return 1;
      if (a.category === 'historic_site' && b.category !== 'historic_site') return -1;
      if (b.category === 'historic_site' && a.category !== 'historic_site') return 1;
      return 0;
    });
    
    return sortedAttractions.slice(0, maxAttractions);
  }
  
  private static getDriveTimeCategory(driveTimeHours: number): DriveTimeCategory {
    if (driveTimeHours <= 4) {
      return {
        category: 'short',
        message: `${driveTimeHours.toFixed(1)} hours - Relaxed pace with plenty of time for attractions`,
        color: 'text-green-800'
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'optimal',
        message: `${driveTimeHours.toFixed(1)} hours - Perfect balance of driving and exploration`,
        color: 'text-blue-800'
      };
    } else if (driveTimeHours <= 8) {
      return {
        category: 'long',
        message: `${driveTimeHours.toFixed(1)} hours - Substantial driving day, but manageable`,
        color: 'text-orange-800'
      };
    } else {
      return {
        category: 'extreme',
        message: `${driveTimeHours.toFixed(1)} hours - Very long driving day, consider breaking into multiple days`,
        color: 'text-red-800'
      };
    }
  }
}
