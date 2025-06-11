
export class DateNormalizationService {
  /**
   * CRITICAL: Normalize segment date to prevent timezone drift
   * Uses UTC noon to ensure consistent date handling across timezones
   */
  static normalizeSegmentDate(date: Date): Date {
    console.log('🗓️ DateNormalizationService: Normalizing segment date:', {
      input: date.toISOString(),
      inputTimezoneOffset: date.getTimezoneOffset(),
      localTime: date.toLocaleString()
    });
    
    // Create UTC date at noon to prevent timezone edge cases
    const normalized = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      12, 0, 0, 0 // Noon UTC
    ));
    
    console.log('✅ DateNormalizationService: Date normalized:', {
      original: date.toISOString(),
      normalized: normalized.toISOString(),
      dateString: this.toDateString(normalized)
    });
    
    return normalized;
  }

  /**
   * Convert date to YYYY-MM-DD string format for consistent matching
   */
  static toDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Calculate segment date from trip start date and day number
   * ENHANCED: With comprehensive logging and validation
   */
  static calculateSegmentDate(tripStartDate: Date | string, dayNumber: number): Date | null {
    console.log('🗓️ DateNormalizationService: Calculating segment date:', {
      tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate?.toISOString(),
      dayNumber,
      tripStartDateType: typeof tripStartDate
    });

    if (!tripStartDate || dayNumber < 1) {
      console.error('❌ DateNormalizationService: Invalid input parameters:', {
        tripStartDate,
        dayNumber,
        hasStartDate: !!tripStartDate,
        dayNumberValid: dayNumber >= 1
      });
      return null;
    }

    try {
      let startDate: Date;
      
      if (typeof tripStartDate === 'string') {
        startDate = new Date(tripStartDate);
        if (isNaN(startDate.getTime())) {
          console.error('❌ DateNormalizationService: Invalid date string:', tripStartDate);
          return null;
        }
      } else if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ DateNormalizationService: Invalid Date object:', tripStartDate);
          return null;
        }
        startDate = tripStartDate;
      } else {
        console.error('❌ DateNormalizationService: Invalid date type:', typeof tripStartDate);
        return null;
      }

      // Normalize start date first
      const normalizedStartDate = this.normalizeSegmentDate(startDate);
      
      // Calculate segment date by adding days
      const segmentDate = new Date(normalizedStartDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000);
      
      console.log('✅ DateNormalizationService: Segment date calculated:', {
        tripStartDate: normalizedStartDate.toISOString(),
        dayNumber,
        calculatedDate: segmentDate.toISOString(),
        dateString: this.toDateString(segmentDate),
        daysFromNow: Math.ceil((segmentDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
      });
      
      return segmentDate;
    } catch (error) {
      console.error('❌ DateNormalizationService: Error calculating segment date:', error, {
        tripStartDate,
        dayNumber
      });
      return null;
    }
  }

  /**
   * Validate if two dates represent the same day
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return this.toDateString(date1) === this.toDateString(date2);
  }

  /**
   * Get days difference between two dates
   */
  static getDaysDifference(date1: Date, date2: Date): number {
    const normalized1 = this.normalizeSegmentDate(date1);
    const normalized2 = this.normalizeSegmentDate(date2);
    return Math.round((normalized2.getTime() - normalized1.getTime()) / (24 * 60 * 60 * 1000));
  }
}
