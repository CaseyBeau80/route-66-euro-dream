
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

      // FIXED: Normalize the trip start date first
      const normalizedStartDate = this.normalizeSegmentDate(startDate);
      
      // FIXED: Calculate the segment date by adding (segmentDay - 1) days
      // Create a new date to avoid mutating the original
      const segmentDate = new Date(normalizedStartDate.getTime());
      segmentDate.setUTCDate(normalizedStartDate.getUTCDate() + (segmentDay - 1));
      
      // FIXED: Enhanced debug output for date calculation
      console.log('🔧 FIXED: DateNormalizationService.calculateSegmentDate - CORRECTED CALCULATION', {
        input: {
          tripStartDate: tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString(),
          segmentDay,
          tripStartDateType: typeof tripStartDate
        },
        normalization: {
          originalStartDate: startDate.toISOString(),
          normalizedStartDate: normalizedStartDate.toISOString(),
          daysToAdd: segmentDay - 1
        },
        calculation: {
          baseTime: normalizedStartDate.getTime(),
          finalTime: segmentDate.getTime(),
          timeDifference: segmentDate.getTime() - normalizedStartDate.getTime(),
          expectedDaysDifference: segmentDay - 1
        },
        result: {
          segmentDate: segmentDate.toISOString(),
          isValid: !isNaN(segmentDate.getTime()),
          timezone: 'UTC (normalized)',
          daysDifference: Math.floor((segmentDate.getTime() - normalizedStartDate.getTime()) / (24 * 60 * 60 * 1000))
        }
      });
      
      return isNaN(segmentDate.getTime()) ? null : segmentDate;
    } catch (error) {
      console.error('🔧 FIXED: Error in calculateSegmentDate:', error);
      return null;
    }
  }

  static normalizeSegmentDate(date: Date): Date {
    // FIXED: Normalize to UTC midnight to ensure consistent date handling
    const normalized = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    
    console.log('🔧 FIXED: DateNormalizationService.normalizeSegmentDate', {
      input: date.toISOString(),
      inputComponents: {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth(),
        date: date.getUTCDate()
      },
      output: normalized.toISOString(),
      timezone: 'UTC (normalized)'
    });
    
    return normalized;
  }

  static getDaysDifference(date1: Date, date2: Date): number {
    // FIXED: Use UTC dates for consistent calculation
    const utc1 = Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate());
    const utc2 = Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysDiff = Math.floor((utc2 - utc1) / msPerDay);
    
    console.log('🔧 FIXED: DateNormalizationService.getDaysDifference', {
      date1: date1.toISOString(),
      date2: date2.toISOString(),
      utc1: new Date(utc1).toISOString(),
      utc2: new Date(utc2).toISOString(),
      utc1Ms: utc1,
      utc2Ms: utc2,
      differenceMs: utc2 - utc1,
      daysDifference: daysDiff
    });
    
    return daysDiff;
  }

  static toDateString(date: Date): string {
    // FIXED: Use UTC date for string conversion
    const dateString = date.toISOString().split('T')[0];
    
    console.log('🔧 FIXED: DateNormalizationService.toDateString', {
      input: date.toISOString(),
      output: dateString
    });
    
    return dateString;
  }
}
