
import { TripStop } from '../data/SupabaseDataService';
import { TripPlanFactory, TripPlan } from './TripPlanFactory';
import { DailySegment, SegmentTiming } from './DailySegmentCreator';

// Re-export types for backward compatibility
export type { TripPlan, DailySegment, SegmentTiming };

export class TripPlanBuilder {
  /**
   * Build a complete trip plan with enhanced drive time balancing
   */
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): TripPlan {
    return TripPlanFactory.createTripPlan(
      startStop,
      endStop,
      allStops,
      requestedDays,
      inputStartCity,
      inputEndCity
    );
  }
}
