
export class DateCalculationService {
  static calculateDaysFromToday(targetDate: Date): number {
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const normalizedTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const timeDifference = normalizedTarget.getTime() - normalizedToday.getTime();
    return Math.round(timeDifference / (24 * 60 * 60 * 1000));
  }

  static isWithinForecastRange(daysFromToday: number): boolean {
    return daysFromToday >= 0 && daysFromToday <= 4;
  }

  static normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  static getTargetDateString(date: Date): string {
    return this.normalizeDate(date).toISOString().split('T')[0];
  }
}
