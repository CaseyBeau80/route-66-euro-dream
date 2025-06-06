
import { TripStop } from '../data/SupabaseDataService';
import { TripPlan } from './TripPlanBuilder';
import { EnhancedDriveTimeBalancer, BalanceResult } from './EnhancedDriveTimeBalancer';
import { UnifiedTripPlanningService } from './UnifiedTripPlanningService';

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
  private static readonly MAX_OPTIMIZATION_ATTEMPTS = 3;

  /**
   * Optimize trip plan for balanced drive times
   */
  static optimizeTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): OptimizationResult {
    console.log(`🔧 TripPlanOptimizer: Starting optimization for ${requestedDays} days`);

    const optimizationSteps: string[] = [];
    let wasOptimized = false;

    // Step 1: Analyze current plan with drive time balancer
    const balanceAnalysis = EnhancedDriveTimeBalancer.analyzeAndBalance(
      startStop,
      endStop,
      allStops,
      requestedDays
    );

    // Log analysis results
    console.log(`📊 Balance analysis: ${balanceAnalysis.isBalanced ? '✅ Balanced' : '❌ Needs optimization'}`);
    console.log(`📈 Max drive time: ${balanceAnalysis.maxDriveTime.toFixed(1)}h, Violations: ${balanceAnalysis.violationCount}`);

    // Determine optimal days
    let finalDays = requestedDays;
    if (!balanceAnalysis.isBalanced) {
      finalDays = balanceAnalysis.recommendedDays;
      wasOptimized = true;
      optimizationSteps.push(`Adjusted trip duration from ${requestedDays} to ${finalDays} days for better balance`);
    }

    // Step 2: Create optimized trip plan
    const finalPlan = UnifiedTripPlanningService.createTripPlan(
      startStop,
      endStop,
      allStops,
      finalDays,
      inputStartCity,
      inputEndCity
    );

    // Step 3: Validate final plan
    const validation = EnhancedDriveTimeBalancer.validateTripPlan(
      balanceAnalysis.segments
    );

    if (!validation.isValid) {
      optimizationSteps.push(`Validation found ${validation.violations.length} issues`);
      validation.recommendations.forEach(rec => optimizationSteps.push(`Recommendation: ${rec}`));
    }

    // Step 4: Apply any adjustments made by the balancer
    if (balanceAnalysis.adjustmentsMade.length > 0) {
      optimizationSteps.push(...balanceAnalysis.adjustmentsMade);
      wasOptimized = true;
    }

    // Final metrics
    const balanceMetrics = {
      isBalanced: balanceAnalysis.isBalanced,
      averageDriveTime: Math.round(balanceAnalysis.averageDriveTime * 10) / 10,
      maxDriveTime: Math.round(balanceAnalysis.maxDriveTime * 10) / 10,
      violationCount: balanceAnalysis.violationCount
    };

    // Update trip plan with optimization info
    const optimizedPlan: TripPlan = {
      ...finalPlan,
      wasAdjusted: wasOptimized,
      originalDays: wasOptimized ? requestedDays : undefined,
      driveTimeBalance: {
        ...finalPlan.driveTimeBalance,
        isBalanced: balanceMetrics.isBalanced,
        averageDriveTime: balanceMetrics.averageDriveTime,
        balanceQuality: this.getBalanceQuality(balanceMetrics.maxDriveTime, balanceMetrics.violationCount),
        suggestions: validation.recommendations
      }
    };

    console.log(`🎯 Optimization complete: ${wasOptimized ? 'Plan optimized' : 'No optimization needed'}`);
    
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
    
    const totalDistance = EnhancedDriveTimeBalancer['calculateDistance'](startStop, endStop);
    const totalDriveTime = totalDistance / 50; // 50 mph average
    const avgDailyDriveTime = totalDriveTime / requestedDays;

    // Check if trip is feasible with requested days
    if (avgDailyDriveTime > 10) {
      issues.push(`Average ${avgDailyDriveTime.toFixed(1)}h/day exceeds safe driving limits`);
      const recommendedDays = Math.ceil(totalDriveTime / 8);
      return {
        isFeasible: false,
        issues,
        recommendedDays
      };
    }

    if (avgDailyDriveTime > 8) {
      issues.push(`Average ${avgDailyDriveTime.toFixed(1)}h/day is quite long but manageable`);
    }

    return {
      isFeasible: true,
      issues
    };
  }
}
