
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
   * FIXED: Simplified and more accurate live weather detection
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
    
    // FIXED: More lenient live weather detection
    // If we have a valid API key and the date is within forecast range, treat it as live
    // OR if the weather explicitly says it's live forecast
    const shouldBeLive = isValidApiKey && isWithinForecastRange;
    const claimsToBeActual = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    // FIXED: Accept live weather if either condition is met
    const isLiveForecast = shouldBeLive || claimsToBeActual;
    
    console.log('🔧 FIXED: WeatherDataValidator simplified validation:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      daysFromToday,
      hasValidApiKey: isValidApiKey,
      isWithinForecastRange,
      shouldBeLive,
      weatherSource: weather.source,
      weatherIsActualForecast: weather.isActualForecast,
      claimsToBeActual,
      finalIsLiveForecast: isLiveForecast,
      apiKeyLength: apiKey?.length || 0
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
    
    // FIXED: Create normalized weather that reflects our validation
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      // Override source and isActualForecast based on our validation
      source: isLiveForecast ? 'live_forecast' : 'historical_fallback',
      isActualForecast: isLiveForecast,
      cityName: weather.cityName || cityName
    };
    
    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' = 'high';
    if (validationErrors.length > 0) {
      confidence = 'low';
    } else if (!isLiveForecast && shouldBeLive) {
      confidence = 'medium';
    }
    
    console.log('🔧 FIXED: WeatherDataValidator final result:', {
      cityName,
      isLiveForecast,
      confidence,
      normalizedSource: normalizedWeather.source,
      normalizedIsActualForecast: normalizedWeather.isActualForecast,
      errorsCount: validationErrors.length,
      overriddenToLive: isLiveForecast && weather.source !== 'live_forecast'
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
