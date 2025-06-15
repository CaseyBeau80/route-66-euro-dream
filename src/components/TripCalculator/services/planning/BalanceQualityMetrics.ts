
export class BalanceQualityMetrics {
  static getBalanceSummary(balanceMetrics: any): string {
    if (!balanceMetrics) {
      return 'No balance metrics available';
    }
    
    return `Balance quality: ${balanceMetrics.quality || 'unknown'}`;
  }
}
