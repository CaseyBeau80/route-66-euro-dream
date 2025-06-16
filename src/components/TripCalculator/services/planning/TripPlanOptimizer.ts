
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../data/SupabaseDataService';

export interface OptimizationResult {
  optimizedPlan: TripPlan;
  optimizationApplied: boolean;
  optimizationNotes: string[];
}

export class TripPlanOptimizer {
  /**
   * Optimize a trip plan for better balance and experience
   */
  static optimizeTripPlan(
    tripPlan: TripPlan,
    allStops: TripStop[]
  ): OptimizationResult {
    console.log('🔧 TripPlanOptimizer: Starting optimization');
    
    const optimizationNotes: string[] = [];
    let optimizationApplied = false;
    
    // Create a copy of the trip plan for optimization
    const optimizedPlan: TripPlan = {
      ...tripPlan,
      segments: [...tripPlan.segments],
      dailySegments: [...tripPlan.dailySegments],
      lastUpdated: new Date()
    };
    
    // Optimization 1: Balance drive times
    const balanceResult = this.balanceDriveTimes(optimizedPlan.segments);
    if (balanceResult.wasOptimized) {
      optimizedPlan.segments = balanceResult.optimizedSegments;
      optimizedPlan.dailySegments = balanceResult.optimizedSegments;
      optimizationApplied = true;
      optimizationNotes.push('Balanced drive times across days');
    }
    
    // Optimization 2: Improve stop selection
    const stopResult = this.optimizeStops(optimizedPlan.segments, allStops);
    if (stopResult.wasOptimized) {
      optimizedPlan.segments = stopResult.optimizedSegments;
      optimizedPlan.dailySegments = stopResult.optimizedSegments;
      optimizationApplied = true;
      optimizationNotes.push('Optimized attraction selection');
    }
    
    // Recalculate totals
    optimizedPlan.totalDrivingTime = optimizedPlan.segments.reduce(
      (total, segment) => total + (segment.driveTimeHours || 0), 0
    );
    
    console.log(`✅ TripPlanOptimizer: Optimization complete, applied: ${optimizationApplied}`);
    
    return {
      optimizedPlan,
      optimizationApplied,
      optimizationNotes
    };
  }
  
  private static balanceDriveTimes(segments: DailySegment[]): {
    optimizedSegments: DailySegment[];
    wasOptimized: boolean;
  } {
    // Simple drive time balancing logic
    const driveTimes = segments.map(s => s.driveTimeHours || 0);
    const maxDriveTime = Math.max(...driveTimes);
    const avgDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    
    // If max drive time is significantly higher than average, flag for optimization
    const wasOptimized = maxDriveTime > avgDriveTime * 1.5 && maxDriveTime > 8;
    
    if (wasOptimized) {
      console.log('⚖️ Drive time optimization suggested but not implemented in this version');
    }
    
    return {
      optimizedSegments: segments,
      wasOptimized: false // Not implementing actual optimization in this version
    };
  }
  
  private static optimizeStops(
    segments: DailySegment[], 
    allStops: TripStop[]
  ): {
    optimizedSegments: DailySegment[];
    wasOptimized: boolean;
  } {
    // Simple stop optimization - could be enhanced
    return {
      optimizedSegments: segments,
      wasOptimized: false // Not implementing actual optimization in this version
    };
  }
}
