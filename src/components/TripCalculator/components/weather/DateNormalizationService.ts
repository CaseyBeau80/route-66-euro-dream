
export class DateNormalizationService {
  /**
   * FIXED: Normalize a date to start of day in local timezone with comprehensive logging
   * This ensures consistent date handling across the application
   */
  static normalizeSegmentDate(date: Date): Date {
    // FIXED: Use the exact same date without any timezone conversion
    // This prevents off-by-one errors due to timezone differences
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    console.log('🗓️ FIXED: DateNormalizationService.normalizeSegmentDate COMPREHENSIVE:', {
      input: {
        iso: date.toISOString(),
        local: date.toLocaleDateString(),
        components: {
          year: date.getFullYear(),
          month: date.getMonth(),
          date: date.getDate(),
          hours: date.getHours(),
          minutes: date.getMinutes(),
          seconds: date.getSeconds()
        }
      },
      normalized: {
        iso: normalized.toISOString(),
        local: normalized.toLocaleDateString(),
        components: {
          year: normalized.getFullYear(),
          month: normalized.getMonth(),
          date: normalized.getDate(),
          hours: normalized.getHours(),
          minutes: normalized.getMinutes(),
          seconds: normalized.getSeconds()
        }
      },
      verification: {
        sameYear: date.getFullYear() === normalized.getFullYear(),
        sameMonth: date.getMonth() === normalized.getMonth(),
        sameDate: date.getDate() === normalized.getDate(),
        isStartOfDay: normalized.getHours() === 0 && normalized.getMinutes() === 0 && normalized.getSeconds() === 0
      },
      method: 'local_timezone_start_of_day_FIXED'
    });
    
    return normalized;
  }

  /**
   * FIXED: Calculate segment date based on trip start date and day number
   * Day 1 = trip start date, Day 2 = trip start date + 1 day, etc.
   * CRITICAL FIX: Ensures Day 1 always equals the trip start date exactly
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🚨 CRITICAL FIXED: DateNormalizationService.calculateSegmentDate COMPREHENSIVE INPUT:', {
      tripStartDate: {
        iso: tripStartDate.toISOString(),
        local: tripStartDate.toLocaleDateString(),
        components: {
          year: tripStartDate.getFullYear(),
          month: tripStartDate.getMonth(),
          date: tripStartDate.getDate(),
          hours: tripStartDate.getHours(),
          minutes: tripStartDate.getMinutes(),
          seconds: tripStartDate.getSeconds()
        }
      },
      segmentDay,
      expectedBehavior: {
        day1: 'MUST_EQUAL_TRIP_START_DATE_EXACTLY',
        otherDays: `TRIP_START_DATE_PLUS_${segmentDay - 1}_DAYS`
      }
    });

    // FIXED: Normalize the trip start date first to ensure consistent base
    const normalizedStartDate = this.normalizeSegmentDate(tripStartDate);
    
    console.log('🚨 CRITICAL FIXED: Normalized start date:', {
      original: tripStartDate.toISOString(),
      normalized: normalizedStartDate.toISOString(),
      normalizedLocal: normalizedStartDate.toLocaleDateString(),
      normalizedComponents: {
        year: normalizedStartDate.getFullYear(),
        month: normalizedStartDate.getMonth(),
        date: normalizedStartDate.getDate()
      }
    });
    
    // CRITICAL FIX: For Day 1, return the exact normalized start date
    if (segmentDay === 1) {
      console.log('🚨 CRITICAL FIXED: Day 1 - returning EXACT trip start date:', {
        tripStartDate: tripStartDate.toISOString(),
        normalizedStartDate: normalizedStartDate.toISOString(),
        result: normalizedStartDate.toISOString(),
        resultLocal: normalizedStartDate.toLocaleDateString(),
        resultComponents: {
          year: normalizedStartDate.getFullYear(),
          month: normalizedStartDate.getMonth(),
          date: normalizedStartDate.getDate()
        },
        verification: 'DAY_1_EQUALS_TRIP_START_DATE_EXACTLY'
      });
      return normalizedStartDate;
    }
    
    // FIXED: For other days, add the correct number of days
    const segmentDate = new Date(normalizedStartDate);
    segmentDate.setDate(normalizedStartDate.getDate() + (segmentDay - 1));
    
    console.log('🚨 CRITICAL FIXED: DateNormalizationService.calculateSegmentDate FINAL RESULT:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        tripStartDateLocal: tripStartDate.toLocaleDateString(),
        segmentDay
      },
      normalized: {
        normalizedStartDate: normalizedStartDate.toISOString(),
        normalizedStartDateLocal: normalizedStartDate.toLocaleDateString()
      },
      calculation: {
        daysToAdd: segmentDay - 1,
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
          (segmentDate.toDateString() === normalizedStartDate.toDateString() ? 'CORRECT_MATCH' : 'INCORRECT_MISMATCH') : 
          'NOT_DAY_1',
        expectedForDay1: segmentDay === 1 ? 'SHOULD_EQUAL_TRIP_START_DATE' : 'OTHER_DAY',
        actualResult: segmentDay === 1 ? 
          (segmentDate.toDateString() === normalizedStartDate.toDateString() ? 'PERFECT_MATCH' : 'ERROR_MISMATCH') : 
          'CALCULATED_CORRECTLY',
        dateStringComparison: segmentDay === 1 ? {
          segmentDateString: segmentDate.toDateString(),
          normalizedStartDateString: normalizedStartDate.toDateString(),
          matches: segmentDate.toDateString() === normalizedStartDate.toDateString()
        } : null
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
