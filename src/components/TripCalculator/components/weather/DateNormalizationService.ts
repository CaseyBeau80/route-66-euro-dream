
export class DateNormalizationService {
  /**
   * Normalize a date to start of day in local timezone
   * This ensures consistent date handling across the application
   */
  static normalizeSegmentDate(date: Date): Date {
    // FIXED: Use the exact same date without any timezone conversion
    // This prevents off-by-one errors due to timezone differences
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    console.log('🗓️ FIXED: DateNormalizationService.normalizeSegmentDate:', {
      input: date.toISOString(),
      inputLocal: date.toLocaleDateString(),
      inputYear: date.getFullYear(),
      inputMonth: date.getMonth(),
      inputDate: date.getDate(),
      normalized: normalized.toISOString(),
      normalizedLocal: normalized.toLocaleDateString(),
      normalizedYear: normalized.getFullYear(),
      normalizedMonth: normalized.getMonth(),
      normalizedDate: normalized.getDate(),
      method: 'local_timezone_start_of_day_FIXED'
    });
    return normalized;
  }

  /**
   * Calculate segment date based on trip start date and day number
   * Day 1 = trip start date, Day 2 = trip start date + 1 day, etc.
   * FIXED: Ensures Day 1 always equals the trip start date exactly
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🗓️ FIXED: DateNormalizationService.calculateSegmentDate INPUT VALIDATION:', {
      tripStartDate: tripStartDate.toISOString(),
      tripStartDateLocal: tripStartDate.toLocaleDateString(),
      tripStartDateComponents: {
        year: tripStartDate.getFullYear(),
        month: tripStartDate.getMonth(),
        date: tripStartDate.getDate()
      },
      segmentDay,
      expectedOutput: segmentDay === 1 ? 'SHOULD_EQUAL_TRIP_START_DATE' : `TRIP_START_DATE_PLUS_${segmentDay - 1}_DAYS`
    });

    // FIXED: Normalize the trip start date first to ensure consistent base
    const normalizedStartDate = this.normalizeSegmentDate(tripStartDate);
    
    // FIXED: For Day 1, return the exact normalized start date
    if (segmentDay === 1) {
      console.log('🗓️ FIXED: Day 1 - returning exact trip start date:', {
        tripStartDate: tripStartDate.toISOString(),
        normalizedStartDate: normalizedStartDate.toISOString(),
        result: normalizedStartDate.toISOString(),
        resultLocal: normalizedStartDate.toLocaleDateString(),
        verification: 'DAY_1_EQUALS_TRIP_START_DATE'
      });
      return normalizedStartDate;
    }
    
    // FIXED: For other days, add the correct number of days
    const segmentDate = new Date(normalizedStartDate);
    segmentDate.setDate(normalizedStartDate.getDate() + (segmentDay - 1));
    
    console.log('🗓️ FIXED: DateNormalizationService.calculateSegmentDate RESULT:', {
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
        segmentDateLocal: segmentDate.toLocaleDateString()
      },
      verification: {
        day1Check: segmentDay === 1 ? 
          (segmentDate.toDateString() === normalizedStartDate.toDateString() ? 'CORRECT' : 'INCORRECT') : 
          'NOT_DAY_1',
        expectedForDay1: segmentDay === 1 ? 'SHOULD_EQUAL_TRIP_START_DATE' : 'OTHER_DAY',
        actualResult: segmentDay === 1 ? 
          (segmentDate.toDateString() === normalizedStartDate.toDateString() ? 'MATCHES' : 'MISMATCH') : 
          'CALCULATED_CORRECTLY'
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
