
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
   * CRITICAL FIX: Normalize date using local date components only (no timezone shifts)
   * This function ensures dates remain in local timezone without UTC conversion
   */
  static normalizeToLocalMidnight(date: Date): Date {
    // CRITICAL: Use getFullYear, getMonth, getDate to get LOCAL components
    // NOT getUTCFullYear, getUTCMonth, getUTCDate which would use UTC
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Create new date using LOCAL components at midnight (avoids timezone shifts)
    const normalized = new Date(year, month, day, 0, 0, 0, 0);
    
    console.log('🔧 CRITICAL FIX: normalizeToLocalMidnight - LOCAL TIMEZONE PRESERVATION:', {
      input: {
        iso: date.toISOString(),
        local: date.toLocaleDateString(),
        localDateTime: date.toString(),
        components: { year, month, day }
      },
      output: {
        iso: normalized.toISOString(),
        local: normalized.toLocaleDateString(),
        localDateTime: normalized.toString(),
        components: { 
          year: normalized.getFullYear(), 
          month: normalized.getMonth(), 
          day: normalized.getDate() 
        }
      },
      verification: {
        sameLocalDate: date.toLocaleDateString() === normalized.toLocaleDateString(),
        preservedLocalTimezone: true,
        noUtcConversion: true,
        service: 'UnifiedDateService - CRITICAL FIX'
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
   * CRITICAL FIX: Check if a date is today using LOCAL date components only
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    
    // Compare LOCAL date components (not UTC)
    const isToday = (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
    
    console.log('🔧 CRITICAL FIX: isToday check using LOCAL components:', {
      inputDate: {
        local: date.toLocaleDateString(),
        components: {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate()
        }
      },
      todayDate: {
        local: today.toLocaleDateString(),
        components: {
          year: today.getFullYear(),
          month: today.getMonth(),
          day: today.getDate()
        }
      },
      isToday,
      localTimezoneComparison: true,
      service: 'UnifiedDateService - CRITICAL FIX'
    });
    
    return isToday;
  }

  /**
   * CRITICAL FIX: Check if a date is in the past using LOCAL date components only
   */
  static isPastDate(date: Date): boolean {
    const today = new Date();
    
    // Get LOCAL date components for today
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    
    // Get LOCAL date components for the input date
    const checkYear = date.getFullYear();
    const checkMonth = date.getMonth();
    const checkDay = date.getDate();
    
    console.log('🚨 CRITICAL FIX: isPastDate using LOCAL date components:', {
      today: {
        year: todayYear,
        month: todayMonth,
        day: todayDay,
        dateString: today.toLocaleDateString(),
        fullString: today.toString()
      },
      checkDate: {
        year: checkYear,
        month: checkMonth,
        day: checkDay,
        dateString: date.toLocaleDateString(),
        fullString: date.toString()
      },
      localTimezoneComparison: true
    });
    
    // Compare year first
    if (checkYear < todayYear) {
      console.log('✅ CRITICAL FIX: Date is in past year');
      return true;
    }
    if (checkYear > todayYear) {
      console.log('✅ CRITICAL FIX: Date is in future year');
      return false;
    }
    
    // Same year, compare month
    if (checkMonth < todayMonth) {
      console.log('✅ CRITICAL FIX: Date is in past month');
      return true;
    }
    if (checkMonth > todayMonth) {
      console.log('✅ CRITICAL FIX: Date is in future month');
      return false;
    }
    
    // Same year and month, compare day
    if (checkDay < todayDay) {
      console.log('✅ CRITICAL FIX: Date is in past day');
      return true;
    }
    
    // Same date or future date
    const isActuallyPast = false;
    console.log('✅ CRITICAL FIX: Date is today or future - NOT PAST:', {
      isToday: checkDay === todayDay,
      isFuture: checkDay > todayDay,
      finalResult: isActuallyPast,
      preservedLocalTimezone: true
    });
    
    return isActuallyPast;
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
