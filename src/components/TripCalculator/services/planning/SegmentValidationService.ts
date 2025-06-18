
import { DailySegment } from './TripPlanTypes';

export class SegmentValidationService {
  static isValidSegment(segment: DailySegment): boolean {
    return segment && segment.startCity && segment.endCity && segment.distance > 0;
  }

  static validateSegments(segments: DailySegment[]): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];
    
    segments.forEach((segment, index) => {
      if (!this.isValidSegment(segment)) {
        violations.push(`Invalid segment at day ${index + 1}`);
      }
    });

    return {
      isValid: violations.length === 0,
      violations
    };
  }
}
