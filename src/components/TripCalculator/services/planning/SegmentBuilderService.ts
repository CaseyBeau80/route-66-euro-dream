
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { SubStopTimingCalculator } from './SubStopTimingCalculator';
import { RouteProgressCalculator } from './RouteProgressCalculator';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { BalanceQualityMetrics } from './BalanceQualityMetrics';
import { SegmentStopSelector } from './SegmentStopSelector';
import { DailySegment } from './DailySegmentCreator';

export class SegmentBuilderService {
  /**
   * Build daily segments from optimized destinations
   */
  static buildSegmentsFromDestinations(
    startStop: TripStop,
    destinations: TripStop[],
    allStops: TripStop[],
    totalDistance: number,
    driveTimeTargets: DriveTimeTarget[],
    balanceMetrics: any
  ): DailySegment[] {
    const dailySegments: DailySegment[] = [];
    let currentStop = startStop;
    let cumulativeDistance = 0;
    let remainingStops = [...allStops];

    for (let day = 1; day <= destinations.length; day++) {
      const dayDestination = destinations[day - 1];
      const driveTimeTarget = driveTimeTargets[day - 1];

      // Calculate distances and timings
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      const actualDriveTime = segmentDistance / 50; // 50 mph average

      // Select stops for this segment
      const segmentStops = SegmentStopSelector.selectStopsForSegment(
        currentStop, 
        dayDestination, 
        remainingStops, 
        2,
        actualDriveTime
      );
      
      const subStopTimings = SubStopTimingCalculator.calculateValidSubStopTimings(
        currentStop, 
        dayDestination, 
        segmentStops
      );
      
      const totalSegmentDriveTime = SubStopTimingCalculator.calculateTotalDriveTime(subStopTimings);
      const finalDriveTime = totalSegmentDriveTime > 0 ? totalSegmentDriveTime : actualDriveTime;

      // Get drive time category for this segment
      const driveTimeCategory = DriveTimeBalancingService.getDriveTimeCategory(finalDriveTime);

      // Determine route section
      const progressPercent = RouteProgressCalculator.calculateCumulativeProgress(
        cumulativeDistance + segmentDistance, 
        totalDistance
      );
      const routeSection = RouteProgressCalculator.getRouteSection(progressPercent);

      const startCityDisplay = CityDisplayService.getCityDisplayName(currentStop);
      const endCityDisplay = CityDisplayService.getCityDisplayName(dayDestination);

      // Include balance metrics on the first segment
      const segmentBalanceMetrics = day === 1 ? balanceMetrics : undefined;

      dailySegments.push({
        day,
        title: `Day ${day}: ${startCityDisplay} to ${endCityDisplay}`,
        startCity: startCityDisplay,
        endCity: endCityDisplay,
        approximateMiles: Math.round(segmentDistance),
        recommendedStops: segmentStops,
        driveTimeHours: Math.round(finalDriveTime * 10) / 10,
        subStopTimings: subStopTimings,
        routeSection,
        driveTimeCategory,
        balanceMetrics: segmentBalanceMetrics
      });

      // Update for next iteration - remove used stops
      segmentStops.forEach(stop => {
        const index = remainingStops.findIndex(s => s.id === stop.id);
        if (index > -1) remainingStops.splice(index, 1);
      });

      // Remove the day destination from remaining stops if it's not the final destination
      if (day < destinations.length) {
        const destIndex = remainingStops.findIndex(s => s.id === dayDestination.id);
        if (destIndex > -1) remainingStops.splice(destIndex, 1);
      }

      currentStop = dayDestination;
      cumulativeDistance += segmentDistance;
      
      console.log(`✅ Day ${day}: ${Math.round(segmentDistance)}mi to ${dayDestination.name} (${dayDestination.category}), ${finalDriveTime.toFixed(1)}h drive (${driveTimeCategory.category}), ${segmentStops.length} stops`);
    }

    // Log final balance summary
    console.log(`🎯 Final balance summary: ${BalanceQualityMetrics.getBalanceSummary(balanceMetrics)}`);

    return dailySegments;
  }
}
