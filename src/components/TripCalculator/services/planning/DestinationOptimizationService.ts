
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationPriorityService } from './DestinationPriorityService';
import { DistanceBasedDestinationService } from './DistanceBasedDestinationService';

export class DestinationOptimizationService {
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

    // If we have a drive time target, use the balanced approach with destination city priority
    if (driveTimeTarget) {
      const balancedDestination = DestinationPriorityService.selectDestinationWithPriority(
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

    return DistanceBasedDestinationService.selectDestinationByDistance(
      currentStop, 
      finalDestination, 
      availableStops, 
      targetDailyDistance
    );
  }

  /**
   * Select optimal destination for a day with drive time preference and destination city priority
   */
  static selectOptimalDayDestination(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    targetDistance: number,
    driveTimeTarget?: DriveTimeTarget
  ): TripStop {
    if (availableStops.length === 0) return finalDestination;

    // Try drive time balanced selection with destination city priority first
    if (driveTimeTarget) {
      const balancedDestination = DestinationPriorityService.selectDestinationWithPriority(
        currentStop,
        availableStops,
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
      availableStops, 
      targetDistance
    );
  }
}
