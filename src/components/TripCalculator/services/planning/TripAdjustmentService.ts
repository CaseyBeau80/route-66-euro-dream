
export interface TripAdjustmentNotice {
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  adjustments: string[];
  details?: string[]; // Add optional details property
}

export class TripAdjustmentService {
  /**
   * Generate adjustment notice for UI display
   */
  static generateAdjustmentNotice(
    adjustments: any[],
    warnings: string[],
    originalDays: number,
    finalDays: number
  ): TripAdjustmentNotice | null {
    if (adjustments.length === 0 && warnings.length === 0) {
      return null;
    }

    const adjustmentStrings = adjustments.map(adj => adj.reason);
    const allIssues = [...adjustmentStrings, ...warnings];

    let type: 'info' | 'warning' | 'error' = 'info';
    let title = 'Trip Planning Adjustments';

    if (originalDays !== finalDays) {
      type = 'warning';
      title = 'Trip Duration Adjusted';
    }

    return {
      type,
      title,
      message: `Your trip has been adjusted from ${originalDays} to ${finalDays} days to ensure optimal Route 66 experience.`,
      adjustments: allIssues,
      details: allIssues // Include details for backward compatibility
    };
  }

  /**
   * Format adjustment summary for logging
   */
  static formatAdjustmentSummary(
    adjustments: any[],
    originalDays: number,
    finalDays: number
  ): string {
    if (adjustments.length === 0) return 'No adjustments made';
    
    const summary = adjustments.map(adj => `${adj.type}: ${adj.reason}`).join('; ');
    return `${originalDays}→${finalDays} days: ${summary}`;
  }
}
