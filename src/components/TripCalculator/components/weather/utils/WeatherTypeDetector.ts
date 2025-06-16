
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface WeatherTypeInfo {
  type: 'live' | 'historical' | 'estimated' | 'unknown';
  isActualForecast: boolean;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  displayLabel: string;
}

export class WeatherTypeDetector {
  /**
   * CRITICAL FIX: Strict source-based weather type detection
   * If source is 'live_forecast' and isActualForecast is true, it's ALWAYS live weather
   */
  static detectWeatherType(weather: ForecastWeatherData): WeatherTypeInfo {
    console.log('🔍 CRITICAL FIX: WeatherTypeDetector - STRICT SOURCE-BASED DETECTION:', {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      cityName: weather.cityName,
      temperature: weather.temperature,
      strictLogic: 'SOURCE_TRUMPS_ALL_OTHER_LOGIC'
    });

    // CRITICAL FIX: If explicitly marked as live forecast, it IS live weather
    if (weather.source === 'live_forecast' && weather.isActualForecast === true) {
      console.log('✅ CRITICAL FIX: DEFINITIVE LIVE WEATHER DETECTION:', {
        cityName: weather.cityName,
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        result: 'LIVE_WEATHER',
        noDateChecking: 'SOURCE_IS_AUTHORITATIVE'
      });

      return {
        type: 'live',
        isActualForecast: true,
        source: weather.source,
        confidence: 'high',
        dataQuality: 'excellent',
        description: 'Real-time weather forecast from API',
        displayLabel: '🟢 Live Weather Forecast'
      };
    }

    // CRITICAL FIX: If explicitly marked as historical fallback
    if (weather.source === 'historical_fallback') {
      console.log('📊 CRITICAL FIX: DEFINITIVE HISTORICAL WEATHER DETECTION:', {
        cityName: weather.cityName,
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        result: 'HISTORICAL_WEATHER'
      });

      return {
        type: 'historical',
        isActualForecast: false,
        source: weather.source,
        confidence: 'medium',
        dataQuality: 'good',
        description: 'Historical weather data estimate',
        displayLabel: '📊 Historical Weather Data'
      };
    }

    // Fallback for unclear cases
    console.log('⚠️ CRITICAL FIX: UNCLEAR WEATHER SOURCE:', {
      cityName: weather.cityName,
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      result: 'UNKNOWN_TREATING_AS_ESTIMATED'
    });

    return {
      type: 'estimated',
      isActualForecast: weather.isActualForecast || false,
      source: weather.source || 'unknown',
      confidence: 'low',
      dataQuality: 'fair',
      description: 'Weather estimate',
      displayLabel: '🌤️ Weather Estimate'
    };
  }

  /**
   * CRITICAL FIX: Simple live weather check based purely on source
   */
  static isLiveWeather(weather: ForecastWeatherData): boolean {
    const isLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    console.log('🔍 CRITICAL FIX: WeatherTypeDetector.isLiveWeather - STRICT CHECK:', {
      cityName: weather.cityName,
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      isLive,
      logic: 'PURE_SOURCE_BASED_DETECTION'
    });

    return isLive;
  }
}
