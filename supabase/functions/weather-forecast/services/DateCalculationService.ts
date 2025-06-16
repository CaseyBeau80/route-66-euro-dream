
export class DateCalculationService {
  static calculateDaysFromToday(targetDate: Date): number {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const timeDifference = targetStart.getTime() - todayStart.getTime();
    const daysFromToday = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    
    console.log('📅 FIXED: DateCalculationService.calculateDaysFromToday:', {
      targetDate: targetDate.toISOString(),
      todayStart: todayStart.toISOString(), 
      targetStart: targetStart.toISOString(),
      daysFromToday,
      calculation: 'SIMPLIFIED_MIDNIGHT_COMPARISON'
    });
    
    return daysFromToday;
  }

  static isWithinForecastRange(daysFromToday: number): boolean {
    const isWithinRange = daysFromToday >= 0 && daysFromToday <= 4;
    
    console.log('📅 FIXED: DateCalculationService.isWithinForecastRange:', {
      daysFromToday,
      isWithinRange,
      logic: 'Days 0-4 = live forecast, Day 5+ = historical'
    });
    
    return isWithinRange;
  }

  static normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  static getTargetDateString(date: Date): string {
    const normalized = this.normalizeDate(date);
    return normalized.toISOString().split('T')[0];
  }
}
