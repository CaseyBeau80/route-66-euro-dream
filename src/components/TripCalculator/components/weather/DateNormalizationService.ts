
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

  static toDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
