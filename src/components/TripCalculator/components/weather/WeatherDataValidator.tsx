
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

    // CRITICAL FIX: DO NOT MODIFY the original source and isActualForecast values
    // These were correctly set by the SimpleWeatherFetcher
    const originalSource = weather.source;
    const originalIsActualForecast = weather.isActualForecast;
    
    // Direct live forecast detection using ORIGINAL values (NO MODIFICATION)
    const isLiveForecast = originalSource === 'live_forecast' && originalIsActualForecast === true;

    console.log('🔧 FIXED: WeatherDataValidator PRESERVING ALL original values:', {
      cityName,
      originalSource,
      originalIsActualForecast,
      isLiveForecast,
      temperature: weather.temperature,
      preservationMode: 'STRICT_ORIGINAL_VALUES_ONLY'
    });

    // CRITICAL FIX: Create normalized weather data that PRESERVES ALL original values
    // DO NOT override source or isActualForecast under any circumstances
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      cityName,
      forecastDate: segmentDate,
      // CRITICAL: NEVER override these - use original values exactly as they are
      source: originalSource,
      isActualForecast: originalIsActualForecast,
      // Only provide defaults for missing optional fields
      humidity: weather.humidity || 50,
      windSpeed: weather.windSpeed || 0,
      precipitationChance: weather.precipitationChance || 0,
      highTemp: weather.highTemp || weather.temperature + 5,
      lowTemp: weather.lowTemp || weather.temperature - 5
    };

    console.log('🔧 FIXED: WeatherDataValidator final result (ZERO OVERRIDES):', {
      cityName,
      isValid: errors.length === 0,
      isLiveForecast,
      inputValues: {
        source: originalSource,
        isActualForecast: originalIsActualForecast
      },
      outputValues: {
        source: normalizedWeather.source,
        isActualForecast: normalizedWeather.isActualForecast
      },
      valuesUnchanged: normalizedWeather.source === originalSource && normalizedWeather.isActualForecast === originalIsActualForecast,
      errors,
      strictPreservation: 'GUARANTEED'
    });

    return {
      isValid: errors.length === 0,
      isLiveForecast,
      validationErrors: errors,
      normalizedWeather
    };
  }
}
