
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
   * FIXED: Simplified validation that properly detects live weather
   */
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    const validationErrors: string[] = [];
    
    console.log('🔍 FIXED: WeatherDataValidator validating for', cityName, {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      segmentDate: segmentDate.toISOString()
    });

    // Check date range for live forecast eligibility
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(segmentDate);
    targetDate.setHours(0, 0, 0, 0);
    
    const timeDiff = targetDate.getTime() - today.getTime();
    const daysFromToday = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;

    // FIXED: Determine if this is live weather based on explicit criteria
    const isLiveForecast = (
      weather.source === 'live_forecast' && 
      weather.isActualForecast === true && 
      isWithinForecastRange
    );

    console.log('🎯 FIXED: Live weather determination for', cityName, {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      isWithinForecastRange,
      daysFromToday,
      finalIsLive: isLiveForecast
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

    // Create normalized weather data
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      // Ensure proper source marking
      source: isLiveForecast ? 'live_forecast' : 'historical_fallback',
      isActualForecast: isLiveForecast,
      // Ensure we have sensible defaults
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

    console.log('✅ FIXED: Validation result for', cityName, {
      isValid: result.isValid,
      isLiveForecast: result.isLiveForecast,
      weatherQuality: result.weatherQuality,
      errors: validationErrors.length
    });

    return result;
  }
}
