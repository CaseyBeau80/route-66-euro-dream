
import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './TripPlanBuilder';

export class SegmentValidationHelper {
  static filterRemainingStops(
    allStops: TripStop[],
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[]
  ): TripStop[] {
    const usedStopIds = new Set([
      startStop.id,
      endStop.id,
      ...destinations.map(d => d.id)
    ]);
    
    return allStops.filter(stop => !usedStopIds.has(stop.id));
  }

  static validateSegmentCount(segments: DailySegment[], expectedDays: number): void {
    if (segments.length !== expectedDays) {
      console.warn(`⚠️ Segment count mismatch: expected ${expectedDays}, got ${segments.length}`);
    }
  }
}
