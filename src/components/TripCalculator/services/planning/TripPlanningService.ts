
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../data/SupabaseDataService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { EnhancedDestinationSelector } from './EnhancedDestinationSelector';
import { TripSegmentBuilder } from './TripSegmentBuilder';
import { TripPlanUtils } from './TripPlanUtils';

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

    // STEP 3: Build segments with destination cities only
    const segments = TripSegmentBuilder.buildSegmentsWithDestinationCities(
      startStop, endStop, selectedDestinationCities, tripDays
    );

    // STEP 4: Strict validation and sanitization
    const sanitizedSegments = StrictDestinationCityEnforcer.sanitizeTripPlan(segments);
    
    const validation = StrictDestinationCityEnforcer.validateTripPlan(sanitizedSegments);
    if (!validation.isValid) {
      console.error(`❌ TRIP PLAN VALIDATION FAILED:`, validation.violations);
    } else {
      console.log(`✅ TRIP PLAN VALIDATION PASSED: All stops are destination cities`);
    }

    return {
      title: `${tripDays}-Day Route 66 Journey: ${startCityName} to ${endCityName}`,
      segments: sanitizedSegments,
      totalDays: tripDays,
      totalDistance: TripPlanUtils.calculateTotalDistance(startStop, endStop, selectedDestinationCities),
      tripStyle,
      startCity: startCityName,
      endCity: endCityName
    };
  }
}
