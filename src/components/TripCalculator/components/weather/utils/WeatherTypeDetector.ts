
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export type WeatherType = 'live_forecast' | 'historical_fallback' | 'seasonal_estimate' | 'unknown';

export interface WeatherTypeInfo {
  type: WeatherType;
  isActualForecast: boolean;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
}

export class WeatherTypeDetector {
  static detectWeatherType(weather: ForecastWeatherData): WeatherTypeInfo {
    const isActualForecast = weather.isActualForecast === true;
    const source = weather.source || 'unknown';
    
    console.log('🔍 PLAN: WeatherTypeDetector analyzing weather type:', {
      cityName: weather.cityName,
      isActualForecast,
      source
    });

    // Live forecast detection
    if (isActualForecast && source === 'live_forecast') {
      return {
        type: 'live_forecast',
        isActualForecast: true,
        source,
        confidence: 'high',
        dataQuality: 'excellent',
        description: 'Real-time weather forecast from OpenWeatherMap API'
      };
    }

    // Historical fallback detection
    if (!isActualForecast && source === 'historical_fallback') {
      return {
        type: 'historical_fallback',
        isActualForecast: false,
        source,
        confidence: 'medium',
        dataQuality: 'good',
        description: 'Seasonal average weather data with city-specific variations'
      };
    }

    // Seasonal estimate detection
    if (!isActualForecast && (source.includes('seasonal') || source.includes('fallback'))) {
      return {
        type: 'seasonal_estimate',
        isActualForecast: false,
        source,
        confidence: 'low',
        dataQuality: 'fair',
        description: 'Estimated weather based on seasonal patterns'
      };
    }

    // Unknown or inconsistent data
    return {
      type: 'unknown',
      isActualForecast,
      source,
      confidence: 'low',
      dataQuality: 'poor',
      description: 'Weather data type could not be determined'
    };
  }

  static isHighQualityWeather(weather: ForecastWeatherData): boolean {
    const typeInfo = this.detectWeatherType(weather);
    return typeInfo.type === 'live_forecast' && typeInfo.confidence === 'high';
  }

  static getWeatherSourceLabel(weather: ForecastWeatherData): string {
    const typeInfo = this.detectWeatherType(weather);
    
    switch (typeInfo.type) {
      case 'live_forecast':
        return 'Live Forecast ✅';
      case 'historical_fallback':
        return 'Historical Average';
      case 'seasonal_estimate':
        return 'Seasonal Estimate';
      default:
        return 'Weather Data';
    }
  }
}
