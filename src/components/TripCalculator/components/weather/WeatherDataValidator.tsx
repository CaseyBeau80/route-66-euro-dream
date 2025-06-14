
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

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

    // Validate source and forecast flags
    const hasLiveSource = weather.source === 'live_forecast';
    const hasLiveFlag = weather.isActualForecast === true;
    const isLiveForecast = hasLiveSource && hasLiveFlag;

    if (!hasLiveSource && weather.isActualForecast === true) {
      errors.push('Has isActualForecast=true but source is not live_forecast');
    }

    // Create normalized weather data
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      cityName,
      forecastDate: segmentDate,
      // Ensure consistent typing - use only valid source values
      source: weather.source || 'historical_fallback',
      isActualForecast: Boolean(weather.isActualForecast)
    };

    console.log('🔍 WeatherDataValidator result:', {
      cityName,
      isValid: errors.length === 0,
      isLiveForecast,
      hasLiveSource,
      hasLiveFlag,
      errors,
      originalWeather: {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        temperature: weather.temperature
      }
    });

    return {
      isValid: errors.length === 0,
      isLiveForecast,
      validationErrors: errors,
      normalizedWeather
    };
  }
}
