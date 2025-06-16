/**
 * UNIFIED DATE SERVICE - The single source of truth for all date operations
 * This replaces all other date handling to ensure absolute consistency
 */
export class UnifiedDateService {
  /**
   * Create a clean local date (no timezone issues)
   */
  static createLocalDate(year: number, month: number, day: number): Date {
    return new Date(year, month, day);
  }

  /**
   * Normalize any date to local midnight (removes time component)
   */
  static normalizeToLocalMidnight(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Get today as a clean local date
   */
  static getToday(): Date {
    const now = new Date();
    return this.normalizeToLocalMidnight(now);
  }

  /**
   * Calculate segment date - Day 1 = EXACT same date as trip start
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    const normalizedStart = this.normalizeToLocalMidnight(tripStartDate);
    
    if (segmentDay === 1) {
      // Day 1 is EXACTLY the trip start date
      return normalizedStart;
    }
    
    // Other days: add (segmentDay - 1) days
    const daysToAdd = segmentDay - 1;
    return new Date(
      normalizedStart.getFullYear(),
      normalizedStart.getMonth(),
      normalizedStart.getDate() + daysToAdd
    );
  }

  /**
   * Check if a date is today (same calendar date)
   */
  static isToday(date: Date): boolean {
    const today = this.getToday();
    const checkDate = this.normalizeToLocalMidnight(date);
    return checkDate.getTime() === today.getTime();
  }

  /**
   * Check if a date is in the past (before today)
   */
  static isPastDate(date: Date): boolean {
    const today = this.getToday();
    const checkDate = this.normalizeToLocalMidnight(date);
    return checkDate.getTime() < today.getTime();
  }

  /**
   * Calculate days from today (0 = today, positive = future, negative = past)
   */
  static getDaysFromToday(date: Date): number {
    const today = this.getToday();
    const targetDate = this.normalizeToLocalMidnight(date);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.floor(diffTime / (24 * 60 * 60 * 1000));
  }

  /**
   * Format date for API calls (YYYY-MM-DD)
   */
  static formatForApi(date: Date): string {
    const normalized = this.normalizeToLocalMidnight(date);
    const year = normalized.getFullYear();
    const month = String(normalized.getMonth() + 1).padStart(2, '0');
    const day = String(normalized.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Check if date is within live forecast range (today through day 7)
   */
  static isWithinLiveForecastRange(date: Date): boolean {
    const daysFromToday = this.getDaysFromToday(date);
    return daysFromToday >= 0 && daysFromToday <= 7;
  }

  /**
   * Compare two dates (returns true if same calendar date)
   */
  static isSameDate(date1: Date, date2: Date): boolean {
    const norm1 = this.normalizeToLocalMidnight(date1);
    const norm2 = this.normalizeToLocalMidnight(date2);
    return norm1.getTime() === norm2.getTime();
  }
}
