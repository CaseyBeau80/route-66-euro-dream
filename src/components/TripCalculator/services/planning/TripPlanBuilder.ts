
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { RouteStopSelectionService } from './RouteStopSelectionService';

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  approximateMiles: number;
  recommendedStops: TripStop[];
  driveTimeHours: number;
}

export interface TripPlan {
  title: string;
  startCityImage?: string;
  endCityImage?: string;
  totalDays: number;
  totalMiles: number;
  dailySegments: DailySegment[];
}

export class TripPlanBuilder {
  /**
   * Build a complete trip plan with daily segments
   */
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    tripDays: number,
    startCityName: string,
    endCityName: string
  ): TripPlan {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance} miles`);

    // Get stops along the route
    const routeStops = RouteStopSelectionService.getStopsAlongRoute(startStop, endStop, allStops);
    console.log(`🛤️ Found ${routeStops.length} stops along the route`);

    // Plan daily segments
    const dailySegments: DailySegment[] = [];
    let currentStop = startStop;
    const remainingStops = [...routeStops];

    for (let day = 1; day <= tripDays; day++) {
      const isLastDay = day === tripDays;
      const targetStop = isLastDay ? endStop : RouteStopSelectionService.selectNextDayDestination(currentStop, endStop, remainingStops, tripDays - day + 1);
      
      if (!targetStop) continue;

      // Find recommended stops for this segment
      const segmentStops = RouteStopSelectionService.selectStopsForSegment(currentStop, targetStop, remainingStops, day === 1 ? 2 : 3);
      
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        targetStop.latitude, targetStop.longitude
      );

      console.log(`📅 Day ${day}: ${currentStop.city_name} to ${targetStop.city_name}, ${Math.round(segmentDistance)} miles, ${segmentStops.length} stops`);

      dailySegments.push({
        day,
        title: `Day ${day}: ${currentStop.city_name} to ${targetStop.city_name}`,
        startCity: currentStop.city_name,
        endCity: targetStop.city_name,
        approximateMiles: Math.round(segmentDistance),
        recommendedStops: segmentStops,
        driveTimeHours: Math.round((segmentDistance / 55) * 10) / 10 // Assuming 55 mph average
      });

      // Remove used stops from remaining
      segmentStops.forEach(stop => {
        const index = remainingStops.findIndex(s => s.id === stop.id);
        if (index > -1) remainingStops.splice(index, 1);
      });

      currentStop = targetStop;
    }

    return {
      title: `Route 66 Trip: ${startCityName} to ${endCityName}`,
      startCityImage: startStop.image_url,
      endCityImage: endStop.image_url,
      totalDays: tripDays,
      totalMiles: Math.round(totalDistance),
      dailySegments
    };
  }
}
