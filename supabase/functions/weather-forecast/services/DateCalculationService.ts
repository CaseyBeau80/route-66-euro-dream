export class DateCalculationService {
  /**
   * FIXED: Enhanced days calculation that treats today as day 0 (live forecast)
   */
  static calculateDaysFromToday(targetDate: Date): number {
    // FIXED: Normalize both dates to local midnight for accurate comparison
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetNormalized = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const timeDifference = targetNormalized.getTime() - todayNormalized.getTime();
    const daysFromToday = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    
    console.log('📅 FIXED: Enhanced DateCalculationService.calculateDaysFromToday:', {
      targetDate: targetDate.toISOString(),
      targetDateLocal: targetDate.toLocaleDateString(),
      todayNormalized: todayNormalized.toISOString(),
      todayNormalizedLocal: todayNormalized.toLocaleDateString(),
      targetNormalized: targetNormalized.toISOString(),
      targetNormalizedLocal: targetNormalized.toLocaleDateString(),
      daysFromToday,
      interpretation: daysFromToday === 0 ? 'TODAY - LIVE FORECAST' : daysFromToday > 0 ? 'FUTURE - LIVE FORECAST' : 'PAST - HISTORICAL',
      enhancedForToday: true
    });
    
    return daysFromToday;
  }

  /**
   * FIXED: Enhanced forecast range check - day 0 (today) through day 7 are live
   */
  static isWithinForecastRange(daysFromToday: number): boolean {
    const isWithinRange = daysFromToday >= 0 && daysFromToday <= 7;
    
    console.log('📅 FIXED: Enhanced DateCalculationService.isWithinForecastRange:', {
      daysFromToday,
      isWithinRange,
      logic: 'Day 0 (TODAY) through Day 7 = LIVE FORECAST',
      todayIncluded: daysFromToday === 0 ? 'YES - TODAY IS LIVE FORECAST' : 'N/A'
    });
    
    return isWithinRange;
  }

  /**
   * CRITICAL FIX: Normalize date to local midnight
   */
  static normalizeDate(date: Date): Date {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    console.log('📅 CRITICAL FIX: DateCalculationService.normalizeDate:', {
      input: date.toISOString(),
      inputLocal: date.toLocaleDateString(),
      normalized: normalized.toISOString(),
      normalizedLocal: normalized.toLocaleDateString(),
      method: 'LOCAL_DATE_CONSTRUCTOR'
    });
    
    return normalized;
  }

  /**
   * CRITICAL FIX: Get target date string using local date components
   */
  static getTargetDateString(date: Date): string {
    const normalized = this.normalizeDate(date);
    const year = normalized.getFullYear();
    const month = String(normalized.getMonth() + 1).padStart(2, '0');
    const day = String(normalized.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    console.log('📅 CRITICAL FIX: DateCalculationService.getTargetDateString:', {
      input: date.toISOString(),
      inputLocal: date.toLocaleDateString(),
      normalized: normalized.toISOString(),
      normalizedLocal: normalized.toLocaleDateString(),
      dateString,
      components: { year, month, day }
    });
    
    return dateString;
  }
}
