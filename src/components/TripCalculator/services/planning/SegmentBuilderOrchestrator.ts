
import { TripStop } from '../../types/TripStop';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { BalanceQualityMetrics } from './BalanceQualityMetrics';
import { DailySegment } from './TripPlanBuilder';
import { SegmentCreationLoop } from './SegmentCreationLoop';
import { SegmentValidationHelper } from './SegmentValidationHelper';

export class SegmentBuilderOrchestrator {
  /**
   * Orchestrate the complete segment building process
   */
  static async orchestrateSegmentBuilding(
    startStop: TripStop,
    destinations: TripStop[],
    allStops: TripStop[],
    totalDistance: number,
    driveTimeTargets: DriveTimeTarget[],
    balanceMetrics: any,
    endStop: TripStop
  ): Promise<DailySegment[]> {
    // Filter remaining stops to prevent duplication
    const remainingStops = SegmentValidationHelper.filterRemainingStops(
      allStops,
      startStop,
      endStop,
      destinations
    );

    // Create all daily segments - now with await
    const dailySegments = await SegmentCreationLoop.createDailySegments(
      startStop,
      destinations,
      endStop,
      remainingStops,
      totalDistance,
      driveTimeTargets,
      balanceMetrics
    );

    // Validate segment count
    const expectedDays = destinations.length + 1;
    SegmentValidationHelper.validateSegmentCount(dailySegments, expectedDays);

    // Log final balance summary
    this.logFinalSummary(balanceMetrics);

    return dailySegments;
  }

  /**
   * Log final balance summary
   */
  private static logFinalSummary(balanceMetrics: any): void {
    console.log(`🎯 Final balance summary: ${BalanceQualityMetrics.getBalanceSummary(balanceMetrics)}`);
  }
}
