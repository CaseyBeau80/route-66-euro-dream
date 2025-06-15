
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { LiveWeatherDetectionService } from './services/LiveWeatherDetectionService';

export interface WeatherValidationResult {
  isLiveForecast: boolean;
  normalizedWeather: ForecastWeatherData;
  validationErrors: string[];
  confidence: 'high' | 'medium' | 'low';
}

export class WeatherDataValidator {
  /**
   * UNIFIED: Use the exact same logic as Preview and LiveWeatherDetectionService
   */
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    const validationErrors: string[] = [];
    
    console.log('🔧 UNIFIED: WeatherDataValidator using unified logic:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      unifiedLogic: true
    });
    
    // UNIFIED: Use the exact same detection as LiveWeatherDetectionService
    const isLiveForecast = LiveWeatherDetectionService.isLiveWeatherForecast(weather);
    
    console.log('✅ UNIFIED: Weather validation result:', {
      cityName,
      isLiveForecast,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      expectedColor: isLiveForecast ? 'GREEN (Live Forecast)' : 'YELLOW (Historical)',
      unifiedDetection: true
    });
    
    // Validate basic weather data
    if (!weather.temperature || isNaN(weather.temperature)) {
      validationErrors.push('Invalid temperature data');
    }
    
    if (!weather.description) {
      validationErrors.push('Missing weather description');
    }
    
    // Create normalized weather with original properties intact
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      cityName: weather.cityName || cityName
    };
    
    const confidence: 'high' | 'medium' | 'low' = validationErrors.length > 0 ? 'low' : (isLiveForecast ? 'high' : 'medium');
    
    return {
      isLiveForecast,
      normalizedWeather,
      validationErrors,
      confidence
    };
  }
  
  static shouldDisplayAsLive(weather: ForecastWeatherData, segmentDate: Date): boolean {
    // UNIFIED: Use the same logic as LiveWeatherDetectionService
    return LiveWeatherDetectionService.isLiveWeatherForecast(weather);
  }
}
