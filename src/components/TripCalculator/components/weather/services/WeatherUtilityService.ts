
import { DateNormalizationService } from '../DateNormalizationService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

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
   * FIXED: Calculate days from today - treats same calendar date as day 0 (today)
   */
  static getDaysFromToday(targetDate: Date): number {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetNormalized = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const timeDiff = targetNormalized.getTime() - todayNormalized.getTime();
    const daysDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
    
    console.log('📅 FIXED: getDaysFromToday - treating same calendar date as today:', {
      targetDate: targetDate.toLocaleDateString(),
      today: today.toLocaleDateString(),
      todayNormalized: todayNormalized.toLocaleDateString(),
      targetNormalized: targetNormalized.toLocaleDateString(),
      daysDiff,
      interpretation: daysDiff === 0 ? 'TODAY - LIVE FORECAST' : daysDiff > 0 ? 'FUTURE - LIVE FORECAST' : 'PAST - HISTORICAL'
    });
    
    return daysDiff;
  }

  /**
   * FIXED: Forecast range check - day 0 (today) through day 7 are live forecast
   */
  static isWithinForecastRange(targetDate: Date): boolean {
    const daysFromToday = this.getDaysFromToday(targetDate);
    const isWithinRange = daysFromToday >= 0 && daysFromToday <= 7;
    
    console.log('🌤️ FIXED: isWithinForecastRange - same calendar date is today:', {
      targetDate: targetDate.toLocaleDateString(),
      daysFromToday,
      isWithinRange,
      logic: 'Day 0 (same calendar date as today) through Day 7 = LIVE FORECAST'
    });
    
    return isWithinRange;
  }

  /**
   * FIXED: Check if date is within live forecast range (same as isWithinForecastRange)
   */
  static isWithinLiveForecastRange(targetDate: Date): boolean {
    return this.isWithinForecastRange(targetDate);
  }

  /**
   * FIXED: Enhanced live forecast detection
   */
  static isLiveForecast(weather: ForecastWeatherData, segmentDate: Date): boolean {
    if (!weather || !segmentDate) return false;
    
    // Check if the weather source indicates it's a live forecast
    if (weather.source === 'live_forecast') return true;
    if (weather.isActualForecast === true) return true;
    
    // Also check if the date is within forecast range (including today)
    return this.isWithinForecastRange(segmentDate);
  }

  /**
   * CRITICAL FIX: Format date for API requests
   */
  static formatDateForApi(date: Date): string {
    return DateNormalizationService.toDateString(date);
  }
}
