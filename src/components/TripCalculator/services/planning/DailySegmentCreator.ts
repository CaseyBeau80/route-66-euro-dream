
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { RouteStopSelectionService } from './RouteStopSelectionService';
import { SubStopTimingCalculator, SubStopTiming } from './SubStopTimingCalculator';
import { RouteProgressCalculator } from './RouteProgressCalculator';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { EnhancedDestinationSelectionService } from './EnhancedDestinationSelectionService';
import { BalanceQualityMetrics } from './BalanceQualityMetrics';

// Export SubStopTiming for external use
export type { SubStopTiming };

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  approximateMiles: number;
  recommendedStops: TripStop[];
  driveTimeHours: number;
  subStopTimings: SubStopTiming[];
  routeSection?: string;
  driveTimeCategory?: {
    category: 'short' | 'optimal' | 'long' | 'extreme';
    message: string;
    color: string;
  };
  balanceMetrics?: any;
}

export class DailySegmentCreator {
  /**
   * Create daily segments with advanced drive time balancing
   */
  static createBalancedDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    enhancedStops: TripStop[],
    tripDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🎯 Creating balanced daily segments for ${tripDays} days, ${Math.round(totalDistance)} miles`);
    console.log('🚀 Using enhanced drive time balancing system');

    // Calculate drive time targets for each day
    const driveTimeTargets = DriveTimeBalancingService.calculateDriveTimeTargets(
      totalDistance,
      tripDays
    );

    console.log(`📊 Drive time targets calculated:`, driveTimeTargets.map((t, i) => 
      `Day ${i + 1}: ${t.targetHours.toFixed(1)}h (${t.minHours.toFixed(1)}-${t.maxHours.toFixed(1)}h)`
    ));

    // Use enhanced destination selection with advanced balancing
    const enhancedResult = EnhancedDestinationSelectionService.selectBalancedDestinations(
      startStop,
      endStop,
      [...enhancedStops], // Make a copy to avoid mutations
      driveTimeTargets
    );

    console.log(`🎯 Enhanced destination selection complete:`);
    console.log(`   - Balance Grade: ${enhancedResult.balanceMetrics.qualityGrade}`);
    console.log(`   - Was Optimized: ${enhancedResult.wasOptimized}`);
    console.log(`   - Iterations: ${enhancedResult.iterations}`);

    // Build daily segments from selected destinations
    const dailySegments = this.buildSegmentsFromDestinations(
      startStop,
      enhancedResult.destinations,
      enhancedStops,
      totalDistance,
      driveTimeTargets,
      enhancedResult.balanceMetrics
    );

    console.log(`✅ Created ${dailySegments.length} balanced daily segments`);
    return dailySegments;
  }

  /**
   * Build daily segments from optimized destinations
   */
  private static buildSegmentsFromDestinations(
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
      const segmentStops = this.selectSegmentStops(
        currentStop, 
        dayDestination, 
        remainingStops, 
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

  /**
   * Legacy method for backward compatibility - now uses enhanced approach
   */
  static createSmartDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    enhancedStops: TripStop[],
    tripDays: number,
    totalDistance: number
  ): DailySegment[] {
    return this.createBalancedDailySegments(startStop, endStop, enhancedStops, tripDays, totalDistance);
  }

  /**
   * Select appropriate stops for a segment with drive time consideration
   */
  private static selectSegmentStops(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    driveTimeHours: number
  ): TripStop[] {
    return RouteStopSelectionService.selectStopsForSegment(startStop, endStop, availableStops, 2, driveTimeHours);
  }
}
