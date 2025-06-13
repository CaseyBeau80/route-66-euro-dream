
import { DateNormalizationService } from '../../../TripCalculator/components/weather/DateNormalizationService';

export class WeatherDateCalculator {
  private static readonly FORECAST_THRESHOLD_DAYS = 5;

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
    
    // SIMPLE LOGIC: Today through Day 5 = forecast range (0, 1, 2, 3, 4, 5)
    // Day 6 and beyond = historical weather
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= 5;
    
    console.log('🔧 FIXED: WeatherDateCalculator SIMPLIFIED logic', {
      originalDate: targetDate.toISOString(),
      normalizedDate: normalizedTargetDate.toISOString(),
      targetDateString,
      today: today.toISOString(),
      normalizedToday: normalizedToday.toISOString(),
      daysFromToday,
      isWithinForecastRange,
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS,
      logic: `Days 0-5 = forecast, Day 6+ = historical`
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
