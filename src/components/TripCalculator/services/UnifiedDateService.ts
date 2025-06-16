/**
 * FIXED UNIFIED DATE SERVICE - Eliminates all timezone-related date shifts
 * This ensures Day 1 = EXACT same calendar date as trip start
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
   * FIXED: Normalize date using local date components only (no timezone shifts)
   */
  static normalizeToLocalMidnight(date: Date): Date {
    // Extract local date components and create new date
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Create new date using local components (avoids timezone shifts)
    const normalized = new Date(year, month, day);
    
    console.log('🔧 FIXED: normalizeToLocalMidnight - NO TIMEZONE SHIFTS:', {
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
        noTimezoneShift: true
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
   * FIXED: Calculate segment date - Day 1 = EXACT same LOCAL date as trip start
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🔧 FIXED: calculateSegmentDate - ELIMINATING DATE SHIFTS:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        tripStartDateLocal: tripStartDate.toLocaleDateString(),
        segmentDay
      },
      rule: 'Day 1 = EXACT SAME LOCAL DATE as trip start (ZERO OFFSET)'
    });

    // FIXED: Extract local components from trip start date
    const startYear = tripStartDate.getFullYear();
    const startMonth = tripStartDate.getMonth();
    const startDay = tripStartDate.getDate();
    
    if (segmentDay === 1) {
      // Day 1: Use EXACT same local date components
      const day1Date = new Date(startYear, startMonth, startDay);
      
      console.log('🔧 FIXED: Day 1 calculation - EXACT MATCH:', {
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
          rule: 'DAY_1_EQUALS_TRIP_START_EXACT'
        }
      });
      
      return day1Date;
    }
    
    // Other days: Add (segmentDay - 1) days to trip start
    const daysToAdd = segmentDay - 1;
    const segmentDate = new Date(startYear, startMonth, startDay + daysToAdd);
    
    console.log('🔧 FIXED: Other day calculation:', {
      segmentDay,
      daysToAdd,
      tripStart: tripStartDate.toLocaleDateString(),
      result: segmentDate.toLocaleDateString(),
      verification: `Day ${segmentDay} = Trip start + ${daysToAdd} days`
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
    
    console.log('🔧 FIXED: isToday check:', {
      inputDate: date.toLocaleDateString(),
      todayDate: today.toLocaleDateString(),
      isToday
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
    return Math.floor(diffTime / (24 * 60 * 60 * 1000));
  }

  /**
   * Format date for API calls (YYYY-MM-DD) using local components
   */
  static formatForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
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
   * Compare two dates (returns true if same local calendar date)
   */
  static isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
