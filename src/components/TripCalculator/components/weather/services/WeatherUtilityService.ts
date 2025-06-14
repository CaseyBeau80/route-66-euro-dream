
export class WeatherUtilityService {
  static getSegmentDate(tripStartDate: Date, segmentDay: number): Date | null {
    try {
      if (!tripStartDate || !(tripStartDate instanceof Date) || isNaN(tripStartDate.getTime())) {
        console.error('Invalid trip start date provided');
        return null;
      }

      // Calculate segment date: tripStartDate + (segmentDay - 1) days
      const segmentDate = new Date(tripStartDate.getTime() + (segmentDay - 1) * 24 * 60 * 60 * 1000);
      
      console.log('📅 WeatherUtilityService: Date calculation:', {
        tripStartDate: tripStartDate.toISOString(),
        segmentDay,
        calculatedDate: segmentDate.toISOString()
      });

      return segmentDate;
    } catch (error) {
      console.error('Error calculating segment date:', error);
      return null;
    }
  }

  static getDaysFromToday(targetDate: Date): number {
    const today = new Date();
    return Math.ceil((targetDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  }

  static isWithinLiveForecastRange(targetDate: Date): boolean {
    const daysFromToday = this.getDaysFromToday(targetDate);
    return daysFromToday >= 0 && daysFromToday <= 7;
  }

  static isLiveForecast(weather: any, targetDate: Date): boolean {
    return weather.source === 'live_forecast' && weather.isActualForecast === true;
  }
}
