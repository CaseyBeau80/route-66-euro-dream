
export class DateNormalizationService {
  /**
   * CRITICAL FIX: Normalize a date to start of day in local timezone
   * This ensures consistent date handling across the application
   */
  static normalizeSegmentDate(date: Date): Date {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    console.log('📅 CRITICAL FIX: DateNormalizationService.normalizeSegmentDate:', {
      input: {
        iso: date.toISOString(),
        local: date.toLocaleDateString(),
        components: {
          year: date.getFullYear(),
          month: date.getMonth(),
          date: date.getDate()
        }
      },
      normalized: {
        iso: normalized.toISOString(),
        local: normalized.toLocaleDateString(),
        components: {
          year: normalized.getFullYear(),
          month: normalized.getMonth(),
          date: normalized.getDate()
        }
      },
      verification: {
        sameYear: date.getFullYear() === normalized.getFullYear(),
        sameMonth: date.getMonth() === normalized.getMonth(),
        sameDate: date.getDate() === normalized.getDate(),
        isStartOfDay: normalized.getHours() === 0 && normalized.getMinutes() === 0 && normalized.getSeconds() === 0
      }
    });
    
    return normalized;
  }

  /**
   * CRITICAL FIX: Calculate segment date based on trip start date and day number
   * FINAL FIXED LOGIC: Day 1 = exact same date as trip start, Day N = add (N-1) days
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('📅 CRITICAL FIX: DateNormalizationService.calculateSegmentDate:', {
      tripStartDate: {
        iso: tripStartDate.toISOString(),
        local: tripStartDate.toLocaleDateString(),
        components: {
          year: tripStartDate.getFullYear(),
          month: tripStartDate.getMonth(),
          date: tripStartDate.getDate()
        }
      },
      segmentDay,
      absoluteRule: 'Day 1 = EXACT SAME DATE as trip start'
    });

    // CRITICAL FIX: Normalize the trip start date first
    const normalizedStartDate = this.normalizeSegmentDate(tripStartDate);
    
    // CRITICAL FIX: For Day 1, return the exact same normalized date
    if (segmentDay === 1) {
      console.log('📅 CRITICAL FIX: Day 1 - returning EXACT SAME DATE:', {
        input: normalizedStartDate.toISOString(),
        inputLocal: normalizedStartDate.toLocaleDateString(),
        verification: 'DAY_1_GETS_EXACT_SAME_DATE'
      });
      return normalizedStartDate;
    }
    
    // CRITICAL FIX: For other days, use proper date arithmetic that preserves local timezone
    const daysToAdd = segmentDay - 1;
    
    // Use Date constructor to add days while preserving local timezone
    const segmentDate = new Date(
      normalizedStartDate.getFullYear(),
      normalizedStartDate.getMonth(),
      normalizedStartDate.getDate() + daysToAdd
    );
    
    console.log('📅 CRITICAL FIX: DateNormalizationService FINAL CALCULATION:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        tripStartDateLocal: tripStartDate.toLocaleDateString(),
        segmentDay
      },
      calculation: {
        normalizedStartDate: normalizedStartDate.toISOString(),
        normalizedStartDateLocal: normalizedStartDate.toLocaleDateString(),
        daysToAdd,
        method: 'new Date(year, month, date + daysToAdd)',
        preservesLocalTimezone: true
      },
      result: {
        segmentDate: segmentDate.toISOString(),
        segmentDateLocal: segmentDate.toLocaleDateString(),
        segmentDateComponents: {
          year: segmentDate.getFullYear(),
          month: segmentDate.getMonth(),
          date: segmentDate.getDate()
        }
      },
      verification: {
        day1Check: segmentDay === 1 ? 
          'NOT_APPLICABLE_DAY_1_HANDLED_SEPARATELY' : 
          'CALCULATED_USING_LOCAL_DATE_ARITHMETIC',
        isConsistent: 'USING_LOCAL_TIMEZONE_ARITHMETIC',
        noTimezoneShift: true
      }
    });
    
    return segmentDate;
  }

  /**
   * Convert date to YYYY-MM-DD string format using local date components
   */
  static toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    console.log('📅 DateNormalizationService.toDateString:', {
      input: date.toISOString(),
      inputLocal: date.toLocaleDateString(),
      output: dateString,
      components: { year, month, day }
    });
    
    return dateString;
  }

  /**
   * Calculate days difference between two dates using local date components
   */
  static getDaysDifference(startDate: Date, endDate: Date): number {
    const start = this.normalizeSegmentDate(startDate);
    const end = this.normalizeSegmentDate(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (24 * 60 * 60 * 1000));
    
    console.log('📅 DateNormalizationService.getDaysDifference:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      normalizedStart: start.toISOString(),
      normalizedEnd: end.toISOString(),
      diffDays
    });
    
    return diffDays;
  }

  /**
   * CRITICAL FIX: Check if a date is today using local date components
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    const normalizedToday = this.normalizeSegmentDate(today);
    const normalizedDate = this.normalizeSegmentDate(date);
    
    const isToday = (
      normalizedDate.getFullYear() === normalizedToday.getFullYear() &&
      normalizedDate.getMonth() === normalizedToday.getMonth() &&
      normalizedDate.getDate() === normalizedToday.getDate()
    );
    
    console.log('📅 DateNormalizationService.isToday:', {
      inputDate: date.toLocaleDateString(),
      todayDate: today.toLocaleDateString(),
      isToday,
      comparison: 'LOCAL_DATE_COMPONENTS_ONLY'
    });
    
    return isToday;
  }

  /**
   * CRITICAL FIX: Check if a date is in the past using local date components
   */
  static isPastDate(date: Date): boolean {
    const today = new Date();
    const normalizedToday = this.normalizeSegmentDate(today);
    const normalizedDate = this.normalizeSegmentDate(date);
    
    const isPast = normalizedDate.getTime() < normalizedToday.getTime();
    
    console.log('📅 DateNormalizationService.isPastDate:', {
      inputDate: date.toLocaleDateString(),
      todayDate: today.toLocaleDateString(),
      isPast,
      comparison: 'LOCAL_NORMALIZED_TIME_COMPARISON'
    });
    
    return isPast;
  }
}
