
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
   * FIXED: Enhanced validation using ONLY DATE-BASED validation as decision factor
   */
  static validateWeatherData(weather: any, segmentDate?: Date): UnifiedWeatherValidation {
    console.log('🎯 FIXED VALIDATION: UnifiedWeatherValidator with CONSISTENT DATE-BASED validation:', {
      weatherExists: !!weather,
      segmentDateProvided: !!segmentDate,
      source: weather?.source,
      isActualForecast: weather?.isActualForecast,
      fixImplementation: 'CONSISTENT_DATE_BASED_ONLY',
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

    // FIXED: REQUIRE segmentDate for consistent validation
    if (!segmentDate) {
      console.warn('⚠️ FIXED VALIDATION: No segmentDate provided - this should not happen in fixed implementation');
      return {
        isLiveForecast: false,
        source: 'unknown',
        confidence: 'low',
        displayLabel: 'Date Required for Weather Validation',
        badgeText: 'No date provided',
        styleTheme: 'gray',
        explanation: 'Segment date required for accurate weather validation',
        dateBasedDecision: false,
        daysFromToday: -999,
        forecastRangeCheck: false
      };
    }

    // FIXED: CONSISTENT DATE-BASED VALIDATION for all cases
    const daysFromToday = UnifiedDateService.getDaysFromToday(segmentDate);
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= this.FORECAST_THRESHOLD_DAYS;

    console.log('🎯 FIXED: CONSISTENT DATE-BASED VALIDATION:', {
      segmentDate: segmentDate.toLocaleDateString(),
      daysFromToday,
      isWithinForecastRange,
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
      decision: isWithinForecastRange ? 'LIVE_FORECAST' : 'HISTORICAL_FALLBACK',
      logic: `Days 0-${this.FORECAST_THRESHOLD_DAYS} = LIVE FORECAST, Day ${this.FORECAST_THRESHOLD_DAYS + 1}+ = HISTORICAL`,
      consistentValidation: true
    });

    // FIXED: Use ONLY date-based decision - no fallback to object characteristics
    if (isWithinForecastRange) {
      console.log('✅ FIXED: DATE-BASED LIVE FORECAST DECISION:', {
        segmentDate: segmentDate.toLocaleDateString(),
        daysFromToday,
        decision: 'LIVE_FORECAST_BY_DATE_RANGE_ONLY',
        weatherSource: weather.source,
        isActualForecast: weather.isActualForecast,
        primaryFactor: `DATE_WITHIN_0_TO_${this.FORECAST_THRESHOLD_DAYS}_DAYS`,
        noFallbackLogic: true
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
      console.log('📊 FIXED: DATE-BASED HISTORICAL DECISION:', {
        segmentDate: segmentDate.toLocaleDateString(),
        daysFromToday,
        decision: 'HISTORICAL_BY_DATE_RANGE_ONLY',
        weatherSource: weather.source,
        isActualForecast: weather.isActualForecast,
        primaryFactor: `DATE_BEYOND_${this.FORECAST_THRESHOLD_DAYS}_DAYS`,
        noFallbackLogic: true
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

  /**
   * FIXED: Enhanced convenience method with REQUIRED date support
   */
  static isLiveWeather(weather: any, segmentDate?: Date): boolean {
    const validation = this.validateWeatherData(weather, segmentDate);
    console.log('🎯 FIXED: isLiveWeather consistent result:', {
      cityName: weather?.cityName,
      segmentDate: segmentDate?.toLocaleDateString(),
      isLive: validation.isLiveForecast,
      dateBasedDecision: validation.dateBasedDecision,
      daysFromToday: validation.daysFromToday,
      consistentImplementation: true
    });
    return validation.isLiveForecast;
  }

  /**
   * FIXED: Enhanced display label with REQUIRED date context
   */
  static getDisplayLabel(weather: any, segmentDate?: Date): string {
    const validation = this.validateWeatherData(weather, segmentDate);
    return validation.displayLabel;
  }

  /**
   * FIXED: Enhanced style theme with REQUIRED date context
   */
  static getStyleTheme(weather: any, segmentDate?: Date): 'green' | 'amber' | 'gray' {
    const validation = this.validateWeatherData(weather, segmentDate);
    return validation.styleTheme;
  }

  /**
   * Get forecast threshold for consistency
   */
  static getForecastThresholdDays(): number {
    return this.FORECAST_THRESHOLD_DAYS;
  }

  /**
   * Check if date is within forecast range
   */
  static isDateWithinForecastRange(segmentDate: Date): boolean {
    const daysFromToday = UnifiedDateService.getDaysFromToday(segmentDate);
    const isWithinRange = daysFromToday >= 0 && daysFromToday <= this.FORECAST_THRESHOLD_DAYS;
    
    console.log('🎯 FIXED: Date-based forecast range check:', {
      segmentDate: segmentDate.toLocaleDateString(),
      daysFromToday,
      isWithinRange,
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
      logic: `Days 0-${this.FORECAST_THRESHOLD_DAYS} = LIVE FORECAST RANGE`,
      consistentImplementation: true
    });
    
    return isWithinRange;
  }
}
