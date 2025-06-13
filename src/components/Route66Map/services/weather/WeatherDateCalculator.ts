
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherDateCalculator {
  private static readonly FORECAST_THRESHOLD_DAYS = 6;

  static calculateDaysFromToday(targetDate: Date): {
    normalizedTargetDate: Date;
    targetDateString: string;
    daysFromToday: number;
    isWithinForecastRange: boolean;
  } {
    const normalizedTargetDate = DateNormalizationService.normalizeSegmentDate(targetDate);
    const targetDateString = DateNormalizationService.toDateString(normalizedTargetDate);
    
    // Get today's date and normalize it
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    
    // Calculate days from today (can be negative for past dates)
    const daysFromToday = Math.floor((normalizedTargetDate.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000));
    
    // FIXED LOGIC: Today through Day 6 = forecast range (0, 1, 2, 3, 4, 5, 6)
    // Day 7 and beyond = historical weather
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 6;
    
    console.log('🔧 FIXED: WeatherDateCalculator CORRECTED off-by-one logic', {
      originalDate: targetDate.toISOString(),
      normalizedDate: normalizedTargetDate.toISOString(),
      targetDateString,
      today: today.toISOString(),
      normalizedToday: normalizedToday.toISOString(),
      daysFromToday,
      isWithinForecastRange,
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
      logic: `Days 0-6 = forecast, Day 7+ = historical`
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
