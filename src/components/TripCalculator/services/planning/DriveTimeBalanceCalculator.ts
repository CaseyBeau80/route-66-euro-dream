
import { DailySegment } from './TripPlanBuilder';

export class DriveTimeBalanceCalculator {
  /**
   * Calculate comprehensive drive time balance metrics
   */
  static calculateDriveTimeBalance(dailySegments: DailySegment[]): {
    isBalanced: boolean;
    averageDriveTime: number;
    driveTimeRange: { min: number; max: number };
    balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
    qualityGrade?: 'A' | 'B' | 'C' | 'D' | 'F';
    overallScore?: number;
    variance?: number;
    suggestions?: string[];
  } {
    const totalDrivingTime = dailySegments.reduce((total, segment) => total + segment.drivingTime, 0);
    const averageDriveTime = totalDrivingTime / dailySegments.length;
    const driveTimeRange = {
      min: Math.min(...dailySegments.map(segment => segment.drivingTime)),
      max: Math.max(...dailySegments.map(segment => segment.drivingTime))
    };
    const balanceQuality = this.getDriveTimeBalanceQuality(averageDriveTime, driveTimeRange);

    return {
      isBalanced: balanceQuality === 'excellent',
      averageDriveTime,
      driveTimeRange,
      balanceQuality,
      qualityGrade: this.getDriveTimeQualityGrade(averageDriveTime, driveTimeRange),
      overallScore: this.getOverallDriveTimeScore(averageDriveTime, driveTimeRange),
      variance: this.getDriveTimeVariance(dailySegments, averageDriveTime),
      suggestions: this.getDriveTimeBalanceSuggestions(averageDriveTime, driveTimeRange)
    };
  }

  private static getDriveTimeBalanceQuality(averageDriveTime: number, driveTimeRange: { min: number; max: number }): 'excellent' | 'good' | 'fair' | 'poor' {
    const range = driveTimeRange.max - driveTimeRange.min;
    if (range <= 1) return 'excellent';
    if (range <= 2) return 'good';
    if (range <= 3) return 'fair';
    return 'poor';
  }

  private static getDriveTimeQualityGrade(averageDriveTime: number, driveTimeRange: { min: number; max: number }): 'A' | 'B' | 'C' | 'D' | 'F' {
    const range = driveTimeRange.max - driveTimeRange.min;
    if (range <= 1) return 'A';
    if (range <= 2) return 'B';
    if (range <= 3) return 'C';
    if (range <= 4) return 'D';
    return 'F';
  }

  private static getOverallDriveTimeScore(averageDriveTime: number, driveTimeRange: { min: number; max: number }): number {
    const range = driveTimeRange.max - driveTimeRange.min;
    const score = Math.max(0, 100 - (range * 20));
    return Math.round(score);
  }

  private static getDriveTimeVariance(dailySegments: DailySegment[], averageDriveTime: number): number {
    const variance = dailySegments.reduce((sum, segment) => {
      return sum + Math.pow(segment.drivingTime - averageDriveTime, 2);
    }, 0) / dailySegments.length;
    return Math.round(variance * 100) / 100;
  }

  private static getDriveTimeBalanceSuggestions(averageDriveTime: number, driveTimeRange: { min: number; max: number }): string[] {
    const suggestions: string[] = [];
    const range = driveTimeRange.max - driveTimeRange.min;
    
    if (range > 3) {
      suggestions.push('Consider redistributing stops to balance daily drive times.');
    }
    if (driveTimeRange.max > 8) {
      suggestions.push('Some days have very long drive times. Consider adding an extra day.');
    }
    if (driveTimeRange.min < 2) {
      suggestions.push('Some days have very short drive times. Consider combining with adjacent days.');
    }
    if (suggestions.length === 0) {
      suggestions.push('Drive times are well-balanced across all days.');
    }
    
    return suggestions;
  }
}
