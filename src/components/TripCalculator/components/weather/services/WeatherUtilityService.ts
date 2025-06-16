
import { UnifiedDateService } from '../../../services/UnifiedDateService';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class WeatherUtilityService {
  /**
   * Calculate segment date using unified date service
   */
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date | null {
    if (!tripStartDate || !segmentDay || segmentDay < 1) {
      console.error('❌ UNIFIED WEATHER: Invalid parameters:', {
        tripStartDate,
        segmentDay,
        isValidDate: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())
      });
      return null;
    }

    try {
      const segmentDate = UnifiedDateService.calculateSegmentDate(tripStartDate, segmentDay);
      
      console.log('📅 UNIFIED WEATHER: Segment date calculation:', {
        tripStartDate: tripStartDate.toLocaleDateString(),
        segmentDay,
        calculatedDate: segmentDate.toLocaleDateString(),
        verification: segmentDay === 1 ? {
          day1Check: 'Day 1 should match trip start exactly',
          matches: UnifiedDateService.isSameDate(tripStartDate, segmentDate)
        } : null
      });
      
      return segmentDate;
    } catch (error) {
      console.error('❌ UNIFIED WEATHER: Date calculation error:', error);
      return null;
    }
  }

  /**
   * Calculate days from today using unified service
   */
  static getDaysFromToday(targetDate: Date): number {
    const daysDiff = UnifiedDateService.getDaysFromToday(targetDate);
    
    console.log('📅 UNIFIED WEATHER: Days from today:', {
      targetDate: targetDate.toLocaleDateString(),
      daysDiff,
      interpretation: daysDiff === 0 ? 'TODAY - LIVE FORECAST' : daysDiff > 0 ? 'FUTURE - LIVE FORECAST' : 'PAST - HISTORICAL'
    });
    
    return daysDiff;
  }

  /**
   * Check if within forecast range using unified service
   */
  static isWithinForecastRange(targetDate: Date): boolean {
    const isWithinRange = UnifiedDateService.isWithinLiveForecastRange(targetDate);
    
    console.log('🌤️ UNIFIED WEATHER: Forecast range check:', {
      targetDate: targetDate.toLocaleDateString(),
      isWithinRange,
      logic: 'Day 0 (TODAY) through Day 7 = LIVE FORECAST'
    });
    
    return isWithinRange;
  }

  /**
   * Check if date is within live forecast range (same as isWithinForecastRange)
   */
  static isWithinLiveForecastRange(targetDate: Date): boolean {
    return this.isWithinForecastRange(targetDate);
  }

  /**
   * Enhanced live forecast detection
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
   * Format date for API requests using unified service
   */
  static formatDateForApi(date: Date): string {
    return UnifiedDateService.formatForApi(date);
  }
}
