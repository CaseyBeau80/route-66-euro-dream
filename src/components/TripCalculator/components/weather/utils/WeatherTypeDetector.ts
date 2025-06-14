
export interface WeatherTypeInfo {
  type: 'live' | 'forecast' | 'seasonal' | 'fallback';
  confidence: 'high' | 'medium' | 'low';
  dataQuality: 'real-time' | 'forecast' | 'estimated' | 'fallback';
  isReliable: boolean;
  displayLabel: string;
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
        isReliable: true,
        displayLabel: 'Live Weather Forecast'
      };
    }

    // API forecast but not live
    if (weather.source === 'live_forecast') {
      return {
        type: 'forecast',
        confidence: 'high',
        dataQuality: 'forecast',
        isReliable: true,
        displayLabel: 'Weather Forecast'
      };
    }

    // Historical/seasonal fallback
    if (weather.source === 'historical_fallback') {
      return {
        type: 'seasonal',
        confidence: 'medium',
        dataQuality: 'estimated',
        isReliable: false,
        displayLabel: 'Seasonal Weather Estimate'
      };
    }

    // Unknown or fallback
    return {
      type: 'fallback',
      confidence: 'low',
      dataQuality: 'fallback',
      isReliable: false,
      displayLabel: 'Weather Data'
    };
  }

  static getFooterMessage(weather: { source?: string; isActualForecast?: boolean }): string {
    if (weather.source === 'live_forecast' && weather.isActualForecast) {
      return 'Live weather forecast from OpenWeatherMap';
    }
    
    if (weather.source === 'live_forecast') {
      return 'Weather forecast from OpenWeatherMap API';
    }
    
    if (weather.source === 'historical_fallback') {
      return 'Seasonal weather estimate based on historical data';
    }
    
    return 'Weather data not available';
  }
}
