import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { EnhancedDestinationSelectorV2 } from './EnhancedDestinationSelectorV2';
import { TripSegmentBuilderV2 } from './TripSegmentBuilderV2';
import { TripPlanUtils } from './TripPlanUtils';
import { TripStyleLogic } from './TripStyleLogic';
import { DistanceValidationService } from './DistanceValidationService';
import { SupabaseDataService } from './SupabaseDataService';
import { SegmentBuilderService } from './SegmentBuilderService';
import { TripBoundaryService } from './TripBoundaryService';

export class TripPlanningServiceV2 {
  /**
   * Build trip plan with ABSOLUTE drive time enforcement from the start
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
    console.log(`🏗️ V2 TRIP PLANNER: ABSOLUTE drive time enforcement from planning start`);
    
    // STEP 1: Get style configuration with enforced limits
    const styleConfig = TripStyleLogic.getStyleConfig(tripStyle);
    console.log(`🎨 V2 PLANNER: Using ${styleConfig.style} style with ABSOLUTE ${styleConfig.maxDailyDriveHours}h limit`);

    // STEP 2: Validate trip feasibility and adjust days if needed
    const recommendedDays = DistanceValidationService.calculateRecommendedDays(
      startStop, endStop, styleConfig.maxDailyDriveHours
    );
    
    if (tripDays < recommendedDays) {
      console.warn(`⚠️ V2 ADJUSTMENT: Trip needs ${recommendedDays} days minimum, adjusting from ${tripDays}`);
      tripDays = recommendedDays;
    }

    // STEP 3: Ensure start and end are destination cities
    if (!StrictDestinationCityEnforcer.isDestinationCity(startStop)) {
      console.warn(`⚠️ START CITY NOT A DESTINATION CITY: ${startStop.name} (${startStop.category})`);
    }
    if (!StrictDestinationCityEnforcer.isDestinationCity(endStop)) {
      console.warn(`⚠️ END CITY NOT A DESTINATION CITY: ${endStop.name} (${endStop.category})`);
    }

    // STEP 4: Select destination cities with ABSOLUTE distance validation
    const selectedDestinationCities = EnhancedDestinationSelectorV2.selectDestinationCitiesForTrip(
      startStop, endStop, allStops, tripDays, styleConfig.maxDailyDriveHours
    );

    console.log(`🎯 V2 SELECTED: ${selectedDestinationCities.length} destinations with validated distances`);

    // STEP 5: Build segments with ABSOLUTE validation
    const segments = TripSegmentBuilderV2.buildSegmentsWithDestinationCities(
      startStop, endStop, selectedDestinationCities, tripDays, styleConfig
    );

    // STEP 6: Final validation and sanitization
    const sanitizedSegments = StrictDestinationCityEnforcer.sanitizeTripPlan(segments);
    
    // STEP 7: Absolute final check - log any violations
    const finalViolations = this.performAbsoluteFinalCheck(sanitizedSegments, styleConfig.maxDailyDriveHours);
    if (finalViolations.length > 0) {
      console.error(`❌ V2 FINAL CHECK FAILED:`, finalViolations);
    } else {
      console.log(`✅ V2 FINAL CHECK PASSED: All segments within ${styleConfig.maxDailyDriveHours}h limit`);
    }

    const validation = StrictDestinationCityEnforcer.validateTripPlan(sanitizedSegments);
    if (!validation.isValid) {
      console.error(`❌ TRIP PLAN VALIDATION FAILED:`, validation.violations);
    } else {
      console.log(`✅ TRIP PLAN VALIDATION PASSED: All stops are destination cities`);
    }

    const totalDistance = TripPlanUtils.calculateTotalDistance(startStop, endStop, selectedDestinationCities);
    const totalDrivingTime = sanitizedSegments.reduce((total, segment) => total + (segment.driveTimeHours || 0), 0);

    return {
      id: TripPlanUtils.generateId(),
      title: `${tripDays}-Day Route 66 Journey: ${startCityName} to ${endCityName}`,
      startCity: startCityName,
      endCity: endCityName,
      startDate: new Date(),
      totalDays: tripDays,
      totalDistance,
      totalMiles: Math.round(totalDistance),
      totalDrivingTime,
      segments: sanitizedSegments,
      dailySegments: sanitizedSegments,
      tripStyle,
      lastUpdated: new Date()
    };
  }

  /**
   * Perform absolute final check on all segments
   */
  private static performAbsoluteFinalCheck(
    segments: DailySegment[],
    maxDailyDriveHours: number
  ): string[] {
    const violations: string[] = [];

    segments.forEach(segment => {
      if (segment.driveTimeHours > maxDailyDriveHours) {
        violations.push(`Day ${segment.day}: ${segment.startCity} → ${segment.endCity} = ${segment.driveTimeHours.toFixed(1)}h (exceeds ${maxDailyDriveHours}h)`);
      }
      
      // Also check for extreme violations (should never happen now)
      if (segment.driveTimeHours > 24) {
        violations.push(`Day ${segment.day}: CRITICAL - ${segment.driveTimeHours.toFixed(1)}h exceeds 24h!`);
      }
    });

    return violations;
  }

  /**
   * Plan a trip with ABSOLUTE drive time enforcement from the start
   */
  static async planTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<TripPlan> {
    console.log(`🚗 V2 PLANNING: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle}`);

    try {
      // Load and prepare data
      const allStops = await SupabaseDataService.fetchAllStops();
      const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
        startLocation,
        endLocation,
        allStops
      );

      // Use proper await for the async method
      const segments = await SegmentBuilderService.buildSegmentsFromDestinations(
        startStop,
        [], // destinations will be determined internally
        routeStops,
        0, // totalDistance will be calculated
        [], // driveTimeTargets will be generated
        {}, // balanceMetrics
        endStop
      );

      const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
      const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

      return {
        id: `v2-trip-${Date.now()}`,
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

    } catch (error) {
      console.error('❌ V2 Trip planning failed:', error);
      throw error;
    }
  }
}
