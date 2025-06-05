
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { EnhancedDestinationSelectionService } from './EnhancedDestinationSelectionService';
import { SegmentBuilderService } from './SegmentBuilderService';
import { SubStopTiming, SegmentTiming } from './SubStopTimingCalculator';

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  approximateMiles: number;
  recommendedStops: TripStop[];
  driveTimeHours: number;
  subStopTimings: SegmentTiming[];
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
   * Create balanced daily segments using enhanced drive time balancing
   */
  static createBalancedDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    totalDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log('🎯 Creating balanced daily segments with enhanced drive time balancing');
    
    // Calculate drive time targets
    const driveTimeTargets = DriveTimeBalancingService.calculateDriveTimeTargets(
      totalDistance,
      totalDays
    );
    
    console.log(`📊 Drive time targets:`, driveTimeTargets.map((t, i) => 
      `Day ${i + 1}: ${t.targetHours.toFixed(1)}h (${t.minHours.toFixed(1)}-${t.maxHours.toFixed(1)}h)`
    ));

    // Use enhanced destination selection for optimal balance
    const destinationResult = EnhancedDestinationSelectionService.selectBalancedDestinations(
      startStop,
      endStop,
      availableStops,
      driveTimeTargets
    );

    console.log(`✅ Enhanced destination selection complete with ${destinationResult.iterations} iterations`);
    console.log(`📈 Balance Grade: ${destinationResult.balanceMetrics.qualityGrade}, Score: ${destinationResult.balanceMetrics.overallScore}/100`);

    // Build segments from optimized destinations
    const dailySegments = SegmentBuilderService.buildSegmentsFromDestinations(
      startStop,
      destinationResult.destinations,
      availableStops,
      totalDistance,
      driveTimeTargets,
      destinationResult.balanceMetrics
    );

    console.log(`🏁 Created ${dailySegments.length} balanced daily segments`);
    return dailySegments;
  }
}
