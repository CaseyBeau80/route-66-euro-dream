
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

      // Calculate the segment date by adding (segmentDay - 1) days to the start date
      const segmentDate = new Date(startDate);
      segmentDate.setDate(startDate.getDate() + (segmentDay - 1));
      
      return isNaN(segmentDate.getTime()) ? null : segmentDate;
    } catch (error) {
      console.error('Error calculating segment date:', error);
      return null;
    }
  }

  static normalizeSegmentDate(date: Date): Date {
    // Normalize to UTC midnight to ensure consistent date handling
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }

  static getDaysDifference(date1: Date, date2: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc2 - utc1) / msPerDay);
  }

  static toDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
