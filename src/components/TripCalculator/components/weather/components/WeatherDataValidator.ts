
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { LiveWeatherDetectionService } from '../services/LiveWeatherDetectionService';

interface WeatherValidationResult {
  isValid: boolean;
  isLiveForecast: boolean;
  normalizedWeather: ForecastWeatherData;
  validationErrors: string[];
}

export class WeatherDataValidator {
  /**
   * CRITICAL: Validate and normalize weather data
   * This ensures consistent weather detection across all components
   */
  static validateWeatherData(
    weather: ForecastWeatherData, 
    cityName: string, 
    segmentDate: Date
  ): WeatherValidationResult {
    console.log(`🔧 VALIDATION: Starting validation for ${cityName}:`, {
      originalSource: weather.source,
      originalIsActualForecast: weather.isActualForecast,
      temperature: weather.temperature
    });

    const validationErrors: string[] = [];
    
    // Validate required fields
    if (!weather.temperature || isNaN(weather.temperature)) {
      validationErrors.push('Invalid temperature');
    }
    
    if (!weather.source) {
      validationErrors.push('Missing weather source');
    }
    
    if (weather.isActualForecast === undefined || weather.isActualForecast === null) {
      validationErrors.push('Missing isActualForecast property');
    }

    // CRITICAL: Normalize the weather data to ensure proper properties
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      // Ensure source is properly set
      source: weather.source || 'historical_fallback',
      // Ensure isActualForecast is properly set
      isActualForecast: weather.isActualForecast ?? false,
      // Ensure other required fields have defaults
      temperature: weather.temperature || 70,
      description: weather.description || 'Partly Cloudy',
      icon: weather.icon || '02d',
      humidity: weather.humidity || 50,
      windSpeed: weather.windSpeed || 0,
      precipitationChance: weather.precipitationChance || 0,
      cityName: weather.cityName || cityName,
      forecastDate: weather.forecastDate || segmentDate,
      forecast: weather.forecast || []
    };

    // CRITICAL: Use the unified detection service
    const isLiveForecast = LiveWeatherDetectionService.isLiveWeatherForecast(normalizedWeather);
    
    console.log(`✅ VALIDATION: Completed for ${cityName}:`, {
      isValid: validationErrors.length === 0,
      isLiveForecast,
      normalizedSource: normalizedWeather.source,
      normalizedIsActualForecast: normalizedWeather.isActualForecast,
      temperature: normalizedWeather.temperature,
      validationErrors
    });

    return {
      isValid: validationErrors.length === 0,
      isLiveForecast,
      normalizedWeather,
      validationErrors
    };
  }
}
