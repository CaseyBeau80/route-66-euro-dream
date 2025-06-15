
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { LiveWeatherDetectionService } from './services/LiveWeatherDetectionService';

export interface WeatherValidationResult {
  isValid: boolean;
  isLiveForecast: boolean;
  validationErrors: string[];
  normalizedWeather: ForecastWeatherData;
}

export class WeatherDataValidator {
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    const errors: string[] = [];
    
    // Validate basic structure
    if (!weather) {
      errors.push('Weather data is null/undefined');
      return {
        isValid: false,
        isLiveForecast: false,
        validationErrors: errors,
        normalizedWeather: weather
      };
    }

    // Validate temperature data
    if (typeof weather.temperature !== 'number' || weather.temperature < -100 || weather.temperature > 150) {
      errors.push(`Invalid temperature: ${weather.temperature}`);
    }

    // FIXED: Use EXACT same detection logic as Preview version
    const isLiveForecast = LiveWeatherDetectionService.isLiveWeatherForecast(weather);
    
    console.log('🔧 FIXED: WeatherDataValidator using Preview detection:', {
      cityName,
      segmentDate: segmentDate.toLocaleDateString(),
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isLiveForecast,
      shouldShowAsLive: isLiveForecast ? 'YES_GREEN' : 'NO_AMBER',
      usingPreviewLogic: true
    });

    // Create normalized weather data - preserve original properties
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      cityName,
      forecastDate: segmentDate
    };

    console.log('🔧 FIXED: WeatherDataValidator final result:', {
      cityName,
      isValid: errors.length === 0,
      isLiveForecast,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      shouldDisplayGreen: isLiveForecast,
      usingPreviewLogic: true
    });

    return {
      isValid: errors.length === 0,
      isLiveForecast,
      validationErrors: errors,
      normalizedWeather
    };
  }

  static validateLiveForecastData(data: ForecastWeatherData): boolean {
    if (!data) return false;
    
    // FIXED: Use Preview detection logic
    return LiveWeatherDetectionService.isLiveWeatherForecast(data);
  }
}
