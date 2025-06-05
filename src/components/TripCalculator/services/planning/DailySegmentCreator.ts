
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { EnhancedDestinationSelectionService } from './EnhancedDestinationSelectionService';
import { SegmentBuilderService } from './SegmentBuilderService';
import { SubStopTiming, SegmentTiming } from './SubStopTimingCalculator';
import { StopValidationService } from './StopValidationService';
import { DynamicRebalancingService } from './DynamicRebalancingService';
import { DestinationSelectionByDriveTime } from './DestinationSelectionByDriveTime';

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
   * Create balanced daily segments using enhanced drive time balancing with validation and rebalancing
   */
  static createBalancedDailySegments(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    totalDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log('🎯 Creating balanced daily segments with enhanced validation and rebalancing');
    
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

    // Step 1: Try to find intermediate destinations using geographic progression
    console.log('📍 Phase 1: Finding intermediate destinations with geographic progression');
    let destinations = DestinationSelectionByDriveTime.findIntermediateDestinations(
      startStop,
      endStop,
      validatedStops,
      totalDays
    );

    // Step 2: If we don't have enough destinations, use enhanced destination selection
    if (destinations.length < totalDays - 1) {
      console.log('📍 Phase 2: Enhanced destination selection for remaining days');
      const destinationResult = EnhancedDestinationSelectionService.selectBalancedDestinations(
        startStop,
        endStop,
        validatedStops,
        driveTimeTargets
      );
      
      // Merge with any destinations we already found
      const existingDestIds = new Set(destinations.map(d => d.id));
      const additionalDests = destinationResult.destinations.filter(d => !existingDestIds.has(d.id));
      
      destinations = [...destinations, ...additionalDests].slice(0, totalDays - 1);
    }

    // Step 3: Build initial segments from destinations
    console.log('📍 Phase 3: Building initial segments');
    let dailySegments = SegmentBuilderService.buildSegmentsFromDestinations(
      startStop,
      destinations,
      validatedStops,
      totalDistance,
      driveTimeTargets,
      { overallScore: 0, qualityGrade: 'C' }
    );

    // Step 4: Dynamic rebalancing to fix severe imbalances
    console.log('📍 Phase 4: Dynamic rebalancing for severe imbalances');
    const rebalancingResult = DynamicRebalancingService.rebalanceSevereDriveTimeImbalances(
      dailySegments,
      validatedStops,
      driveTimeTargets,
      startStop,
      endStop
    );

    if (rebalancingResult.wasRebalanced) {
      dailySegments = rebalancingResult.rebalancedSegments;
      console.log(`✅ Rebalancing applied: ${rebalancingResult.actions.join(', ')}`);
      
      if (rebalancingResult.newTotalDays && rebalancingResult.newTotalDays !== totalDays) {
        console.log(`📅 Trip days adjusted: ${totalDays} → ${rebalancingResult.newTotalDays}`);
      }
    }

    // Validate final segments for circular references
    for (const segment of dailySegments) {
      if (!StopValidationService.validateSegmentTimings(segment.subStopTimings)) {
        console.error(`❌ Day ${segment.day} has circular reference issues`);
      }
    }

    // Log final balance summary
    const finalDriveTimes = dailySegments.map(s => s.driveTimeHours);
    const finalImbalance = Math.max(...finalDriveTimes) - Math.min(...finalDriveTimes);
    console.log(`🏁 Created ${dailySegments.length} balanced daily segments with ${finalImbalance.toFixed(1)}h imbalance`);
    
    return dailySegments;
  }
}
