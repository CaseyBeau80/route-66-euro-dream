
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
   * SIMPLE: Direct logic to determine if weather should show as live (GREEN) or historical (YELLOW)
   */
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    const validationErrors: string[] = [];
    
    console.log('🔧 SIMPLE: WeatherDataValidator with direct logic:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      hasApiKey: WeatherApiKeyManager.hasApiKey()
    });
    
    // SIMPLE CHECK 1: Do we have a valid API key?
    const hasValidApiKey = WeatherApiKeyManager.hasApiKey() && 
                          WeatherApiKeyManager.getApiKey() !== 'YOUR_API_KEY_HERE' && 
                          (WeatherApiKeyManager.getApiKey()?.length || 0) > 10;
    
    // SIMPLE CHECK 2: Is date within 0-5 days from today?
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(segmentDate);
    targetDate.setHours(0, 0, 0, 0);
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 5;
    
    // SIMPLE CHECK 3: Does weather data indicate it's live?
    const hasLiveIndicators = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    // SIMPLE DECISION: Live forecast = ALL THREE conditions must be true
    const isLiveForecast = hasValidApiKey && isWithinForecastRange && hasLiveIndicators;
    
    console.log('✅ SIMPLE: Final decision for', cityName, ':', {
      hasValidApiKey,
      isWithinForecastRange,
      hasLiveIndicators,
      daysFromToday,
      isLiveForecast,
      expectedColor: isLiveForecast ? 'GREEN' : 'YELLOW'
    });
    
    // Validate basic weather data
    if (!weather.temperature || isNaN(weather.temperature)) {
      validationErrors.push('Invalid temperature data');
    }
    
    if (!weather.description) {
      validationErrors.push('Missing weather description');
    }
    
    // Create normalized weather with corrected source
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      source: isLiveForecast ? 'live_forecast' : 'historical_fallback',
      isActualForecast: isLiveForecast,
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
    const result = this.validateWeatherData(weather, weather.cityName, segmentDate);
    return result.isLiveForecast;
  }
}
