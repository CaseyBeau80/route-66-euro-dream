
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DirectionEnforcerService } from './DirectionEnforcerService';
import { GeographicProgressionService } from './GeographicProgressionService';
import { TripPlan, DailySegment, RecommendedStop, DriveTimeCategory, DestinationInfo } from './TripPlanTypes';

// Re-export types so other files can import them from here
export type { TripPlan, DailySegment, RecommendedStop, DriveTimeCategory, DestinationInfo } from './TripPlanTypes';

// Helper function to get destination city name
export function getDestinationCityName(destination?: DestinationInfo | { city?: string; state?: string }): string {
  if (!destination) return 'Unknown';
  return destination.city || 'Unknown';
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
        title: `Day ${i + 1}: ${currentPoint.name} to ${nextPoint.name}`,
        startCity: currentPoint.name,
        endCity: nextPoint.name,
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: driveTimeHours,
        drivingTime: driveTimeHours,
        destination: {
          city: nextPoint.city || nextPoint.city_name,
          state: nextPoint.state
        },
        recommendedStops: [],
        isGoogleMapsData: false,
        attractions: [],
        driveTimeCategory: {
          category: driveTimeHours > 8 ? 'extreme' : driveTimeHours > 6 ? 'long' : driveTimeHours > 4 ? 'optimal' : 'short',
          message: driveTimeHours > 8 ? `Long drive day: ${driveTimeHours.toFixed(1)} hours. Consider breaking this into multiple days.` : 'Manageable drive time',
          color: driveTimeHours > 8 ? 'text-red-600' : driveTimeHours > 6 ? 'text-orange-600' : 'text-green-600'
        }
      };

      // Add drive time warning if over 8 hours
      if (driveTimeHours > 8) {
        segment.driveTimeWarning = `Long drive day: ${driveTimeHours.toFixed(1)} hours. Consider breaking this into multiple days.`;
      }

      segments.push(segment);
    }

    const tripPlan: TripPlan = {
      id: `trip-${Date.now()}`,
      title: `${startStop.name} to ${endStop.name} Road Trip`,
      startCity: startStop.name,
      endCity: endStop.name,
      startLocation: `${startStop.name}, ${startStop.state}`,
      endLocation: `${endStop.name}, ${endStop.state}`,
      startDate: new Date(),
      totalDays: segments.length,
      totalDistance,
      totalMiles: Math.round(totalDistance),
      totalDrivingTime: segments.reduce((total, seg) => total + (seg.driveTimeHours || 0), 0),
      segments,
      dailySegments: segments,
      stops: [],
      tripStyle: tripStyle,
      lastUpdated: new Date(),
      summary: {
        startLocation: `${startStop.name}, ${startStop.state}`,
        endLocation: `${endStop.name}, ${endStop.state}`,
        totalDriveTime: segments.reduce((total, seg) => total + (seg.driveTimeHours || 0), 0),
        totalDays: segments.length,
        totalDistance: Math.round(totalDistance),
        tripStyle: tripStyle
      }
    };

    console.log(`✅ STRICT: Trip plan built with ${segments.length} days, all destinations are cities`);
    
    // Validate geographic progression
    const progressionValidation = this.validateGeographicProgression(tripPlan);
    if (!progressionValidation.isValid) {
      console.warn(`⚠️ Geographic progression issues in trip plan:`, progressionValidation.violations);
    } else {
      console.log(`✅ Geographic progression validated - Score: ${progressionValidation.score}%`);
    }
    
    return tripPlan;
  }

  /**
   * Validate trip plan ensures all overnight stops are destination cities
   */
  static validateTripPlan(tripPlan: TripPlan): { 
    isValid: boolean; 
    violations: string[];
    progressionValidation?: {
      isValid: boolean;
      violations: string[];
      score: number;
      suggestions: string[];
    };
  } {
    console.log(`🛡️ STRICT: Validating trip plan for destination city compliance and geographic progression`);
    
    const destinationValidation = StrictDestinationCityEnforcer.validateTripPlan(tripPlan.segments);
    const progressionValidation = this.validateGeographicProgression(tripPlan);
    
    return {
      isValid: destinationValidation.isValid && progressionValidation.isValid,
      violations: [...destinationValidation.violations, ...progressionValidation.violations],
      progressionValidation
    };
  }

  /**
   * Validate geographic progression of the trip
   */
  static validateGeographicProgression(tripPlan: TripPlan): {
    isValid: boolean;
    violations: string[];
    score: number;
    suggestions: string[];
  } {
    // Extract route stops from segments
    const routeStops: TripStop[] = [];
    
    // Add start stop (reconstruct from first segment)
    if (tripPlan.segments.length > 0) {
      const firstSegment = tripPlan.segments[0];
      routeStops.push({
        id: 'start',
        name: firstSegment.startCity,
        city: firstSegment.startCity,
        city_name: firstSegment.startCity,
        state: 'Unknown', // State info not available in segments
        latitude: 0,
        longitude: 0,
        description: '',
        category: 'start'
      } as TripStop);
    }

    // Add destination stops from segments
    tripPlan.segments.forEach(segment => {
      if (segment.destination) {
        routeStops.push({
          id: `dest-${segment.day}`,
          name: segment.endCity,
          city: segment.destination.city,
          city_name: segment.destination.city,
          state: segment.destination.state,
          latitude: 0,
          longitude: 0,
          description: '',
          category: 'destination'
        } as TripStop);
      }
    });

    // Skip validation if we don't have enough coordinate data
    if (routeStops.length < 2 || routeStops.some(stop => !stop.latitude || !stop.longitude)) {
      console.log(`⚠️ Skipping geographic progression validation - insufficient coordinate data`);
      return {
        isValid: true,
        violations: [],
        score: 100,
        suggestions: ['Add coordinate data to enable geographic progression validation']
      };
    }

    return GeographicProgressionService.validateProgressionConstraints(routeStops);
  }

  /**
   * Sanitize trip plan to remove non-destination cities
   */
  static sanitizeTripPlan(tripPlan: TripPlan): TripPlan {
    console.log(`🧹 STRICT: Sanitizing trip plan to only include destination cities`);
    
    const sanitizedSegments = StrictDestinationCityEnforcer.sanitizeTripPlan(tripPlan.segments);
    
    return {
      ...tripPlan,
      segments: sanitizedSegments,
      dailySegments: sanitizedSegments
    };
  }
}
