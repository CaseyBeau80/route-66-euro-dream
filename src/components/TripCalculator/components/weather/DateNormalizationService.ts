
export class DateNormalizationService {
  /**
   * CRITICAL FIX: Normalize a date to start of day in local timezone
   * This ensures consistent date handling across the application
   */
  static normalizeSegmentDate(date: Date): Date {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    console.log('🗓️ CRITICAL FIX: DateNormalizationService.normalizeSegmentDate:', {
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
   * CONSISTENT LOGIC: Day 1 = trip start date exactly, Day N = trip start + (N-1) days
   * This ensures Day 1 always equals the trip start date exactly
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🚨 CRITICAL FIX: DateNormalizationService.calculateSegmentDate - CONSISTENT VERSION:', {
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
      consistentLogic: 'Day 1 = trip start date exactly, Day N = trip start + (N-1) days'
    });

    // CRITICAL FIX: Normalize the trip start date first to ensure consistent handling
    const normalizedStartDate = this.normalizeSegmentDate(tripStartDate);
    
    // CRITICAL FIX: For ALL days, use consistent calculation
    // Day 1: add 0 days (segmentDay - 1 = 0)
    // Day 2: add 1 day (segmentDay - 1 = 1)
    // Day N: add (N-1) days
    const daysToAdd = segmentDay - 1;
    const segmentDate = new Date(normalizedStartDate);
    segmentDate.setDate(normalizedStartDate.getDate() + daysToAdd);
    
    console.log('🚨 CRITICAL FIX: DateNormalizationService CONSISTENT CALCULATION:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        tripStartDateLocal: tripStartDate.toLocaleDateString(),
        segmentDay
      },
      calculation: {
        normalizedStartDate: normalizedStartDate.toISOString(),
        normalizedStartDateLocal: normalizedStartDate.toLocaleDateString(),
        daysToAdd,
        method: 'setDate(normalizedStartDate.getDate() + daysToAdd)'
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
          (segmentDate.toDateString() === normalizedStartDate.toDateString() ? 'PERFECT_MATCH' : 'ERROR_MISMATCH') : 
          'NOT_DAY_1',
        dateStringComparison: segmentDay === 1 ? {
          segmentDateString: segmentDate.toDateString(),
          normalizedStartDateString: normalizedStartDate.toDateString(),
          matches: segmentDate.toDateString() === normalizedStartDate.toDateString()
        } : null,
        isConsistent: 'USING_SAME_NORMALIZATION_AS_CALENDAR'
      }
    });
    
    return segmentDate;
  }

  /**
   * Convert date to YYYY-MM-DD string format
   */
  static toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    console.log('🗓️ DateNormalizationService.toDateString:', {
      input: date.toISOString(),
      inputLocal: date.toLocaleDateString(),
      output: dateString
    });
    
    return dateString;
  }

  /**
   * Calculate days difference between two dates
   */
  static getDaysDifference(startDate: Date, endDate: Date): number {
    const start = this.normalizeSegmentDate(startDate);
    const end = this.normalizeSegmentDate(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (24 * 60 * 60 * 1000));
    
    console.log('🗓️ DateNormalizationService.getDaysDifference:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      normalizedStart: start.toISOString(),
      normalizedEnd: end.toISOString(),
      diffDays
    });
    
    return diffDays;
  }
}
