
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { EnhancedDestinationSelectionService } from './EnhancedDestinationSelectionService';
import { SegmentBuilderService } from './SegmentBuilderService';
import { SubStopTiming } from './SubStopTimingCalculator';

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
    const dailySegments = SegmentBuilderService.buildSegmentsFromDestinations(
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
}
