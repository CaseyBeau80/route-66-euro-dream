
import { DateNormalizationService } from '../DateNormalizationService';

export class WeatherUtilityService {
  /**
   * CRITICAL FIX: Calculate segment date using consistent date normalization
   */
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date | null {
    if (!tripStartDate || !segmentDay || segmentDay < 1) {
      console.error('❌ WeatherUtilityService: Invalid parameters:', {
        tripStartDate,
        segmentDay,
        isValidDate: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())
      });
      return null;
    }

    try {
      const segmentDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
      
      console.log('📅 CRITICAL FIX: WeatherUtilityService.getSegmentDate:', {
        tripStartDate: tripStartDate.toISOString(),
        tripStartDateLocal: tripStartDate.toLocaleDateString(),
        segmentDay,
        calculatedDate: segmentDate.toISOString(),
        calculatedDateLocal: segmentDate.toLocaleDateString(),
        usingConsistentService: true
      });
      
      return segmentDate;
    } catch (error) {
      console.error('❌ WeatherUtilityService: Date calculation error:', error);
      return null;
    }
  }

  /**
   * CRITICAL FIX: Calculate days from today using consistent logic
   */
  static getDaysFromToday(targetDate: Date): number {
    const today = new Date();
    return DateNormalizationService.getDaysDifference(today, targetDate);
  }

  /**
   * CRITICAL FIX: Check if date is within weather forecast range
   */
  static isWithinForecastRange(targetDate: Date): boolean {
    const daysFromToday = this.getDaysFromToday(targetDate);
    return daysFromToday >= 0 && daysFromToday <= 7;
  }

  /**
   * CRITICAL FIX: Format date for API requests
   */
  static formatDateForApi(date: Date): string {
    return DateNormalizationService.toDateString(date);
  }
}
