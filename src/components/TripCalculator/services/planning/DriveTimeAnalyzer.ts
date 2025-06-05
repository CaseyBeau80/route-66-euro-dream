
import { DailySegment } from './DailySegmentCreator';
import { BalanceQualityMetrics, BalanceMetrics } from './BalanceQualityMetrics';

export class DriveTimeAnalyzer {
  /**
   * Analyze drive time balance with enhanced metrics
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
    // Use the first segment's balance metrics if available (from enhanced balancing)
    const enhancedMetrics = dailySegments[0]?.balanceMetrics;
    
    if (enhancedMetrics) {
      console.log(`📊 Using enhanced balance metrics: Grade ${enhancedMetrics.qualityGrade}, Score ${enhancedMetrics.overallScore}/100`);
      
      return {
        isBalanced: enhancedMetrics.overallScore >= 70,
        averageDriveTime: enhancedMetrics.averageDriveTime,
        driveTimeRange: enhancedMetrics.driveTimeRange,
        balanceQuality: this.convertGradeToQuality(enhancedMetrics.qualityGrade),
        qualityGrade: enhancedMetrics.qualityGrade,
        overallScore: enhancedMetrics.overallScore,
        variance: enhancedMetrics.variance,
        suggestions: enhancedMetrics.suggestions
      };
    }
    
    // Fallback to legacy calculation if enhanced metrics not available
    return this.calculateLegacyDriveTimeBalance(dailySegments);
  }

  /**
   * Calculate legacy drive time balance for fallback
   */
  private static calculateLegacyDriveTimeBalance(dailySegments: DailySegment[]) {
    const driveTimes = dailySegments.map(s => s.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);
    const timeRange = maxTime - minTime;
    
    // Determine balance quality
    let balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
    let isBalanced = true;
    
    if (timeRange <= 1.5) {
      balanceQuality = 'excellent';
    } else if (timeRange <= 2.5) {
      balanceQuality = 'good';
    } else if (timeRange <= 3.5) {
      balanceQuality = 'fair';
    } else {
      balanceQuality = 'poor';
      isBalanced = false;
    }
    
    // Check for extreme days
    const hasExtremeDays = driveTimes.some(time => time > 8 || time < 2);
    if (hasExtremeDays) {
      isBalanced = false;
      if (balanceQuality === 'excellent' || balanceQuality === 'good') {
        balanceQuality = 'fair';
      }
    }
    
    console.log(`⚖️ Legacy drive time balance: ${balanceQuality} (${minTime.toFixed(1)}-${maxTime.toFixed(1)}h range, ${averageDriveTime.toFixed(1)}h avg)`);
    
    return {
      isBalanced,
      averageDriveTime: Math.round(averageDriveTime * 10) / 10,
      driveTimeRange: { 
        min: Math.round(minTime * 10) / 10, 
        max: Math.round(maxTime * 10) / 10 
      },
      balanceQuality
    };
  }

  /**
   * Convert quality grade to legacy quality format
   */
  private static convertGradeToQuality(grade: 'A' | 'B' | 'C' | 'D' | 'F'): 'excellent' | 'good' | 'fair' | 'poor' {
    switch (grade) {
      case 'A': return 'excellent';
      case 'B': return 'good';
      case 'C': return 'fair';
      case 'D':
      case 'F': return 'poor';
      default: return 'fair';
    }
  }
}
