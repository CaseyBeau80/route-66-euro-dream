
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class RouteStopFilteringService {
  /**
   * Get stops that are along the route with strict destination city prioritization
   */
  static getStopsAlongRoute(startStop: TripStop, endStop: TripStop, allStops: TripStop[], maxStops: number = 40): TripStop[] {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude, 
      endStop.latitude, endStop.longitude
    );

    // Filter stops that are roughly between start and end points
    const routeStops = allStops.filter(stop => {
      // Skip start and end stops
      if (stop.id === startStop.id || stop.id === endStop.id) {
        return false;
      }

      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        stop.latitude, stop.longitude
      );
      const distanceFromEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude, 
        endStop.latitude, endStop.longitude
      );
      
      // Much more lenient tolerance for destination cities
      const isDestinationCity = stop.category === 'destination_city';
      const tolerance = isDestinationCity ? 1.8 : (totalDistance > 1000 ? 1.4 : 1.3);
      const isOnRoute = distanceFromStart + distanceFromEnd <= totalDistance * tolerance;
      
      // Very small minimum distance for destination cities
      const minDistance = isDestinationCity ? 3 : 8;
      const farEnoughFromStart = distanceFromStart >= minDistance;
      const farEnoughFromEnd = distanceFromEnd >= minDistance;
      
      return isOnRoute && farEnoughFromStart && farEnoughFromEnd;
    });

    console.log(`🛤️ Route stops: ${routeStops.length} stops found along ${Math.round(totalDistance)}mi route`);
    return routeStops.slice(0, maxStops);
  }

  /**
   * Find stops between start and end for a specific segment
   */
  static getSegmentStops(
    startStop: TripStop, 
    endStop: TripStop, 
    availableStops: TripStop[]
  ): TripStop[] {
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    return availableStops.filter(stop => {
      const distFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        stop.latitude, stop.longitude
      );
      const distFromEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude, 
        endStop.latitude, endStop.longitude
      );
      
      // Very lenient tolerance for destination cities
      const isDestinationCity = stop.category === 'destination_city';
      const tolerance = isDestinationCity ? 1.5 : (segmentDistance > 500 ? 1.3 : 1.2);
      const isInSegment = distFromStart + distFromEnd <= segmentDistance * tolerance;
      
      // Very small minimum distance for destination cities
      const minDistance = isDestinationCity ? 3 : 8;
      const farEnoughFromStart = distFromStart >= minDistance;
      const farEnoughFromEnd = distFromEnd >= minDistance;
      
      return isInSegment && farEnoughFromStart && farEnoughFromEnd;
    });
  }
}
