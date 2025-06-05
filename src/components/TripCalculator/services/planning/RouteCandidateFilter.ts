
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class RouteCandidateFilter {
  /**
   * Filter stops that are reasonable candidates along the route
   */
  static getRouteCandidates(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    segmentDistance: number
  ): TripStop[] {
    const maxDetourDistance = Math.min(segmentDistance * 0.3, 100); // Max 30% detour or 100 miles
    
    return availableStops.filter(stop => {
      // Calculate distance from start to stop
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      
      // Calculate distance from stop to end
      const distanceToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // Total route distance if we visit this stop
      const totalWithStop = distanceFromStart + distanceToEnd;
      
      // Check if this is a reasonable detour
      const detour = totalWithStop - segmentDistance;
      
      return detour <= maxDetourDistance;
    });
  }
}
