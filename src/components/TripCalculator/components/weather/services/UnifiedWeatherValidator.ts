
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface UnifiedWeatherValidation {
  isLiveForecast: boolean;
  source: 'live_forecast' | 'historical_fallback' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  displayLabel: string;
  badgeText: string;
  styleTheme: 'green' | 'amber' | 'gray';
  explanation: string;
}

export class UnifiedWeatherValidator {
  /**
   * MASTER VALIDATION: Single source of truth for weather classification
   * This is the ONLY method that determines if weather is live vs historical
   */
  static validateWeatherData(weather: any): UnifiedWeatherValidation {
    console.log('🎯 MASTER VALIDATION: UnifiedWeatherValidator starting classification:', {
      weatherExists: !!weather,
      source: weather?.source,
      isActualForecast: weather?.isActualForecast,
      temperature: weather?.temperature,
      cityName: weather?.cityName,
      masterValidation: true
    });

    // Handle missing weather
    if (!weather) {
      return {
        isLiveForecast: false,
        source: 'unknown',
        confidence: 'low',
        displayLabel: 'Weather Data Unavailable',
        badgeText: 'No data available',
        styleTheme: 'gray',
        explanation: 'No weather data provided'
      };
    }

    // CRITICAL RULE: If source is 'live_forecast' AND isActualForecast is true, it's ALWAYS live
    const isDefinitivelyLive = weather.source === 'live_forecast' && weather.isActualForecast === true;
    
    if (isDefinitivelyLive) {
      console.log('✅ MASTER VALIDATION: DEFINITIVE LIVE WEATHER detected:', {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        cityName: weather.cityName,
        temperature: weather.temperature,
        result: 'LIVE_FORECAST'
      });

      return {
        isLiveForecast: true,
        source: 'live_forecast',
        confidence: 'high',
        displayLabel: 'Live Weather Forecast',
        badgeText: 'Current live forecast',
        styleTheme: 'green',
        explanation: 'Real-time weather forecast from API'
      };
    }

    // CRITICAL RULE: If source is 'historical_fallback', it's ALWAYS historical
    if (weather.source === 'historical_fallback') {
      console.log('📊 MASTER VALIDATION: DEFINITIVE HISTORICAL WEATHER detected:', {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        cityName: weather.cityName,
        temperature: weather.temperature,
        result: 'HISTORICAL_DATA'
      });

      return {
        isLiveForecast: false,
        source: 'historical_fallback',
        confidence: 'medium',
        displayLabel: 'Historical Weather Data',
        badgeText: 'Based on historical patterns',
        styleTheme: 'amber',
        explanation: 'Weather estimate based on historical data'
      };
    }

    // Fallback for unclear cases
    console.log('⚠️ MASTER VALIDATION: UNCLEAR weather source - defaulting to historical:', {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      cityName: weather.cityName,
      result: 'FALLBACK_TO_HISTORICAL'
    });

    return {
      isLiveForecast: false,
      source: 'unknown',
      confidence: 'low',
      displayLabel: 'Weather Estimate',
      badgeText: 'Estimated data',
      styleTheme: 'amber',
      explanation: 'Weather data source unclear - treating as estimate'
    };
  }

  /**
   * CONVENIENCE METHOD: Quick check for live weather
   */
  static isLiveWeather(weather: any): boolean {
    const validation = this.validateWeatherData(weather);
    return validation.isLiveForecast;
  }

  /**
   * CONVENIENCE METHOD: Get display label
   */
  static getDisplayLabel(weather: any): string {
    const validation = this.validateWeatherData(weather);
    return validation.displayLabel;
  }

  /**
   * CONVENIENCE METHOD: Get style theme
   */
  static getStyleTheme(weather: any): 'green' | 'amber' | 'gray' {
    const validation = this.validateWeatherData(weather);
    return validation.styleTheme;
  }
}
