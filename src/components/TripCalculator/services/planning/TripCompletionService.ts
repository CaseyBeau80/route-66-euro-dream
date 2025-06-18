
import { TripPlan } from './TripPlanTypes';

export interface TripCompletionAnalysis {
  isComplete: boolean;
  completionScore: number;
  missingElements: string[];
  recommendations: string[];
  qualityMetrics: {
    hasValidSegments: boolean;
    hasReasonableDistances: boolean;
    hasBalancedDriveTimes: boolean;
    coversTotalRoute: boolean;
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

    return {
      isComplete,
      completionScore,
      missingElements,
      recommendations,
      qualityMetrics: {
        hasValidSegments,
        hasReasonableDistances,
        hasBalancedDriveTimes,
        coversTotalRoute
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
