
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopPrioritizationService } from './StopPrioritizationService';

export class DistanceBasedDestinationService {
  /**
   * Fallback distance-based selection with geographic validation and destination city priority
   */
  static selectDestinationByDistance(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    targetDistance: number
  ): TripStop {
    const minDailyDistance = 50; // Increased minimum for meaningful progress
    const maxDailyDistance = 500;

    // Calculate current distance to final destination for geographic validation
    const currentToFinalDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    // Separate destination cities from other stops
    const destinationCities = availableStops.filter(stop => 
      stop.category === 'destination_city'
    );
    
    const majorWaypoints = availableStops.filter(stop => 
      stop.category === 'route66_waypoint' && stop.is_major_stop
    );
    
    const otherStops = availableStops.filter(stop => 
      stop.category !== 'destination_city' && 
      !(stop.category === 'route66_waypoint' && stop.is_major_stop)
    );

    let bestStop = availableStops[0] || finalDestination;
    let bestScore = Number.MAX_VALUE;

    // Absolutely prioritize destination cities first
    const candidateStops = destinationCities.length > 0 ? destinationCities : 
                          (majorWaypoints.length > 0 ? majorWaypoints : otherStops);

    for (const stop of candidateStops) {
      const distanceFromCurrent = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      if (distanceFromCurrent < minDailyDistance || distanceFromCurrent > maxDailyDistance) {
        continue;
      }

      const distanceToFinal = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        finalDestination.latitude, finalDestination.longitude
      );

      // CRITICAL: Ensure geographic progression - the stop must be closer to final destination
      const makingProgress = distanceToFinal < currentToFinalDistance;
      if (!makingProgress) {
        console.log(`🚫 Rejecting ${stop.name}: not making geographic progress (${distanceToFinal.toFixed(0)}mi vs ${currentToFinalDistance.toFixed(0)}mi to final)`);
        continue;
      }

      // Enhanced scoring with massive destination city bonuses
      const distanceScore = Math.abs(distanceFromCurrent - targetDistance);
      const progressScore = distanceToFinal * 0.1; // Favor stops closer to final destination
      
      // Massive bonuses for destination cities
      const destinationCityBonus = stop.category === 'destination_city' ? -1000 : 0;
      const majorStopBonus = stop.is_major_stop ? -500 : 0;
      const waypointBonus = stop.category === 'route66_waypoint' ? -200 : 0;

      const finalScore = distanceScore + progressScore + destinationCityBonus + majorStopBonus + waypointBonus;

      if (finalScore < bestScore) {
        bestScore = finalScore;
        bestStop = stop;
      }
    }

    console.log(`🎯 Selected ${bestStop.name} (${bestStop.category}) as destination via distance-based selection with geographic validation`);
    return bestStop;
  }

  /**
   * Enhanced destination selection with comprehensive scoring
   */
  static selectDestinationWithEnhancedScoring(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    targetDistance: number
  ): TripStop {
    if (availableStops.length === 0) return finalDestination;

    // Prioritize destination cities
    const destinationCities = availableStops.filter(stop => 
      stop.category === 'destination_city'
    );
    
    const otherStops = availableStops.filter(stop => 
      stop.category !== 'destination_city'
    );

    let bestStop = availableStops[0];
    let bestScore = Number.MAX_VALUE;

    // Prioritize destination cities
    const candidateStops = destinationCities.length > 0 ? destinationCities : otherStops;

    for (const stop of candidateStops) {
      const distanceFromCurrent = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      // Skip if too close or too far
      if (distanceFromCurrent < 15 || distanceFromCurrent > 600) {
        continue;
      }

      const finalScore = StopPrioritizationService.calculateDestinationScore(stop, currentStop, targetDistance);

      if (finalScore < bestScore) {
        bestScore = finalScore;
        bestStop = stop;
      }
    }

    return bestStop;
  }
}
