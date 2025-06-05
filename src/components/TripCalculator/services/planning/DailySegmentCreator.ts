
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { EnhancedDestinationSelectionService } from './EnhancedDestinationSelectionService';
import { SegmentBuilderService } from './SegmentBuilderService';
import { SubStopTiming, SegmentTiming } from './SubStopTimingCalculator';
import { StopValidationService } from './StopValidationService';

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
   * Create balanced daily segments using enhanced drive time balancing with validation
   */
  static createBalancedDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    totalDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log('🎯 Creating balanced daily segments with enhanced validation');
    
    // Validate and clean available stops first
    const validatedStops = StopValidationService.validateAndDeduplicateStops(
      availableStops,
      startStop,
      endStop
    );
    
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
      validatedStops,
      driveTimeTargets
    );

    console.log(`✅ Enhanced destination selection complete with ${destinationResult.iterations} iterations`);
    console.log(`📈 Balance Grade: ${destinationResult.balanceMetrics.qualityGrade}, Score: ${destinationResult.balanceMetrics.overallScore}/100`);

    // Build segments from optimized destinations
    const dailySegments = SegmentBuilderService.buildSegmentsFromDestinations(
      startStop,
      destinationResult.destinations,
      validatedStops,
      totalDistance,
      driveTimeTargets,
      destinationResult.balanceMetrics
    );

    // Validate final segments for circular references
    for (const segment of dailySegments) {
      if (!StopValidationService.validateSegmentTimings(segment.subStopTimings)) {
        console.error(`❌ Day ${segment.day} has circular reference issues`);
      }
    }

    console.log(`🏁 Created ${dailySegments.length} validated balanced daily segments`);
    return dailySegments;
  }
}
