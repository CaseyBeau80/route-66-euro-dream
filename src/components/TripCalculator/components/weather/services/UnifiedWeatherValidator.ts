
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { UnifiedDateService } from '../../../services/UnifiedDateService';

export interface UnifiedWeatherValidation {
  isLiveForecast: boolean;
  source: 'live_forecast' | 'historical_fallback' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  displayLabel: string;
  badgeText: string;
  styleTheme: 'green' | 'amber' | 'gray';
  explanation: string;
  dateBasedDecision: boolean;
  daysFromToday: number;
  forecastRangeCheck: boolean;
}

export class UnifiedWeatherValidator {
  // CENTRALIZED: 7-day forecast threshold (consistent across all services)
  private static readonly FORECAST_THRESHOLD_DAYS = 7;

  /**
   * PLAN IMPLEMENTATION: Enhanced validation using DATE-BASED validation as PRIMARY decision factor
   */
  static validateWeatherData(weather: any, segmentDate?: Date): UnifiedWeatherValidation {
    console.log('🎯 PLAN IMPLEMENTATION: Enhanced UnifiedWeatherValidator with DATE-BASED primary validation:', {
      weatherExists: !!weather,
      segmentDateProvided: !!segmentDate,
      source: weather?.source,
      isActualForecast: weather?.isActualForecast,
      planImplementation: 'DATE_BASED_PRIMARY_VALIDATION',
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS
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
        explanation: 'No weather data provided',
        dateBasedDecision: false,
        daysFromToday: -999,
        forecastRangeCheck: false
      };
    }

    // PLAN IMPLEMENTATION: DATE-BASED VALIDATION as PRIMARY decision factor
    let daysFromToday = -999;
    let isWithinForecastRange = false;
    let dateBasedDecision = false;

    if (segmentDate) {
      daysFromToday = UnifiedDateService.getDaysFromToday(segmentDate);
      isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= this.FORECAST_THRESHOLD_DAYS;
      dateBasedDecision = true;

      console.log('🎯 PLAN: DATE-BASED PRIMARY VALIDATION:', {
        segmentDate: segmentDate.toLocaleDateString(),
        daysFromToday,
        isWithinForecastRange,
        forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
        primaryDecisionFactor: 'DATE_BASED',
        logic: `Days 0-${this.FORECAST_THRESHOLD_DAYS} = LIVE FORECAST, Day ${this.FORECAST_THRESHOLD_DAYS + 1}+ = HISTORICAL`
      });

      // PLAN IMPLEMENTATION: If date-based validation is available, use it as PRIMARY factor
      if (isWithinForecastRange) {
        console.log('✅ PLAN: DATE-BASED LIVE FORECAST DECISION:', {
          segmentDate: segmentDate.toLocaleDateString(),
          daysFromToday,
          decision: 'LIVE_FORECAST_BY_DATE_RANGE',
          weatherSource: weather.source,
          isActualForecast: weather.isActualForecast,
          primaryFactor: 'DATE_WITHIN_0_TO_7_DAYS'
        });

        return {
          isLiveForecast: true,
          source: 'live_forecast',
          confidence: 'high',
          displayLabel: 'Live Weather Forecast',
          badgeText: '🟢 Live Forecast',
          styleTheme: 'green',
          explanation: `Real-time weather forecast (${daysFromToday} days from today)`,
          dateBasedDecision: true,
          daysFromToday,
          forecastRangeCheck: true
        };
      } else {
        console.log('📊 PLAN: DATE-BASED HISTORICAL DECISION:', {
          segmentDate: segmentDate.toLocaleDateString(),
          daysFromToday,
          decision: 'HISTORICAL_BY_DATE_RANGE',
          weatherSource: weather.source,
          isActualForecast: weather.isActualForecast,
          primaryFactor: `DATE_BEYOND_${this.FORECAST_THRESHOLD_DAYS}_DAYS`
        });

        return {
          isLiveForecast: false,
          source: 'historical_fallback',
          confidence: 'medium',
          displayLabel: 'Historical Weather Data',
          badgeText: '📊 Historical Data',
          styleTheme: 'amber',
          explanation: `Weather estimate based on historical data (${daysFromToday} days from today)`,
          dateBasedDecision: true,
          daysFromToday,
          forecastRangeCheck: false
        };
      }
    }

    // PLAN IMPLEMENTATION: FALLBACK - Weather object-based validation (when no date available)
    console.log('⚠️ PLAN: Using FALLBACK weather object-based validation (no date provided):', {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      fallbackReason: 'NO_SEGMENT_DATE_PROVIDED',
      recommendation: 'PROVIDE_SEGMENT_DATE_FOR_ACCURATE_VALIDATION'
    });

    // Check for explicit live forecast indicators
    const hasLiveIndicators = 
      weather.source === 'live_forecast' || 
      weather.isActualForecast === true ||
      (weather.forecast && Array.isArray(weather.forecast) && weather.forecast.length > 0);

    // Check for detailed weather metrics
    const hasDetailedMetrics = 
      weather.humidity !== undefined || 
      weather.windSpeed !== undefined || 
      weather.precipitationChance !== undefined;

    const isLiveForecast = hasLiveIndicators || hasDetailedMetrics;

    if (isLiveForecast) {
      console.log('✅ PLAN: FALLBACK LIVE FORECAST detected (object-based):', {
        source: weather.source,
        isActualForecast: weather.isActualForecast,
        hasDetailedMetrics,
        fallbackDecision: 'LIVE_FORECAST_BY_OBJECT_CHARACTERISTICS',
        warning: 'DATE_BASED_VALIDATION_PREFERRED'
      });

      return {
        isLiveForecast: true,
        source: 'live_forecast',
        confidence: 'medium',
        displayLabel: 'Live Weather Forecast',
        badgeText: '🟢 Live Forecast',
        styleTheme: 'green',
        explanation: 'Real-time weather forecast from API (fallback validation)',
        dateBasedDecision: false,
        daysFromToday: -999,
        forecastRangeCheck: false
      };
    }

    // Final fallback
    console.log('📊 PLAN: FALLBACK HISTORICAL decision (object-based):', {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      fallbackDecision: 'HISTORICAL_BY_OBJECT_CHARACTERISTICS',
      warning: 'DATE_BASED_VALIDATION_PREFERRED'
    });

    return {
      isLiveForecast: false,
      source: 'historical_fallback',
      confidence: 'low',
      displayLabel: 'Historical Weather Data',
      badgeText: '📊 Historical Data',
      styleTheme: 'amber',
      explanation: 'Weather estimate based on historical data (fallback validation)',
      dateBasedDecision: false,
      daysFromToday: -999,
      forecastRangeCheck: false
    };
  }

