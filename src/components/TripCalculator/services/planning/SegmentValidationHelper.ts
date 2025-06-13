import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './TripPlanBuilder';

export class SegmentValidationHelper {
  /**
   * Validate we have the correct number of segments
   */
  static validateSegmentCount(dailySegments: DailySegment[], expectedDays: number): void {
    if (dailySegments.length !== expectedDays) {
      console.error(`❌ Expected ${expectedDays} segments, but created ${dailySegments.length}`);
    }
  }

  /**
   * Validate destination for segment creation
   */
  static validateDestination(
    currentStop: TripStop,
    dayDestination: TripStop,
    day: number
  ): boolean {
    if (!dayDestination || currentStop.id === dayDestination.id) {
      console.warn(`⚠️ Invalid destination for day ${day}`);
      return false;
    }
    return true;
  }

  /**
   * Filter remaining stops to prevent duplication
   */
  static filterRemainingStops(
    allStops: TripStop[],
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[]
  ): TripStop[] {
    return allStops.filter(stop => 
      stop.id !== startStop.id && 
      stop.id !== endStop.id &&
      !destinations.some(dest => dest.id === stop.id)
    );
  }
}
