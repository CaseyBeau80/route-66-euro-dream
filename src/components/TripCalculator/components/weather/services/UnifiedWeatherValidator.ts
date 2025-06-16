
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
   * FIXED: Enhanced validation logic to properly detect live forecasts
   */
  static validateWeatherData(weather: any): UnifiedWeatherValidation {
    console.log('🎯 FIXED VALIDATION: Enhanced weather classification:', {
      weatherExists: !!weather,
      source: weather?.source,
      isActualForecast: weather?.isActualForecast,
      temperature: weather?.temperature,
      highTemp: weather?.highTemp,
      lowTemp: weather?.lowTemp,
      cityName: weather?.cityName,
      fixedValidation: true
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

    // ENHANCED RULE 1: Check for explicit live forecast indicators
    const hasLiveIndicators = 
      weather.source === 'live_forecast' || 
      weather.isActualForecast === true ||
      (weather.forecast && Array.isArray(weather.forecast) && weather.forecast.length > 0);

    // ENHANCED RULE 2: Check for temperature data that suggests live forecast
    const hasDetailedTemperatureData = 
      (weather.temperature && weather.highTemp && weather.lowTemp) ||
      (weather.highTemp && weather.lowTemp && Math.abs(weather.highTemp - weather.lowTemp) > 5);

    // ENHANCED RULE 3: Check for detailed weather metrics
    const hasDetailedMetrics = 
      weather.humidity !== undefined || 
      weather.windSpeed !== undefined || 
      weather.precipitationChance !== undefined;

    // ENHANCED RULE 4: Date-based validation
    const dateMatchInfo = weather.dateMatchInfo?.source;
    const hasRecentDateMatch = dateMatchInfo === 'forecast' || dateMatchInfo === 'exact_match';

    console.log('🎯 FIXED VALIDATION: Enhanced validation checks:', {
      hasLiveIndicators,
      hasDetailedTemperatureData,
      hasDetailedMetrics,
      hasRecentDateMatch,
      sourceCheck: weather.source,
      isActualForecastCheck: weather.isActualForecast,
      cityName: weather?.cityName
    });

    // DECISION LOGIC: Determine if this is live forecast
    const isLiveForecast = 
      hasLiveIndicators || 
      (hasDetailedTemperatureData && hasDetailedMetrics) ||
      hasRecentDateMatch;

    if (isLiveForecast) {
      console.log('✅ FIXED VALIDATION: LIVE FORECAST detected:', {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        cityName: weather.cityName,
        reasons: {
          hasLiveIndicators,
          hasDetailedTemperatureData,
          hasDetailedMetrics,
          hasRecentDateMatch
        },
        result: 'LIVE_FORECAST'
      });

      return {
        isLiveForecast: true,
        source: 'live_forecast',
        confidence: 'high',
        displayLabel: 'Live Weather Forecast',
        badgeText: '🟢 Live Forecast',
        styleTheme: 'green',
        explanation: 'Real-time weather forecast from API'
      };
    }

    // If source is explicitly historical_fallback
    if (weather.source === 'historical_fallback') {
      console.log('📊 FIXED VALIDATION: HISTORICAL WEATHER confirmed:', {
        source: weather.source,
        cityName: weather.cityName,
        result: 'HISTORICAL_DATA'
      });

      return {
        isLiveForecast: false,
        source: 'historical_fallback',
        confidence: 'medium',
        displayLabel: 'Historical Weather Data',
        badgeText: '📊 Historical Data',
        styleTheme: 'amber',
        explanation: 'Weather estimate based on historical data'
      };
    }

    // Fallback for unclear cases
    console.log('⚠️ FIXED VALIDATION: UNCLEAR weather source - defaulting to historical:', {
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
      badgeText: '📊 Historical Data',
      styleTheme: 'amber',
      explanation: 'Weather data source unclear - treating as estimate'
    };
  }

  /**
   * CONVENIENCE METHOD: Quick check for live weather
   */
  static isLiveWeather(weather: any): boolean {
    const validation = this.validateWeatherData(weather);
    console.log('🎯 FIXED: isLiveWeather result:', {
      cityName: weather?.cityName,
      isLive: validation.isLiveForecast,
      validation
    });
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
