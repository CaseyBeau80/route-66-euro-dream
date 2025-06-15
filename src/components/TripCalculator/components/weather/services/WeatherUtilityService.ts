
import { DateNormalizationService } from '../DateNormalizationService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

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
