
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export interface WeatherTypeResult {
  isLiveForecast: boolean;
  isHistoricalData: boolean;
  displayLabel: string;
  badgeType: 'live' | 'historical';
  confidence: 'high' | 'medium' | 'low';
}

export class WeatherTypeDetector {
  private static readonly FORECAST_THRESHOLD_DAYS = 6;

  /**
   * Calculate days from today for date-based validation
   */
  private static calculateDaysFromToday(segmentDate?: Date): number {
    if (!segmentDate) return 999; // Force historical for invalid dates
    
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedSegment = new Date(segmentDate.getFullYear(), segmentDate.getMonth(), segmentDate.getDate());
    
    return Math.floor((normalizedSegment.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000));
  }

  /**
   * Centralized logic to determine weather data type with strict validation
   */
  static detectWeatherType(weather: ForecastWeatherData | null, segmentDate?: Date): WeatherTypeResult {
    if (!weather) {
      return {
        isLiveForecast: false,
        isHistoricalData: true,
        displayLabel: 'Weather Information',
        badgeType: 'historical',
        confidence: 'low'
      };
    }

    // ENHANCED: Calculate days from today for date-based validation
    const daysFromToday = this.calculateDaysFromToday(segmentDate);
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= this.FORECAST_THRESHOLD_DAYS;

    console.log('🔍 ENHANCED: WeatherTypeDetector analyzing weather data:', {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      dateMatchSource: weather.dateMatchInfo?.source,
      daysFromToday,
      isWithinForecastRange,
      segmentDate: segmentDate?.toISOString(),
      temperature: weather.temperature,
      hasValidData: !!(weather.temperature || weather.highTemp || weather.lowTemp)
    });

    // STRICT RULE 1: Date-based validation - Day 7+ is ALWAYS historical
    if (!isWithinForecastRange) {
      console.log('🚨 STRICT VALIDATION: Day 7+ detected - forcing historical classification:', {
        daysFromToday,
        threshold: this.FORECAST_THRESHOLD_DAYS,
        originalSource: weather.source,
        originalIsActualForecast: weather.isActualForecast
      });

      return {
        isLiveForecast: false,
        isHistoricalData: true,
        displayLabel: 'Historical Data',
        badgeType: 'historical',
        confidence: 'high'
      };
    }

    // STRICT RULE 2: Explicit historical/seasonal sources are NEVER live
    const isExplicitlyHistorical = (
      weather.source === 'historical_fallback' ||
      weather.source === 'seasonal' ||
      weather.dateMatchInfo?.source === 'historical_fallback' ||
      weather.dateMatchInfo?.source === 'seasonal-estimate'
    );

    if (isExplicitlyHistorical) {
      console.log('🚨 STRICT VALIDATION: Explicit historical source detected:', {
        source: weather.source,
        dateMatchSource: weather.dateMatchInfo?.source,
        daysFromToday
      });

      return {
        isLiveForecast: false,
        isHistoricalData: true,
        displayLabel: 'Historical Data',
        badgeType: 'historical',
        confidence: 'high'
      };
    }

    // STRICT RULE 3: Only mark as live forecast if ALL conditions are met
    const isStrictlyLiveForecast = (
      weather.isActualForecast === true &&
      weather.source === 'live_forecast' &&
      weather.dateMatchInfo?.source === 'live_forecast' &&
      isWithinForecastRange
    );

    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' = 'medium';
    if (isStrictlyLiveForecast && weather.dateMatchInfo?.confidence) {
      confidence = weather.dateMatchInfo.confidence;
    } else if (!isStrictlyLiveForecast) {
      confidence = weather.source === 'seasonal' ? 'low' : 'medium';
    }

    const result: WeatherTypeResult = {
      isLiveForecast: isStrictlyLiveForecast,
      isHistoricalData: !isStrictlyLiveForecast,
      displayLabel: isStrictlyLiveForecast ? 'Live Forecast' : 'Historical Data',
      badgeType: isStrictlyLiveForecast ? 'live' : 'historical',
      confidence
    };

    console.log('✅ ENHANCED WeatherTypeDetector result:', {
      ...result,
      weatherSource: weather.source,
      dateMatchSource: weather.dateMatchInfo?.source,
      temperature: weather.temperature,
      daysFromToday,
      strictValidation: {
        isStrictlyLiveForecast,
        isExplicitlyHistorical,
        isWithinForecastRange
      }
    });

    return result;
  }

  /**
   * Get section header text for weather components with date validation
   */
  static getSectionHeader(weather: ForecastWeatherData | null, segmentDate?: Date): string {
    const result = this.detectWeatherType(weather, segmentDate);
    return result.displayLabel;
  }

  /**
   * Get footer message for weather displays
   */
  static getFooterMessage(weather: ForecastWeatherData | null, segmentDate?: Date): string {
    const result = this.detectWeatherType(weather, segmentDate);
    return result.isLiveForecast 
      ? 'Real-time weather forecast from API'
      : 'Historical weather patterns - live forecast not available';
  }

  /**
   * Validate weather type consistency across components
   */
  static validateWeatherTypeConsistency(
    weather: ForecastWeatherData | null,
    componentName: string,
    segmentDate?: Date
  ): boolean {
    if (!weather) return true;

    const result = this.detectWeatherType(weather, segmentDate);
    const daysFromToday = this.calculateDaysFromToday(segmentDate);
    
    // Enhanced validation for Day 7+ scenarios
    if (daysFromToday > this.FORECAST_THRESHOLD_DAYS && result.isLiveForecast) {
      console.error(`❌ CRITICAL: Day 7+ weather incorrectly classified as live forecast in ${componentName}:`, {
        daysFromToday,
        threshold: this.FORECAST_THRESHOLD_DAYS,
        result,
        weatherSource: weather.source,
        isActualForecast: weather.isActualForecast,
        segmentDate: segmentDate?.toISOString()
      });
      return false;
    }
    
    // Log validation for debugging
    console.log(`🔧 WeatherTypeDetector validation for ${componentName}:`, {
      isLiveForecast: result.isLiveForecast,
      isHistoricalData: result.isHistoricalData,
      displayLabel: result.displayLabel,
      confidence: result.confidence,
      daysFromToday,
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
