
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';

export interface DailySegment {
  day: number;
  startCity: string;
  endCity: string;
  distance: number;
  driveTimeHours: number;
  recommendedStops?: TripStop[];
  attractions?: any[];
  driveTimeWarning?: string;
}

export interface TripPlan {
  title: string;
  startCity: string;
  endCity: string;
  totalDays: number;
  totalDistance: number;
  segments: DailySegment[];
  tripStyle?: 'balanced' | 'destination-focused';
}

export class TripPlanBuilder {
  /**
   * Build trip plan with STRICT destination city enforcement
   */
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    selectedDestinations: TripStop[],
    tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'
  ): TripPlan {
    console.log(`🏗️ STRICT: Building trip plan with ${selectedDestinations.length} destination cities`);
    
    // CRITICAL: Validate all destinations are destination cities
    const validation = StrictDestinationCityEnforcer.validateAllAreDestinationCities(selectedDestinations);
    if (!validation.isValid) {
      console.error(`❌ STRICT: Invalid destinations found:`, validation.violations);
      // Filter out invalid destinations
      const validDestinations = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(selectedDestinations);
      console.log(`🔧 STRICT: Using only ${validDestinations.length} valid destination cities`);
      selectedDestinations = validDestinations;
    }

    // Create route points: start → destinations → end
    const routePoints = [startStop, ...selectedDestinations, endStop];
    const segments: DailySegment[] = [];
    let totalDistance = 0;

    // Build segments between consecutive destination cities
    for (let i = 0; i < routePoints.length - 1; i++) {
      const currentPoint = routePoints[i];
      const nextPoint = routePoints[i + 1];
      
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentPoint.latitude,
        currentPoint.longitude,
        nextPoint.latitude,
        nextPoint.longitude
      );
      
      const driveTimeHours = segmentDistance / 60; // Assume 60 mph average
      totalDistance += segmentDistance;

      const segment: DailySegment = {
        day: i + 1,
        startCity: currentPoint.name,
        endCity: nextPoint.name,
        distance: segmentDistance,
        driveTimeHours,
        recommendedStops: [], // Will be populated later with destination cities only
        attractions: []
      };

      // Add drive time warning if over 8 hours
      if (driveTimeHours > 8) {
        segment.driveTimeWarning = `Long drive day: ${driveTimeHours.toFixed(1)} hours. Consider breaking this into multiple days.`;
      }

      segments.push(segment);
    }

    const tripPlan: TripPlan = {
      title: `${startStop.name} to ${endStop.name} Road Trip`,
      startCity: startStop.name,
      endCity: endStop.name,
      totalDays: segments.length,
      totalDistance,
      segments,
      tripStyle
    };

    console.log(`✅ STRICT: Trip plan built with ${segments.length} days, all destinations are cities`);
    return tripPlan;
  }

  /**
   * Validate trip plan ensures all overnight stops are destination cities
   */
  static validateTripPlan(tripPlan: TripPlan): { isValid: boolean; violations: string[] } {
    console.log(`🛡️ STRICT: Validating trip plan for destination city compliance`);
    
    return StrictDestinationCityEnforcer.validateTripPlan(tripPlan.segments);
  }

  /**
   * Sanitize trip plan to remove non-destination cities
   */
  static sanitizeTripPlan(tripPlan: TripPlan): TripPlan {
    console.log(`🧹 STRICT: Sanitizing trip plan to only include destination cities`);
    
    const sanitizedSegments = StrictDestinationCityEnforcer.sanitizeTripPlan(tripPlan.segments);
    
    return {
      ...tripPlan,
      segments: sanitizedSegments
    };
  }
}
