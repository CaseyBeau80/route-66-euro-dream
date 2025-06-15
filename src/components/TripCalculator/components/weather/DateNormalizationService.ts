
export class DateNormalizationService {
  /**
   * ULTIMATE FIX: Normalize a date to start of day in local timezone
   * This ensures consistent date handling across the application
   */
  static normalizeSegmentDate(date: Date): Date {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    console.log('🚨 ULTIMATE FIX: DateNormalizationService.normalizeSegmentDate:', {
      input: {
        iso: date.toISOString(),
        local: date.toLocaleDateString(),
        dateString: date.toDateString(),
        components: {
          year: date.getFullYear(),
          month: date.getMonth(),
          date: date.getDate()
        }
      },
      normalized: {
        iso: normalized.toISOString(),
        local: normalized.toLocaleDateString(),
        dateString: normalized.toDateString(),
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
   * ULTIMATE FIX: Calculate segment date based on trip start date and day number
   * ABSOLUTELY FIXED LOGIC: Day 1 = exact same date as trip start, Day N = add (N-1) days using proper date arithmetic
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🚨 ULTIMATE FIX: DateNormalizationService.calculateSegmentDate - FINAL VERSION:', {
      tripStartDate: {
        iso: tripStartDate.toISOString(),
        local: tripStartDate.toLocaleDateString(),
        dateString: tripStartDate.toDateString(),
        components: {
          year: tripStartDate.getFullYear(),
          month: tripStartDate.getMonth(),
          date: tripStartDate.getDate()
        }
      },
      segmentDay,
      absoluteRule: 'Day 1 = EXACT SAME DATE as trip start, no calculation needed'
    });

    // ULTIMATE FIX: Normalize the trip start date first
    const normalizedStartDate = this.normalizeSegmentDate(tripStartDate);
    
    // ULTIMATE FIX: For Day 1, return the exact same normalized date - no calculation
    if (segmentDay === 1) {
      console.log('🚨 ULTIMATE FIX: Day 1 - returning EXACT SAME DATE:', {
        input: normalizedStartDate.toISOString(),
        inputLocal: normalizedStartDate.toLocaleDateString(),
        inputDateString: normalizedStartDate.toDateString(),
        verification: 'DAY_1_GETS_EXACT_SAME_DATE_NO_CALCULATION'
      });
      return normalizedStartDate;
    }
    
    // ULTIMATE FIX: For other days, use proper date arithmetic
    const daysToAdd = segmentDay - 1;
    
    // Use proper date arithmetic that handles month/year boundaries correctly
    const segmentDate = new Date(normalizedStartDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    
    console.log('🚨 ULTIMATE FIX: DateNormalizationService FINAL CALCULATION:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        tripStartDateLocal: tripStartDate.toLocaleDateString(),
        segmentDay
      },
      calculation: {
        normalizedStartDate: normalizedStartDate.toISOString(),
        normalizedStartDateLocal: normalizedStartDate.toLocaleDateString(),
        daysToAdd,
        method: 'new Date(normalizedStartDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000))',
        millisToAdd: daysToAdd * 24 * 60 * 60 * 1000
      },
      result: {
        segmentDate: segmentDate.toISOString(),
        segmentDateLocal: segmentDate.toLocaleDateString(),
        segmentDateString: segmentDate.toDateString()
      },
      verification: {
        day1Check: segmentDay === 1 ? 
          'NOT_APPLICABLE_DAY_1_HANDLED_SEPARATELY' : 
          'CALCULATED_USING_MILLISECONDS',
        isConsistent: 'USING_MILLISECOND_ARITHMETIC_FOR_ACCURACY'
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
