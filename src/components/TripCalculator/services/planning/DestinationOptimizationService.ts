
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationPriorityService } from './DestinationPriorityService';
import { DistanceBasedDestinationService } from './DistanceBasedDestinationService';

export class DestinationOptimizationService {
  /**
   * Enhanced next day destination selection with proper Route 66 geographic progression
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

    // Filter stops that are in the correct direction toward the final destination
    const properDirectionStops = this.filterStopsInCorrectDirection(
      currentStop,
      finalDestination,
      availableStops
    );

    console.log(`🧭 Filtered ${properDirectionStops.length} stops in correct direction from ${availableStops.length} total`);

    // If we have a drive time target, use the balanced approach with geographic validation
    if (driveTimeTarget && properDirectionStops.length > 0) {
      const balancedDestination = DestinationPriorityService.selectDestinationWithPriority(
        currentStop,
        properDirectionStops,
        driveTimeTarget
      );
      
      if (balancedDestination) {
        console.log(`✅ Selected destination with geographic validation: ${balancedDestination.name}`);
        return balancedDestination;
      }
    }

    // Fallback to distance-based selection with geographic constraints
    const totalRemainingDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    const targetDailyDistance = totalRemainingDistance / remainingDays;

    return DistanceBasedDestinationService.selectDestinationByDistance(
      currentStop, 
      finalDestination, 
      properDirectionStops.length > 0 ? properDirectionStops : availableStops, 
      targetDailyDistance
    );
  }

  /**
   * Filter stops that are geographically progressing toward the final destination
   */
  private static filterStopsInCorrectDirection(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[]
  ): TripStop[] {
    const currentToFinalDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    return availableStops.filter(stop => {
      // Distance from current stop to this potential stop
      const currentToStopDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      // Distance from this potential stop to final destination
      const stopToFinalDistance = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        finalDestination.latitude, finalDestination.longitude
      );

      // The stop should be closer to the final destination than the current stop
      // and should be making progress (not going backwards)
      const makingProgress = stopToFinalDistance < currentToFinalDistance;
      
      // Also check that we're not making too little progress (avoiding very short hops)
      const minimumProgress = currentToStopDistance >= 50; // At least 50 miles
      
      // Maximum reasonable daily distance
      const maximumProgress = currentToStopDistance <= 500; // No more than 500 miles

      const isValidDirection = makingProgress && minimumProgress && maximumProgress;

      if (!isValidDirection) {
        console.log(`🚫 Filtering out ${stop.name}: progress=${makingProgress}, minDist=${minimumProgress}, maxDist=${maximumProgress}`);
      }

      return isValidDirection;
    });
  }

  /**
   * Select optimal destination for a day with geographic validation
   */
  static selectOptimalDayDestination(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    targetDistance: number,
    driveTimeTarget?: DriveTimeTarget
  ): TripStop {
    if (availableStops.length === 0) return finalDestination;

    // First filter by geographic direction
    const directionValidStops = this.filterStopsInCorrectDirection(
      currentStop,
      finalDestination,
      availableStops
    );

    const candidateStops = directionValidStops.length > 0 ? directionValidStops : availableStops;

    // Try drive time balanced selection with destination city priority first
    if (driveTimeTarget) {
      const balancedDestination = DestinationPriorityService.selectDestinationWithPriority(
        currentStop,
        candidateStops,
        driveTimeTarget
      );
      
      if (balancedDestination) {
        return balancedDestination;
      }
    }

    // Fallback to distance-based selection with destination city priority
    return DistanceBasedDestinationService.selectDestinationByDistance(
      currentStop, 
      finalDestination, 
      candidateStops, 
      targetDistance
    );
  }
}
