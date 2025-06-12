
export class DateNormalizationService {
  /**
   * CRITICAL FIX: Ensure consistent date calculation across all components
   */
  static calculateSegmentDate(tripStartDate: Date | string, segmentDay: number): Date | null {
    console.log(`🗓️ CRITICAL DateNormalizationService.calculateSegmentDate:`, {
      tripStartDate,
      segmentDay,
      tripStartDateType: typeof tripStartDate,
      isDateObject: tripStartDate instanceof Date
    });

    if (!tripStartDate) {
      console.error('❌ DateNormalizationService: No trip start date provided');
      return null;
    }

    let baseDate: Date;
    
    try {
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) {
          console.error('❌ DateNormalizationService: Invalid Date object:', tripStartDate);
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
        console.error('❌ DateNormalizationService: Invalid tripStartDate type:', { tripStartDate, type: typeof tripStartDate });
        return null;
      }
    } catch (error) {
      console.error('❌ DateNormalizationService: Error parsing date:', error, tripStartDate);
      return null;
    }

    // CRITICAL: Calculate segment date by adding (segmentDay - 1) days
    // Day 1 = start date, Day 2 = start date + 1 day, etc.
    const segmentDate = new Date(baseDate);
    segmentDate.setDate(baseDate.getDate() + (segmentDay - 1));
    
    // Normalize to midnight local time to avoid timezone issues
    segmentDate.setHours(0, 0, 0, 0);
    
    const dateString = this.toDateString(segmentDate);
    
    console.log(`✅ DateNormalizationService: Calculated segment date:`, {
      segmentDay,
      baseDate: baseDate.toISOString(),
      calculatedDate: segmentDate.toISOString(),
      dateString,
      daysAdded: segmentDay - 1
    });
    
    return segmentDate;
  }

  /**
   * Convert Date to YYYY-MM-DD string format (local timezone)
   */
  static toDateString(date: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      console.error('❌ DateNormalizationService.toDateString: Invalid date:', date);
      return '';
    }
    
    // Use local timezone to avoid UTC conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const dateString = `${year}-${month}-${day}`;
    
    console.log(`📅 DateNormalizationService.toDateString:`, {
      inputDate: date.toISOString(),
      outputString: dateString,
      localDate: date.toLocaleDateString()
    });
    
    return dateString;
  }

  /**
   * Normalize a date to midnight local time
   */
  static normalizeSegmentDate(date: Date): Date {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      console.error('❌ DateNormalizationService.normalizeSegmentDate: Invalid date:', date);
      return new Date();
    }
    
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    
    console.log(`🕒 DateNormalizationService.normalizeSegmentDate:`, {
      original: date.toISOString(),
      normalized: normalized.toISOString()
    });
    
    return normalized;
  }

  /**
   * CRITICAL: Enhanced debugging for date issues
   */
  static debugDateCalculation(context: string, inputs: any, result: any): void {
    console.log(`🔍 DATE DEBUG [${context}]:`, {
      inputs,
      result: result?.toISOString(),
      resultString: result ? this.toDateString(result) : null,
      timestamp: new Date().toISOString()
    });
  }
}
