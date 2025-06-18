
import { TripPlan } from './TripPlanTypes';
import { DailySegment } from './TripPlanTypes';
import { SupabaseDataService } from '../data/SupabaseDataService';
import { TripBoundaryService } from './TripBoundaryService';
import { SegmentBuilderService } from './SegmentBuilderService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { TripDataSanitizationService } from './TripDataSanitizationService';
import { SegmentCreationService } from './segments/SegmentCreationService';
import { TripStyleConfig, TripStyleLogic } from './TripStyleLogic';
import { SegmentEnrichmentService } from './SegmentEnrichmentService';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';
import { SegmentValidationService } from './SegmentValidationService';
import { TripCompletionService } from './TripCompletionService';
import { GoogleMapsIntegrationService } from '../GoogleMapsIntegrationService';

export class EnhancedTripPlanningService {
  /**
   * Plan a trip with enhanced logic, Google Maps integration, and data validation
   */
  static async planEnhancedTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<TripPlan> {
    console.log(`🚗 ENHANCED PLANNING: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle}`);

    try {
      // 0. Load all stops and configure trip style
      const allStops = await SupabaseDataService.fetchAllStops();
      const styleConfig: TripStyleConfig = TripStyleLogic.configureTripStyle(tripStyle);

      // 1. Identify boundary stops and initial route stops
      const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
        startLocation,
        endLocation,
        allStops
      );

      // 2. Determine drive time targets and balance metrics
      const { driveTimeTargets, balanceMetrics } = DriveTimeBalancingService.calculateDriveTimeTargets(
        travelDays,
        styleConfig
      );

      // 3. Build initial segments from optimized destinations
      const destinations = routeStops.slice(1, -1); // Remove start and end stops
      const segments = await SegmentBuilderService.buildSegmentsFromDestinations(
        startStop,
        destinations,
        routeStops,
        0, // totalDistance will be calculated later
        driveTimeTargets,
        balanceMetrics,
        endStop
      );

      // 4. Calculate total distance and driving time
      const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
      const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

      // 5. Create the trip plan
      const tripPlan: TripPlan = {
        id: `enhanced-trip-${Date.now()}`,
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

      // 10. Analyze trip completion - Fix: Use only one argument
      const completionAnalysis = TripCompletionService.analyzeTripCompletion(tripPlan);
      console.log('✅ Trip Completion Analysis:', completionAnalysis);

      return tripPlan;

    } catch (error) {
      console.error('❌ ENHANCED Trip planning failed:', error);
      throw error;
    }
  }

  /**
   * Plan a trip with validated segments and Google Maps integration
   */
  static async planTripWithGoogleMaps(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<TripPlan> {
    console.log(`🚗 GOOGLE MAPS PLANNING: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle}`);

    try {
      // 0. Load all stops and configure trip style
      const allStops = await SupabaseDataService.fetchAllStops();
      const styleConfig: TripStyleConfig = TripStyleLogic.configureTripStyle(tripStyle);

      // 1. Identify boundary stops
      const { startStop, endStop } = TripBoundaryService.findExactBoundaryStops(
        startLocation,
        endLocation,
        allStops
      );

      // 2. Calculate drive time targets
      const driveTimeTargets: DriveTimeTarget[] = DriveTimeBalancingService.generateDriveTimeTargets(
        travelDays,
        styleConfig
      );

      // 3. Initial segment - validated with Google Maps
      let currentStop = startStop;
      const dailySegments: DailySegment[] = [];

      for (let day = 1; day <= travelDays; day++) {
        const dayEndStop = (day === travelDays) ? endStop : null;

        // 4. Create validated segment
        let segment = await SegmentCreationService.createValidatedSegment(
          currentStop,
          dayEndStop || endStop,
          day,
          styleConfig
        );

        if (!segment) {
          // 5. If validation fails, create capped segment
          segment = await SegmentCreationService.createCappedSegment(
            currentStop,
            endStop,
            day,
            styleConfig
          );
        }

        dailySegments.push(segment);
        currentStop = endStop;
      }

      // 6. Enforce drive time limits
      const enforcedSegments = DriveTimeEnforcementService.enforceDriveTimeLimits(
        dailySegments,
        styleConfig
      );

      // 7. Enrich segments with additional data
      const enrichedSegments = await SegmentEnrichmentService.enrichSegments(
        enforcedSegments,
        allStops
      );

      // 8. Validate final segments
      const validationResult = SegmentValidationService.validateSegments(enrichedSegments);

      // 9. Create the trip plan
      const totalDistance = enrichedSegments.reduce((sum, seg) => sum + seg.distance, 0);
      const totalDrivingTime = enrichedSegments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

      const tripPlan: TripPlan = {
        id: `google-maps-trip-${Date.now()}`,
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
        segments: enrichedSegments,
        dailySegments: enrichedSegments,
        tripStyle,
        stops: [],
        lastUpdated: new Date()
      };

      // 10. Analyze trip completion - Fix: Use only one argument
      const completionAnalysis = TripCompletionService.analyzeTripCompletion(tripPlan);
      console.log('✅ Trip Completion Analysis:', completionAnalysis);

      return tripPlan;

    } catch (error) {
      console.error('❌ GOOGLE MAPS Trip planning failed:', error);
      throw error;
    }
  }

  // Replace the problematic category assignment with proper mapping
  private static mapDriveTimeCategory(category: string): 'short' | 'optimal' | 'long' | 'extreme' {
    switch (category) {
      case 'moderate':
        return 'optimal';
      case 'comfortable':
        return 'short';
      case 'extended':
        return 'long';
      default:
        return 'optimal';
    }
  }
}
