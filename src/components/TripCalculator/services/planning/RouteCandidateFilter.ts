
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class RouteCandidateFilter {
  /**
   * Filter stops that are reasonably along the route
   */
  static getRouteCandidates(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    segmentDistance: number
  ): TripStop[] {
    return availableStops.filter(stop => {
      // Skip if it's the start or end stop
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      const startToStop = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      const stopToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // Check if stop is roughly on the route path (allow some detour)
      const totalViaStop = startToStop + stopToEnd;
      const detourFactor = totalViaStop / segmentDistance;
      
      // More lenient filtering for longer segments, stricter for shorter ones
      const maxDetourFactor = segmentDistance > 300 ? 1.2 : 1.15;
      
      return detourFactor <= maxDetourFactor && startToStop < segmentDistance * 0.8;
    });
  }
}
