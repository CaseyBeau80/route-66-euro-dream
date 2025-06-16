
import { UnifiedDateService } from '../../../TripCalculator/services/UnifiedDateService';
import { UnifiedWeatherValidator } from '../../../TripCalculator/components/weather/services/UnifiedWeatherValidator';

export class WeatherDateCalculator {
  // PLAN IMPLEMENTATION: Use centralized forecast threshold from UnifiedWeatherValidator
  private static get FORECAST_THRESHOLD_DAYS(): number {
    return UnifiedWeatherValidator.getForecastThresholdDays();
  }

  static calculateDaysFromToday(targetDate: Date): {
    normalizedTargetDate: Date;
    targetDateString: string;
    daysFromToday: number;
    isWithinForecastRange: boolean;
  } {
    // PLAN IMPLEMENTATION: Enhanced LOCAL date normalization for consistency
    const normalizedTargetDate = UnifiedDateService.normalizeToLocalMidnight(targetDate);
    const targetDateString = UnifiedDateService.formatForApi(normalizedTargetDate);
    
    // PLAN IMPLEMENTATION: Enhanced LOCAL date normalization for today as well
    const today = UnifiedDateService.getToday();
    
    // PLAN IMPLEMENTATION: Enhanced days calculation using standardized LOCAL date arithmetic
    const daysFromToday = UnifiedDateService.getDaysFromToday(normalizedTargetDate);
    
    // PLAN IMPLEMENTATION: Use centralized forecast range check
    const isWithinForecastRange = UnifiedWeatherValidator.isDateWithinForecastRange(normalizedTargetDate);
    
    console.log('🔧 PLAN: WeatherDateCalculator - CENTRALIZED forecast threshold', {
      input: {
        originalTargetDate: targetDate.toISOString(),
        originalTargetLocal: targetDate.toLocaleDateString(),
        targetTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      normalization: {
        normalizedTargetDate: normalizedTargetDate.toISOString(),
        normalizedTargetLocal: normalizedTargetDate.toLocaleDateString(),
        normalizedToday: today.toISOString(),
        normalizedTodayLocal: today.toLocaleDateString(),
        targetDateString,
        normalizationMethod: 'ENHANCED_LOCAL_MIDNIGHT_CONSISTENT'
      },
      calculation: {
        daysFromToday,
        isWithinForecastRange,
        forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
        logic: `Days 0-${this.FORECAST_THRESHOLD_DAYS} = LIVE FORECAST attempt, Day ${this.FORECAST_THRESHOLD_DAYS + 1}+ = historical`,
        centralizedThreshold: true,
        localDateArithmetic: true
      },
      decision: {
        useCase: isWithinForecastRange ? 'LIVE_FORECAST_ATTEMPT' : 'HISTORICAL_FALLBACK',
        reason: isWithinForecastRange ? `within_0_to_${this.FORECAST_THRESHOLD_DAYS}_range` : 'beyond_range',
        consistentWithValidator: true
      },
      planImplementation: 'CENTRALIZED_FORECAST_THRESHOLD'
    });

    return {
      normalizedTargetDate,
      targetDateString,
      daysFromToday,
      isWithinForecastRange
    };
  }

  static get forecastThresholdDays(): number {
    return this.FORECAST_THRESHOLD_DAYS;
  }
}
