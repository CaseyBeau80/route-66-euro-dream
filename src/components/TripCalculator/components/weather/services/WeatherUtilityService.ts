
import { DateNormalizationService } from '../DateNormalizationService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class WeatherUtilityService {
  /**
   * Calculate the date for a specific segment day
   * Uses DateNormalizationService for consistent date calculations
   * FIXED: Ensures absolute consistency with trip planning dates
   */
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🔧 FIXED: WeatherUtilityService.getSegmentDate called:', {
      tripStartDate: tripStartDate.toISOString(),
      tripStartDateLocal: tripStartDate.toLocaleDateString(),
      tripStartDateComponents: {
        year: tripStartDate.getFullYear(),
        month: tripStartDate.getMonth(),
        date: tripStartDate.getDate()
      },
      segmentDay,
      usingDateNormalizationService: true,
      expectedResult: segmentDay === 1 ? 'EXACTLY_EQUALS_TRIP_START_DATE' : `TRIP_START_PLUS_${segmentDay - 1}_DAYS`
    });

    // FIXED: Use the centralized date calculation service for absolute consistency
    const segmentDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segmentDay);
    
    console.log('🔧 FIXED: WeatherUtilityService.getSegmentDate VALIDATION:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        tripStartDateLocal: tripStartDate.toLocaleDateString(),
        segmentDay
      },
      output: {
        segmentDate: segmentDate.toISOString(),
        segmentDateLocal: segmentDate.toLocaleDateString(),
        segmentDateComponents: {
          year: segmentDate.getFullYear(),
          month: segmentDate.getMonth(),
          date: segmentDate.getDate()
        }
      },
      verification: {
        expectedForDay1: segmentDay === 1 ? 'SHOULD_EQUAL_TRIP_START_DATE' : 'SHOULD_BE_TRIP_START_PLUS_DAYS',
        day1DateCheck: segmentDay === 1 ? 
          (segmentDate.toDateString() === tripStartDate.toDateString() ? 'CORRECT_MATCH' : 'INCORRECT_MISMATCH') : 
          'NOT_DAY_1',
        day1LocalCheck: segmentDay === 1 ?
          (segmentDate.toLocaleDateString() === tripStartDate.toLocaleDateString() ? 'LOCAL_MATCH' : 'LOCAL_MISMATCH') :
          'NOT_DAY_1'
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

  /**
   * Calculate days from today to a target date
   */
  static getDaysFromToday(targetDate: Date): number {
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    const normalizedTarget = DateNormalizationService.normalizeSegmentDate(targetDate);
    
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedTarget);
    
    console.log('🔧 WeatherUtilityService.getDaysFromToday:', {
      targetDate: targetDate.toISOString(),
      daysFromToday
    });
    
    return daysFromToday;
  }

  /**
   * Check if a date is within the live forecast range (0-5 days)
   */
  static isWithinLiveForecastRange(targetDate: Date): boolean {
    return this.isWithinForecastRange(targetDate, 5);
  }

  /**
   * Determine if weather data represents a live forecast
   */
  static isLiveForecast(weather: ForecastWeatherData, targetDate: Date): boolean {
    const isWithinRange = this.isWithinLiveForecastRange(targetDate);
    const hasLiveSource = weather.source === 'live_forecast';
    const isActual = weather.isActualForecast === true;
    
    const isLive = hasLiveSource && isActual && isWithinRange;
    
    console.log('🔧 WeatherUtilityService.isLiveForecast:', {
      targetDate: targetDate.toISOString(),
      isWithinRange,
      hasLiveSource,
      isActual,
      isLive,
      weatherSource: weather.source,
      weatherIsActual: weather.isActualForecast
    });
    
    return isLive;
  }
}
