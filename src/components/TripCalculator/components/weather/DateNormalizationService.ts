
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

      // PLAN IMPLEMENTATION: Normalize the trip start date to local midnight first
      const normalizedStartDate = this.normalizeSegmentDate(startDate);
      
      // PLAN IMPLEMENTATION: Calculate the segment date by adding (segmentDay - 1) days using local date arithmetic
      const segmentDate = new Date(normalizedStartDate);
      segmentDate.setDate(normalizedStartDate.getDate() + (segmentDay - 1));
      
      // PLAN IMPLEMENTATION: Enhanced debug output for local date calculation
      console.log('🔧 PLAN: DateNormalizationService.calculateSegmentDate - LOCAL DATE CALCULATION', {
        input: {
          tripStartDate: tripStartDate instanceof Date ? tripStartDate.toISOString() : tripStartDate.toString(),
          segmentDay,
          tripStartDateType: typeof tripStartDate
        },
        normalization: {
          originalStartDate: startDate.toISOString(),
          normalizedStartDate: normalizedStartDate.toISOString(),
          daysToAdd: segmentDay - 1,
          calculationMethod: 'LOCAL_DATE_ARITHMETIC'
        },
        calculation: {
          baseTime: normalizedStartDate.getTime(),
          finalTime: segmentDate.getTime(),
          timeDifference: segmentDate.getTime() - normalizedStartDate.getTime(),
          expectedDaysDifference: segmentDay - 1,
          localDateUsed: true
        },
        result: {
          segmentDate: segmentDate.toISOString(),
          localSegmentDate: segmentDate.toLocaleDateString(),
          isValid: !isNaN(segmentDate.getTime()),
          timezone: 'LOCAL (normalized to midnight)',
          daysDifference: Math.floor((segmentDate.getTime() - normalizedStartDate.getTime()) / (24 * 60 * 60 * 1000))
        }
      });
      
      return isNaN(segmentDate.getTime()) ? null : segmentDate;
    } catch (error) {
      console.error('🔧 PLAN: Error in calculateSegmentDate:', error);
      return null;
    }
  }

  static normalizeSegmentDate(date: Date): Date {
    // PLAN IMPLEMENTATION: Normalize to LOCAL midnight instead of UTC
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    console.log('🔧 PLAN: DateNormalizationService.normalizeSegmentDate - LOCAL MIDNIGHT NORMALIZATION', {
      input: date.toISOString(),
      inputLocal: date.toLocaleDateString(),
      inputComponents: {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
        timezone: date.getTimezoneOffset()
      },
      output: normalized.toISOString(),
      outputLocal: normalized.toLocaleDateString(),
      timezone: 'LOCAL (midnight)',
      normalizationMethod: 'LOCAL_MIDNIGHT_NOT_UTC'
    });
    
    return normalized;
  }

  static getDaysDifference(date1: Date, date2: Date): number {
    // PLAN IMPLEMENTATION: Use LOCAL dates for consistent calculation
    const local1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const local2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysDiff = Math.floor((local2.getTime() - local1.getTime()) / msPerDay);
    
    console.log('🔧 PLAN: DateNormalizationService.getDaysDifference - LOCAL DATE CALCULATION', {
      date1: date1.toISOString(),
      date2: date2.toISOString(),
      date1Local: date1.toLocaleDateString(),
      date2Local: date2.toLocaleDateString(),
      local1: local1.toISOString(),
      local2: local2.toISOString(),
      local1Ms: local1.getTime(),
      local2Ms: local2.getTime(),
      differenceMs: local2.getTime() - local1.getTime(),
      daysDifference: daysDiff,
      calculationMethod: 'LOCAL_DATE_ARITHMETIC'
    });
    
    return daysDiff;
  }

  static toDateString(date: Date): string {
    // PLAN IMPLEMENTATION: Use LOCAL date for string conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    console.log('🔧 PLAN: DateNormalizationService.toDateString - LOCAL DATE STRING', {
      input: date.toISOString(),
      inputLocal: date.toLocaleDateString(),
      output: dateString,
      components: { year, month, day },
      conversionMethod: 'LOCAL_DATE_COMPONENTS'
    });
    
    return dateString;
  }
}
