
export class BalanceQualityAnalyzer {
  /**
   * Calculate overall balance score (0-100)
   */
  static calculateOverallScore(
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
  static getQualityGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * Get balance quality summary
   */
  static getBalanceSummary(
    qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F',
    overallScore: number
  ): string {
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
