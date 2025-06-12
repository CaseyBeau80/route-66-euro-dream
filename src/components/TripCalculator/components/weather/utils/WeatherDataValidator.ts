
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherDataNormalizer, NormalizedWeatherData } from '../services/WeatherDataNormalizer';

export class WeatherDataValidator {
  static validateWeatherData(data: ForecastWeatherData, city: string, dateString: string): boolean {
    console.log('🔧 WeatherDataValidator: Enhanced validation for', city, ':', {
      hasWeatherObject: !!data,
      temperature: data?.temperature,
      highTemp: data?.highTemp,
      lowTemp: data?.lowTemp
    });

    if (!data) {
      console.log('❌ WeatherDataValidator: No weather data provided');
      return false;
    }

    // Use the normalizer to validate
    const normalized = WeatherDataNormalizer.normalizeWeatherData(data, city);
    const isValid = normalized !== null && normalized.isValid;
    
    console.log('✅ WeatherDataValidator: Enhanced validation result:', {
      isValid,
      hasNormalizedData: !!normalized,
      temperature: normalized?.temperature,
      source: normalized?.source
    });

    return isValid;
  }

  static validateLiveForecastData(data: ForecastWeatherData): boolean {
    console.log('🔧 WeatherDataValidator: Enhanced live forecast validation:', {
      hasData: !!data,
      isActualForecast: data?.isActualForecast
    });

    if (!data) return false;

    const normalized = WeatherDataNormalizer.normalizeWeatherData(data, data.cityName || 'Unknown');
    return normalized !== null && normalized.isValid;
  }

  /**
   * Validate normalized weather data for consistency
   */
  static validateNormalizedData(data: NormalizedWeatherData | null): boolean {
    if (!data) return false;
    
    return data.isValid && 
           data.temperature > 0 && 
           data.highTemp > 0 && 
           data.lowTemp > 0 &&
           !!data.description;
  }
}
