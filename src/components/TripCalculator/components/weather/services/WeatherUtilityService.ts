
import { UnifiedDateService } from '../../../services/UnifiedDateService';
import { UnifiedWeatherValidator } from './UnifiedWeatherValidator';

export class WeatherUtilityService {
  /**
   * FIXED: Calculate segment date using UnifiedDateService for consistency
   */
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    const segmentDate = UnifiedDateService.calculateSegmentDate(tripStartDate, segmentDay);
    
    console.log('📅 FIXED: WeatherUtilityService.getSegmentDate:', {
      tripStartDate: tripStartDate.toLocaleDateString(),
      segmentDay,
      calculatedDate: segmentDate.toLocaleDateString(),
      service: 'UnifiedDateService - CONSISTENT CALCULATION'
    });
    
    return segmentDate;
  }

  /**
   * FIXED: Check if date is within live forecast range using centralized threshold
   */
  static isWithinLiveForecastRange(segmentDate: Date): boolean {
    return UnifiedWeatherValidator.isDateWithinForecastRange(segmentDate);
  }

  /**
   * FIXED: Get days from today using UnifiedDateService
   */
  static getDaysFromToday(segmentDate: Date): number {
    return UnifiedDateService.getDaysFromToday(segmentDate);
  }

  /**
   * FIXED: Determine if weather is live forecast using UnifiedWeatherValidator
   */
  static isLiveForecast(weather: any, segmentDate: Date): boolean {
    return UnifiedWeatherValidator.isLiveWeather(weather, segmentDate);
  }

  /**
   * FIXED: Get centralized forecast threshold
   */
  static getForecastThresholdDays(): number {
    return UnifiedWeatherValidator.getForecastThresholdDays();
  }

  /**
   * FIXED: Format weather source label using UnifiedWeatherValidator
   */
  static formatWeatherSourceLabel(weather: any, segmentDate: Date): string {
    return UnifiedWeatherValidator.getDisplayLabel(weather, segmentDate);
  }

  /**
   * FIXED: Get weather style theme using UnifiedWeatherValidator
   */
  static getWeatherStyleTheme(weather: any, segmentDate: Date): 'green' | 'amber' | 'gray' {
    return UnifiedWeatherValidator.getStyleTheme(weather, segmentDate);
  }
}
