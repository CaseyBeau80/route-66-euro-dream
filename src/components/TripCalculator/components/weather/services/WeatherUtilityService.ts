
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

export class WeatherUtilityService {
  /**
   * CRITICAL: Enhanced live forecast detection with explicit logging
   */
  static isLiveForecast(weather: ForecastWeatherData, segmentDate?: Date | null): boolean {
    if (!weather || !segmentDate) {
      console.log('🎯 CRITICAL: isLiveForecast - missing data:', {
        hasWeather: !!weather,
        hasSegmentDate: !!segmentDate
      });
      return false;
    }

    const daysFromToday = this.getDaysFromToday(segmentDate);
    const isWithinRange = this.isWithinLiveForecastRange(segmentDate);
    
    // CRITICAL: Explicit checks for live forecast properties
    const hasLiveSource = weather.source === 'live_forecast';
    const isActualForecast = weather.isActualForecast === true;
    const withinRange = isWithinRange;
    
    const isVerifiedLive = hasLiveSource && isActualForecast && withinRange;
    
    console.log('🎯 STANDARDIZED: Live forecast validation:', {
      cityName: weather.cityName,
      segmentDate: segmentDate.toISOString(),
      daysFromToday,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      isVerifiedLive,
      standardizedCriteria: {
        hasLiveSource,
        isActualForecast,
        withinRange
      },
      validationMethod: 'standardized'
    });
    
    return isVerifiedLive;
  }

  /**
   * Get days from today for a given date
   */
  static getDaysFromToday(date: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    return Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  }

  /**
   * Check if date is within live forecast range (0-7 days)
   */
  static isWithinLiveForecastRange(date: Date): boolean {
    const daysFromToday = this.getDaysFromToday(date);
    return daysFromToday >= 0 && daysFromToday <= 7;
  }

  /**
   * Get weather source label for display
   */
  static getWeatherSourceLabel(weather: ForecastWeatherData, segmentDate?: Date | null): string {
    const isLive = this.isLiveForecast(weather, segmentDate);
    
    if (isLive) {
      return 'Live Weather Forecast';
    }
    
    return 'Historical Weather Data';
  }

  /**
   * Calculate segment date from trip start date and day number
   */
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    const segmentDate = new Date(tripStartDate);
    segmentDate.setDate(tripStartDate.getDate() + (segmentDay - 1));
    return segmentDate;
  }
}
