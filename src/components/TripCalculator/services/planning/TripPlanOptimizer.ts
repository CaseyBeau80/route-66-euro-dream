
import { TripStop } from '../../types/TripStop';
import { TripPlan } from './TripPlanBuilder';
import { EnhancedDriveTimeBalancer, BalanceResult } from './EnhancedDriveTimeBalancer';
import { UnifiedTripPlanningService } from './UnifiedTripPlanningService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface OptimizationResult {
  finalPlan: TripPlan;
  optimizationSteps: string[];
  balanceMetrics: {
    isBalanced: boolean;
    averageDriveTime: number;
    maxDriveTime: number;
    violationCount: number;
  };
  wasOptimized: boolean;
}

export class TripPlanOptimizer {
  private static readonly MAX_OPTIMIZATION_ATTEMPTS = 5;
  private static readonly MAX_DRIVE_TIME = 8;
  private static readonly OPTIMAL_DRIVE_TIME = 6;

  /**
   * Optimize trip plan for balanced drive times with aggressive balancing
   */
  static optimizeTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): OptimizationResult {
    console.log(`🔧 TripPlanOptimizer: Starting aggressive optimization for ${requestedDays} days`);

    const optimizationSteps: string[] = [];
    let wasOptimized = false;

    // Pre-flight check for obvious issues
    const feasibilityCheck = this.validateTripFeasibility(startStop, endStop, requestedDays);
    
    if (!feasibilityCheck.isFeasible) {
      console.log(`⚠️ Trip not feasible with ${requestedDays} days, using recommended ${feasibilityCheck.recommendedDays}`);
      requestedDays = feasibilityCheck.recommendedDays || requestedDays + 2;
      wasOptimized = true;
      optimizationSteps.push(`Increased days from original request due to excessive drive times`);
    }

    // Iterative optimization approach
    let currentDays = requestedDays;
    let bestAnalysis: BalanceResult | null = null;
    let attempts = 0;

    while (attempts < this.MAX_OPTIMIZATION_ATTEMPTS) {
      console.log(`🔄 Optimization attempt ${attempts + 1} with ${currentDays} days`);
      
      const analysis = EnhancedDriveTimeBalancer.analyzeAndBalance(
        startStop,
        endStop,
        allStops,
        currentDays
      );

      console.log(`📊 Analysis: max drive ${analysis.maxDriveTime.toFixed(1)}h, violations: ${analysis.violationCount}`);

      // Check if this is acceptable
      if (analysis.maxDriveTime <= this.MAX_DRIVE_TIME && analysis.violationCount === 0) {
        console.log(`✅ Found balanced solution with ${currentDays} days`);
        bestAnalysis = analysis;
        break;
      }

      // If still too long, add another day
      if (analysis.maxDriveTime > this.MAX_DRIVE_TIME) {
        console.log(`❌ Still too long (${analysis.maxDriveTime.toFixed(1)}h max), adding another day`);
        currentDays++;
        wasOptimized = true;
        attempts++;
      } else {
        // This is the best we can do
        bestAnalysis = analysis;
        break;
      }
    }

    if (!bestAnalysis) {
      // Fallback - use last analysis
      bestAnalysis = EnhancedDriveTimeBalancer.analyzeAndBalance(
        startStop,
        endStop,
        allStops,
        currentDays
      );
    }

    // Record optimization steps
    if (currentDays !== requestedDays) {
      optimizationSteps.push(`Adjusted trip from ${requestedDays} to ${currentDays} days for balanced drive times`);
    }

    // Create final trip plan with optimized days
    const planningResult = UnifiedTripPlanningService.createTripPlan(
      startStop,
      endStop,
      allStops,
      currentDays,
      inputStartCity,
      inputEndCity
    );

    // Final metrics
    const balanceMetrics = {
      isBalanced: bestAnalysis.maxDriveTime <= this.MAX_DRIVE_TIME,
      averageDriveTime: Math.round(bestAnalysis.averageDriveTime * 10) / 10,
      maxDriveTime: Math.round(bestAnalysis.maxDriveTime * 10) / 10,
      violationCount: bestAnalysis.violationCount
    };

    // Update trip plan with optimization info
    const optimizedPlan: TripPlan = {
      ...planningResult.tripPlan,
      totalDays: currentDays,
      wasAdjusted: wasOptimized,
      originalDays: wasOptimized ? requestedDays : undefined,
      driveTimeBalance: {
        ...planningResult.tripPlan.driveTimeBalance,
        isBalanced: balanceMetrics.isBalanced,
        averageDriveTime: balanceMetrics.averageDriveTime,
        balanceQuality: this.getBalanceQuality(balanceMetrics.maxDriveTime, balanceMetrics.violationCount),
        suggestions: bestAnalysis.violationCount > 0 ? 
          [`Consider adding stops to break up ${balanceMetrics.maxDriveTime.toFixed(1)}h drive days`] : []
      }
    };

    console.log(`🎯 Optimization complete: ${wasOptimized ? 'Plan optimized' : 'No optimization needed'}`);
    console.log(`📈 Final metrics: ${currentDays} days, max ${balanceMetrics.maxDriveTime}h, avg ${balanceMetrics.averageDriveTime}h`);
    
    return {
      finalPlan: optimizedPlan,
      optimizationSteps,
      balanceMetrics,
      wasOptimized
    };
  }

  /**
   * Get balance quality based on metrics
   */
  private static getBalanceQuality(
    maxDriveTime: number,
    violationCount: number
  ): 'excellent' | 'good' | 'fair' | 'poor' {
    if (violationCount === 0 && maxDriveTime <= 6) return 'excellent';
    if (violationCount === 0 && maxDriveTime <= 8) return 'good';
    if (violationCount <= 1 && maxDriveTime <= 9) return 'fair';
    return 'poor';
  }

  /**
   * Quick validation check for pre-flight analysis
   */
  static validateTripFeasibility(
    startStop: TripStop,
    endStop: TripStop,
    requestedDays: number
  ): {
    isFeasible: boolean;
    issues: string[];
    recommendedDays?: number;
  } {
    const issues: string[] = [];
    
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    const totalDriveTime = totalDistance / 50; // 50 mph average
    const avgDailyDriveTime = totalDriveTime / requestedDays;

    console.log(`🔍 Feasibility check: ${totalDistance.toFixed(0)}mi in ${requestedDays} days = ${avgDailyDriveTime.toFixed(1)}h/day avg`);

    // Check if trip is feasible with requested days
    if (avgDailyDriveTime > this.MAX_DRIVE_TIME) {
      issues.push(`Average ${avgDailyDriveTime.toFixed(1)}h/day exceeds safe driving limits`);
      const recommendedDays = Math.ceil(totalDriveTime / this.OPTIMAL_DRIVE_TIME);
      console.log(`❌ Not feasible: recommending ${recommendedDays} days instead`);
      return {
        isFeasible: false,
        issues,
        recommendedDays
      };
    }

    if (avgDailyDriveTime > 7) {
      issues.push(`Average ${avgDailyDriveTime.toFixed(1)}h/day is quite long but manageable`);
    }

    console.log(`✅ Feasible with ${requestedDays} days`);
    return {
      isFeasible: true,
      issues
    };
  }
}
