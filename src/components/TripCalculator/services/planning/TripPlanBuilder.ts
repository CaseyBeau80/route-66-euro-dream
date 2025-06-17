
import { TripStop } from '../data/SupabaseDataService';
import { DailySegment, RouteProgression } from './TripPlanTypes';
import { SequenceOrderService } from './SequenceOrderService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';

// Re-export types from the unified location
export type { 
  DriveTimeCategory, 
  RecommendedStop, 
  WeatherData, 
  DriveTimeBalance, 
  TripPlan, 
  DailySegment, 
  SegmentTiming,
  RouteProgression
} from './TripPlanTypes';

// Add utility functions that components expect
export const getDestinationCityName = (segment: DailySegment | { city: string; state: string }): string => {
  if ('endCity' in segment) {
    return segment.endCity || segment.destination?.city || 'Unknown';
  }
  return segment.city || 'Unknown';
};

export class TripPlanDataValidator {
  static validateTripPlan(tripPlan: any): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!tripPlan) {
      issues.push('Trip plan is null or undefined');
      return { isValid: false, issues };
    }
    
    if (!tripPlan.segments || tripPlan.segments.length === 0) {
      issues.push('No segments found in trip plan');
    }
    
    if (!tripPlan.totalDays || tripPlan.totalDays <= 0) {
      issues.push('Invalid total days');
    }
    
    return { isValid: issues.length === 0, issues };
  }
  
  static validateDailySegment(segment: any, context?: string): boolean {
    if (!segment) return false;
    return !!(segment.day && segment.startCity && segment.endCity);
  }

  static sanitizeTripPlan(tripPlan: any): any {
    const sanitized = {
      ...tripPlan,
      segments: (tripPlan.segments || []).map((segment: any) => ({
        ...segment,
        stops: segment.stops || [],
        drivingTime: segment.drivingTime || segment.driveTimeHours || 0,
        distance: segment.distance || 0,
        driveTimeHours: segment.driveTimeHours || 0
      })),
      totalDays: tripPlan.totalDays || 0,
      totalDistance: tripPlan.totalDistance || 0,
      totalDrivingTime: tripPlan.totalDrivingTime || 0
    };

    return sanitized;
  }
}

