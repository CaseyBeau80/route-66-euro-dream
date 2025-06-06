
import { TripStop } from '../../types/TripStop';
import { TripPlan, DailySegment } from './TripPlanBuilder';
import { DailySegmentCreator } from './DailySegmentCreator';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface TripPlanningResult {
  tripPlan: TripPlan;
  tripStyle: string;
  warnings?: string[];
}

export class UnifiedTripPlanningService {
  /**
   * Create a comprehensive trip plan with proper day calculation
   */
  static createTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedTripDays: number, // Use the REQUESTED days
    startCityName: string,
    endCityName: string,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): TripPlanningResult {
    console.log(`🎯 Creating ${tripStyle} trip plan for ${requestedTripDays} days from ${startCityName} to ${endCityName}`);

    // Calculate total distance for the trip
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    console.log(`📏 Total trip distance: ${Math.round(totalDistance)} miles`);

    // Filter stops for this route (between start and end geographically)
    const routeStops = this.filterStopsForRoute(startStop, endStop, allStops);
    console.log(`🛣️ Found ${routeStops.length} stops along the route`);

    // Create daily segments using the REQUESTED trip days
    const dailySegments = DailySegmentCreator.createBalancedDailySegments(
      startStop,
      endStop,
      routeStops,
      requestedTripDays, // Pass the exact requested days
      totalDistance
    );

    // Calculate total driving time (more realistic calculation)
    const totalDrivingTime = dailySegments.reduce(
      (total, segment) => total + (segment.drivingTime || segment.driveTimeHours || 0),
      0
    );

    console.log(`⏱️ Total driving time: ${totalDrivingTime.toFixed(1)} hours`);

    // Create city display names
    const startCityDisplay = CityDisplayService.getCityDisplayName(startStop);
    const endCityDisplay = CityDisplayService.getCityDisplayName(endStop);

    // Create the trip plan
    const tripPlan: TripPlan = {
      title: `${startCityDisplay} to ${endCityDisplay} Route 66 Adventure`,
      startCity: startCityDisplay,
      endCity: endCityDisplay,
      totalDistance: Math.round(totalDistance),
      totalDays: requestedTripDays, // Use REQUESTED days
      totalDrivingTime: totalDrivingTime,
      segments: dailySegments,
      dailySegments: dailySegments, // Legacy compatibility
      tripStyle,
      warnings: this.generateTripWarnings(dailySegments, tripStyle)
    };

    console.log(`✅ Trip plan created: ${tripPlan.totalDays} days, ${tripPlan.segments.length} segments, ${Math.round(tripPlan.totalDistance)} miles`);

    return {
      tripPlan,
      tripStyle,
      warnings: tripPlan.warnings
    };
  }

  /**
   * Filter stops that are geographically between start and end points
   */
  private static filterStopsForRoute(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[]
  ): TripStop[] {
    // Calculate the direct distance between start and end
    const directDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    // Filter stops that are roughly along the route
    return allStops.filter(stop => {
      // Skip start and end stops
      if (stop.id === startStop.id || stop.id === endStop.id) {
        return false;
      }

      // Calculate distances
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        stop.latitude,
        stop.longitude
      );

      const distanceToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude,
        stop.longitude,
        endStop.latitude,
        endStop.longitude
      );

      // Check if the stop is roughly along the path (triangle inequality)
      const routeDeviation = (distanceFromStart + distanceToEnd) - directDistance;
      const isOnRoute = routeDeviation < (directDistance * 0.3); // Within 30% deviation

      // Also ensure the stop is between start and end (not beyond either)
      const isBetween = distanceFromStart < directDistance * 1.1 && distanceToEnd < directDistance * 1.1;

      return isOnRoute && isBetween;
    });
  }

  /**
   * Generate warnings based on trip characteristics
   */
  private static generateTripWarnings(
    segments: DailySegment[],
    tripStyle: string
  ): string[] {
    const warnings: string[] = [];

    // Check for very long driving days
    const longDays = segments.filter(segment => 
      (segment.drivingTime || segment.driveTimeHours || 0) > 6
    );

    if (longDays.length > 0) {
      warnings.push(
        `${longDays.length} day(s) have over 6 hours of driving. Consider adding rest stops or extending your trip.`
      );
    }

    // Check for very short trip
    if (segments.length < 3) {
      warnings.push(
        'This is a short trip. Consider extending to fully experience Route 66 attractions.'
      );
    }

    // Style-specific warnings
    if (tripStyle === 'destination-focused' && segments.length > 7) {
      warnings.push(
        'Destination-focused trips work best with fewer days. Consider a balanced approach for longer trips.'
      );
    }

    return warnings;
  }
}
