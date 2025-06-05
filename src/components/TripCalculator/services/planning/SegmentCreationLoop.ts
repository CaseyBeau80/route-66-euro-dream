
import { TripStop } from '../data/SupabaseDataService';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { DailySegment } from './DailySegmentCreator';
import { SegmentStopCurator } from './SegmentStopCurator';
import { SegmentTimingCalculator } from './SegmentTimingCalculator';
import { SegmentMetricsCalculator } from './SegmentMetricsCalculator';
import { SegmentValidationHelper } from './SegmentValidationHelper';

export class SegmentCreationLoop {
  /**
   * Create all daily segments through iterative loop
   */
  static createDailySegments(
    startStop: TripStop,
    destinations: TripStop[],
    endStop: TripStop,
    remainingStops: TripStop[],
    totalDistance: number,
    driveTimeTargets: DriveTimeTarget[],
    balanceMetrics: any
  ): DailySegment[] {
    const dailySegments: DailySegment[] = [];
    let currentStop = startStop;
    let workingRemainingStops = [...remainingStops];

    const totalDays = destinations.length + 1;
    
    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      const dayDestination = isLastDay ? endStop : destinations[day - 1];
      const driveTimeTarget = driveTimeTargets[day - 1];

      // Validate segment
      if (!SegmentValidationHelper.validateDestination(currentStop, dayDestination, day)) {
        continue;
      }

      // Create the segment
      const segment = this.createSingleSegment(
        currentStop,
        dayDestination,
        workingRemainingStops,
        totalDistance,
        dailySegments,
        day,
        driveTimeTarget,
        balanceMetrics
      );

      if (segment) {
        dailySegments.push(segment);

        // Update for next iteration
        workingRemainingStops = SegmentStopCurator.removeUsedStops(
          workingRemainingStops, 
          segment.recommendedStops
        );
        currentStop = dayDestination;

        // Log segment creation
        this.logSegmentCreation(segment, day, dayDestination);
      }
    }

    return dailySegments;
  }

  /**
   * Create a single daily segment
   */
  private static createSingleSegment(
    currentStop: TripStop,
    dayDestination: TripStop,
    remainingStops: TripStop[],
    totalDistance: number,
    dailySegments: DailySegment[],
    day: number,
    driveTimeTarget: DriveTimeTarget,
    balanceMetrics: any
  ): DailySegment | null {
    // Curate stops for this segment
    const { segmentStops, curatedSelection } = SegmentStopCurator.curateStopsForSegment(
      currentStop,
      dayDestination,
      remainingStops
    );
    
    // Calculate segment timings and drive time
    const { segmentTimings, totalSegmentDriveTime, segmentDistance } = 
      SegmentTimingCalculator.calculateSegmentTimings(currentStop, dayDestination, segmentStops);

    // Get drive time category for this segment
    const driveTimeCategory = SegmentTimingCalculator.getDriveTimeCategory(totalSegmentDriveTime);

    // Calculate route progression metrics
    const { routeSection } = SegmentMetricsCalculator.calculateRouteMetrics(
      day, 
      segmentDistance, 
      totalDistance, 
      dailySegments
    );

    // Create city display names
    const { startCityDisplay, endCityDisplay } = SegmentMetricsCalculator.createCityDisplays(
      currentStop, 
      dayDestination
    );

    // Include balance metrics on the first segment
    const segmentBalanceMetrics = day === 1 ? balanceMetrics : undefined;

    return {
      day,
      title: `Day ${day}: ${startCityDisplay} to ${endCityDisplay}`,
      startCity: startCityDisplay,
      endCity: endCityDisplay,
      approximateMiles: Math.round(segmentDistance),
      recommendedStops: segmentStops,
      driveTimeHours: Math.round(totalSegmentDriveTime * 10) / 10,
      subStopTimings: segmentTimings,
      routeSection,
      driveTimeCategory,
      balanceMetrics: segmentBalanceMetrics
    };
  }

  /**
   * Log segment creation details
   */
  private static logSegmentCreation(
    segment: DailySegment,
    day: number,
    dayDestination: TripStop
  ): void {
    console.log(`✅ Day ${day}: ${segment.approximateMiles}mi to ${dayDestination.name} (${dayDestination.category}), ${segment.driveTimeHours}h drive (${segment.driveTimeCategory.category}), ${segment.recommendedStops.length} curated stops, ${segment.routeSection}`);
  }
}
