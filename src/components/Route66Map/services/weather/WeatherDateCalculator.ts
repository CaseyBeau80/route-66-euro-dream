
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherDateCalculator {
  private static readonly FORECAST_THRESHOLD_DAYS = 7; // PLAN: STANDARDIZED to 7 days

  static calculateDaysFromToday(targetDate: Date): {
    normalizedTargetDate: Date;
    targetDateString: string;
    daysFromToday: number;
    isWithinForecastRange: boolean;
  } {
    // PLAN: Use LOCAL date normalization for consistency
    const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(targetDate);
    const targetDateString = DateNormalizationService.toDateString(normalizedTargetDate);
    
    // PLAN: Use LOCAL date normalization for today as well
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    
    // PLAN: Calculate days using standardized LOCAL date arithmetic
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedTargetDate);
    
    // PLAN: STANDARDIZED forecast range 0-7 days
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;
    
    console.log('🔧 PLAN: WeatherDateCalculator - STANDARDIZED LOCAL date calculation', {
      input: {
        originalTargetDate: targetDate.toISOString(),
        originalTargetLocal: targetDate.toLocaleDateString(),
        targetTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      normalization: {
        normalizedTargetDate: normalizedTargetDate.toISOString(),
        normalizedTargetLocal: normalizedTargetDate.toLocaleDateString(),
        normalizedToday: normalizedToday.toISOString(),
        normalizedTodayLocal: normalizedToday.toLocaleDateString(),
        targetDateString,
        normalizationMethod: 'LOCAL_MIDNIGHT_CONSISTENT'
      },
      calculation: {
        daysFromToday,
        isWithinForecastRange,
        forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
        logic: 'Days 0-7 = LIVE FORECAST attempt, Day 8+ = historical',
        standardizedRange: true,
        localDateArithmetic: true
      },
      decision: {
        useCase: isWithinForecastRange ? 'LIVE_FORECAST_ATTEMPT' : 'HISTORICAL_FALLBACK',
        reason: isWithinForecastRange ? 'within_standardized_0_to_7_range' : 'beyond_standardized_range',
        consistentWithPersistence: true
      }
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
