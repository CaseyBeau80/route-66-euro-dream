
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';

export interface WeatherValidationResult {
  isLiveForecast: boolean;
  normalizedWeather: ForecastWeatherData;
  validationErrors: string[];
  confidence: 'high' | 'medium' | 'low';
}

export class WeatherDataValidator {
  /**
   * CORRECTED: Determine if weather should be displayed as live forecast
   */
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    const validationErrors: string[] = [];
    
    // Check if we have a valid API key
    const hasValidApiKey = WeatherApiKeyManager.hasApiKey();
    const apiKey = WeatherApiKeyManager.getApiKey();
    const isValidApiKey = hasValidApiKey && apiKey !== 'YOUR_API_KEY_HERE' && (apiKey?.length || 0) > 10;
    
    // Check if date is within live forecast range (0-5 days from today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(segmentDate);
    targetDate.setHours(0, 0, 0, 0);
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 5;
    
    // CORRECTED LOGIC: Live forecast ONLY if API key exists AND within 5-day range
    const isLiveForecast = isValidApiKey && isWithinForecastRange;
    
    console.log('🔧 CORRECTED: WeatherDataValidator logic:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      daysFromToday,
      isValidApiKey,
      isWithinForecastRange,
      isLiveForecast,
      shouldShowGreen: isLiveForecast,
      shouldShowYellow: !isLiveForecast
    });
    
    // Validate basic weather data
    if (!weather.temperature || isNaN(weather.temperature)) {
      validationErrors.push('Invalid temperature data');
    }
    
    if (!weather.description) {
      validationErrors.push('Missing weather description');
    }
    
    if (!weather.icon) {
      validationErrors.push('Missing weather icon');
    }
    
    // CORRECTED: Force correct source assignment based on validation
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      source: isLiveForecast ? 'live_forecast' : 'historical_fallback',
      isActualForecast: isLiveForecast,
      cityName: weather.cityName || cityName
    };
    
    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' = 'high';
    if (validationErrors.length > 0) {
      confidence = 'low';
    } else if (!isLiveForecast && isWithinForecastRange) {
      confidence = 'medium';
    }
    
    console.log('✅ CORRECTED: WeatherDataValidator final result:', {
      cityName,
      daysFromToday,
      isLiveForecast,
      normalizedSource: normalizedWeather.source,
      confidence,
      displayStyle: isLiveForecast ? 'GREEN_LIVE' : 'YELLOW_HISTORICAL'
    });
    
    return {
      isLiveForecast,
      normalizedWeather,
      validationErrors,
      confidence
    };
  }
  
  /**
   * Helper method to check if weather should display as live
   */
  static shouldDisplayAsLive(weather: ForecastWeatherData, segmentDate: Date): boolean {
    const result = this.validateWeatherData(weather, weather.cityName, segmentDate);
    return result.isLiveForecast;
  }
}
