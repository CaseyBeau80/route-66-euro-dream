
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { SubStopTimingCalculator, SegmentTiming } from './SubStopTimingCalculator';
import { RouteProgressCalculator } from './RouteProgressCalculator';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { BalanceQualityMetrics } from './BalanceQualityMetrics';
import { EnhancedSegmentStopSelector } from './EnhancedSegmentStopSelector';
import { DailySegment } from './DailySegmentCreator';

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

      // Enhanced stop curation with intelligent categorization
      const expectedDriveTime = segmentDistance / 50; // 50 mph average
      const curatedSelection = EnhancedSegmentStopSelector.selectCuratedStopsForSegment(
        currentStop,
        dayDestination,
        remainingStops,
        expectedDriveTime,
        {
          maxStops: 4,
          attractionRatio: 0.6, // 60% attractions, 40% waypoints/gems
          preferDestinationCities: true,
          diversityBonus: true
        }
      );

      // Combine all selected stops for backward compatibility
      const segmentStops = EnhancedSegmentStopSelector.combineSelectedStops(curatedSelection);
      
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

      // Calculate accurate cumulative distance for route section
      const previousSegments = dailySegments.map(s => ({ approximateMiles: s.approximateMiles }));
      const cumulativeDistance = RouteProgressCalculator.calculateAccurateCumulativeDistance(
        day - 1, 
        [...previousSegments, { approximateMiles: Math.round(segmentDistance) }]
      );
      
      const progressPercent = RouteProgressCalculator.calculateCumulativeProgress(
        cumulativeDistance, 
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
