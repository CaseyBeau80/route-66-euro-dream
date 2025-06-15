
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
   * FIXED: Use the EXACT same logic as Preview version - only check weather properties
   */
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    const validationErrors: string[] = [];
    
    console.log('🔧 FIXED: WeatherDataValidator using Preview logic:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      usingPreviewLogic: true
    });
    
    // FIXED: Use the EXACT same detection as Preview - no date range check
    const isLiveForecast = LiveWeatherDetectionService.isLiveWeatherForecast(weather);
    
    console.log('✅ FIXED: Weather validation using Preview detection:', {
      cityName,
      isLiveForecast,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      expectedColor: isLiveForecast ? 'GREEN (Live Forecast)' : 'YELLOW (Historical)',
      matchesPreview: true
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
    // FIXED: Use Preview logic directly
    return LiveWeatherDetectionService.isLiveWeatherForecast(weather);
  }
}
