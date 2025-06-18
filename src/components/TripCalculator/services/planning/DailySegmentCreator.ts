
import { TripStop } from '../../types/TripStop';
import { DailySegment, DriveTimeCategory, RecommendedStop } from './TripPlanBuilder';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';

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
    console.log(`🏗️ STRICT: Creating ${totalDays} daily segments with destination city enforcement`);
    
    // FIXED: Filter to only use destination cities for overnight stops with proper type assertion
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops) as TripStop[];
    
    console.log(`🏛️ STRICT: Available destination cities for overnight stops: ${destinationCities.length}`);
    console.log(`🏛️ STRICT: Destination cities: ${destinationCities.map(stop => stop.name).join(', ')}`);
    
    // Calculate average distance per day
    const avgDistancePerDay = totalDistance / totalDays;
    console.log(`📏 STRICT: Target average distance per day: ${Math.round(avgDistancePerDay)} miles`);
    
    // Find intermediate overnight stops (destination cities only)
    const overnightStops = this.selectDestinationCityOvernightStops(
      startStop,
      endStop,
      destinationCities,
      totalDays,
      totalDistance
    );
    
    // Strict validation of all selected overnight stops
    const warnings: string[] = [];
    overnightStops.forEach((stop: TripStop) => {
      if (!StrictDestinationCityEnforcer.isDestinationCity(stop)) {
        warnings.push(`${stop.name} is not a destination city and was removed from overnight stops`);
      }
    });
    
    if (warnings.length > 0) {
      console.warn('🛡️ STRICT: Overnight stop validation warnings:', warnings);
    }
    
    // Create segments
    const segments: DailySegment[] = [];
    let currentStop = startStop;
    
    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      const dayEndStop = isLastDay ? endStop : overnightStops[day - 1];
      
      if (!dayEndStop) {
        console.error(`❌ STRICT: No end stop found for day ${day}`);
        continue;
      }
      
      // Create segment with strict validation
      const segment = this.createStrictSegment(
        currentStop,
        dayEndStop,
        allStops,
        day,
        totalDistance
      );
      
      if (segment) {
        segments.push(segment);
        currentStop = dayEndStop;
      }
    }
    
    console.log(`✅ STRICT: Created ${segments.length} validated daily segments`);
    return segments;
  }
  
  private static selectDestinationCityOvernightStops(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    totalDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🎯 STRICT: Selecting overnight stops from ${destinationCities.length} destination cities`);
    
    // Filter out start and end stops - with proper type assertion
    const availableStops = destinationCities.filter((stop): stop is TripStop => {
      return stop.id !== startStop.id && 
             stop.id !== endStop.id &&
             StrictDestinationCityEnforcer.isDestinationCity(stop);
    });
    
    console.log(`🏛️ STRICT: ${availableStops.length} available destination cities for overnight stops`);
    
    // Sort by distance from start to ensure geographic progression
    const sortedStops = availableStops.sort((a: TripStop, b: TripStop) => {
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
    
    console.log(`🏛️ STRICT: Need ${neededStops} overnight destination cities from ${sortedStops.length} available`);
    
    // Select stops based on ideal spacing
    for (let i = 1; i <= neededStops; i++) {
      const idealDistance = (totalDistance * i) / totalDays;
      
      // Find the destination city closest to the ideal distance
      let bestStop: TripStop | null = null;
      let bestStopDiff = Number.MAX_VALUE;
      
      for (const stop of sortedStops) {
        // Skip already selected stops
        if (overnightStops.some((s: TripStop) => s.id === stop.id)) continue;
        
        const stopDistance = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude, stop.latitude, stop.longitude
        );
        
        const diff = Math.abs(stopDistance - idealDistance);
        
        if (diff < bestStopDiff) {
          bestStop = stop;
          bestStopDiff = diff;
        }
      }
      
      if (bestStop && StrictDestinationCityEnforcer.isDestinationCity(bestStop)) {
        console.log(`🏛️ STRICT: Selected overnight destination: ${bestStop.name} (${bestStop.category})`);
        overnightStops.push(bestStop);
      } else if (bestStop) {
        console.warn(`⚠️ STRICT: Rejected non-destination city: ${bestStop.name} (${bestStop.category})`);
      } else {
        console.warn(`⚠️ STRICT: Could not find suitable destination city for day ${i + 1}`);
      }
    }
    
    // Sort overnight stops by distance from start for proper sequence
    const finalStops = overnightStops.sort((a: TripStop, b: TripStop) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, b.latitude, b.longitude
      );
      return distA - distB;
    });
    
    console.log(`🏛️ STRICT: Final overnight destinations: ${finalStops.map(stop => stop.name).join(' → ')}`);
    return finalStops;
  }
  
  private static createStrictSegment(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    day: number,
    totalDistance: number
  ): DailySegment {
    console.log(`🔨 STRICT: Creating Day ${day} segment: ${startStop.name} → ${endStop.name}`);
    
    // Calculate segment distance
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude
    );
    
    // Calculate drive time (Route 66 average speed: 50 mph)
    const driveTimeHours = segmentDistance / 50;
    
    // Find attractions along this segment (NOT destination cities for overnight)
    const segmentAttractions = this.findStrictAttractionsForSegment(
      startStop, endStop, allStops, 3
    );
    
    // Determine drive time category
    const driveTimeCategory = this.getDriveTimeCategory(driveTimeHours);
    
    // Create city display names
    const startCityDisplay = CityDisplayService.getCityDisplayName(startStop);
    const endCityDisplay = CityDisplayService.getCityDisplayName(endStop);
    
    console.log(`✅ STRICT: Day ${day} segment created: ${Math.round(segmentDistance)}mi, ${driveTimeHours.toFixed(1)}h, ${segmentAttractions.length} attractions`);
    
    return {
      day,
      title: `Day ${day}: ${startCityDisplay} to ${endCityDisplay}`,
      startCity: startCityDisplay,
      endCity: endCityDisplay,
      distance: segmentDistance,
      approximateMiles: Math.round(segmentDistance),
      drivingTime: driveTimeHours,
      driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
      stops: [startStop, endStop, ...segmentAttractions], // Add required stops property
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops: segmentAttractions.map((stop: TripStop) => ({
        stopId: stop.id, // Add required stopId
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
      attractions: segmentAttractions.map((stop: TripStop) => ({
        name: stop.name,
        title: stop.name,
        description: stop.description,
        city: stop.city || stop.city_name || 'Unknown',
        category: stop.category || 'attraction' // Add required category property
      })),
      driveTimeCategory: driveTimeCategory,
      routeSection: day <= Math.ceil(3) ? 'Early Route' : 
                   day <= Math.ceil(6) ? 'Mid Route' : 'Final Stretch'
    };
  }
  
  private static findStrictAttractionsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    maxAttractions: number
  ): TripStop[] {
    console.log(`🔍 STRICT: Finding attractions for ${startStop.name} → ${endStop.name}`);
    
    const directDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude
    );
    
    // Find stops along the route - EXCLUDE destination cities for attractions with proper type assertion
    const attractions = allStops.filter((stop): stop is TripStop => {
      // Skip start and end stops
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      // STRICT: Don't use destination cities as attractions in segments
      if (StrictDestinationCityEnforcer.isDestinationCity(stop)) {
        console.log(`🚫 STRICT: Excluding destination city from attractions: ${stop.name}`);
        return false;
      }
      
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
    const sortedAttractions = attractions.sort((a: TripStop, b: TripStop) => {
      if (a.category === 'attraction' && b.category !== 'attraction') return -1;
      if (b.category === 'attraction' && a.category !== 'attraction') return 1;
      if (a.category === 'historic_site' && b.category !== 'historic_site') return -1;
      if (b.category === 'historic_site' && a.category !== 'historic_site') return 1;
      return 0;
    });
    
    const selectedAttractions = sortedAttractions.slice(0, maxAttractions);
    console.log(`🎯 STRICT: Selected ${selectedAttractions.length} attractions: ${selectedAttractions.map(stop => stop.name).join(', ')}`);
    
    return selectedAttractions;
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
