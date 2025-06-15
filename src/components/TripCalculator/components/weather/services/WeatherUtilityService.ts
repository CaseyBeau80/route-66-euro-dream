
import { DateNormalizationService } from '../DateNormalizationService';

export class WeatherUtilityService {
  /**
   * Calculate the date for a specific segment day
   * Uses DateNormalizationService for consistent date calculations
   */
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🔧 WeatherUtilityService.getSegmentDate called:', {
      tripStartDate: tripStartDate.toISOString(),
      tripStartDateLocal: tripStartDate.toLocaleDateString(),
      segmentDay,
      usingDateNormalizationService: true
    });

    const segmentDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
    
    console.log('🔧 WeatherUtilityService.getSegmentDate result:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        segmentDay
      },
      output: {
        segmentDate: segmentDate.toISOString(),
        segmentDateLocal: segmentDate.toLocaleDateString()
      },
      verification: {
        expectedForDay1: segmentDay === 1 ? 'SHOULD_EQUAL_TRIP_START_DATE' : 'SHOULD_BE_TRIP_START_PLUS_DAYS',
        actualResult: segmentDay === 1 ? 
          (segmentDate.toDateString() === tripStartDate.toDateString() ? 'CORRECT' : 'INCORRECT') : 
          'CALCULATED'
      }
    });

    return segmentDate;
  }

  /**
   * Format a date for display
   */
  static formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Check if a date is within the reliable weather forecast range
   */
  static isWithinForecastRange(targetDate: Date, daysLimit: number = 5): boolean {
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    const normalizedTarget = DateNormalizationService.normalizeSegmentDate(targetDate);
    
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedTarget);
    const isWithinRange = daysFromToday >= 0 && daysFromToday <= daysLimit;
    
    console.log('🔧 WeatherUtilityService.isWithinForecastRange:', {
      targetDate: targetDate.toISOString(),
      daysFromToday,
      daysLimit,
      isWithinRange
    });
    
    return isWithinRange;
  }
}
