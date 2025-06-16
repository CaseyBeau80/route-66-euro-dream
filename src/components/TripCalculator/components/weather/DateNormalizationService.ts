
/**
 * DEPRECATED: This service has been consolidated into UnifiedDateService
 * All functionality has been moved to src/components/TripCalculator/services/UnifiedDateService.ts
 * This file is kept temporarily for reference and will be removed after migration is complete.
 */

import { UnifiedDateService } from '../../services/UnifiedDateService';

export class DateNormalizationService {
  /**
   * @deprecated Use UnifiedDateService.calculateSegmentDate instead
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.warn('⚠️ DEPRECATED: DateNormalizationService.calculateSegmentDate is deprecated. Use UnifiedDateService.calculateSegmentDate instead.');
    return UnifiedDateService.calculateSegmentDate(tripStartDate, segmentDay);
  }

  /**
   * @deprecated Use UnifiedDateService.normalizeToLocalMidnight instead
   */
  static normalizeDate(date: Date): Date {
    console.warn('⚠️ DEPRECATED: DateNormalizationService.normalizeDate is deprecated. Use UnifiedDateService.normalizeToLocalMidnight instead.');
    return UnifiedDateService.normalizeToLocalMidnight(date);
  }

  /**
   * @deprecated Use UnifiedDateService.getDaysFromToday instead
   */
  static getDaysFromToday(date: Date): number {
    console.warn('⚠️ DEPRECATED: DateNormalizationService.getDaysFromToday is deprecated. Use UnifiedDateService.getDaysFromToday instead.');
    return UnifiedDateService.getDaysFromToday(date);
  }

  /**
   * @deprecated Use UnifiedDateService.isWithinLiveForecastRange instead
   */
  static isWithinForecastRange(date: Date): boolean {
    console.warn('⚠️ DEPRECATED: DateNormalizationService.isWithinForecastRange is deprecated. Use UnifiedDateService.isWithinLiveForecastRange instead.');
    return UnifiedDateService.isWithinLiveForecastRange(date);
  }

  /**
   * @deprecated Use UnifiedDateService.formatForApi instead
   */
  static formatDateForApi(date: Date): string {
    console.warn('⚠️ DEPRECATED: DateNormalizationService.formatDateForApi is deprecated. Use UnifiedDateService.formatForApi instead.');
    return UnifiedDateService.formatForApi(date);
  }

  /**
   * @deprecated Use UnifiedDateService.getToday instead
   */
  static getToday(): Date {
    console.warn('⚠️ DEPRECATED: DateNormalizationService.getToday is deprecated. Use UnifiedDateService.getToday instead.');
    return UnifiedDateService.getToday();
  }
}
