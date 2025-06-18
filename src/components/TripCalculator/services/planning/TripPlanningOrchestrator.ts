
import { TripPlan } from './TripPlanTypes';
import { DailySegment } from './TripPlanTypes';
import { SupabaseDataService } from '../data/SupabaseDataService';
import { TripBoundaryService } from './TripBoundaryService';
import { SegmentBuilderService } from './SegmentBuilderService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { TripStyleConfig, TripStyleLogic } from './TripStyleLogic';
import { TripCompletionService } from './TripCompletionService';

export interface OrchestrationData {
  allStops: any[];
  styleConfig: TripStyleConfig;
  startStop: any;
  endStop: any;
  routeStops: any[];
  driveTimeTargets: DriveTimeTarget[];
  balanceMetrics: any;
}

export class TripPlanningOrchestrator {
  /**
   * Orchestrate the complete trip planning process
   */
  static async orchestrateTripPlanning(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<OrchestrationData> {
    console.log(`🚗 ORCHESTRATING: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle}`);

    // 1. Load all stops and configure trip style
    const allStops = await SupabaseDataService.fetchAllStops();
    const styleConfig: TripStyleConfig = TripStyleLogic.configureTripStyle(tripStyle);

    // 2. Identify boundary stops and initial route stops
    const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
      startLocation,
      endLocation,
      allStops
    );

    // 3. Determine drive time targets and balance metrics
    const { driveTimeTargets, balanceMetrics } = DriveTimeBalancingService.calculateDriveTimeTargets(
      travelDays,
      styleConfig
    );

    return {
      allStops,
      styleConfig,
      startStop,
      endStop,
      routeStops,
      driveTimeTargets,
      balanceMetrics
    };
  }

  /**
   * Build the final trip plan from orchestration data
   */
  static async buildTripPlan(
    orchestrationData: OrchestrationData,
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<TripPlan> {
    const { startStop, endStop, routeStops, driveTimeTargets, balanceMetrics } = orchestrationData;

    // Build initial segments from optimized destinations
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

    // Calculate total distance and driving time
    const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    // Create the trip plan
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

    // Analyze trip completion
    const completionAnalysis = TripCompletionService.analyzeTripCompletion(tripPlan);
    console.log('✅ Trip Completion Analysis:', completionAnalysis);

    return tripPlan;
  }
}
