
import { DailySegment } from './DailySegmentCreator';

export class BalanceIssuesAnalyzer {
  /**
   * Generate issues and suggestions based on metrics
   */
  static generateIssuesAndSuggestions(
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
}
