
import { PlanningAdjustment } from './PlanningPolicy';

export interface TripAdjustmentNotice {
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
  details?: string[];
  showDetails?: boolean;
}

export class TripAdjustmentService {
  /**
   * Generate user-friendly adjustment notice
   */
  static generateAdjustmentNotice(
    adjustments: PlanningAdjustment[],
    warnings: string[],
    originalDays: number,
    finalDays: number
  ): TripAdjustmentNotice | null {
    if (adjustments.length === 0 && warnings.length === 0) {
      return null;
    }

    // Primary adjustment (usually the most significant one)
    const primaryAdjustment = adjustments[0];
    
    if (primaryAdjustment?.type === 'day_reduction') {
      return {
        type: 'info',
        title: 'Trip Duration Automatically Adjusted',
        message: `Your trip has been optimized from ${originalDays} to ${finalDays} days to match the available major Route 66 heritage destinations along your route.`,
        details: [
          `🏛️ Based on major heritage cities between your start and end points`,
          `🎯 Ensures you can experience authentic Route 66 destinations each day`,
          `⏱️ Maintains comfortable driving times (under 10 hours per day)`,
          `✨ You can still enjoy all the iconic Route 66 experiences!`
        ],
        showDetails: true
      };
    }

    if (primaryAdjustment?.type === 'day_increase') {
      return {
        type: 'warning',
        title: 'Trip Duration Extended',
        message: `Your trip has been extended from ${originalDays} to ${finalDays} days to ensure safe and comfortable travel.`,
        details: adjustments.map(adj => `• ${adj.reason}`),
        showDetails: false
      };
    }

    // General warnings
    if (warnings.length > 0) {
      return {
        type: 'warning',
        title: 'Planning Adjustments Made',
        message: warnings[0],
        details: warnings.slice(1),
        showDetails: warnings.length > 1
      };
    }

    return null;
  }

  /**
   * Format adjustment summary for logging
   */
  static formatAdjustmentSummary(
    adjustments: PlanningAdjustment[],
    originalDays: number,
    finalDays: number
  ): string {
    if (adjustments.length === 0) {
      return `No adjustments needed (${finalDays} days)`;
    }

    const summary = adjustments.map(adj => 
      `${adj.constraint}: ${adj.originalValue}→${adj.adjustedValue} days (${adj.reason})`
    ).join('; ');

    return `Adjusted: ${originalDays}→${finalDays} days | ${summary}`;
  }
}
