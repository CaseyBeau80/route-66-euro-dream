
import { TripStop } from '../../types/TripStop';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { DailySegment } from './TripPlanBuilder';
import { SegmentBuilderOrchestrator } from './SegmentBuilderOrchestrator';

export class SegmentBuilderService {
  /**
   * Build daily segments from optimized destinations with enhanced stop curation
   */
  static async buildSegmentsFromDestinations(
    startStop: TripStop,
    destinations: TripStop[],
    allStops: TripStop[],
    totalDistance: number,
    driveTimeTargets: DriveTimeTarget[],
    balanceMetrics: any,
    endStop: TripStop
  ): Promise<DailySegment[]> {
    return await SegmentBuilderOrchestrator.orchestrateSegmentBuilding(
      startStop,
      destinations,
      allStops,
      totalDistance,
      driveTimeTargets,
      balanceMetrics,
      endStop
    );
  }
}
