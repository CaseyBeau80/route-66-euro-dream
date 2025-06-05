
import { TripStop } from '../data/SupabaseDataService';
import { RouteProgressCalculator } from './RouteProgressCalculator';
import { CityDisplayService } from '../utils/CityDisplayService';
import { DailySegment } from './DailySegmentCreator';

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
    cumulativeDistance: number;
    progressPercent: number;
    routeSection: string;
  } {
    // Calculate accurate cumulative distance for route section
    const previousSegments = dailySegments.map(s => ({ approximateMiles: s.approximateMiles }));
    const cumulativeDistance = RouteProgressCalculator.calculateAccurateCumulativeDistance(
      day - 1, 
      [...previousSegments, { approximateMiles: Math.round(segmentDistance) }]
    );
    
    const progressPercent = RouteProgressCalculator.calculateCumulativeProgress(
      cumulativeDistance, 
      totalDistance
    );
    const routeSection = RouteProgressCalculator.getRouteSection(progressPercent);

    return {
      cumulativeDistance,
      progressPercent,
      routeSection
    };
  }

  /**
   * Create city display names for segment
   */
  static createCityDisplays(currentStop: TripStop, dayDestination: TripStop): {
    startCityDisplay: string;
    endCityDisplay: string;
  } {
    const startCityDisplay = CityDisplayService.getCityDisplayName(currentStop);
    const endCityDisplay = CityDisplayService.getCityDisplayName(dayDestination);

    return {
      startCityDisplay,
      endCityDisplay
    };
  }

  /**
   * Validate segment creation
   */
  static validateSegment(
    currentStop: TripStop,
    dayDestination: TripStop,
    day: number,
    isLastDay: boolean
  ): boolean {
    // Validate destination
    if (!dayDestination || currentStop.id === dayDestination.id) {
      console.warn(`⚠️ Invalid destination for day ${day}`);
      return false;
    }
    return true;
  }
}
