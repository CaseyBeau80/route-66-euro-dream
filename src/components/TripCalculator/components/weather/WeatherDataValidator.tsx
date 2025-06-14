
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

    // CRITICAL FIX: PRESERVE the original source and isActualForecast values - DO NOT MODIFY THEM
    const originalSource = weather.source;
    const originalIsActualForecast = weather.isActualForecast;
    
    // FIXED: Direct live forecast detection using ORIGINAL values without any modification
    const isLiveForecast = originalSource === 'live_forecast' && originalIsActualForecast === true;

    console.log('🔧 FIXED: WeatherDataValidator PRESERVING original live weather data:', {
      cityName,
      originalSource,
      originalIsActualForecast,
      isLiveForecast,
      temperature: weather.temperature,
      criticalFix: 'PRESERVING_ORIGINAL_VALUES'
    });

    // CRITICAL FIX: Create normalized weather data that PRESERVES ALL original values
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      cityName,
      forecastDate: segmentDate,
      // CRITICAL: PRESERVE original source and isActualForecast - NEVER override them
      source: originalSource,
      isActualForecast: originalIsActualForecast,
      // Ensure we have sensible defaults for missing optional fields only
      humidity: weather.humidity || 50,
      windSpeed: weather.windSpeed || 0,
      precipitationChance: weather.precipitationChance || 0,
      highTemp: weather.highTemp || weather.temperature + 5,
      lowTemp: weather.lowTemp || weather.temperature - 5
    };

    console.log('🔧 FIXED: WeatherDataValidator final result (NO OVERRIDES):', {
      cityName,
      isValid: errors.length === 0,
      isLiveForecast,
      originalValues: {
        source: originalSource,
        isActualForecast: originalIsActualForecast
      },
      preservedValues: {
        source: normalizedWeather.source,
        isActualForecast: normalizedWeather.isActualForecast
      },
      valuesPreserved: normalizedWeather.source === originalSource && normalizedWeather.isActualForecast === originalIsActualForecast,
      errors,
      criticalFix: 'VALUES_PRESERVED_NOT_OVERRIDDEN'
    });

    return {
      isValid: errors.length === 0,
      isLiveForecast,
      validationErrors: errors,
      normalizedWeather
    };
  }
}
