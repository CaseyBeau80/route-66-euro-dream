
import { DailySegment } from '../TripPlanTypes';

export class DataSanitizationUtils {
  static sanitizeString(value: any, fallback: string | undefined): string | undefined {
    if (fallback === undefined) {
      return typeof value === 'string' && value.trim() ? value.trim() : undefined;
    }
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  }

  static sanitizeNumber(value: any, fallback: number): number {
    const num = Number(value);
    return isNaN(num) ? fallback : Math.max(0, num);
  }

  static sanitizeSegmentField(segment: any, field: string, fallback: any): any {
    return segment && segment[field] !== undefined ? segment[field] : fallback;
  }

  static createDefaultDestination(city?: string, state?: string) {
    return {
      city: this.sanitizeString(city, 'Unknown'),
      state: this.sanitizeString(state, 'Unknown')
    };
  }

  static validateSegmentIntegrity(segment: DailySegment): boolean {
    return !!(
      segment.day && 
      segment.startCity && 
      segment.endCity && 
      !isNaN(segment.distance) && 
      !isNaN(segment.driveTimeHours)
    );
  }
}
