
export class DateNormalizationService {
  /**
   * CRITICAL FIX: Calculate segment date ensuring Day 1 = trip start date
   */
  static calculateSegmentDate(tripStartDate: Date, segmentDay: number): Date {
    console.log('🚨 DATE FIX: DateNormalizationService.calculateSegmentDate called:', {
      tripStartDate: tripStartDate.toISOString(),
      segmentDay,
      calculation: `Day ${segmentDay} = tripStartDate + ${segmentDay - 1} days`
    });

    // CRITICAL FIX: Day 1 should be exactly the trip start date
    // Day 2 should be trip start date + 1 day, etc.
    const daysToAdd = segmentDay - 1; // This ensures Day 1 = +0 days = trip start date
    
    const segmentDate = new Date(tripStartDate);
    segmentDate.setDate(segmentDate.getDate() + daysToAdd);
    
    // Normalize to midnight local time for consistency
    const normalizedSegmentDate = this.normalizeSegmentDate(segmentDate);
    
    console.log('🚨 DATE FIX: DateNormalizationService.calculateSegmentDate result:', {
      input: {
        tripStartDate: tripStartDate.toISOString(),
        segmentDay,
        daysToAdd
      },
      output: {
        rawSegmentDate: segmentDate.toISOString(),
        normalizedSegmentDate: normalizedSegmentDate.toISOString(),
        localDate: normalizedSegmentDate.toLocaleDateString()
      },
      validation: {
        day1Check: segmentDay === 1 ? 
          (normalizedSegmentDate.toDateString() === this.normalizeSegmentDate(tripStartDate).toDateString() ? 'CORRECT' : 'INCORRECT') :
          'NOT_DAY_1'
      }
    });

    return normalizedSegmentDate;
  }

  /**
   * Normalize a date to midnight local time for consistent calculations
   */
  static normalizeSegmentDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  /**
   * Convert date to string format
   */
  static toDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Calculate days difference between two dates
   */
  static getDaysDifference(fromDate: Date, toDate: Date): number {
    const normalizedFrom = this.normalizeSegmentDate(fromDate);
    const normalizedTo = this.normalizeSegmentDate(toDate);
    
    const diffInMs = normalizedTo.getTime() - normalizedFrom.getTime();
    const diffInDays = Math.ceil(diffInMs / (24 * 60 * 60 * 1000));
    
    console.log('🚨 DATE FIX: getDaysDifference calculation:', {
      fromDate: normalizedFrom.toISOString(),
      toDate: normalizedTo.toISOString(),
      diffInMs,
      diffInDays
    });
    
    return diffInDays;
  }
}
