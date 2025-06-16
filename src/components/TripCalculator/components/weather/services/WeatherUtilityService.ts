
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
   * CRITICAL FIX: Calculate days from today with live forecast buffer
   */
  static getDaysFromToday(targetDate: Date): number {
    const today = new Date();
    return DateNormalizationService.getDaysDifference(today, targetDate);
  }

  /**
   * FIXED: Enhanced forecast range check - includes today as live forecast
   */
  static isWithinForecastRange(targetDate: Date): boolean {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetNormalized = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    // Calculate difference in days
    const timeDiff = targetNormalized.getTime() - todayNormalized.getTime();
    const daysDiff = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
    
    // FIXED: Today (day 0) through day 7 are live forecast
    const isWithinRange = daysDiff >= 0 && daysDiff <= 7;
    
    console.log('🌤️ FIXED: Enhanced forecast range check:', {
      targetDate: targetDate.toLocaleDateString(),
      today: today.toLocaleDateString(),
      daysDiff,
      isWithinRange,
      logic: 'Day 0 (today) through Day 7 = LIVE FORECAST'
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
