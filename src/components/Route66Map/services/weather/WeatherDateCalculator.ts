
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherDateCalculator {
  private static readonly FORECAST_THRESHOLD_DAYS = 5; // FIXED: Back to 5 days for reliable API forecasts

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
    
    // FIXED: Days 0-5 = forecast range (today through 5 days out), Day 6+ = historical
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 5;
    
    console.log('🔧 FIXED: WeatherDateCalculator.calculateDaysFromToday - CORRECTED FORECAST RANGE 0-5', {
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
        logic: 'Days 0-5 = LIVE FORECAST, Day 6+ = historical',
        correctedRange: true
      },
      decision: {
        useCase: isWithinForecastRange ? 'LIVE_FORECAST' : 'HISTORICAL_FALLBACK',
        reason: isWithinForecastRange ? 'within_5_day_range' : 'beyond_5_day_range',
        forecastRangeCorrected: true
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