export class TripPlanBuilder {
  static createTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    travelDays: number,
    startLocation: string,
    endLocation: string,
    tripStyle: string = 'balanced'
  ): any {
    console.log(`🗺️ Creating sequence-aware trip plan: ${startLocation} → ${endLocation} (${travelDays} days)`);
    
    // Determine trip direction based on sequence order
    const direction = SequenceOrderService.getTripDirection(startStop, endStop);
    console.log(`🧭 Trip direction: ${direction}`);
    
    // Filter destination cities only and remove start/end stops
    const destinationCities = allStops.filter(stop => 
      stop.category === 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );
    
    // Filter stops that maintain proper sequence progression
    const validStops = SequenceOrderService.filterStopsInSequence(
      startStop, 
      destinationCities, 
      direction
    );
    
    // Sort by sequence order for the trip direction
    const sortedStops = SequenceOrderService.sortBySequence(validStops, direction);
    
    console.log(`📍 Found ${sortedStops.length} valid destination cities in ${direction} direction`);
    
    // Calculate total trip distance and target daily distance
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    const targetDailyDistance = totalDistance / travelDays;
    
    console.log(`📏 Total distance: ${totalDistance.toFixed(0)} miles, target per day: ${targetDailyDistance.toFixed(0)} miles`);
    
    // Select intermediate destinations using sequence-aware logic
    const selectedDestinations = this.selectSequenceAwareDestinations(
      startStop,
      endStop,
      sortedStops,
      travelDays,
      targetDailyDistance,
      direction
    );
    
    // Create segments with selected destinations
    const segments = this.createSequentialSegments(
      startStop,
      endStop,
      selectedDestinations,
      totalDistance
    );
    
    // Validate sequence progression
    const allTripStops = [startStop, ...selectedDestinations, endStop];
    const sequenceValidation = SequenceOrderService.validateSequenceProgression(allTripStops);
    
    if (!sequenceValidation.isValid) {
      console.warn(`⚠️ Sequence violations detected:`, sequenceValidation.violations);
    } else {
      console.log(`✅ Sequence progression validated for ${direction} travel`);
    }
    
    // Calculate totals
    const totalDrivingTime = segments.reduce((sum, segment) => sum + segment.driveTimeHours, 0);
    
    return {
      id: `trip-${Date.now()}`,
      segments,
      dailySegments: segments,
      totalDays: travelDays,
      totalDistance,
      totalDrivingTime,
      totalMiles: totalDistance,
      startCity: startLocation,
      endCity: endLocation,
      startDate: new Date(),
      title: `${startLocation} to ${endLocation} Adventure`,
      tripStyle,
      summary: {
        totalDays: travelDays,
        totalDistance,
        totalDriveTime: totalDrivingTime,
        startLocation,
        endLocation,
        tripStyle
      }
    };
  }

  /**
   * Select destinations that maintain sequence order and distribute evenly
   */
  private static selectSequenceAwareDestinations(
    startStop: TripStop,
    endStop: TripStop,
    sortedStops: TripStop[],
    travelDays: number,
    targetDailyDistance: number,
    direction: 'eastbound' | 'westbound'
  ): TripStop[] {
    const selectedDestinations: TripStop[] = [];
    const usedStopIds = new Set<string>();
    let currentStop = startStop;
    
    // We need (travelDays - 1) intermediate destinations
    const neededDestinations = travelDays - 1;
    
    console.log(`🎯 Selecting ${neededDestinations} intermediate destinations`);
    
    for (let day = 1; day <= neededDestinations; day++) {
      const targetDistanceFromStart = targetDailyDistance * day;
      
      // Filter out already used stops
      const availableStops = sortedStops.filter(stop => 
        !usedStopIds.has(stop.id)
      );
      
      if (availableStops.length === 0) {
        console.log(`⚠️ No more available stops for day ${day + 1}`);
        break;
      }
      
      // Select next stop in sequence that's closest to target distance
      const nextStop = SequenceOrderService.selectNextInSequence(
        currentStop,
        availableStops,
        direction,
        targetDailyDistance
      );
      
      if (nextStop) {
        selectedDestinations.push(nextStop);
        usedStopIds.add(nextStop.id);
        currentStop = nextStop;
        
        const actualDistance = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          nextStop.latitude, nextStop.longitude
        );
        
        console.log(`✅ Day ${day + 1}: Selected ${nextStop.name} (${actualDistance.toFixed(0)} miles from start)`);
      } else {
        console.log(`⚠️ Could not find suitable destination for day ${day + 1}`);
        break;
      }
    }
    
    return selectedDestinations;
  }

  /**
   * Create segments with proper sequence validation and route progression
   */
  private static createSequentialSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    totalDistance: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    const allStops = [startStop, ...destinations, endStop];
    
    for (let i = 0; i < allStops.length - 1; i++) {
      const current = allStops[i];
      const next = allStops[i + 1];
      const day = i + 1;
      
      const distance = DistanceCalculationService.calculateDistance(
        current.latitude, current.longitude,
        next.latitude, next.longitude
      );
      
      const driveTimeHours = distance / 55; // Assume 55 mph average speed
      
      const cumulativeDistance = segments.reduce((sum, seg) => sum + seg.distance, 0) + distance;
      const progressPercentage = (cumulativeDistance / totalDistance) * 100;
      
      // Create route progression object
      const routeProgression: RouteProgression = {
        segmentNumber: day,
        progressPercentage: Math.round(progressPercentage),
        cumulativeDistance: Math.round(cumulativeDistance),
        totalDistance: Math.round(totalDistance)
      };
      
      segments.push({
        day,
        title: `Day ${day}: ${current.name} to ${next.name}`,
        startCity: CityDisplayService.getCityDisplayName(current),
        endCity: CityDisplayService.getCityDisplayName(next),
        distance: distance,
        approximateMiles: Math.round(distance),
        driveTimeHours: driveTimeHours,
        destination: {
          city: next.city_name || next.name,
          state: next.state,
        },
        recommendedStops: [],
        attractions: [],
        routeSection: routeProgression
      });
    }
    
    return segments;
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3958.8; // Radius of the earth in miles
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
