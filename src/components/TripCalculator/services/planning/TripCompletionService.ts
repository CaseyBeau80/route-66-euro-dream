
import { TripPlan } from './TripPlanTypes';

export interface TripCompletionAnalysis {
  isComplete: boolean;
  isCompleted: boolean; // Alias for backward compatibility
  completionScore: number;
  missingElements: string[];
  recommendations: string[];
  duplicateSegments: any[]; // For duplicate segment detection
  totalUsefulDays: number; // Actual useful days after optimization
  unusedDays: number; // Days that were removed/optimized
  originalDays?: number; // Original requested days
  optimizedDays?: number; // Final optimized days
  adjustmentReason?: string; // Reason for optimization
  confidence: number; // Planning confidence score (0-1)
  qualityMetrics: {
    hasValidSegments: boolean;
    hasReasonableDistances: boolean;
    hasBalancedDriveTimes: boolean;
    coversTotalRoute: boolean;
    driveTimeBalance: string; // 'excellent' | 'good' | 'fair' | 'poor'
    routeEfficiency: string; // 'excellent' | 'good' | 'fair' | 'poor'
    attractionCoverage: string; // 'excellent' | 'good' | 'fair' | 'poor'
    overallScore: number; // 0-1 overall quality score
  };
}

export class TripCompletionService {
  /**
   * Analyze trip completion and quality
   */
  static analyzeTripCompletion(tripPlan: TripPlan): TripCompletionAnalysis {
    console.log('📊 TripCompletionService: Analyzing trip completion');

    const missingElements: string[] = [];
    const recommendations: string[] = [];
    let completionScore = 0;

    // Check for valid segments
    const hasValidSegments = tripPlan.segments && tripPlan.segments.length > 0;
    if (hasValidSegments) {
      completionScore += 25;
    } else {
      missingElements.push('Valid trip segments');
    }

    // Check segment count matches expected days
    const expectedSegments = tripPlan.totalDays;
    const actualSegments = tripPlan.segments?.length || 0;
    const hasCorrectSegmentCount = actualSegments === expectedSegments;
    if (hasCorrectSegmentCount) {
      completionScore += 25;
    } else {
      missingElements.push(`Correct segment count (expected ${expectedSegments}, got ${actualSegments})`);
    }

    // Check for reasonable distances
    const hasReasonableDistances = this.validateDistances(tripPlan);
    if (hasReasonableDistances) {
      completionScore += 25;
    } else {
      missingElements.push('Reasonable daily distances');
      recommendations.push('Consider adjusting trip duration or route');
    }

    // Check for balanced drive times
    const hasBalancedDriveTimes = this.validateDriveTimes(tripPlan);
    if (hasBalancedDriveTimes) {
      completionScore += 25;
    } else {
      missingElements.push('Balanced daily drive times');
      recommendations.push('Consider redistributing distances across days');
    }

    // Additional quality checks
    if (tripPlan.totalDistance > 0) {
      completionScore += 5;
    }

    if (tripPlan.startLocation && tripPlan.endLocation) {
      completionScore += 5;
    }

    const isComplete = completionScore >= 90;
    const coversTotalRoute = tripPlan.totalDistance > 1000; // Route 66 is ~2400 miles

    // Calculate quality metrics
    const driveTimeBalance = hasBalancedDriveTimes ? 'excellent' : completionScore > 70 ? 'good' : completionScore > 50 ? 'fair' : 'poor';
    const routeEfficiency = coversTotalRoute ? 'excellent' : completionScore > 70 ? 'good' : completionScore > 50 ? 'fair' : 'poor';
    const attractionCoverage = (tripPlan.segments?.length || 0) > 0 ? 'good' : 'fair';
    const overallScore = completionScore / 100;

    return {
      isComplete,
      isCompleted: isComplete, // Alias for backward compatibility
      completionScore,
      missingElements,
      recommendations,
      duplicateSegments: [], // No duplicate detection implemented yet
      totalUsefulDays: tripPlan.totalDays || 0,
      unusedDays: 0, // No optimization implemented yet
      originalDays: tripPlan.totalDays,
      optimizedDays: tripPlan.totalDays,
      adjustmentReason: undefined,
      confidence: overallScore,
      qualityMetrics: {
        hasValidSegments,
        hasReasonableDistances,
        hasBalancedDriveTimes,
        coversTotalRoute,
        driveTimeBalance,
        routeEfficiency,
        attractionCoverage,
        overallScore
      }
    };
  }

  /**
   * Validate that distances are reasonable for each day
   */
  private static validateDistances(tripPlan: TripPlan): boolean {
    if (!tripPlan.segments || tripPlan.segments.length === 0) {
      return false;
    }

    const unreasonableSegments = tripPlan.segments.filter(segment => 
      segment.distance < 50 || segment.distance > 600
    );

    return unreasonableSegments.length === 0;
  }

  /**
   * Validate that drive times are balanced and reasonable
   */
  private static validateDriveTimes(tripPlan: TripPlan): boolean {
    if (!tripPlan.segments || tripPlan.segments.length === 0) {
      return false;
    }

    const driveTimes = tripPlan.segments.map(s => s.driveTimeHours || 0);
    const maxDriveTime = Math.max(...driveTimes);
    const minDriveTime = Math.min(...driveTimes);

    // Check that no day has extreme drive times
    if (maxDriveTime > 10 || minDriveTime < 1) {
      return false;
    }

    // Check that drive times aren't too imbalanced
    const driveTimeRange = maxDriveTime - minDriveTime;
    return driveTimeRange <= 6; // Max 6 hour difference between shortest and longest day
  }
}
