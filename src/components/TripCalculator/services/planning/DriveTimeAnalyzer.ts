
import { DailySegment } from './DailySegmentCreator';
import { BalanceQualityMetrics } from './BalanceQualityMetrics';

export class DriveTimeAnalyzer {
  /**
   * Analyze enhanced drive time balance with comprehensive metrics
   */
  static analyzeEnhancedDriveTimeBalance(dailySegments: DailySegment[]): {
    isBalanced: boolean;
    averageDriveTime: number;
    driveTimeRange: { min: number; max: number };
    balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
    qualityGrade?: 'A' | 'B' | 'C' | 'D' | 'F';
    overallScore?: number;
    variance?: number;
    suggestions?: string[];
  } {
    const driveTimes = dailySegments.map(segment => segment.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);

    // Use comprehensive balance metrics
    const balanceMetrics = BalanceQualityMetrics.calculateBalanceMetrics(dailySegments);
    
    // Determine balance quality based on variance and score
    let balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
    if (balanceMetrics.qualityGrade === 'A') {
      balanceQuality = 'excellent';
    } else if (balanceMetrics.qualityGrade === 'B') {
      balanceQuality = 'good';
    } else if (balanceMetrics.qualityGrade === 'C') {
      balanceQuality = 'fair';
    } else {
      balanceQuality = 'poor';
    }

    const isBalanced = balanceMetrics.variance <= 1.5 && balanceMetrics.overallScore >= 70;

    console.log(`🎯 Drive time balance analysis: ${balanceQuality} (Grade: ${balanceMetrics.qualityGrade}, Score: ${balanceMetrics.overallScore}/100)`);

    return {
      isBalanced,
      averageDriveTime: Math.round(averageDriveTime * 10) / 10,
      driveTimeRange: { 
        min: Math.round(minTime * 10) / 10, 
        max: Math.round(maxTime * 10) / 10 
      },
      balanceQuality,
      qualityGrade: balanceMetrics.qualityGrade,
      overallScore: balanceMetrics.overallScore,
      variance: balanceMetrics.variance,
      suggestions: balanceMetrics.suggestions
    };
  }
}
