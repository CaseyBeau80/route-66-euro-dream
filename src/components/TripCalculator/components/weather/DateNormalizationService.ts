
export class DateNormalizationService {
  /**
   * Normalize a date to start of day in local timezone
   * This ensures consistent date handling across the application
   */
  static normalizeSegmentDate(date: Date): Date {
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    console.log('🗓️ DateNormalizationService.normalizeSegmentDate:', {
      input: date.toISOString(),
      inputLocal: date.toLocaleDateString(),
      normalized: normalized.toISOString(),
      normalizedLocal: normalized.toLocaleDateString(),
      method: 'local_timezone_start_of_day'
    });
    return normalized;
  }

  /**
   * Calculate segment date based on trip start date and day number
   * Day 1 = trip start date, Day 2 = trip start date + 1 day, etc.
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    // Normalize the trip start date first
    const normalizedStartDate = this.normalizeSegmentDate(tripStartDate);
    
    // Add days for the segment (Day 1 = start date, so we add segmentDay - 1)
    const segmentDate = new Date(normalizedStartDate);
    segmentDate.setDate(normalizedStartDate.getDate() + (segmentDay - 1));
    
    console.log('🗓️ DateNormalizationService.calculateSegmentDate:', {
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
        day1ShouldEqual: segmentDay === 1 ? 'TRIP_START_DATE' : 'TRIP_START_DATE_PLUS_DAYS',
        isCorrect: segmentDay === 1 ? segmentDate.toDateString() === normalizedStartDate.toDateString() : true
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
