
import { DailySegment, RecommendedStop } from './TripPlanTypes';
import { TripStop } from '../data/SupabaseDataService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { TripPlanUtils } from './TripPlanUtils';
import { TripStyleConfig } from './TripStyleLogic';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';
import { SegmentBalancingService } from './SegmentBalancingService';

export class TripSegmentBuilder {
  /**
   * Build segments with destination cities only and drive-time enforcement
   */
  static buildSegmentsWithDestinationCities(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    console.log(`🏗️ Building segments with drive-time enforcement: ${tripDays} days, ${styleConfig.style} style`);
    console.log(`🏗️ Destination cities provided: ${destinationCities.length}`, destinationCities.map(c => c.name));
    
    // CRITICAL FIX: Ensure we have the right number of stops for the trip days
    // For a 14-day trip, we need 13 intermediate destinations (startStop -> 13 destinations -> endStop)
    const neededIntermediateStops = tripDays - 1;
    
    console.log(`🏗️ CRITICAL: Need ${neededIntermediateStops} intermediate stops for ${tripDays} days`);
    
    // If we don't have enough destination cities, we need to space them out properly
    let selectedDestinations: TripStop[];
    
    if (destinationCities.length >= neededIntermediateStops) {
      // We have enough cities, select the best ones
      selectedDestinations = destinationCities.slice(0, neededIntermediateStops);
    } else if (destinationCities.length > 0) {
      // We don't have enough destination cities, so we need to space out what we have
      selectedDestinations = this.distributeDestinationsAcrossDays(
        destinationCities, 
        neededIntermediateStops
      );
    } else {
      // No destination cities available, create a direct route with intermediate points
      selectedDestinations = this.createIntermediatePoints(
        startStop,
        endStop,
        neededIntermediateStops
      );
    }
    
    console.log(`🏗️ FINAL SELECTED DESTINATIONS: ${selectedDestinations.length}`, selectedDestinations.map(c => c.name));
    
    // Create the complete trip stops array
    const allTripStops = [startStop, ...selectedDestinations, endStop];
    
    console.log(`🏗️ ALL TRIP STOPS (${allTripStops.length}):`, allTripStops.map(s => s.name));
    
    // Validate we have the right number of stops
    if (allTripStops.length !== tripDays + 1) {
      console.error(`❌ MISMATCH: Expected ${tripDays + 1} stops, got ${allTripStops.length}`);
    }
    
    // Create segments for each day
    const segments: DailySegment[] = [];
    
    for (let day = 1; day <= tripDays; day++) {
      const currentStop = allTripStops[day - 1];
      const nextStop = allTripStops[day];
      
      if (!currentStop || !nextStop) {
        console.error(`❌ Missing stop for day ${day}: current=${currentStop?.name}, next=${nextStop?.name}`);
        continue;
      }
      
      const segment = this.createSingleSegment(
        currentStop,
        nextStop,
        day,
        styleConfig
      );
      
      if (segment) {
        segments.push(segment);
        console.log(`✅ Created segment for Day ${day}: ${currentStop.name} → ${nextStop.name}`);
      }
    }
    
    console.log(`🏗️ FINAL SEGMENTS COUNT: ${segments.length} (expected: ${tripDays})`);
    
    return segments;
  }

  /**
   * Distribute available destination cities across the required number of days
   */
  private static distributeDestinationsAcrossDays(
    availableDestinations: TripStop[],
    neededStops: number
  ): TripStop[] {
    if (availableDestinations.length >= neededStops) {
      return availableDestinations.slice(0, neededStops);
    }
    
    console.log(`🔄 Distributing ${availableDestinations.length} destinations across ${neededStops} stops`);
    
    // Calculate spacing - distribute cities evenly across the trip
    const spacing = Math.floor(neededStops / availableDestinations.length);
    const distributed: TripStop[] = [];
    
    for (let i = 0; i < neededStops; i++) {
      const cityIndex = Math.floor(i / spacing);
      const city = availableDestinations[Math.min(cityIndex, availableDestinations.length - 1)];
      
      // Avoid consecutive duplicates
      if (distributed.length === 0 || distributed[distributed.length - 1].id !== city.id) {
        distributed.push(city);
      } else if (cityIndex + 1 < availableDestinations.length) {
        // Use next city if available
        distributed.push(availableDestinations[cityIndex + 1]);
      } else {
        // Create intermediate point
        distributed.push(city); // For now, allow duplicate
      }
    }
    
    return distributed.slice(0, neededStops);
  }

