
/**
 * UNIFIED DATE SERVICE - Single source of truth for all date operations
 * This eliminates all timezone-related date shifts and ensures Day 1 = EXACT same calendar date as trip start
 */
export class UnifiedDateService {
  /**
   * Create a clean local date using only year, month, day components
   */
  static createLocalDate(year: number, month: number, day: number): Date {
    // Use local date constructor to avoid timezone issues
    return new Date(year, month, day);
  }

  /**
   * UNIFIED: Normalize date using local date components only (no timezone shifts)
   */
  static normalizeToLocalMidnight(date: Date): Date {
    // Extract local date components and create new date
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Create new date using local components (avoids timezone shifts)
    const normalized = new Date(year, month, day);
    
    console.log('🔧 UNIFIED: normalizeToLocalMidnight - CONSISTENT NORMALIZATION:', {
      input: {
        iso: date.toISOString(),
        local: date.toLocaleDateString(),
        components: { year, month, day }
      },
      output: {
        iso: normalized.toISOString(),
        local: normalized.toLocaleDateString(),
        components: { 
          year: normalized.getFullYear(), 
          month: normalized.getMonth(), 
          day: normalized.getDate() 
        }
      },
      verification: {
        sameLocalDate: date.toLocaleDateString() === normalized.toLocaleDateString(),
        noTimezoneShift: true,
        service: 'UnifiedDateService'
      }
    });
    
    return normalized;
  }

  /**
   * Get today as a clean local date
   */
  static getToday(): Date {
    const now = new Date();
    return this.normalizeToLocalMidnight(now);
  }

  /**
   * UNIFIED: Calculate segment date - Day 1 = EXACT same LOCAL date as trip start
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🔧 UNIFIED: calculateSegmentDate - CONSISTENT DATE CALCULATION:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        tripStartDateLocal: tripStartDate.toLocaleDateString(),
        segmentDay
      },
      rule: 'Day 1 = EXACT SAME LOCAL DATE as trip start (ZERO OFFSET)',
      service: 'UnifiedDateService - SINGLE SOURCE OF TRUTH'
    });

    // UNIFIED: Extract local components from trip start date
    const startYear = tripStartDate.getFullYear();
    const startMonth = tripStartDate.getMonth();
    const startDay = tripStartDate.getDate();
    
    if (segmentDay === 1) {
      // Day 1: Use EXACT same local date components
      const day1Date = new Date(startYear, startMonth, startDay);
      
      console.log('🔧 UNIFIED: Day 1 calculation - EXACT MATCH GUARANTEED:', {
        tripStart: {
          local: tripStartDate.toLocaleDateString(),
          components: { startYear, startMonth, startDay }
        },
        day1Result: {
          local: day1Date.toLocaleDateString(),
          components: { 
            year: day1Date.getFullYear(), 
            month: day1Date.getMonth(), 
            day: day1Date.getDate() 
          }
        },
        verification: {
          exactMatch: tripStartDate.toLocaleDateString() === day1Date.toLocaleDateString(),
          rule: 'DAY_1_EQUALS_TRIP_START_EXACT',
          service: 'UnifiedDateService'
        }
      });
      
      return day1Date;
    }
    
    // Other days: Add (segmentDay - 1) days to trip start
    const daysToAdd = segmentDay - 1;
    const segmentDate = new Date(startYear, startMonth, startDay + daysToAdd);
    
    console.log('🔧 UNIFIED: Other day calculation:', {
      segmentDay,
      daysToAdd,
      tripStart: tripStartDate.toLocaleDateString(),
      result: segmentDate.toLocaleDateString(),
      verification: `Day ${segmentDay} = Trip start + ${daysToAdd} days`,
      service: 'UnifiedDateService'
    });
    
    return segmentDate;
  }

  /**
   * Check if a date is today (same local calendar date)
   */
  static isToday(date: Date): boolean {
    const today = this.getToday();
    const checkDate = this.normalizeToLocalMidnight(date);
    
    const isToday = (
      checkDate.getFullYear() === today.getFullYear() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getDate() === today.getDate()
    );
    
    console.log('🔧 UNIFIED: isToday check:', {
      inputDate: date.toLocaleDateString(),
      todayDate: today.toLocaleDateString(),
      isToday,
      service: 'UnifiedDateService'
    });
    
    return isToday;
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
    const daysDiff = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    
    console.log('🔧 UNIFIED: getDaysFromToday calculation:', {
      targetDate: date.toLocaleDateString(),
      todayDate: today.toLocaleDateString(),
      daysDiff,
      interpretation: daysDiff === 0 ? 'TODAY' : daysDiff > 0 ? 'FUTURE' : 'PAST',
      service: 'UnifiedDateService'
    });
    
    return daysDiff;
  }

