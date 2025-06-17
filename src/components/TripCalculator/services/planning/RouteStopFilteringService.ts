
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class RouteStopFilteringService {
  /**
   * Get destination cities that are along the route with strict filtering
   */
  static getStopsAlongRoute(startStop: TripStop, endStop: TripStop, allStops: TripStop[], maxStops: number = 40): TripStop[] {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude, 
      endStop.latitude, endStop.longitude
    );

    // CRITICAL: Only use destination cities as stops
    const destinationCities = allStops.filter(stop => {
      // Skip start and end stops
      if (stop.id === startStop.id || stop.id === endStop.id) {
        return false;
      }

      // ENFORCE: Only destination cities allowed
      if (stop.category !== 'destination_city') {
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
      
      // Generous tolerance for destination cities since they're the only allowed stops
      const tolerance = 1.8;
      const isOnRoute = distanceFromStart + distanceFromEnd <= totalDistance * tolerance;
      
      // Small minimum distance for proper spacing
      const minDistance = 10;
      const farEnoughFromStart = distanceFromStart >= minDistance;
      const farEnoughFromEnd = distanceFromEnd >= minDistance;
      
      return isOnRoute && farEnoughFromStart && farEnoughFromEnd;
    });

    console.log(`🛤️ Route destination cities: ${destinationCities.length} cities found along ${Math.round(totalDistance)}mi route`);
    console.log(`🏛️ Destination cities: ${destinationCities.map(c => c.name).join(', ')}`);
    
    return destinationCities.slice(0, maxStops);
  }

  /**
   * Find destination cities between start and end for a specific segment
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

    // ENFORCE: Only destination cities
    return availableStops.filter(stop => {
      // Only destination cities allowed
      if (stop.category !== 'destination_city') {
        return false;
      }

      const distFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        stop.latitude, stop.longitude
      );
      const distFromEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude, 
        endStop.latitude, endStop.longitude
      );
      
      // Generous tolerance for destination cities
      const tolerance = 1.5;
      const isInSegment = distFromStart + distFromEnd <= segmentDistance * tolerance;
      
      // Minimum distance for proper spacing
      const minDistance = 10;
      const farEnoughFromStart = distFromStart >= minDistance;
      const farEnoughFromEnd = distFromEnd >= minDistance;
      
      return isInSegment && farEnoughFromStart && farEnoughFromEnd;
    });
  }
}
