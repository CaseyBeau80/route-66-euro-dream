
import { DateNormalizationService } from '../DateNormalizationService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class WeatherUtilityService {
  /**
   * CRITICAL FIX: Calculate the date for a specific segment day
   * Uses simplified date arithmetic to ensure Day 1 = trip start date exactly
   */
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🚨 CRITICAL FIX: WeatherUtilityService.getSegmentDate called:', {
      tripStartDate: {
        iso: tripStartDate.toISOString(),
        local: tripStartDate.toLocaleDateString(),
        year: tripStartDate.getFullYear(),
        month: tripStartDate.getMonth(),
        date: tripStartDate.getDate()
      },
      segmentDay,
      calculation: 'SIMPLIFIED_DATE_ARITHMETIC'
    });

    // CRITICAL FIX: Use simple date arithmetic
    // Day 1 = trip start date exactly
    // Day 2 = trip start date + 1 day
    // etc.
    const segmentDate = new Date(tripStartDate);
    segmentDate.setDate(tripStartDate.getDate() + (segmentDay - 1));
    
    console.log('🚨 CRITICAL FIX: WeatherUtilityService.getSegmentDate RESULT:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        segmentDay
      },
      output: {
        segmentDate: segmentDate.toISOString(),
        segmentDateLocal: segmentDate.toLocaleDateString(),
        daysAdded: segmentDay - 1
      },
      verification: {
        day1Check: segmentDay === 1 ? (segmentDate.toDateString() === tripStartDate.toDateString() ? 'CORRECT_MATCH' : 'INCORRECT_MISMATCH') : 'NOT_DAY_1',
        daysFromToday: this.getDaysFromToday(segmentDate),
        isWithinForecastRange: this.isWithinForecastRange(segmentDate)
      }
    });

    return segmentDate;
  }

  /**
   * Check if a date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
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
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const daysFromToday = Math.floor((targetStart.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinRange = daysFromToday >= 0 && daysFromToday <= daysLimit;
    
    console.log('🔧 FIXED: WeatherUtilityService.isWithinForecastRange:', {
      targetDate: targetDate.toISOString(),
      todayStart: todayStart.toISOString(),
      targetStart: targetStart.toISOString(),
      daysFromToday,
      daysLimit,
      isWithinRange,
      calculation: 'SIMPLIFIED_MIDNIGHT_COMPARISON'
    });
    
    return isWithinRange;
  }

  /**
   * Calculate days from today to a target date
   */
  static getDaysFromToday(targetDate: Date): number {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const daysFromToday = Math.floor((targetStart.getTime() - todayStart.getTime()) / (24 * 60 * 60 * 1000));
    
    console.log('🔧 FIXED: WeatherUtilityService.getDaysFromToday:', {
      targetDate: targetDate.toISOString(),
      todayStart: todayStart.toISOString(),
      targetStart: targetStart.toISOString(),
      daysFromToday,
      calculation: 'SIMPLIFIED_MIDNIGHT_COMPARISON'
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
    
    console.log('🔧 FIXED: WeatherUtilityService.isLiveForecast:', {
      targetDate: targetDate.toISOString(),
      isWithinRange,
      hasLiveSource,
      isActual,
      isLive,
      weatherSource: weather.source,
      weatherIsActual: weather.isActualForecast,
      simplifiedLogic: true
    });
    
    return isLive;
  }
}
