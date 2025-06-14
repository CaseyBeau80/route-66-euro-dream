
export interface WeatherTypeInfo {
  type: 'live' | 'forecast' | 'seasonal' | 'fallback';
  confidence: 'high' | 'medium' | 'low';
  dataQuality: 'real-time' | 'forecast' | 'estimated' | 'fallback';
  isReliable: boolean;
}

export class WeatherTypeDetector {
  static detectWeatherType(weather: any): WeatherTypeInfo {
    console.log('🔍 PLAN: WeatherTypeDetector analyzing weather type:', {
      cityName: weather.cityName,
      isActualForecast: weather.isActualForecast,
      source: weather.source
    });

    // Live forecast from OpenWeatherMap
    if (weather.source === 'live_forecast' && weather.isActualForecast) {
      return {
        type: 'live',
        confidence: 'high',
        dataQuality: 'real-time',
        isReliable: true
      };
    }

    // API forecast but not live
    if (weather.source === 'live_forecast') {
      return {
        type: 'forecast',
        confidence: 'high',
        dataQuality: 'forecast',
        isReliable: true
      };
    }

    // Historical/seasonal fallback
    if (weather.source === 'historical_fallback') {
      return {
        type: 'seasonal',
        confidence: 'medium',
        dataQuality: 'estimated',
        isReliable: false
      };
    }

    // Unknown or fallback
    return {
      type: 'fallback',
      confidence: 'low',
      dataQuality: 'fallback',
      isReliable: false
    };
  }
}
