
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class RouteCandidateFilter {
  /**
   * Filter stops that are reasonable candidates along the route
   */
  static getRouteCandidates(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: any[], // Changed from TripStop[] to any[] to match EnhancedDestinationSelector
    segmentDistance: number
  ): TripStop[] {
    const maxDetourDistance = Math.min(segmentDistance * 0.3, 100); // Max 30% detour or 100 miles
    
    return availableStops.filter(stop => {
      // Validate that stop is a valid TripStop before processing
      if (!stop || typeof stop !== 'object' || 
          typeof stop.latitude !== 'number' || 
          typeof stop.longitude !== 'number') {
        return false;
      }
      
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
