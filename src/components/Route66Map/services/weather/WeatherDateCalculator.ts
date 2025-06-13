
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherDateCalculator {
  private static readonly FORECAST_THRESHOLD_DAYS = 7; // PLAN: Expanded to 7 days for consistent forecast range

  static calculateDaysFromToday(targetDate: Date): {
    normalizedTargetDate: Date;
    targetDateString: string;
    daysFromToday: number;
    isWithinForecastRange: boolean;
  } {
    // Normalize the target date to local midnight
    const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(targetDate);
    const targetDateString = DateNormalizationService.toDateString(normalizedTargetDate);
    
    // Normalize today's date to local midnight for consistent comparison
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    
    // Calculate days from today using normalized local dates
    const daysFromToday = DateNormalizationService.getDaysDifference(normalizedToday, normalizedTargetDate);
    
    // PLAN: Days 0-7 = forecast range (today through 7 days out), Day 8+ = historical
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 7;
    
    console.log('🔧 PLAN: WeatherDateCalculator.calculateDaysFromToday - STANDARDIZED FORECAST RANGE 0-7', {
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
        normalizationMethod: 'LOCAL_MIDNIGHT'
      },
      calculation: {
        daysFromToday,
        isWithinForecastRange,
        forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
        logic: 'Days 0-7 = LIVE FORECAST, Day 8+ = historical',
        standardizedRange: true
      },
      decision: {
        useCase: isWithinForecastRange ? 'LIVE_FORECAST' : 'HISTORICAL_FALLBACK',
        reason: isWithinForecastRange ? 'within_7_day_range' : 'beyond_7_day_range',
        forecastRangeStandardized: true
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
