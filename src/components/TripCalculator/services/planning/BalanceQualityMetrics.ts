
import { DailySegment } from './DailySegmentCreator';
import { DriveTimeTarget } from './DriveTimeBalancingService';

export interface BalanceMetrics {
  overallScore: number; // 0-100, higher is better
  variance: number; // Standard deviation in hours
  averageDriveTime: number;
  driveTimeRange: { min: number; max: number };
  qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: string[];
  suggestions: string[];
  targetCompliance: number; // Percentage of days within target range
  destinationCityBalance: number; // Percentage of days ending at destination cities
}

export class BalanceQualityMetrics {
  /**
   * Calculate comprehensive balance quality metrics
   */
  static calculateBalanceMetrics(
    segments: DailySegment[],
    driveTimeTargets?: DriveTimeTarget[]
  ): BalanceMetrics {
    const driveTimes = segments.map(s => s.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);
    const variance = this.calculateStandardDeviation(driveTimes);
    
    console.log(`📊 Calculating balance metrics: avg=${averageDriveTime.toFixed(1)}h, variance=${variance.toFixed(2)}h`);
    
    // Calculate target compliance if targets are provided
    let targetCompliance = 0;
    if (driveTimeTargets) {
      const compliantDays = segments.filter((segment, index) => {
        const target = driveTimeTargets[index];
        return segment.driveTimeHours >= target.minHours && segment.driveTimeHours <= target.maxHours;
      }).length;
      targetCompliance = (compliantDays / segments.length) * 100;
    }
    
    // Calculate destination city balance
    const destinationCityDays = segments.filter(segment => {
      // Check if the day ends at a destination city or has destination city stops
      const hasDestinationCity = segment.recommendedStops.some(stop => stop.category === 'destination_city') ||
                                 segment.endCity.toLowerCase().includes('city') ||
                                 segment.endCity.toLowerCase().includes('town');
      return hasDestinationCity;
    }).length;
    const destinationCityBalance = (destinationCityDays / segments.length) * 100;
    
    // Calculate overall score
    const overallScore = this.calculateOverallScore(
      variance,
      averageDriveTime,
      targetCompliance,
      destinationCityBalance,
      minTime,
      maxTime
    );
    
    // Determine quality grade
    const qualityGrade = this.getQualityGrade(overallScore);
    
    // Generate issues and suggestions
    const { issues, suggestions } = this.generateIssuesAndSuggestions(
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
   * Calculate standard deviation of drive times
   */
  private static calculateStandardDeviation(driveTimes: number[]): number {
    const average = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const variance = driveTimes.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / driveTimes.length;
    return Math.sqrt(variance);
  }

  /**
   * Calculate overall balance score (0-100)
   */
  private static calculateOverallScore(
    variance: number,
    averageDriveTime: number,
    targetCompliance: number,
    destinationCityBalance: number,
    minTime: number,
    maxTime: number
  ): number {
    let score = 100;
    
    // Penalize high variance (weight: 40%)
    const variancePenalty = Math.min(variance * 15, 40);
    score -= variancePenalty;
    
    // Penalize extreme drive times (weight: 30%)
    let extremePenalty = 0;
    if (minTime < 2) extremePenalty += 10;
    if (maxTime > 8) extremePenalty += 20;
    score -= extremePenalty;
    
    // Reward good target compliance (weight: 20%)
    const complianceBonus = (targetCompliance / 100) * 20;
    score += complianceBonus - 20; // Subtract base to make it penalty for low compliance
    
    // Reward destination city balance (weight: 10%)
    const destinationBonus = Math.min(destinationCityBalance / 10, 10);
    score += destinationBonus;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get quality grade based on score
   */
  private static getQualityGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Generate issues and suggestions based on metrics
   */
  private static generateIssuesAndSuggestions(
    segments: DailySegment[],
    variance: number,
    averageDriveTime: number,
    minTime: number,
    maxTime: number,
    destinationCityBalance: number
  ): { issues: string[]; suggestions: string[] } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // High variance issues
    if (variance > 2.0) {
      issues.push(`High drive time variance (${variance.toFixed(1)} hours)`);
      suggestions.push('Consider redistributing stops to balance daily drive times');
    }
    
    // Extreme drive times
    if (minTime < 2.5) {
      issues.push(`Very short driving day (${minTime.toFixed(1)} hours)`);
      suggestions.push('Combine short days or add intermediate destinations');
    }
    
    if (maxTime > 7.5) {
      issues.push(`Very long driving day (${maxTime.toFixed(1)} hours)`);
      suggestions.push('Break up long days with overnight stops');
    }
    
    // Average drive time issues
    if (averageDriveTime < 3.5) {
      issues.push('Overall trip may be too leisurely');
      suggestions.push('Consider reducing trip duration or adding more distant destinations');
    }
    
    if (averageDriveTime > 7) {
      issues.push('Overall trip may be too aggressive');
      suggestions.push('Consider increasing trip duration or choosing closer destinations');
    }
    
    // Destination city balance
    if (destinationCityBalance < 30) {
      issues.push('Low destination city coverage');
      suggestions.push('Route more days through major Route 66 destination cities');
    }
    
    // Range issues
    const range = maxTime - minTime;
    if (range > 4) {
      issues.push(`Large drive time variation (${range.toFixed(1)} hour spread)`);
      suggestions.push('Redistribute destinations for more consistent daily experiences');
    }
    
    return { issues, suggestions };
  }

  /**
   * Get balance quality summary
   */
  static getBalanceSummary(metrics: BalanceMetrics): string {
    const { qualityGrade, overallScore, variance, destinationCityBalance } = metrics;
    
    if (qualityGrade === 'A') {
      return `Excellent balance (${overallScore}/100) - Well-distributed drive times with great destination coverage`;
    } else if (qualityGrade === 'B') {
      return `Good balance (${overallScore}/100) - Mostly consistent drive times with minor adjustments needed`;
    } else if (qualityGrade === 'C') {
      return `Fair balance (${overallScore}/100) - Some drive time imbalances, consider redistribution`;
    } else if (qualityGrade === 'D') {
      return `Poor balance (${overallScore}/100) - Significant drive time issues need attention`;
    } else {
      return `Very poor balance (${overallScore}/100) - Major restructuring recommended`;
    }
  }
}
