
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
   * Determine if weather data represents a true live forecast
   */
  static isLiveForecast(weather: any, targetDate: Date): boolean {
    if (!weather || !targetDate) return false;
    
    const isWithinRange = this.isWithinLiveForecastRange(targetDate);
    const hasLiveSource = weather.source === 'live_forecast';
    const isMarkedAsActual = weather.isActualForecast === true;
    
    // All three conditions must be true for genuine live forecast
    return isWithinRange && hasLiveSource && isMarkedAsActual;
  }

  /**
   * Get appropriate weather display styling based on forecast type
   */
  static getWeatherDisplayStyle(weather: any, targetDate: Date) {
    const isLive = this.isLiveForecast(weather, targetDate);
    const daysFromToday = this.getDaysFromToday(targetDate);
    
    if (isLive) {
      return {
        badgeText: '✨ Live weather forecast',
        badgeClass: 'bg-green-100 text-green-700 border-green-200',
        sourceLabel: '🟢 Live Forecast',
        containerClass: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
      };
    } else {
      return {
        badgeText: `📊 Historical weather patterns`,
        badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
        sourceLabel: '🟡 Historical Data',
        containerClass: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
      };
    }
  }
}
