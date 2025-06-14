
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface WeatherValidationResult {
  isValid: boolean;
  isLiveForecast: boolean;
  normalizedWeather: ForecastWeatherData;
  validationErrors: string[];
  weatherQuality: 'live' | 'historical' | 'fallback';
}

export class WeatherDataValidator {
  /**
   * CRITICAL FIX: Preserve original source values from fetcher - DO NOT OVERRIDE
   */
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    const validationErrors: string[] = [];
    
    console.log('🔍 CRITICAL FIX: WeatherDataValidator.ts preserving original values for', cityName, {
      originalSource: weather.source,
      originalIsActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      segmentDate: segmentDate.toISOString(),
      preservationMode: 'STRICT_NO_OVERRIDES'
    });

    // CRITICAL FIX: DO NOT recalculate or override - use the original values exactly as they are
    const originalSource = weather.source;
    const originalIsActualForecast = weather.isActualForecast;
    
    // CRITICAL FIX: Live forecast detection using ORIGINAL values only
    const isLiveForecast = originalSource === 'live_forecast' && originalIsActualForecast === true;

    console.log('🎯 CRITICAL FIX: Live weather determination using ORIGINAL values:', {
      cityName,
      originalSource,
      originalIsActualForecast,
      finalIsLive: isLiveForecast,
      noOverrides: true
    });

    // Validate temperature
    if (!weather.temperature || weather.temperature < -50 || weather.temperature > 150) {
      validationErrors.push('Invalid temperature value');
    }

    // Validate required fields
    if (!weather.description) {
      validationErrors.push('Missing weather description');
    }

    if (!weather.icon) {
      validationErrors.push('Missing weather icon');
    }

    // CRITICAL FIX: Create normalized weather data that PRESERVES ALL original values
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      // CRITICAL: NEVER override these - preserve exactly what the fetcher set
      source: originalSource,
      isActualForecast: originalIsActualForecast,
      // Only provide defaults for missing optional fields
      humidity: weather.humidity || 50,
      windSpeed: weather.windSpeed || 0,
      precipitationChance: weather.precipitationChance || 0,
      highTemp: weather.highTemp || weather.temperature + 10,
      lowTemp: weather.lowTemp || weather.temperature - 10
    };

    const result: WeatherValidationResult = {
      isValid: validationErrors.length === 0,
      isLiveForecast,
      normalizedWeather,
      validationErrors,
      weatherQuality: isLiveForecast ? 'live' : 'historical'
    };

    console.log('✅ CRITICAL FIX: Validation result preserving original values for', cityName, {
      isValid: result.isValid,
      isLiveForecast: result.isLiveForecast,
      weatherQuality: result.weatherQuality,
      inputSource: originalSource,
      outputSource: normalizedWeather.source,
      valuesPreserved: normalizedWeather.source === originalSource && normalizedWeather.isActualForecast === originalIsActualForecast,
      errors: validationErrors.length,
      guaranteedPreservation: true
    });

    return result;
  }
}
