
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
   * CRITICAL FIX: Enhanced validation that properly detects live weather
   */
  static validateWeatherData(
    weather: ForecastWeatherData,
    cityName: string,
    segmentDate: Date
  ): WeatherValidationResult {
    const validationErrors: string[] = [];
    
    // CRITICAL FIX: Check if we have a valid API key
    const hasValidApiKey = WeatherApiKeyManager.hasApiKey();
    const apiKey = WeatherApiKeyManager.getApiKey();
    const isValidApiKey = hasValidApiKey && apiKey !== 'YOUR_API_KEY_HERE' && (apiKey?.length || 0) > 10;
    
    // CRITICAL FIX: Check if date is within live forecast range (0-7 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(segmentDate);
    targetDate.setHours(0, 0, 0, 0);
    const daysFromToday = Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;
    
    // CRITICAL FIX: Determine if this should be considered live weather
    // Live weather requires: valid API key + within forecast range + live_forecast source
    const shouldBeLive = isValidApiKey && isWithinForecastRange;
    const isActuallyLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    // CRITICAL FIX: The weather is live if all conditions are met
    const isLiveForecast = shouldBeLive && isActuallyLive;
    
    console.log('🔧 CRITICAL FIX: WeatherDataValidator enhanced validation:', {
      cityName,
      segmentDate: segmentDate.toISOString(),
      daysFromToday,
      hasValidApiKey: isValidApiKey,
      isWithinForecastRange,
      shouldBeLive,
      weatherSource: weather.source,
      weatherIsActualForecast: weather.isActualForecast,
      isActuallyLive,
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
    
    // CRITICAL FIX: Create normalized weather with corrected classification
    const normalizedWeather: ForecastWeatherData = {
      ...weather,
      // CRITICAL FIX: Ensure source and isActualForecast reflect the validation result
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
    
    console.log('🔧 CRITICAL FIX: WeatherDataValidator final result:', {
      cityName,
      isLiveForecast,
      confidence,
      normalizedSource: normalizedWeather.source,
      normalizedIsActualForecast: normalizedWeather.isActualForecast,
      errorsCount: validationErrors.length
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