  /**
   * Create intermediate points when no destination cities are available
   */
  private static createIntermediatePoints(
    startStop: TripStop,
    endStop: TripStop,
    neededStops: number
  ): TripStop[] {
    console.log(`🎯 Creating ${neededStops} intermediate points between ${startStop.name} and ${endStop.name}`);
    
    const intermediatePoints: TripStop[] = [];
    
    for (let i = 1; i <= neededStops; i++) {
      const progress = i / (neededStops + 1);
      
      const lat = startStop.latitude + (endStop.latitude - startStop.latitude) * progress;
      const lng = startStop.longitude + (endStop.longitude - startStop.longitude) * progress;
      
      const intermediatePoint: TripStop = {
        id: `intermediate-${i}`,
        name: `Day ${i} Stop`,
        city_name: `Day ${i} Destination`,
        city: `Day ${i} Destination`, // FIX: Add required city property
        state: startStop.state, // Use start state initially
        latitude: lat,
        longitude: lng,
        category: 'destination',
        description: `Intermediate stop for day ${i} of your Route 66 journey`
      };
      
      intermediatePoints.push(intermediatePoint);
    }
    
    return intermediatePoints;
  }

  /**
   * Create a single daily segment
   */
  private static createSingleSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): DailySegment | null {
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const driveTimeHours = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);
    
    // Validate drive time against style limits
    const validation = DriveTimeEnforcementService.validateSegmentDriveTime(
      startStop,
      endStop,
      styleConfig
    );
    
    // Only include destination cities as recommended stops with stopId
    const segmentStops = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly([endStop]);
    const recommendedStops: RecommendedStop[] = segmentStops.map(stop => ({
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
    }));
    
    const segment: DailySegment = {
      day,
      title: `Day ${day}: ${startStop.city_name || startStop.name} to ${endStop.city_name || endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance: segmentDistance,
      approximateMiles: Math.round(segmentDistance),
      driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops,
      attractions: recommendedStops.map(stop => ({
        name: stop.name,
        title: stop.name,
        description: stop.description,
        city: stop.city
      })),
      driveTimeCategory: TripPlanUtils.getDriveTimeCategory(driveTimeHours),
      routeSection: TripPlanUtils.getRouteSection(day, 14) // Use total days for route section
    };
    
    // Add drive-time validation warning if needed
    if (!validation.isValid && validation.recommendation) {
      segment.driveTimeWarning = validation.recommendation;
    }
    
    return segment;
  }

  /**
   * Create daily segments from start/end stop pairs
   */
  private static createDailySegmentsFromPairs(
    segmentPairs: Array<{ startStop: TripStop; endStop: TripStop }>,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    
    segmentPairs.forEach((pair, index) => {
      const day = index + 1;
      const { startStop, endStop } = pair;
      
      const segmentDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      const driveTimeHours = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);
      
      // Validate drive time against style limits
      const validation = DriveTimeEnforcementService.validateSegmentDriveTime(
        startStop,
        endStop,
        styleConfig
      );
      
      // Only include destination cities as recommended stops with stopId
      const segmentStops = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly([endStop]);
      const recommendedStops: RecommendedStop[] = segmentStops.map(stop => ({
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
      }));
      
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${startStop.city_name} to ${endStop.city_name}`,
        startCity: CityDisplayService.getCityDisplayName(startStop),
        endCity: CityDisplayService.getCityDisplayName(endStop),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        destination: {
          city: endStop.city_name,
          state: endStop.state
        },
        recommendedStops,
        attractions: recommendedStops.map(stop => ({
          name: stop.name,
          title: stop.name,
          description: stop.description,
          city: stop.city
        })),
        driveTimeCategory: TripPlanUtils.getDriveTimeCategory(driveTimeHours),
        routeSection: TripPlanUtils.getRouteSection(day, segmentPairs.length)
      };
      
      // Add drive-time validation warning if needed
      if (!validation.isValid && validation.recommendation) {
        segment.driveTimeWarning = validation.recommendation;
      }
      
      segments.push(segment);
      
      console.log(`📍 Day ${day}: ${startStop.name} → ${endStop.name} | ${segmentDistance.toFixed(1)}mi | ${driveTimeHours.toFixed(1)}h | Valid: ${validation.isValid}`);
    });
    
    return segments;
  }

  /**
   * Legacy method for backward compatibility
   */
  static buildSegmentsWithDestinationCitiesLegacy(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number
  ): DailySegment[] {
    // Use balanced style as default for legacy calls
    const defaultStyleConfig = {
      style: 'balanced' as const,
      maxDailyDriveHours: 6,
      preferDestinationCities: false,
      allowFlexibleStops: true,
      balancePriority: 'distance' as const
    };
    
    return this.buildSegmentsWithDestinationCities(
      startStop,
      endStop,
      destinationCities,
      tripDays,
      defaultStyleConfig
    );
  }
}
