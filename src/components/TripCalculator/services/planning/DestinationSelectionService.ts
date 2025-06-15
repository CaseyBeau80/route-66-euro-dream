
import { TripStop } from '../../types/TripStop';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationOptimizationService } from './DestinationOptimizationService';

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
    return DestinationOptimizationService.selectNextDayDestination(
      currentStop,
      finalDestination,
      availableStops,
      remainingDays,
      driveTimeTarget
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
    return DestinationOptimizationService.selectOptimalDayDestination(
      currentStop,
      finalDestination,
      availableStops,
      targetDistance,
      driveTimeTarget
    );
  }
}