  /**
   * Format date for API calls (YYYY-MM-DD) using local components
   */
  static formatForApi(date: Date): string {
    const normalized = this.normalizeToLocalMidnight(date);
    const year = normalized.getFullYear();
    const month = String(normalized.getMonth() + 1).padStart(2, '0');
    const day = String(normalized.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;
    
    console.log('🔧 UNIFIED: formatForApi:', {
      input: date.toLocaleDateString(),
      formatted,
      service: 'UnifiedDateService'
    });
    
    return formatted;
  }

  /**
   * Check if date is within live forecast range (today through day 7)
   */
  static isWithinLiveForecastRange(date: Date): boolean {
    const daysFromToday = this.getDaysFromToday(date);
    const isWithinRange = daysFromToday >= 0 && daysFromToday <= 7;
    
    console.log('🔧 UNIFIED: isWithinLiveForecastRange:', {
      targetDate: date.toLocaleDateString(),
      daysFromToday,
      isWithinRange,
      logic: 'Day 0 (TODAY) through Day 7 = LIVE FORECAST',
      service: 'UnifiedDateService'
    });
    
    return isWithinRange;
  }

  /**
   * Compare two dates (returns true if same local calendar date)
   */
  static isSameDate(date1: Date, date2: Date): boolean {
    const normalized1 = this.normalizeToLocalMidnight(date1);
    const normalized2 = this.normalizeToLocalMidnight(date2);
    
    const isSame = (
      normalized1.getFullYear() === normalized2.getFullYear() &&
      normalized1.getMonth() === normalized2.getMonth() &&
      normalized1.getDate() === normalized2.getDate()
    );
    
    console.log('🔧 UNIFIED: isSameDate comparison:', {
      date1: date1.toLocaleDateString(),
      date2: date2.toLocaleDateString(),
      isSame,
      service: 'UnifiedDateService'
    });
    
    return isSame;
  }

  /**
   * Get the start of week for a given date
   */
  static getStartOfWeek(date: Date): Date {
    const normalized = this.normalizeToLocalMidnight(date);
    const dayOfWeek = normalized.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(normalized.getFullYear(), normalized.getMonth(), normalized.getDate() - dayOfWeek);
    
    console.log('🔧 UNIFIED: getStartOfWeek:', {
      input: date.toLocaleDateString(),
      dayOfWeek,
      startOfWeek: startOfWeek.toLocaleDateString(),
      service: 'UnifiedDateService'
    });
    
    return startOfWeek;
  }

  /**
   * Get the end of week for a given date
   */
  static getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);
    
    console.log('🔧 UNIFIED: getEndOfWeek:', {
      input: date.toLocaleDateString(),
      endOfWeek: endOfWeek.toLocaleDateString(),
      service: 'UnifiedDateService'
    });
    
    return endOfWeek;
  }

  /**
   * Add days to a date
   */
  static addDays(date: Date, days: number): Date {
    const normalized = this.normalizeToLocalMidnight(date);
    const result = new Date(normalized.getFullYear(), normalized.getMonth(), normalized.getDate() + days);
    
    console.log('🔧 UNIFIED: addDays:', {
      input: date.toLocaleDateString(),
      daysToAdd: days,
      result: result.toLocaleDateString(),
      service: 'UnifiedDateService'
    });
    
    return result;
  }

  /**
   * Subtract days from a date
   */
  static subtractDays(date: Date, days: number): Date {
    return this.addDays(date, -days);
  }
}
