
import { TripStop } from '../data/SupabaseDataService';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { BalanceQualityMetrics } from './BalanceQualityMetrics';
import { DailySegment } from './DailySegmentCreator';
import { SegmentTimingCalculator } from './SegmentTimingCalculator';
import { SegmentStopCurator } from './SegmentStopCurator';
import { SegmentMetricsCalculator } from './SegmentMetricsCalculator';

export class SegmentBuilderService {
  /**
   * Build daily segments from optimized destinations with enhanced stop curation
   */
  static buildSegmentsFromDestinations(
    startStop: TripStop,
    destinations: TripStop[],
    allStops: TripStop[],
    totalDistance: number,
    driveTimeTargets: DriveTimeTarget[],
    balanceMetrics: any,
    endStop: TripStop
  ): DailySegment[] {
    const dailySegments: DailySegment[] = [];
    let currentStop = startStop;
    let remainingStops = [...allStops];

    // Remove start, destinations, and end stop from remaining stops to prevent duplication
    remainingStops = remainingStops.filter(stop => 
      stop.id !== startStop.id && 
      stop.id !== endStop.id &&
      !destinations.some(dest => dest.id === stop.id)
    );

    // Build all segments including the final one to endStop
    const totalDays = destinations.length + 1;
    
    for (let day = 1; day <= totalDays; day++) {
      const isLastDay = day === totalDays;
      const dayDestination = isLastDay ? endStop : destinations[day - 1];
      const driveTimeTarget = driveTimeTargets[day - 1];

      // Validate segment
      if (!SegmentMetricsCalculator.validateSegment(currentStop, dayDestination, day, isLastDay)) {
        continue;
      }

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

      dailySegments.push({
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
      });

      // Update for next iteration - remove used stops
      remainingStops = SegmentStopCurator.removeUsedStops(remainingStops, segmentStops);
      currentStop = dayDestination;
      
      console.log(`✅ Day ${day}: ${Math.round(segmentDistance)}mi to ${dayDestination.name} (${dayDestination.category}), ${totalSegmentDriveTime.toFixed(1)}h drive (${driveTimeCategory.category}), ${segmentStops.length} curated stops (${curatedSelection.attractions.length}A/${curatedSelection.waypoints.length}W/${curatedSelection.hiddenGems.length}H), ${routeSection}`);
    }

    // Validate we have the correct number of segments
    if (dailySegments.length !== totalDays) {
      console.error(`❌ Expected ${totalDays} segments, but created ${dailySegments.length}`);
    }

    // Log final balance summary
    console.log(`🎯 Final balance summary: ${BalanceQualityMetrics.getBalanceSummary(balanceMetrics)}`);

    return dailySegments;
  }
}
