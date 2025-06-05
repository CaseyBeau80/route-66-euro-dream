
import { TripStop } from '../data/SupabaseDataService';
import { RouteStopSelectionService } from './RouteStopSelectionService';

export class SegmentStopSelector {
  /**
   * Select appropriate stops for a segment with drive time consideration
   */
  static selectStopsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    maxStops: number,
    driveTimeHours?: number
  ): TripStop[] {
    return RouteStopSelectionService.selectStopsForSegment(
      startStop, 
      endStop, 
      availableStops, 
      maxStops, 
      driveTimeHours
    );
  }
}