  /**
   * PLAN IMPLEMENTATION: Enhanced convenience method with date support
   */
  static isLiveWeather(weather: any, segmentDate?: Date): boolean {
    const validation = this.validateWeatherData(weather, segmentDate);
    console.log('🎯 PLAN: isLiveWeather enhanced result:', {
      cityName: weather?.cityName,
      segmentDate: segmentDate?.toLocaleDateString(),
      isLive: validation.isLiveForecast,
      dateBasedDecision: validation.dateBasedDecision,
      daysFromToday: validation.daysFromToday,
      planImplementation: true
    });
    return validation.isLiveForecast;
  }

  /**
   * PLAN IMPLEMENTATION: Enhanced display label with date context
   */
  static getDisplayLabel(weather: any, segmentDate?: Date): string {
    const validation = this.validateWeatherData(weather, segmentDate);
    return validation.displayLabel;
  }

  /**
   * PLAN IMPLEMENTATION: Enhanced style theme with date context
   */
  static getStyleTheme(weather: any, segmentDate?: Date): 'green' | 'amber' | 'gray' {
    const validation = this.validateWeatherData(weather, segmentDate);
    return validation.styleTheme;
  }

  /**
   * PLAN IMPLEMENTATION: Get forecast threshold for consistency
   */
  static getForecastThresholdDays(): number {
    return this.FORECAST_THRESHOLD_DAYS;
  }

  /**
   * PLAN IMPLEMENTATION: Check if date is within forecast range
   */
  static isDateWithinForecastRange(segmentDate: Date): boolean {
    const daysFromToday = UnifiedDateService.getDaysFromToday(segmentDate);
    const isWithinRange = daysFromToday >= 0 && daysFromToday <= this.FORECAST_THRESHOLD_DAYS;
    
    console.log('🎯 PLAN: Date-based forecast range check:', {
      segmentDate: segmentDate.toLocaleDateString(),
      daysFromToday,
      isWithinRange,
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
      logic: `Days 0-${this.FORECAST_THRESHOLD_DAYS} = LIVE FORECAST RANGE`
    });
    
    return isWithinRange;
  }
}
