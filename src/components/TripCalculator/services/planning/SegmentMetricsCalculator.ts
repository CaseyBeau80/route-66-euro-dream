
import { TripStop } from '../data/SupabaseDataService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DailySegment } from './TripPlanBuilder';

export class SegmentMetricsCalculator {
  /**
   * Calculate route progression metrics for a segment
   */
  static calculateRouteMetrics(
    day: number,
    segmentDistance: number,
    totalDistance: number,
    dailySegments: DailySegment[]
  ): {
    routeSection: string;
  } {
    // Calculate cumulative distance up to this segment
    const cumulativeDistance = dailySegments.reduce((total, segment) => total + segment.approximateMiles, 0) + segmentDistance;
    const progressPercentage = (cumulativeDistance / totalDistance) * 100;

    let routeSection: string;
    if (progressPercentage <= 33) {
      routeSection = 'Early Route';
    } else if (progressPercentage <= 66) {
      routeSection = 'Mid Route';
    } else {
      routeSection = 'Final Stretch';
    }

    return { routeSection };
  }

  /**
   * Create properly formatted city display names with state information
   */
  static createCityDisplays(
    startStop: TripStop,
    endStop: TripStop
  ): {
    startCityDisplay: string;
    endCityDisplay: string;
  } {
    const startCityDisplay = CityDisplayService.getCityDisplayName(startStop);
    const endCityDisplay = CityDisplayService.getCityDisplayName(endStop);

    return {
      startCityDisplay,
      endCityDisplay
    };
  }
}
