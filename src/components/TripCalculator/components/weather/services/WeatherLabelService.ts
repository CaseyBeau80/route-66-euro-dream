
import { UnifiedWeatherValidator } from './UnifiedWeatherValidator';

/**
 * UPDATED: WeatherLabelService now delegates to UnifiedWeatherValidator
 */
export class WeatherLabelService {
  /**
   * UPDATED: Uses UnifiedWeatherValidator for consistent detection
   */
  static isLiveWeatherData(weather: any): boolean {
    return UnifiedWeatherValidator.isLiveWeather(weather);
  }

  /**
   * UPDATED: Uses UnifiedWeatherValidator for consistent labeling
   */
  static getWeatherSourceLabel(weather: any): string {
    return UnifiedWeatherValidator.getDisplayLabel(weather);
  }

  /**
   * UPDATED: Get live forecast indicator for display
   */
  static getLiveForecastIndicator(weather: any): string | null {
    const validation = UnifiedWeatherValidator.validateWeatherData(weather);
    return validation.isLiveForecast ? '✓ Live Forecast' : null;
  }
}
