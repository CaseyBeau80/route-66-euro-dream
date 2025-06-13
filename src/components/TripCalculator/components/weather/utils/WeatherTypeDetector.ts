
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface WeatherTypeResult {
  isLiveForecast: boolean;
  isHistoricalData: boolean;
  displayLabel: string;
  badgeType: 'live' | 'historical';
}

export class WeatherTypeDetector {
  /**
   * Centralized logic to determine weather data type
   * This ensures consistent behavior across all weather components
   */
  static detectWeatherType(weather: ForecastWeatherData | null): WeatherTypeResult {
    if (!weather) {
      return {
        isLiveForecast: false,
        isHistoricalData: true,
        displayLabel: 'Weather Information',
        badgeType: 'historical'
      };
    }

    console.log('🔍 WeatherTypeDetector analyzing weather data:', {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      dateMatchSource: weather.dateMatchInfo?.source
    });

    // FIXED LOGIC: Properly detect historical data
    const isHistoricalData = (
      weather.isActualForecast === false ||
      weather.source === 'historical_fallback' ||
      weather.source === 'seasonal' ||
      weather.dateMatchInfo?.source === 'historical_fallback' ||
      weather.dateMatchInfo?.source === 'seasonal-estimate'
    );

    // Only show live forecast if explicitly marked as actual forecast AND not from fallback sources
    const isLiveForecast = (
      weather.isActualForecast === true &&
      weather.source === 'live_forecast' &&
      weather.dateMatchInfo?.source !== 'historical_fallback' &&
      weather.dateMatchInfo?.source !== 'seasonal-estimate'
    );

    const result: WeatherTypeResult = {
      isLiveForecast,
      isHistoricalData,
      displayLabel: isLiveForecast ? 'Live Forecast' : 'Historical Data',
      badgeType: isLiveForecast ? 'live' : 'historical'
    };

    console.log('✅ WeatherTypeDetector result:', result);
    return result;
  }

  /**
   * Get section header text for weather components
   */
  static getSectionHeader(weather: ForecastWeatherData | null): string {
    const result = this.detectWeatherType(weather);
    return result.displayLabel;
  }

  /**
   * Get footer message for weather displays
   */
  static getFooterMessage(weather: ForecastWeatherData | null): string {
    const result = this.detectWeatherType(weather);
    return result.isLiveForecast 
      ? 'Real-time weather forecast from API'
      : 'Historical weather patterns - live forecast not available';
  }
}
