
import { DailySegment } from './TripPlanTypes';

export class SegmentEnrichmentService {
  static async enrichSegments(segments: DailySegment[]): Promise<DailySegment[]> {
    // Basic enrichment - return segments as-is for now
    return segments.map(segment => ({
      ...segment,
      isEnriched: true,
      enrichmentTimestamp: new Date()
    }));
  }

  static validateEnrichment(segment: DailySegment): boolean {
    return segment && segment.endCity && segment.distance > 0;
  }
}
