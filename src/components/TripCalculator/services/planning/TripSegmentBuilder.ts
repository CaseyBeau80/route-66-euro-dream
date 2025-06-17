import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './TripPlanTypes';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { TripCompletionService } from './TripCompletionService';

export class TripSegmentBuilder {
  static buildSegment(
    startStop: TripStop,
    endStop: TripStop,
    segments: DailySegment[],
    totalDistance: number
  ): DailySegment {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    const cumulativeDistance = segments.reduce((sum, segment) => sum + segment.distance, 0) + distance;

    const routeSection = TripCompletionService.calculateRouteProgression(
      segments.length + 1, // Pass the segment number instead of the array
      totalDistance,
      cumulativeDistance
    );

    const sanitizedSegments = segments.map((segment, index) => 
      TripCompletionService.sanitizeSegment(segment, index)
    );

    return {
      day: segments.length + 1,
      title: `Day ${segments.length + 1}: ${startStop.name} to ${endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance: distance,
      approximateMiles: Math.round(distance),
      driveTimeHours: distance / 60,
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state,
      },
      recommendedStops: [],
      attractions: [],
      routeSection: routeSection,
    };
  }
}
