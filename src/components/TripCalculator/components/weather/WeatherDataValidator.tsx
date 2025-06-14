
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

    // CRITICAL FIX: Preserve the original source and isActualForecast values
    const originalSource = weather.source;
    const originalIsActualForecast = weather.isActualForecast;
    
    // FIXED: Direct live forecast detection - use original values without modification
    const isLiveForecast = originalSource === 'live_forecast' && originalIsActualForecast === true;

    console.log('🔧 CRITICAL FIX: WeatherDataValidator preserving original data:', {
      cityName,
      originalSource,
      originalIsActualForecast,
      isLiveForecast,
      temperature: weather.temperature,
      preservingOriginalValues: true
    });

    // CRITICAL FIX: Create normalized weather data that PRESERVES live weather indicators
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      cityName,
      forecastDate: segmentDate,
      // PRESERVE original source and isActualForecast - DO NOT override them
      source: originalSource,
      isActualForecast: originalIsActualForecast
    };

    console.log('🔧 CRITICAL FIX: WeatherDataValidator result:', {
      cityName,
      isValid: errors.length === 0,
      isLiveForecast,
      preservedOriginalSource: normalizedWeather.source === originalSource,
      preservedOriginalFlag: normalizedWeather.isActualForecast === originalIsActualForecast,
      errors,
      originalWeather: {
        source: originalSource,
        isActualForecast: originalIsActualForecast,
        temperature: weather.temperature
      },
      normalizedWeather: {
        source: normalizedWeather.source,
        isActualForecast: normalizedWeather.isActualForecast,
        temperature: normalizedWeather.temperature
      },
      criticalFix: true
    });

    return {
      isValid: errors.length === 0,
      isLiveForecast,
      validationErrors: errors,
      normalizedWeather
    };
  }
}
