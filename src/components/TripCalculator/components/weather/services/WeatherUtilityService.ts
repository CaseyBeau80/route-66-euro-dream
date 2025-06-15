
import { LiveWeatherDetectionService } from './LiveWeatherDetectionService';

export class WeatherUtilityService {
  /**
   * Calculate segment date from trip start date and day number
   */
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    return new Date(tripStartDate.getTime() + (segmentDay - 1) * 24 * 60 * 60 * 1000);
  }

  /**
   * Calculate days from today to target date
   */
  static getDaysFromToday(targetDate: Date): number {
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    return Math.ceil((normalizedTarget.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000));
  }

  /**
   * Check if date is within reliable live forecast range (0-5 days)
   */
  static isWithinLiveForecastRange(targetDate: Date): boolean {
    const daysFromToday = this.getDaysFromToday(targetDate);
    return daysFromToday >= 0 && daysFromToday <= 5;
  }

  /**
   * FIXED: Use the EXACT same logic as LiveWeatherDetectionService
   */
  static isLiveForecast(weather: any, targetDate?: Date): boolean {
    if (!weather) return false;
    
    console.log('🔧 FIXED: WeatherUtilityService using LiveWeatherDetectionService logic:', {
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      usingLiveDetectionService: true
    });
    
    // Use the exact same detection logic as LiveWeatherDetectionService
    return LiveWeatherDetectionService.isLiveWeatherForecast(weather);
  }

  /**
   * Get appropriate weather display styling based on forecast type
   * FIXED: Use unified detection logic
   */
  static getWeatherDisplayStyle(weather: any, targetDate?: Date) {
    const isLive = this.isLiveForecast(weather, targetDate);
    
    console.log('🎨 FIXED: WeatherUtilityService styling using unified detection:', {
      isLive,
      weatherSource: weather.source,
      isActualForecast: weather.isActualForecast,
      willShowGreen: isLive,
      willShowYellow: !isLive
    });
    
    if (isLive) {
      return {
        badgeText: '✨ Live weather forecast',
        badgeClass: 'bg-green-100 text-green-700 border-green-200',
        sourceLabel: '🟢 Live Forecast',
        containerClass: 'bg-green-100 border-green-200'
      };
    } else {
      return {
        badgeText: '📊 Historical weather patterns',
        badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        sourceLabel: '🟡 Historical Data',
        containerClass: 'bg-yellow-100 border-yellow-200'
      };
    }
  }
}
