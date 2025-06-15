
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
   * FIXED: Proper logic to determine if weather should show as live (GREEN) or historical (YELLOW)
   */
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    const validationErrors: string[] = [];
    
    console.log('🔧 FIXED: WeatherDataValidator with correct date logic:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast
    });
    
    // Calculate days from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(segmentDate);
    targetDate.setHours(0, 0, 0, 0);
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    
    // FIXED: Live forecast logic - days 0-5 from today can be live
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 5;
    
    // Check if we have a valid API key
    const hasValidApiKey = WeatherApiKeyManager.hasApiKey() && 
                          WeatherApiKeyManager.getApiKey() !== 'YOUR_API_KEY_HERE' && 
                          (WeatherApiKeyManager.getApiKey()?.length || 0) > 10;
    
    // FIXED: Determine if this should be live forecast
    // For live forecast: must be within range AND have API key
    const shouldBeLiveForecast = isWithinForecastRange && hasValidApiKey;
    
    console.log('✅ FIXED: Weather validation decision:', {
      cityName,
      daysFromToday,
      isWithinForecastRange,
      hasValidApiKey,
      shouldBeLiveForecast,
      expectedColor: shouldBeLiveForecast ? 'GREEN (Live Forecast)' : 'YELLOW (Historical)'
    });
    
    // Validate basic weather data
    if (!weather.temperature || isNaN(weather.temperature)) {
      validationErrors.push('Invalid temperature data');
    }
    
    if (!weather.description) {
      validationErrors.push('Missing weather description');
    }
    
    // Create normalized weather with corrected properties
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      source: shouldBeLiveForecast ? 'live_forecast' : 'historical_fallback',
      isActualForecast: shouldBeLiveForecast,
      cityName: weather.cityName || cityName
    };
    
    const confidence: 'high' | 'medium' | 'low' = validationErrors.length > 0 ? 'low' : (shouldBeLiveForecast ? 'high' : 'medium');
    
    return {
      isLiveForecast: shouldBeLiveForecast,
      normalizedWeather,
      validationErrors,
      confidence
    };
  }
  
  static shouldDisplayAsLive(weather: ForecastWeatherData, segmentDate: Date): boolean {
    const result = this.validateWeatherData(weather, weather.cityName, segmentDate);
    return result.isLiveForecast;
  }
}
