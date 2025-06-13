
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherDateCalculator {
  private static readonly FORECAST_THRESHOLD_DAYS = 7; // PLAN: ENHANCED to 7 days consistent

  static calculateDaysFromToday(targetDate: Date): {
    normalizedTargetDate: Date;
    targetDateString: string;
    daysFromToday: number;
    isWithinForecastRange: boolean;
  } {
    // PLAN IMPLEMENTATION: Enhanced LOCAL date normalization for consistency
    const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(targetDate);
    const targetDateString = DateNormalizationService.toDateString(normalizedTargetDate);
    
    // PLAN IMPLEMENTATION: Enhanced LOCAL date normalization for today as well
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    
    // PLAN IMPLEMENTATION: Enhanced days calculation using standardized LOCAL date arithmetic
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedTargetDate);
    
    // PLAN IMPLEMENTATION: ENHANCED forecast range 0-7 days (consistent with other services)
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;
    
    console.log('🔧 PLAN: WeatherDateCalculator - ENHANCED LOCAL date calculation', {
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
        normalizationMethod: 'ENHANCED_LOCAL_MIDNIGHT_CONSISTENT'
      },
      calculation: {
        daysFromToday,
        isWithinForecastRange,
        forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
        logic: 'Days 0-7 = ENHANCED LIVE FORECAST attempt, Day 8+ = historical',
        enhancedRange: true,
        localDateArithmetic: true,
        day2Check: daysFromToday === 1 ? 'THIS_IS_DAY_2' : 'other_day'
      },
      decision: {
        useCase: isWithinForecastRange ? 'ENHANCED_LIVE_FORECAST_ATTEMPT' : 'HISTORICAL_FALLBACK',
        reason: isWithinForecastRange ? 'within_enhanced_0_to_7_range' : 'beyond_enhanced_range',
        consistentWithPersistence: true,
        day2Decision: daysFromToday === 1 ? 'DAY_2_SHOULD_GET_LIVE_FORECAST' : 'other_day_processing'
      },
      planImplementation: true
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
