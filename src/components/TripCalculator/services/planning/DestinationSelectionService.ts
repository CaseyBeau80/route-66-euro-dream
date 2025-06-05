
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopPrioritizationService } from './StopPrioritizationService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';

export class DestinationSelectionService {
  /**
   * Enhanced next day destination selection with drive time balancing
   */
  static selectNextDayDestination(
    currentStop: TripStop, 
    finalDestination: TripStop, 
    availableStops: TripStop[], 
    remainingDays: number,
    driveTimeTarget?: DriveTimeTarget
  ): TripStop {
    if (availableStops.length === 0 || remainingDays <= 1) {
      return finalDestination;
    }

    // If we have a drive time target, use the balanced approach
    if (driveTimeTarget) {
      const balancedDestination = DriveTimeBalancingService.findBestDestinationByDriveTime(
        currentStop,
        availableStops,
        driveTimeTarget
      );
      
      if (balancedDestination) {
        return balancedDestination;
      }
    }

    // Fallback to distance-based selection
    const totalRemainingDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    const targetDailyDistance = totalRemainingDistance / remainingDays;
    const minDailyDistance = 30;
    const maxDailyDistance = 500;

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

      // Enhanced scoring with massive destination city bonuses
      const distanceScore = Math.abs(distanceFromCurrent - targetDailyDistance);
      const progressScore = distanceToFinal * 0.1;
      
      // Massive bonuses for destination cities
      const destinationCityBonus = stop.category === 'destination_city' ? -500 : 0;
      const majorStopBonus = stop.is_major_stop ? -300 : 0;
      const waypointBonus = stop.category === 'route66_waypoint' ? -100 : 0;

      const finalScore = distanceScore + progressScore + destinationCityBonus + majorStopBonus + waypointBonus;

      if (finalScore < bestScore) {
        bestScore = finalScore;
        bestStop = stop;
      }
    }

    console.log(`🎯 Selected ${bestStop.name} (${bestStop.category}) as next destination`);
    return bestStop;
  }

  /**
   * Select optimal destination for a day with drive time preference
   */
  static selectOptimalDayDestination(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    targetDistance: number,
    driveTimeTarget?: DriveTimeTarget
  ): TripStop {
    if (availableStops.length === 0) return finalDestination;

    // Try drive time balanced selection first
    if (driveTimeTarget) {
      const balancedDestination = DriveTimeBalancingService.findBestDestinationByDriveTime(
        currentStop,
        availableStops,
        driveTimeTarget
      );
      
      if (balancedDestination) {
        return balancedDestination;
      }
    }

    // Fallback to distance-based selection
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
