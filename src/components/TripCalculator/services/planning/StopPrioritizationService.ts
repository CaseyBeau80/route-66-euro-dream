
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class StopPrioritizationService {
  /**
   * Prioritization that absolutely favors destination cities
   */
  static prioritizeStopsWithDestinationCitySupremacy(stops: TripStop[], startStop: TripStop): TripStop[] {
    return stops.sort((a, b) => {
      // Priority scoring system with destination city supremacy
      const getPriorityScore = (stop: TripStop): number => {
        let score = 0;
        
        // Destination cities get overwhelming priority
        if (stop.category === 'destination_city') {
          score += 2000;
          if (stop.is_major_stop) score += 1000; // Extra massive boost
        }
        
        // Major waypoints get second priority
        if (stop.category === 'route66_waypoint' && stop.is_major_stop) {
          score += 800;
        }
        
        // Regular waypoints
        if (stop.category === 'route66_waypoint') {
          score += 600;
        }
        
        // Attractions and hidden gems get much lower priority
        if (stop.category === 'attraction') score += 200;
        if (stop.category === 'hidden_gem') score += 100;
        
        return score;
      };

      const priorityA = getPriorityScore(a);
      const priorityB = getPriorityScore(b);
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }
      
      // If same priority, prefer stops closer to start for better route flow
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        b.latitude, b.longitude
      );
      
      return distA - distB;
    });
  }

  /**
   * Calculate priority score for destination selection
   */
  static calculateDestinationScore(
    stop: TripStop,
    currentStop: TripStop,
    targetDistance: number
  ): number {
    const distanceFromCurrent = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      stop.latitude, stop.longitude
    );

    // Score based on how close to target distance
    const distanceScore = Math.abs(distanceFromCurrent - targetDistance);
    
    // Massive bonus for destination cities
    const destinationCityBonus = stop.category === 'destination_city' ? -500 : 0;
    const majorStopBonus = stop.is_major_stop ? -300 : 0;
    const waypointBonus = stop.category === 'route66_waypoint' ? -100 : 0;

    return distanceScore + destinationCityBonus + majorStopBonus + waypointBonus;
  }
}
