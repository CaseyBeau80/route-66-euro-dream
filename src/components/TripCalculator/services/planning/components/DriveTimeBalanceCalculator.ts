
import { DailySegment, DriveTimeBalance } from '../TripPlanTypes';
import { DriveTimeCalculator } from '../utils/DriveTimeCalculator';

export class DriveTimeBalanceCalculator {
  /**
   * Calculate balanced drive time balance metrics
   */
  static calculateBalancedDriveTimeBalance(segments: DailySegment[], balanceAnalysis?: any): DriveTimeBalance {
    const driveTimes = segments.map(seg => seg.driveTimeHours);
    const totalHours = driveTimes.reduce((sum, time) => sum + time, 0);
    const averageDriveTime = totalHours / driveTimes.length;
    const variance = Math.sqrt(
      driveTimes.reduce((sum, time) => sum + Math.pow(time - averageDriveTime, 2), 0) / driveTimes.length
    );

    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);
    const isBalanced = maxTime <= DriveTimeCalculator.getMaxDriveTime() && variance <= 1.5;

    const balanceQuality: 'excellent' | 'good' | 'fair' | 'poor' = 
      isBalanced && maxTime <= 6 ? 'excellent' :
      isBalanced && maxTime <= 8 ? 'good' :
      maxTime <= 9 ? 'fair' : 'poor';

    const qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 
      balanceQuality === 'excellent' ? 'A' :
      balanceQuality === 'good' ? 'B' :
      balanceQuality === 'fair' ? 'C' :
      maxTime <= 10 ? 'D' : 'F';

    const overallScore = Math.max(0, 100 - (variance * 20) - Math.max(0, maxTime - 8) * 15);

    const suggestions: string[] = [];
    if (maxTime > DriveTimeCalculator.getMaxDriveTime()) {
      suggestions.push(`Day with ${maxTime.toFixed(1)}h drive time should be shortened`);
    }
    if (variance > 2) {
      suggestions.push('Consider redistributing stops for more consistent daily drive times');
    }

    const segmentAnalysis = segments.map((segment, index) => ({
      day: segment.day,
      hours: segment.driveTimeHours,
      category: segment.driveTimeHours <= 4 ? 'light' as const :
                segment.driveTimeHours <= 6 ? 'moderate' as const :
                segment.driveTimeHours <= 8 ? 'heavy' as const : 'extreme' as const
    }));

    return {
      totalHours: parseFloat(totalHours.toFixed(1)),
      averageDriveTime: parseFloat(averageDriveTime.toFixed(1)),
      averageHours: parseFloat(averageDriveTime.toFixed(1)), // Same as averageDriveTime for compatibility
      maxHours: parseFloat(maxTime.toFixed(1)),
      minHours: parseFloat(minTime.toFixed(1)),
      isBalanced,
      variance: parseFloat(variance.toFixed(1)),
      driveTimeRange: { 
        min: parseFloat(minTime.toFixed(1)), 
        max: parseFloat(maxTime.toFixed(1)) 
      },
      balanceQuality,
      qualityGrade,
      overallScore: Math.round(overallScore),
      suggestions,
      reason: isBalanced ? 'Drive times are well balanced' : 
              maxTime > DriveTimeCalculator.getMaxDriveTime() ? `Maximum drive time (${maxTime.toFixed(1)}h) exceeds recommended limit` :
              'Drive time variance could be improved',
      segments: segmentAnalysis
    };
  }
}
