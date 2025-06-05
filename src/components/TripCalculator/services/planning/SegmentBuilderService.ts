
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { SubStopTimingCalculator, SegmentTiming } from './SubStopTimingCalculator';
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

    // Remove start and destinations from remaining stops to prevent duplication
    remainingStops = remainingStops.filter(stop => 
      stop.id !== startStop.id && !destinations.some(dest => dest.id === stop.id)
    );

    for (let day = 1; day <= destinations.length; day++) {
      const dayDestination = destinations[day - 1];
      const driveTimeTarget = driveTimeTargets[day - 1];

      // Validate destination
      if (!dayDestination || currentStop.id === dayDestination.id) {
        console.warn(`⚠️ Invalid destination for day ${day}`);
        continue;
      }

      // Calculate direct distance between current stop and destination
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      // Select stops for this segment
      const segmentStops = SegmentStopSelector.selectStopsForSegment(
        currentStop, 
        dayDestination, 
        remainingStops, 
        2,
        segmentDistance / 50 // Pass expected drive time
      );
      
      // Calculate segment timings for route progression display
      const segmentTimings = SubStopTimingCalculator.calculateSegmentTimings(
        currentStop, 
        dayDestination, 
        segmentStops
      );
      
      // Calculate actual drive time from segment timings
      let totalSegmentDriveTime = 0;
      if (segmentTimings.length > 0) {
        totalSegmentDriveTime = segmentTimings.reduce((total, timing) => total + timing.driveTimeHours, 0);
      } else {
        // Fallback to direct calculation if no timings
        totalSegmentDriveTime = segmentDistance / 50; // 50 mph average
      }

      // Validate drive time is reasonable
      if (totalSegmentDriveTime > 15) {
        console.warn(`⚠️ Excessive drive time ${totalSegmentDriveTime.toFixed(1)}h for day ${day}, using direct route`);
        totalSegmentDriveTime = segmentDistance / 50;
      }

      // Get drive time category for this segment
      const driveTimeCategory = DriveTimeBalancingService.getDriveTimeCategory(totalSegmentDriveTime);

      // Calculate route section based on cumulative progress
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
        driveTimeHours: Math.round(totalSegmentDriveTime * 10) / 10,
        subStopTimings: segmentTimings,
        routeSection,
        driveTimeCategory,
        balanceMetrics: segmentBalanceMetrics
      });

      // Update for next iteration - remove used stops
      segmentStops.forEach(stop => {
        const index = remainingStops.findIndex(s => s.id === stop.id);
        if (index > -1) remainingStops.splice(index, 1);
      });

      currentStop = dayDestination;
      cumulativeDistance += segmentDistance;
      
      console.log(`✅ Day ${day}: ${Math.round(segmentDistance)}mi to ${dayDestination.name} (${dayDestination.category}), ${totalSegmentDriveTime.toFixed(1)}h drive (${driveTimeCategory.category}), ${segmentStops.length} stops`);
    }

    // Log final balance summary
    console.log(`🎯 Final balance summary: ${BalanceQualityMetrics.getBalanceSummary(balanceMetrics)}`);

    return dailySegments;
  }
}
