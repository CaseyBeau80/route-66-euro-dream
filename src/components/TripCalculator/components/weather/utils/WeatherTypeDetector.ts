
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { UnifiedWeatherValidator } from '../services/UnifiedWeatherValidator';

export interface WeatherTypeInfo {
  type: 'live' | 'historical' | 'estimated' | 'unknown';
  isActualForecast: boolean;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  displayLabel: string;
}

export class WeatherTypeDetector {
  /**
   * UPDATED: Use UnifiedWeatherValidator for consistent detection
   */
  static detectWeatherType(weather: ForecastWeatherData): WeatherTypeInfo {
    console.log('🔍 UPDATED: WeatherTypeDetector delegating to UnifiedWeatherValidator');
    
    const validation = UnifiedWeatherValidator.validateWeatherData(weather);

    // Map validation result to WeatherTypeInfo format
    const type: 'live' | 'historical' | 'estimated' | 'unknown' = 
      validation.isLiveForecast ? 'live' : 
      validation.source === 'historical_fallback' ? 'historical' : 'estimated';

    const dataQuality: 'excellent' | 'good' | 'fair' | 'poor' = 
      validation.confidence === 'high' ? 'excellent' :
      validation.confidence === 'medium' ? 'good' : 'fair';

    return {
      type,
      isActualForecast: validation.isLiveForecast,
      source: validation.source,
      confidence: validation.confidence,
      dataQuality,
      description: validation.explanation,
      displayLabel: validation.displayLabel
    };
  }

  /**
   * UPDATED: Use UnifiedWeatherValidator for live weather check
   */
  static isLiveWeather(weather: ForecastWeatherData): boolean {
    return UnifiedWeatherValidator.isLiveWeather(weather);
  }

  /**
   * Get footer message for weather display
   */
  static getFooterMessage(weather: { source?: string; isActualForecast?: boolean }): string {
    const validation = UnifiedWeatherValidator.validateWeatherData(weather);
    return validation.isLiveForecast 
      ? 'Weather data from live forecast API'
      : 'Weather data from historical patterns';
  }
}
