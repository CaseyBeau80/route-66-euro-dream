import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { EnhancedDestinationSelector } from './EnhancedDestinationSelector';
import { TripSegmentBuilder } from './TripSegmentBuilder';
import { TripPlanUtils } from './TripPlanUtils';
import { TripStyleLogic } from './TripStyleLogic';

export class TripPlanningService {
  /**
   * Build enhanced trip plan with strict destination city enforcement
   */
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    tripDays: number,
    startCityName: string,
    endCityName: string,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): TripPlan {
    console.log(`🏗️ ENHANCED TRIP PLAN BUILDER: ${tripDays} days with strict destination city enforcement`);
    
    // STEP 1: Ensure start and end are destination cities
    if (!StrictDestinationCityEnforcer.isDestinationCity(startStop)) {
      console.warn(`⚠️ START CITY NOT A DESTINATION CITY: ${startStop.name} (${startStop.category})`);
    }
    if (!StrictDestinationCityEnforcer.isDestinationCity(endStop)) {
      console.warn(`⚠️ END CITY NOT A DESTINATION CITY: ${endStop.name} (${endStop.category})`);
    }

    // STEP 2: Select only destination cities for intermediate stops
    const selectedDestinationCities = EnhancedDestinationSelector.selectDestinationCitiesForTrip(
      startStop, endStop, allStops, tripDays
    );

    // STEP 3: Get style configuration
    const styleConfig = TripStyleLogic.getStyleConfig(tripStyle);

    // STEP 4: Build segments with destination cities only
    const segments = TripSegmentBuilder.buildSegmentsWithDestinationCities(
      startStop, endStop, selectedDestinationCities, tripDays, styleConfig
    );

    // STEP 5: Strict validation and sanitization
    const sanitizedSegments = StrictDestinationCityEnforcer.sanitizeTripPlan(segments);
    
    const validation = StrictDestinationCityEnforcer.validateTripPlan(sanitizedSegments);
    if (!validation.isValid) {
      console.error(`❌ TRIP PLAN VALIDATION FAILED:`, validation.violations);
    } else {
      console.log(`✅ TRIP PLAN VALIDATION PASSED: All stops are destination cities`);
    }

    const totalDistance = TripPlanUtils.calculateTotalDistance(startStop, endStop, selectedDestinationCities);

    return {
      id: TripPlanUtils.generateId(),
      title: `${tripDays}-Day Route 66 Journey: ${startCityName} to ${endCityName}`,
      startCity: startCityName,
      endCity: endCityName,
      startDate: new Date(),
      totalDays: tripDays,
      totalDistance,
      totalMiles: Math.round(totalDistance),
      totalDrivingTime: sanitizedSegments.reduce((total, segment) => total + (segment.driveTimeHours || 0), 0),
      segments: sanitizedSegments,
      dailySegments: sanitizedSegments,
      tripStyle,
      lastUpdated: new Date()
    };
  }

  private static createTripPlan(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    segments: any[],
    totalDistance: number,
    totalDrivingTime: any,
    tripStyle: 'balanced' | 'destination-focused'
  ): TripPlan {
    return {
      id: `trip-${Date.now()}`,
      title: `${startLocation} to ${endLocation} Route 66 Adventure`,
      startCity: startLocation,
      endCity: endLocation,
      startLocation,
      endLocation,
      startDate: new Date(),
      totalDays: travelDays,
      totalDistance,
      totalMiles: Math.round(totalDistance),
      totalDrivingTime,
      segments,
      dailySegments: segments,
      tripStyle,
      stops: [],
      lastUpdated: new Date()
    };
  }
}
