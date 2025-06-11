
export class DateNormalizationService {
  /**
   * Calculate the exact segment date for a given trip start date and day number
   */
  static calculateSegmentDate(tripStartDate: Date | string, dayNumber: number): Date | null {
    console.log(`🗓️ DateNormalizationService.calculateSegmentDate:`, {
      tripStartDate: typeof tripStartDate === 'string' ? tripStartDate : tripStartDate?.toISOString(),
      dayNumber,
      tripStartDateType: typeof tripStartDate
    });

    if (!tripStartDate) {
      console.error('❌ DateNormalizationService: No trip start date provided');
      return null;
    }

    if (!dayNumber || dayNumber < 1) {
      console.error('❌ DateNormalizationService: Invalid day number:', dayNumber);
      return null;
    }

    try {
      let baseDate: Date;
      
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ DateNormalizationService: Invalid Date object');
          return null;
        }
        baseDate = new Date(tripStartDate);
      } else if (typeof tripStartDate === 'string') {
        baseDate = new Date(tripStartDate);
        if (isNaN(baseDate.getTime())) {
          console.error('❌ DateNormalizationService: Invalid date string:', tripStartDate);
          return null;
        }
      } else {
        console.error('❌ DateNormalizationService: tripStartDate is not a Date or string:', tripStartDate);
        return null;
      }

      // Calculate the segment date by adding (dayNumber - 1) days
      const segmentDate = new Date(baseDate);
      segmentDate.setDate(baseDate.getDate() + (dayNumber - 1));
      
      // Normalize to start of day to avoid time zone issues
      const normalizedDate = this.normalizeSegmentDate(segmentDate);
      
      console.log(`✅ DateNormalizationService: Calculated segment date for day ${dayNumber}:`, {
        baseDate: baseDate.toISOString(),
        calculatedDate: segmentDate.toISOString(),
        normalizedDate: normalizedDate.toISOString(),
        dateString: this.toDateString(normalizedDate)
      });
      
      return normalizedDate;
    } catch (error) {
      console.error('❌ DateNormalizationService: Error calculating segment date:', error);
      return null;
    }
  }

  /**
   * Normalize a date to start of day in UTC to avoid timezone issues
   */
  static normalizeSegmentDate(date: Date): Date {
    if (!date || isNaN(date.getTime())) {
      console.error('❌ DateNormalizationService: Cannot normalize invalid date:', date);
      return new Date(); // fallback to current date
    }

    const normalized = new Date(date);
    normalized.setUTCHours(12, 0, 0, 0); // Set to noon UTC to avoid timezone edge cases
    
    console.log(`🔧 DateNormalizationService.normalizeSegmentDate:`, {
      original: date.toISOString(),
      normalized: normalized.toISOString()
    });
    
    return normalized;
  }

  /**
   * Convert a date to YYYY-MM-DD string format
   */
  static toDateString(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      console.error('❌ DateNormalizationService: Cannot convert invalid date to string:', date);
      return new Date().toISOString().split('T')[0]; // fallback to today
    }

    const dateString = date.toISOString().split('T')[0];
    
    console.log(`📅 DateNormalizationService.toDateString:`, {
      date: date.toISOString(),
      dateString
    });
    
    return dateString;
  }

  /**
   * Create a date from YYYY-MM-DD string
   */
  static fromDateString(dateString: string): Date {
    if (!dateString || typeof dateString !== 'string') {
      console.error('❌ DateNormalizationService: Invalid date string:', dateString);
      return new Date();
    }

    try {
      const date = new Date(dateString + 'T12:00:00.000Z'); // Add time to ensure UTC
      
      if (isNaN(date.getTime())) {
        console.error('❌ DateNormalizationService: Could not parse date string:', dateString);
        return new Date();
      }
      
      console.log(`📅 DateNormalizationService.fromDateString:`, {
        dateString,
        parsedDate: date.toISOString()
      });
      
      return date;
    } catch (error) {
      console.error('❌ DateNormalizationService: Error parsing date string:', error);
      return new Date();
    }
  }
}
