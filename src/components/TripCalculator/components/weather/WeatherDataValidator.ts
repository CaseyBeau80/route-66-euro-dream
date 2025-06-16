
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { UnifiedDateService } from '../../services/UnifiedDateService';

export interface WeatherValidationResult {
  isLiveForecast: boolean;
  normalizedWeather: ForecastWeatherData;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
}

export class WeatherDataValidator {
  /**
   * CRITICAL FIX: Validate and normalize weather data with strict live forecast detection
   */
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    console.log('🔍 CRITICAL FIX: WeatherDataValidator validating weather for', cityName, {
      originalSource: weather.source,
      originalIsActualForecast: weather.isActualForecast,
      segmentDate: segmentDate.toISOString(),
      temperature: weather.temperature
    });

    // CRITICAL FIX: Strict validation - if source is live_forecast AND isActualForecast is true, it's DEFINITELY live
    const isDefinitelyLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    // Additional date-based validation
    const daysFromToday = UnifiedDateService.getDaysFromToday(segmentDate);
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;
    
    // CRITICAL FIX: Final determination - prioritize explicit flags
    const isLiveForecast = isDefinitelyLive && isWithinForecastRange;

    console.log('🔍 CRITICAL FIX: WeatherDataValidator final determination for', cityName, {
      isDefinitelyLive,
      daysFromToday,
      isWithinForecastRange,
      finalIsLiveForecast: isLiveForecast,
      explanation: isLiveForecast ? 'CONFIRMED_LIVE_FORECAST' : 'HISTORICAL_OR_FALLBACK'
    });

    // Normalize the weather data
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      source: isLiveForecast ? 'live_forecast' : 'historical_fallback',
      isActualForecast: isLiveForecast,
      cityName: cityName,
      temperature: weather.temperature || 70,
      description: weather.description || 'Partly Cloudy',
      icon: weather.icon || '02d',
      humidity: weather.humidity || 50,
      windSpeed: weather.windSpeed || 5,
      precipitationChance: weather.precipitationChance || 0
    };

    const result: WeatherValidationResult = {
      isLiveForecast,
      normalizedWeather,
      confidence: isLiveForecast ? 'high' : 'medium',
      explanation: isLiveForecast 
        ? `Live forecast confirmed for ${cityName} - source: ${weather.source}, isActualForecast: ${weather.isActualForecast}`
        : `Historical data for ${cityName} - either not live source or outside forecast range`
    };

    console.log('✅ CRITICAL FIX: WeatherDataValidator result for', cityName, result);

    return result;
  }
}
