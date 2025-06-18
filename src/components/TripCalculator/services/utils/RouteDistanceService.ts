
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from './DistanceCalculationService';

export class RouteDistanceService {
  /**
   * Find stops that lie along the route between start and end stops
   */
  static getStopsAlongRoute(
    startStop: TripStop,
    endStop: TripStop,
    candidateStops: TripStop[]
  ): TripStop[] {
    if (!startStop || !endStop || !candidateStops || candidateStops.length === 0) {
      console.log('⚠️ Invalid parameters for route stops calculation');
      return [];
    }

    console.log(`🛤️ Finding stops along route from ${startStop.name} to ${endStop.name}`);

    // Calculate the direct distance between start and end
    const directDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    if (directDistance === 0) {
      console.warn('⚠️ Zero distance between start and end stops');
      return [];
    }

    // Find stops that are roughly along the route
    const routeStops: Array<{ stop: TripStop; deviation: number; distanceFromStart: number }> = [];

    for (const stop of candidateStops) {
      if (!this.hasValidCoordinates(stop)) {
        continue;
      }

      // Calculate distance from start to candidate stop
      const distanceToCandidate = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        stop.latitude,
        stop.longitude
      );

      // Calculate distance from candidate stop to end
      const distanceFromCandidate = DistanceCalculationService.calculateDistance(
        stop.latitude,
        stop.longitude,
        endStop.latitude,
        endStop.longitude
      );

      // Calculate total distance via this stop
      const totalViaStop = distanceToCandidate + distanceFromCandidate;

      // Calculate deviation from direct route (how much extra distance)
      const deviation = totalViaStop - directDistance;

      // Only include stops that don't add too much extra distance (within 20% of direct route)
      const maxDeviation = directDistance * 0.2;
      
      if (deviation <= maxDeviation && distanceToCandidate > 10 && distanceFromCandidate > 10) {
        routeStops.push({
          stop,
          deviation,
          distanceFromStart: distanceToCandidate
        });
      }
    }

    // Sort by distance from start stop
    routeStops.sort((a, b) => a.distanceFromStart - b.distanceFromStart);

    // Return just the stops, not the metadata
    const selectedStops = routeStops.map(item => item.stop);

    console.log(`🛤️ Found ${selectedStops.length} stops along route with acceptable deviation`);
    
    return selectedStops;
  }

  /**
   * Check if a stop has valid coordinates
   */
  private static hasValidCoordinates(stop: any): stop is TripStop {
    return stop && 
           typeof stop === 'object' &&
           stop.id &&
           stop.name &&
           typeof stop.latitude === 'number' &&
           typeof stop.longitude === 'number' &&
           !isNaN(stop.latitude) &&
           !isNaN(stop.longitude) &&
           stop.latitude !== 0 &&
           stop.longitude !== 0;
  }
}
