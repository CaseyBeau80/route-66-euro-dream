
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { IterativeDriveTimeBalancer } from './IterativeDriveTimeBalancer';
import { DriveTimeRedistributionService } from './DriveTimeRedistributionService';
import { BalanceQualityMetrics } from './BalanceQualityMetrics';

export interface EnhancedDestinationResult {
  destinations: TripStop[];
  balanceMetrics: any;
  wasOptimized: boolean;
  iterations: number;
}

export class EnhancedDestinationSelectionService {
  /**
   * Select destinations with advanced drive time balancing
   */
  static selectBalancedDestinations(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    driveTimeTargets: DriveTimeTarget[]
  ): EnhancedDestinationResult {
    console.log('🎯 Starting enhanced destination selection with drive time balancing');
    
    // Create a copy of available stops for manipulation
    const workingStops = [...availableStops];
    
    // Phase 1: Iterative balancing
    console.log('📍 Phase 1: Iterative drive time balancing');
    const balancingResult = IterativeDriveTimeBalancer.balanceDriveTimes(
      startStop,
      endStop,
      workingStops,
      driveTimeTargets
    );
    
    let finalSegments = balancingResult.segments;
    let wasOptimized = false;
    
    // Phase 2: Redistribution if needed
    if (!balancingResult.isBalanced) {
      console.log('📍 Phase 2: Drive time redistribution');
      const redistributionResult = DriveTimeRedistributionService.redistributeDriveTimes(
        finalSegments,
        workingStops,
        driveTimeTargets
      );
      
      finalSegments = redistributionResult.segments;
      wasOptimized = redistributionResult.actions.length > 0;
    }
    
    // Phase 3: Extract destinations and calculate final metrics
    const destinations = finalSegments.map(segment => segment.endStop);
    
    // Convert segments to daily segments format for metrics calculation
    const dailySegments = finalSegments.map(segment => ({
      day: segment.day,
      title: `Day ${segment.day}`,
      startCity: segment.startStop.name,
      endCity: segment.endStop.name,
      approximateMiles: Math.round(segment.distance),
      recommendedStops: [] as TripStop[],
      driveTimeHours: segment.driveTimeHours,
      subStopTimings: [] as any[]
    }));
    
    const balanceMetrics = BalanceQualityMetrics.calculateBalanceMetrics(dailySegments, driveTimeTargets);
    
    console.log(`✅ Enhanced destination selection complete:`);
    console.log(`   - Balance Grade: ${balanceMetrics.qualityGrade}`);
    console.log(`   - Overall Score: ${balanceMetrics.overallScore}/100`);
    console.log(`   - Variance: ${balanceMetrics.variance} hours`);
    console.log(`   - Was Optimized: ${wasOptimized}`);
    
    return {
      destinations,
      balanceMetrics,
      wasOptimized,
      iterations: balancingResult.iterations
    };
  }

  /**
   * Validate and adjust destinations for optimal balance
   */
  static validateAndAdjustBalance(
    destinations: TripStop[],
    startStop: TripStop,
    availableStops: TripStop[],
    driveTimeTargets: DriveTimeTarget[]
  ): {
    adjustedDestinations: TripStop[];
    improvements: string[];
    finalScore: number;
  } {
    console.log('🔍 Validating and adjusting destination balance');
    
    const improvements: string[] = [];
    let adjustedDestinations = [...destinations];
    
    // Calculate current segments
    let currentStop = startStop;
    const segments = adjustedDestinations.map((dest, index) => {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dest.latitude, dest.longitude
      );
      
      const segment = {
        startStop: currentStop,
        endStop: dest,
        distance,
        driveTimeHours: distance / 50,
        day: index + 1,
        isFixed: index === adjustedDestinations.length - 1
      };
      
      currentStop = dest;
      return segment;
    });
    
    // Check for improvements needed
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const target = driveTimeTargets[i];
      
      if (segment.driveTimeHours < target.minHours) {
        // Try to find a farther destination
        const betterDest = this.findFartherDestination(segment, availableStops, target);
        if (betterDest) {
          adjustedDestinations[i] = betterDest;
          improvements.push(`Extended Day ${i + 1} to ${betterDest.name} for better balance`);
        }
      } else if (segment.driveTimeHours > target.maxHours) {
        // Try to find a closer destination
        const betterDest = this.findCloserDestination(segment, availableStops, target);
        if (betterDest) {
          adjustedDestinations[i] = betterDest;
          improvements.push(`Shortened Day ${i + 1} to ${betterDest.name} for better balance`);
        }
      }
    }
    
    // Recalculate final score
    const finalSegments = this.recalculateSegments(startStop, adjustedDestinations);
    const dailySegments = finalSegments.map(segment => ({
      day: segment.day,
      title: `Day ${segment.day}`,
      startCity: segment.startStop.name,
      endCity: segment.endStop.name,
      approximateMiles: Math.round(segment.distance),
      recommendedStops: [] as TripStop[],
      driveTimeHours: segment.driveTimeHours,
      subStopTimings: [] as any[]
    }));
    
    const finalMetrics = BalanceQualityMetrics.calculateBalanceMetrics(dailySegments, driveTimeTargets);
    
    console.log(`🎯 Balance validation complete: ${improvements.length} improvements made`);
    
    return {
      adjustedDestinations,
      improvements,
      finalScore: finalMetrics.overallScore
    };
  }

  /**
   * Find a farther destination within constraints
   */
  private static findFartherDestination(
    segment: any,
    availableStops: TripStop[],
    target: DriveTimeTarget
  ): TripStop | null {
    const targetDistance = target.targetHours * 50; // 50 mph average
    
    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;
    
    for (const stop of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        segment.startStop.latitude, segment.startStop.longitude,
        stop.latitude, stop.longitude
      );
      
      if (distance <= segment.distance) continue; // Must be farther
      
      const driveTime = distance / 50;
      if (driveTime > target.maxHours) continue; // Must be within max
      
      const score = Math.abs(distance - targetDistance);
      
      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }
    
    return bestStop;
  }

  /**
   * Find a closer destination within constraints
   */
  private static findCloserDestination(
    segment: any,
    availableStops: TripStop[],
    target: DriveTimeTarget
  ): TripStop | null {
    const targetDistance = target.targetHours * 50; // 50 mph average
    
    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;
    
    for (const stop of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        segment.startStop.latitude, segment.startStop.longitude,
        stop.latitude, stop.longitude
      );
      
      if (distance >= segment.distance) continue; // Must be closer
      
      const driveTime = distance / 50;
      if (driveTime < target.minHours) continue; // Must be within min
      
      const score = Math.abs(distance - targetDistance);
      
      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }
    
    return bestStop;
  }

  /**
   * Recalculate segments after destination changes
   */
  private static recalculateSegments(startStop: TripStop, destinations: TripStop[]): any[] {
    let currentStop = startStop;
    
    return destinations.map((dest, index) => {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dest.latitude, dest.longitude
      );
      
      const segment = {
        startStop: currentStop,
        endStop: dest,
        distance,
        driveTimeHours: distance / 50,
        day: index + 1,
        isFixed: index === destinations.length - 1
      };
      
      currentStop = dest;
      return segment;
    });
  }
}
