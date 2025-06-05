import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { RouteStopSelectionService } from './RouteStopSelectionService';
import { StopEnhancementService } from './StopEnhancementService';
import { DailySegmentCreator, DailySegment, SubStopTiming } from './DailySegmentCreator';

// Re-export types for backward compatibility
export type { DailySegment, SubStopTiming };

export interface TripPlan {
  title: string;
  startCityImage?: string;
  endCityImage?: string;
  totalDays: number;
  totalMiles: number;
  dailySegments: DailySegment[];
  wasAdjusted?: boolean;
  originalDays?: number;
}

export class TripPlanBuilder {
  /**
   * Build a complete trip plan with enhanced segmentation and destination city prioritization
   */
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    startCityName: string,
    endCityName: string
  ): TripPlan {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance} miles`);

    // Smart trip day calculation with conservative limits
    const optimalDays = StopEnhancementService.calculateOptimalTripDays(totalDistance, requestedDays);
    const wasAdjusted = optimalDays !== requestedDays;
    
    if (wasAdjusted) {
      console.log(`🔄 Adjusted trip from ${requestedDays} to ${optimalDays} days for comfortable daily distances`);
    }

    // Get and enhance stops along the route with destination city priority
    const routeStops = RouteStopSelectionService.getStopsAlongRoute(startStop, endStop, allStops);
    const enhancedStops = StopEnhancementService.ensureGeographicDiversity(startStop, endStop, routeStops);
    
    console.log(`🛤️ Enhanced route: ${enhancedStops.length} diverse stops selected with destination city priority`);

    // Plan daily segments with smart distribution and destination city targeting
    const dailySegments = DailySegmentCreator.createSmartDailySegments(
      startStop,
      endStop,
      enhancedStops,
      optimalDays,
      totalDistance
    );

    const tripTitle = CityDisplayService.createTripTitle(startStop, endStop);

    return {
      title: tripTitle,
      startCityImage: startStop.image_url,
      endCityImage: endStop.image_url,
      totalDays: optimalDays,
      totalMiles: Math.round(totalDistance),
      dailySegments,
      wasAdjusted,
      originalDays: wasAdjusted ? requestedDays : undefined
    };
  }
}
