
export class DateNormalizationService {
  static calculateSegmentDate(tripStartDate: Date | string, segmentDay: number): Date | null {
    try {
      let startDate: Date;
      
      if (tripStartDate instanceof Date) {
        if (isNaN(tripStartDate.getTime())) return null;
        startDate = tripStartDate;
      } else if (typeof tripStartDate === 'string') {
        startDate = new Date(tripStartDate);
        if (isNaN(startDate.getTime())) return null;
      } else {
        return null;
      }

      // PLAN IMPLEMENTATION: Normalize the trip start date first
      const normalizedStartDate = this.normalizeSegmentDate(startDate);
      
      // PLAN IMPLEMENTATION: Calculate the segment date by adding (segmentDay - 1) days
      const segmentDate = new Date(normalizedStartDate);
      segmentDate.setUTCDate(normalizedStartDate.getUTCDate() + (segmentDay - 1));
      
      // PLAN IMPLEMENTATION: Enhanced debug output for date calculation
      console.log('🔧 PLAN: DateNormalizationService.calculateSegmentDate - ENHANCED CALCULATION', {
        input: {
          tripStartDate: tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString(),
          segmentDay,
          tripStartDateType: typeof tripStartDate
        },
        normalization: {
          normalizedStartDate: normalizedStartDate.toISOString(),
          daysToAdd: segmentDay - 1
        },
        result: {
          segmentDate: segmentDate.toISOString(),
          isValid: !isNaN(segmentDate.getTime()),
          timezone: 'UTC (normalized)'
        }
      });
      
      return isNaN(segmentDate.getTime()) ? null : segmentDate;
    } catch (error) {
      console.error('🔧 PLAN: Error in calculateSegmentDate:', error);
      return null;
    }
  }

  static normalizeSegmentDate(date: Date): Date {
    // PLAN IMPLEMENTATION: Normalize to UTC midnight to ensure consistent date handling
    const normalized = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    
    console.log('🔧 PLAN: DateNormalizationService.normalizeSegmentDate', {
      input: date.toISOString(),
      output: normalized.toISOString(),
      timezone: 'UTC (normalized)'
    });
    
    return normalized;
  }

  static getDaysDifference(date1: Date, date2: Date): number {
    // PLAN IMPLEMENTATION: Use UTC dates for consistent calculation
    const utc1 = Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate());
    const utc2 = Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysDiff = Math.floor((utc2 - utc1) / msPerDay);
    
    console.log('🔧 PLAN: DateNormalizationService.getDaysDifference', {
      date1: date1.toISOString(),
      date2: date2.toISOString(),
      utc1: new Date(utc1).toISOString(),
      utc2: new Date(utc2).toISOString(),
      daysDifference: daysDiff
    });
    
    return daysDiff;
  }

  static toDateString(date: Date): string {
    // PLAN IMPLEMENTATION: Use UTC date for string conversion
    const dateString = date.toISOString().split('T')[0];
    
    console.log('🔧 PLAN: DateNormalizationService.toDateString', {
      input: date.toISOString(),
      output: dateString
    });
    
    return dateString;
  }
}
