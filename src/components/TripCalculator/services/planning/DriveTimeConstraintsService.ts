
import { DailySegment } from './TripPlanBuilder';

export interface DriveTimeValidation {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  balanceScore: number;
}

export class DriveTimeConstraintsService {
  private static readonly IDEAL_DRIVE_TIME = 6;
  private static readonly MIN_DRIVE_TIME = 3;
  private static readonly MAX_DRIVE_TIME = 8;
  private static readonly EXTREME_DRIVE_TIME = 10;

  /**
   * Validate drive time balance across all segments
   */
  static validateTripBalance(segments: DailySegment[]): DriveTimeValidation {
    const driveTimes = segments.map(segment => segment.driveTimeHours);
    const issues: string[] = [];
    const suggestions: string[] = [];

    console.log('🔍 Validating drive time balance:', driveTimes.map(t => `${t.toFixed(1)}h`));

    // Check for extreme drive times
    const extremeSegments = segments.filter(segment => 
      segment.driveTimeHours > this.MAX_DRIVE_TIME
    );

    const shortSegments = segments.filter(segment => 
      segment.driveTimeHours < this.MIN_DRIVE_TIME
    );

    // Log extreme segments
    extremeSegments.forEach(segment => {
      const severity = segment.driveTimeHours > this.EXTREME_DRIVE_TIME ? 'EXTREME' : 'LONG';
      issues.push(`Day ${segment.day}: ${severity} drive time (${segment.driveTimeHours.toFixed(1)}h)`);
      suggestions.push(`Consider adding intermediate stop on Day ${segment.day}`);
    });

    // Log short segments
    shortSegments.forEach(segment => {
      issues.push(`Day ${segment.day}: Very short drive time (${segment.driveTimeHours.toFixed(1)}h)`);
      suggestions.push(`Consider combining Day ${segment.day} with adjacent day`);
    });

    // Calculate variance and balance metrics
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const variance = Math.sqrt(
      driveTimes.reduce((sum, time) => sum + Math.pow(time - averageDriveTime, 2), 0) / driveTimes.length
    );

    // Check for large variations
    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);
    const timeRange = maxTime - minTime;

    if (timeRange > 4) {
      issues.push(`Large variation in drive times: ${minTime.toFixed(1)}h to ${maxTime.toFixed(1)}h`);
      suggestions.push('Consider redistributing destinations for more balanced days');
    }

    // Calculate balance score and grade
    const balanceScore = this.calculateBalanceScore(driveTimes, variance, timeRange);
    const overallGrade = this.calculateGrade(balanceScore);

    const isValid = issues.length === 0 && variance <= 1.5;

    console.log(`📊 Balance validation result:`, {
      isValid,
      balanceScore: balanceScore.toFixed(1),
      overallGrade,
      variance: variance.toFixed(2),
      issues: issues.length,
      suggestions: suggestions.length
    });

    return {
      isValid,
      issues,
      suggestions,
      overallGrade,
      balanceScore
    };
  }

  /**
   * Calculate a balance score from 0-100
   */
  private static calculateBalanceScore(
    driveTimes: number[],
    variance: number,
    timeRange: number
  ): number {
    let score = 100;

    // Penalize high variance (0-30 points)
    const variancePenalty = Math.min(30, variance * 15);
    score -= variancePenalty;

    // Penalize extreme drive times (0-25 points)
    const extremeTimes = driveTimes.filter(time => 
      time > this.MAX_DRIVE_TIME || time < this.MIN_DRIVE_TIME
    ).length;
    const extremePenalty = extremeTimes * 8;
    score -= extremePenalty;

    // Penalize large time ranges (0-20 points)
    const rangePenalty = Math.min(20, timeRange * 3);
    score -= rangePenalty;

    // Bonus for consistent ideal times (0-15 points)
    const idealTimes = driveTimes.filter(time => 
      time >= 5 && time <= 7
    ).length;
    const idealBonus = (idealTimes / driveTimes.length) * 15;
    score += idealBonus;

    // Penalize very long drives (additional penalty)
    const veryLongTimes = driveTimes.filter(time => time > this.EXTREME_DRIVE_TIME).length;
    score -= veryLongTimes * 15;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate grade based on balance score
   */
  private static calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Suggest optimal day adjustments
   */
  static suggestDayAdjustments(
    totalDistance: number,
    currentDays: number
  ): {
    suggestedDays: number;
    reason: string;
    expectedBalance: string;
  } {
    const totalDriveTime = totalDistance / 50; // 50 mph average
    const currentAverageDriveTime = totalDriveTime / currentDays;

    console.log(`🤔 Analyzing day adjustments: ${totalDistance.toFixed(0)}mi, ${currentDays} days, ${currentAverageDriveTime.toFixed(1)}h avg`);

    let suggestedDays = currentDays;
    let reason = '';
    let expectedBalance = '';

    if (currentAverageDriveTime > this.MAX_DRIVE_TIME) {
      suggestedDays = Math.ceil(totalDriveTime / this.IDEAL_DRIVE_TIME);
      reason = `Current average drive time (${currentAverageDriveTime.toFixed(1)}h) exceeds comfortable maximum`;
      expectedBalance = `${(totalDriveTime / suggestedDays).toFixed(1)}h average drive time`;
    } else if (currentAverageDriveTime < this.MIN_DRIVE_TIME && currentDays > 4) {
      suggestedDays = Math.max(4, Math.ceil(totalDriveTime / this.MIN_DRIVE_TIME));
      reason = `Current average drive time (${currentAverageDriveTime.toFixed(1)}h) is very short`;
      expectedBalance = `${(totalDriveTime / suggestedDays).toFixed(1)}h average drive time`;
    } else {
      reason = `Current ${currentDays} days provides reasonable balance`;
      expectedBalance = `${currentAverageDriveTime.toFixed(1)}h average drive time`;
    }

    console.log(`💡 Day adjustment suggestion:`, {
      currentDays,
      suggestedDays,
      reason,
      expectedBalance
    });

    return {
      suggestedDays,
      reason,
      expectedBalance
    };
  }

  /**
   * Check if specific segment needs adjustment
   */
  static shouldAdjustSegment(segment: DailySegment): {
    needsAdjustment: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestion: string;
  } {
    const driveTime = segment.driveTimeHours;
    
    if (driveTime > this.EXTREME_DRIVE_TIME) {
      return {
        needsAdjustment: true,
        severity: 'critical',
        suggestion: `${driveTime.toFixed(1)}h is excessive - strongly consider adding intermediate stop`
      };
    }
    
    if (driveTime > this.MAX_DRIVE_TIME) {
      return {
        needsAdjustment: true,
        severity: 'high',
        suggestion: `${driveTime.toFixed(1)}h is quite long - consider adding intermediate stop`
      };
    }
    
    if (driveTime < this.MIN_DRIVE_TIME) {
      return {
        needsAdjustment: true,
        severity: 'medium',
        suggestion: `${driveTime.toFixed(1)}h is very short - consider combining with adjacent day`
      };
    }
    
    return {
      needsAdjustment: false,
      severity: 'low',
      suggestion: `${driveTime.toFixed(1)}h is within acceptable range`
    };
  }
}
