
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherDateCalculator {
  private static readonly FORECAST_THRESHOLD_DAYS = 6;

  static calculateDaysFromToday(targetDate: Date): {
    normalizedTargetDate: Date;
    targetDateString: string;
    daysFromToday: number;
    isWithinForecastRange: boolean;
  } {
    // PLAN IMPLEMENTATION: Normalize the target date to UTC midnight
    const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(targetDate);
    const targetDateString = DateNormalizationService.toDateString(normalizedTargetDate);
    
    // PLAN IMPLEMENTATION: Normalize today's date to UTC midnight for consistent comparison
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    
    // PLAN IMPLEMENTATION: Calculate days from today using normalized dates
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedTargetDate);
    
    // PLAN IMPLEMENTATION: Fixed logic - Days 0-6 = forecast range (today through 6 days out)
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 6;
    
    // PLAN IMPLEMENTATION: Enhanced debug output
    console.log('🔧 PLAN: WeatherDateCalculator.calculateDaysFromToday - NORMALIZED DATE LOGIC', {
      input: {
        originalTargetDate: targetDate.toISOString(),
        targetTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      normalization: {
        normalizedTargetDate: normalizedTargetDate.toISOString(),
        normalizedToday: normalizedToday.toISOString(),
        targetDateString
      },
      calculation: {
        daysFromToday,
        isWithinForecastRange,
        forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
        logic: 'Days 0-6 = forecast, Day 7+ = historical'
      },
      decision: {
        useCase: isWithinForecastRange ? 'LIVE_FORECAST' : 'HISTORICAL_FALLBACK',
        reason: isWithinForecastRange ? 'within_7_day_range' : 'beyond_7_day_range'
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
