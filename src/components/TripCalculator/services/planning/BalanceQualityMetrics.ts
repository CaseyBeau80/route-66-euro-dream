
export class BalanceQualityMetrics {
  static getBalanceSummary(balanceMetrics: any): string {
    if (!balanceMetrics) {
      return 'No balance metrics available';
    }
    
    return `Balance quality: ${balanceMetrics.quality || 'unknown'}`;
  }

  static calculateBalanceMetrics(dailySegments: any[]): {
    variance: number;
    overallScore: number;
    qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
    suggestions: string[];
  } {
    if (!dailySegments || dailySegments.length === 0) {
      return {
        variance: 0,
        overallScore: 0,
        qualityGrade: 'F',
        suggestions: ['No segments to analyze']
      };
    }

    // Calculate drive time variance
    const driveTimes = dailySegments.map(segment => segment.driveTimeHours || 0);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    
    const variance = driveTimes.reduce((sum, time) => {
      const diff = time - averageDriveTime;
      return sum + (diff * diff);
    }, 0) / driveTimes.length;

    // Calculate overall balance score (0-100)
    let overallScore = 100;
    
    // Penalize high variance
    if (variance > 2) {
      overallScore -= 30;
    } else if (variance > 1) {
      overallScore -= 15;
    }

    // Check for extremely unbalanced segments
    const maxTime = Math.max(...driveTimes);
    const minTime = Math.min(...driveTimes);
    const range = maxTime - minTime;
    
    if (range > 4) {
      overallScore -= 25;
    } else if (range > 2) {
      overallScore -= 10;
    }

    // Determine quality grade
    let qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (overallScore >= 90) qualityGrade = 'A';
    else if (overallScore >= 80) qualityGrade = 'B';
    else if (overallScore >= 70) qualityGrade = 'C';
    else if (overallScore >= 60) qualityGrade = 'D';
    else qualityGrade = 'F';

    // Generate suggestions
    const suggestions: string[] = [];
    if (variance > 1.5) {
      suggestions.push('Consider redistributing drive times for better balance');
    }
    if (range > 3) {
      suggestions.push('Some segments have significantly different drive times');
    }
    if (averageDriveTime > 6) {
      suggestions.push('Consider adding more overnight stops to reduce daily drive times');
    }

    console.log('🎯 BalanceQualityMetrics calculated:', {
      variance: Math.round(variance * 100) / 100,
      overallScore,
      qualityGrade,
      suggestionsCount: suggestions.length
    });

    return {
      variance: Math.round(variance * 100) / 100,
      overallScore,
      qualityGrade,
      suggestions
    };
  }
}
