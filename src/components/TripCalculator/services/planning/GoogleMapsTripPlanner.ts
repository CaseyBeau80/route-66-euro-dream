
import { TripPlan } from './TripPlanTypes';
import { DailySegment } from './TripPlanTypes';
import { SupabaseDataService } from '../data/SupabaseDataService';
import { TripBoundaryService } from './TripBoundaryService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { TripStyleConfig, TripStyleLogic } from './TripStyleLogic';
import { SegmentCreationService } from './segments/SegmentCreationService';
import { SegmentEnrichmentService } from './SegmentEnrichmentService';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';
import { SegmentValidationService } from './SegmentValidationService';
import { TripCompletionService } from './TripCompletionService';

export class GoogleMapsTripPlanner {
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

    // Load all stops and configure trip style
    const allStops = await SupabaseDataService.fetchAllStops();
    const styleConfig: TripStyleConfig = TripStyleLogic.configureTripStyle(tripStyle);

    // Identify boundary stops
    const { startStop, endStop } = TripBoundaryService.findExactBoundaryStops(
      startLocation,
      endLocation,
      allStops
    );

    // Calculate drive time targets
    const driveTimeTargets: DriveTimeTarget[] = DriveTimeBalancingService.generateDriveTimeTargets(
      travelDays,
      styleConfig
    );

    // Create daily segments
    const dailySegments = await this.createDailySegments(
      startStop,
      endStop,
      travelDays,
      styleConfig
    );

    // Process and enrich segments
    const processedSegments = await this.processSegments(dailySegments, styleConfig);

    // Build final trip plan
    return this.buildFinalTripPlan(
      processedSegments,
      startLocation,
      endLocation,
      travelDays,
      tripStyle
    );
  }

  /**
   * Create daily segments for the trip
   */
  private static async createDailySegments(
    startStop: any,
    endStop: any,
    travelDays: number,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment[]> {
    let currentStop = startStop;
    const dailySegments: DailySegment[] = [];

    for (let day = 1; day <= travelDays; day++) {
      const isLastDay = day === travelDays;
      const dayEndStop = isLastDay ? endStop : null;

      // Create validated segment
      let segment = await SegmentCreationService.createValidatedSegment(
        currentStop,
        dayEndStop || endStop,
        day,
        styleConfig
      );

      if (!segment) {
        // If validation fails, create capped segment
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

    return dailySegments;
  }

  /**
   * Process and enrich segments
   */
  private static async processSegments(
    dailySegments: DailySegment[],
    styleConfig: TripStyleConfig
  ): Promise<DailySegment[]> {
    // Enforce drive time limits
    const enforcedSegments = DriveTimeEnforcementService.enforceDriveTimeLimits(
      dailySegments,
      styleConfig
    );

    // Enrich segments with additional data
    const enrichedSegments = await SegmentEnrichmentService.enrichSegments(
      enforcedSegments
    );

    // Validate final segments
    const validationResult = SegmentValidationService.validateSegments(enrichedSegments);
    console.log('🔍 Segment validation result:', validationResult);

    return enrichedSegments;
  }

  /**
   * Build the final trip plan
   */
  private static buildFinalTripPlan(
    segments: DailySegment[],
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): TripPlan {
    const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

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
      segments,
      dailySegments: segments,
      tripStyle,
      stops: [],
      lastUpdated: new Date()
    };

    // Analyze trip completion
    const completionAnalysis = TripCompletionService.analyzeTripCompletion(tripPlan);
    console.log('✅ Trip Completion Analysis:', completionAnalysis);

    return tripPlan;
  }
}
