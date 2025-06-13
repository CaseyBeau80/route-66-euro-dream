
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
    const today = new Date();
    const normalizedToday = DateNormalizationService.normalizeSegmentDate(today);
    
    const daysFromToday = Math.floor((normalizedTargetDate.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000));
    const isWithinForecastRange = daysFromToday >= 0 && daysFromToday <= this.FORECAST_THRESHOLD_DAYS;
    
    console.log('🚨 FIXED: WeatherDateCalculator date processing', {
      originalDate: targetDate.toISOString(),
      normalizedDate: normalizedTargetDate.toISOString(),
      targetDateString,
      today: today.toISOString(),
      normalizedToday: normalizedToday.toISOString(),
      daysFromToday,
      isWithinForecastRange,
      forecastThreshold: this.FORECAST_THRESHOLD_DAYS
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
