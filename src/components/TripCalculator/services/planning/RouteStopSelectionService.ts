
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class RouteStopSelectionService {
  /**
   * Get stops that are roughly along the route between start and end points
   */
  static getStopsAlongRoute(startStop: TripStop, endStop: TripStop, allStops: TripStop[], maxStops: number = 50): TripStop[] {
    // Filter stops that are roughly between start and end points
    const routeStops = allStops.filter(stop => {
      const distanceFromStart = DistanceCalculationService.calculateDistance(startStop.latitude, startStop.longitude, stop.latitude, stop.longitude);
      const distanceFromEnd = DistanceCalculationService.calculateDistance(stop.latitude, stop.longitude, endStop.latitude, endStop.longitude);
      const totalDistance = DistanceCalculationService.calculateDistance(startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude);
      
      // Stop should be roughly on the path (within reasonable deviation)
      return distanceFromStart + distanceFromEnd <= totalDistance * 1.3 && 
             distanceFromStart > 0 && 
             distanceFromEnd > 0;
    });

    // Sort by distance from start point
    routeStops.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(startStop.latitude, startStop.longitude, a.latitude, a.longitude);
      const distB = DistanceCalculationService.calculateDistance(startStop.latitude, startStop.longitude, b.latitude, b.longitude);
      return distA - distB;
    });

    return routeStops.slice(0, maxStops);
  }

  /**
   * Select the best next day destination based on distance and importance
   */
  static selectNextDayDestination(currentStop: TripStop, finalDestination: TripStop, availableStops: TripStop[], remainingDays: number): TripStop {
    const totalRemainingDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    const targetDailyDistance = totalRemainingDistance / remainingDays;

    // Find the stop closest to our target daily distance
    let bestStop = availableStops[0] || finalDestination;
    let bestScore = Number.MAX_VALUE;

    for (const stop of availableStops) {
      const distanceFromCurrent = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      const distanceToFinal = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        finalDestination.latitude, finalDestination.longitude
      );

      // Prefer stops that are roughly our target distance away and move us toward the destination
      const score = Math.abs(distanceFromCurrent - targetDailyDistance) + (distanceToFinal * 0.1);
      
      // Bonus for major stops
      const majorStopBonus = stop.is_major_stop ? -50 : 0;
      const finalScore = score + majorStopBonus;

      if (finalScore < bestScore) {
        bestScore = finalScore;
        bestStop = stop;
      }
    }

    return bestStop;
  }

  /**
   * Select the best stops for a specific segment of the trip
   */
  static selectStopsForSegment(startStop: TripStop, endStop: TripStop, availableStops: TripStop[], maxStops: number): TripStop[] {
    // Find stops between start and end for this segment
    const candidateStops = availableStops.filter(stop => {
      const distFromStart = DistanceCalculationService.calculateDistance(startStop.latitude, startStop.longitude, stop.latitude, stop.longitude);
      const distFromEnd = DistanceCalculationService.calculateDistance(stop.latitude, stop.longitude, endStop.latitude, endStop.longitude);
      const totalSegmentDist = DistanceCalculationService.calculateDistance(startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude);
      
      // Stop should be roughly between start and end
      return distFromStart + distFromEnd <= totalSegmentDist * 1.2;
    });

    // Prioritize by category and features
    candidateStops.sort((a, b) => {
      const getStopPriority = (stop: TripStop): number => {
        if (stop.category === 'route66_waypoint' && stop.is_major_stop) return 1;
        if (stop.category === 'destination_city') return 2;
        if (stop.category === 'attraction') return 3;
        if (stop.category === 'hidden_gem') return 4;
        return 5;
      };

      return getStopPriority(a) - getStopPriority(b);
    });

    // Select top stops up to maxStops
    return candidateStops.slice(0, maxStops);
  }
}
