
import { UnifiedWeatherValidator } from './UnifiedWeatherValidator';

/**
 * FIXED: WeatherLabelService now requires segmentDate for consistent validation
 */
export class WeatherLabelService {
  /**
   * FIXED: Uses UnifiedWeatherValidator with REQUIRED segmentDate for consistent detection
   */
  static isLiveWeatherData(weather: any, segmentDate?: Date): boolean {
    if (!segmentDate) {
      console.warn('⚠️ FIXED: WeatherLabelService.isLiveWeatherData called without segmentDate - this may cause inconsistency');
      return false;
    }
    return UnifiedWeatherValidator.isLiveWeather(weather, segmentDate);
  }

  /**
   * FIXED: Uses UnifiedWeatherValidator with REQUIRED segmentDate for consistent labeling
   */
  static getWeatherSourceLabel(weather: any, segmentDate?: Date): string {
    if (!segmentDate) {
      console.warn('⚠️ FIXED: WeatherLabelService.getWeatherSourceLabel called without segmentDate - using fallback');
      return 'Weather Data (Date Required)';
    }
    return UnifiedWeatherValidator.getDisplayLabel(weather, segmentDate);
  }

  /**
   * FIXED: Get live forecast indicator with REQUIRED segmentDate for display
   */
  static getLiveForecastIndicator(weather: any, segmentDate?: Date): string | null {
    if (!segmentDate) {
      console.warn('⚠️ FIXED: WeatherLabelService.getLiveForecastIndicator called without segmentDate');
      return null;
    }
    const validation = UnifiedWeatherValidator.validateWeatherData(weather, segmentDate);
    return validation.isLiveForecast ? '✓ Live Forecast' : null;
  }
}
