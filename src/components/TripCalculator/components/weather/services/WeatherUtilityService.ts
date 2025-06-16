
import { DateNormalizationService } from '../DateNormalizationService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class WeatherUtilityService {
  /**
   * CRITICAL FIX: Calculate the date for a specific segment day
   * Uses DateNormalizationService for consistent date calculations
   * ENSURES absolute consistency with trip planning dates
   */
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🚨 ULTIMATE DATE FIX: WeatherUtilityService.getSegmentDate called:', {
      tripStartDate: {
        iso: tripStartDate.toISOString(),
        local: tripStartDate.toLocaleDateString(),
        components: {
          year: tripStartDate.getFullYear(),
          month: tripStartDate.getMonth(),
          date: tripStartDate.getDate(),
          hours: tripStartDate.getHours(),
          minutes: tripStartDate.getMinutes(),
          seconds: tripStartDate.getSeconds()
        }
      },
      segmentDay,
      expectedResult: segmentDay === 1 ? 'EXACTLY_EQUALS_TRIP_START_DATE' : `TRIP_START_PLUS_${segmentDay - 1}_DAYS`,
      ultimateFix: true
    });

    // ULTIMATE FIX: Direct date arithmetic with proper timezone handling
    // Ensure we work with local midnight dates to avoid timezone issues
    const normalizedTripStart = new Date(tripStartDate.getFullYear(), tripStartDate.getMonth(), tripStartDate.getDate());
    const segmentDate = new Date(normalizedTripStart.getTime() + (segmentDay - 1) * 24 * 60 * 60 * 1000);
    
    console.log('🚨 ULTIMATE DATE FIX: WeatherUtilityService.getSegmentDate RESULT:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        tripStartDateLocal: tripStartDate.toLocaleDateString(),
        segmentDay
      },
      calculation: {
        normalizedTripStart: normalizedTripStart.toISOString(),
        dayOffset: segmentDay - 1,
        millisecondsOffset: (segmentDay - 1) * 24 * 60 * 60 * 1000
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
          (segmentDate.toDateString() === normalizedTripStart.toDateString() ? 'CORRECT_MATCH' : 'INCORRECT_MISMATCH') : 
          'NOT_DAY_1',
        day1LocalCheck: segmentDay === 1 ?
          (segmentDate.toLocaleDateString() === normalizedTripStart.toLocaleDateString() ? 'LOCAL_MATCH' : 'LOCAL_MISMATCH') :
          'NOT_DAY_1',
        isToday: segmentDay === 1 ? this.isToday(segmentDate) : 'NOT_DAY_1',
        daysFromToday: this.getDaysFromToday(segmentDate)
      },
      ultimateFix: 'DIRECT_DATE_ARITHMETIC_WITH_TIMEZONE_NORMALIZATION'
    });

    return segmentDate;
  }

  /**
   * Check if a date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return normalizedDate.getTime() === normalizedToday.getTime();
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
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const daysFromToday = Math.ceil((normalizedTarget.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinRange = daysFromToday >= 0 && daysFromToday <= daysLimit;
    
    console.log('🔧 ULTIMATE: WeatherUtilityService.isWithinForecastRange:', {
      targetDate: targetDate.toISOString(),
      normalizedTarget: normalizedTarget.toISOString(),
      normalizedToday: normalizedToday.toISOString(),
      daysFromToday,
      daysLimit,
      isWithinRange,
      ultimateFix: true
    });
    
    return isWithinRange;
  }

  /**
   * Calculate days from today to a target date
   */
  static getDaysFromToday(targetDate: Date): number {
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const daysFromToday = Math.ceil((normalizedTarget.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000));
    
    console.log('🔧 ULTIMATE: WeatherUtilityService.getDaysFromToday:', {
      targetDate: targetDate.toISOString(),
      normalizedTarget: normalizedTarget.toISOString(),
      normalizedToday: normalizedToday.toISOString(),
      daysFromToday,
      ultimateFix: true
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
    
    console.log('🔧 ULTIMATE: WeatherUtilityService.isLiveForecast:', {
      targetDate: targetDate.toISOString(),
      isWithinRange,
      hasLiveSource,
      isActual,
      isLive,
      weatherSource: weather.source,
      weatherIsActual: weather.isActualForecast,
      ultimateFix: true
    });
    
    return isLive;
  }
}
