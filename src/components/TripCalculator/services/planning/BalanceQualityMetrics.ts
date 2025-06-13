
import { DailySegment } from './TripPlanBuilder';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { BalanceMetricsCalculator, BalanceMetrics } from './BalanceMetricsCalculator';
import { BalanceQualityAnalyzer } from './BalanceQualityAnalyzer';
import { BalanceIssuesAnalyzer } from './BalanceIssuesAnalyzer';

export type { BalanceMetrics };

export class BalanceQualityMetrics {
  /**
   * Calculate comprehensive balance quality metrics
   */
  static calculateBalanceMetrics(
    segments: DailySegment[],
    driveTimeTargets?: DriveTimeTarget[]
  ): BalanceMetrics {
    // Calculate basic statistics
    const { driveTimes, averageDriveTime, minTime, maxTime, variance } = 
      BalanceMetricsCalculator.calculateBasicStats(segments);
    
    console.log(`📊 Calculating balance metrics: avg=${averageDriveTime.toFixed(1)}h, variance=${variance.toFixed(2)}h`);
    
    // Calculate target compliance
    const targetCompliance = BalanceMetricsCalculator.calculateTargetCompliance(segments, driveTimeTargets);
    
    // Calculate destination city balance
    const destinationCityBalance = BalanceMetricsCalculator.calculateDestinationCityBalance(segments);
    
    // Calculate overall score
    const overallScore = BalanceQualityAnalyzer.calculateOverallScore(
      variance,
      averageDriveTime,
      targetCompliance,
      destinationCityBalance,
      minTime,
      maxTime
    );
    
    // Determine quality grade
    const qualityGrade = BalanceQualityAnalyzer.getQualityGrade(overallScore);
    
    // Generate issues and suggestions
    const { issues, suggestions } = BalanceIssuesAnalyzer.generateIssuesAndSuggestions(
      segments,
      variance,
      averageDriveTime,
      minTime,
      maxTime,
      destinationCityBalance
    );
    
    const metrics: BalanceMetrics = {
      overallScore: Math.round(overallScore),
      variance: Math.round(variance * 100) / 100,
      averageDriveTime: Math.round(averageDriveTime * 10) / 10,
      driveTimeRange: { 
        min: Math.round(minTime * 10) / 10, 
        max: Math.round(maxTime * 10) / 10 
      },
      qualityGrade,
      issues,
      suggestions,
      targetCompliance: Math.round(targetCompliance),
      destinationCityBalance: Math.round(destinationCityBalance)
    };
    
    console.log(`🎯 Balance metrics: Grade ${qualityGrade}, Score ${metrics.overallScore}/100`);
    return metrics;
  }

  /**
   * Get balance quality summary
   */
  static getBalanceSummary(metrics: BalanceMetrics): string {
    return BalanceQualityAnalyzer.getBalanceSummary(metrics.qualityGrade, metrics.overallScore);
  }
}
