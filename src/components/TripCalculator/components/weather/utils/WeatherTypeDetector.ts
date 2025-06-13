
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface WeatherTypeResult {
  isLiveForecast: boolean;
  isHistoricalData: boolean;
  displayLabel: string;
  badgeType: 'live' | 'historical';
  confidence: 'high' | 'medium' | 'low';
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
        badgeType: 'historical',
        confidence: 'low'
      };
    }

    console.log('🔍 WeatherTypeDetector analyzing weather data:', {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      dateMatchSource: weather.dateMatchInfo?.source,
      temperature: weather.temperature,
      hasValidData: !!(weather.temperature || weather.highTemp || weather.lowTemp)
    });

    // ENHANCED LOGIC: More robust detection with confidence levels
    const isHistoricalData = (
      weather.isActualForecast === false ||
      weather.source === 'historical_fallback' ||
      weather.dateMatchInfo?.source === 'historical_fallback' ||
      weather.dateMatchInfo?.source === 'seasonal-estimate' ||
      weather.dateMatchInfo?.source === 'fallback_historical_due_to_location_error'
    );

    // Only show live forecast if explicitly marked as actual forecast AND not from fallback sources
    const isLiveForecast = (
      weather.isActualForecast === true &&
      weather.source === 'live_forecast' &&
      weather.dateMatchInfo?.source !== 'historical_fallback' &&
      weather.dateMatchInfo?.source !== 'seasonal-estimate' &&
      weather.dateMatchInfo?.source !== 'fallback_historical_due_to_location_error'
    );

    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    if (isLiveForecast && weather.dateMatchInfo?.confidence) {
      confidence = weather.dateMatchInfo.confidence;
    } else if (isHistoricalData) {
      confidence = 'low'; // Historical data is always low confidence
    }

    const result: WeatherTypeResult = {
      isLiveForecast,
      isHistoricalData,
      displayLabel: isLiveForecast ? 'Live Forecast' : 'Historical Data',
      badgeType: isLiveForecast ? 'live' : 'historical',
      confidence
    };

    console.log('✅ WeatherTypeDetector result:', {
      ...result,
      weatherSource: weather.source,
      dateMatchSource: weather.dateMatchInfo?.source,
      temperature: weather.temperature
    });

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

  /**
   * Validate weather type consistency across components
   */
  static validateWeatherTypeConsistency(
    weather: ForecastWeatherData | null,
    componentName: string
  ): boolean {
    if (!weather) return true;

    const result = this.detectWeatherType(weather);
    
    // Log validation for debugging
    console.log(`🔧 WeatherTypeDetector validation for ${componentName}:`, {
      isLiveForecast: result.isLiveForecast,
      isHistoricalData: result.isHistoricalData,
      displayLabel: result.displayLabel,
      confidence: result.confidence,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast
    });

    // Basic consistency check: can't be both live and historical
    const isConsistent = !(result.isLiveForecast && result.isHistoricalData);
    
    if (!isConsistent) {
      console.error(`❌ Weather type inconsistency detected in ${componentName}:`, result);
    }
    
    return isConsistent;
  }
}
