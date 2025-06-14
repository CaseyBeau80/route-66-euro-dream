
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

    // FIXED: Strict live forecast validation
    const hasLiveSource = weather.source === 'live_forecast';
    const hasLiveFlag = weather.isActualForecast === true;
    const isLiveForecast = hasLiveSource && hasLiveFlag;

    // Validate source consistency
    if (!hasLiveSource && weather.isActualForecast === true) {
      errors.push('Has isActualForecast=true but source is not live_forecast');
    }

    // FIXED: Create properly normalized weather data with explicit live marking
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      cityName,
      forecastDate: segmentDate,
      // Ensure the source and isActualForecast are properly set for live weather
      source: hasLiveSource ? 'live_forecast' : 'historical_fallback',
      isActualForecast: hasLiveSource ? true : false
    };

    console.log('🔍 FIXED WeatherDataValidator result:', {
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
      },
      normalizedWeather: {
        source: normalizedWeather.source,
        isActualForecast: normalizedWeather.isActualForecast,
        temperature: normalizedWeather.temperature
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
