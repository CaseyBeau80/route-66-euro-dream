
import { TripStop } from '../data/SupabaseDataService';
import { DriveTimeConstraints, DriveTimeTarget } from './DriveTimeConstraints';
import { DriveTimeTargetCalculator } from './DriveTimeTargetCalculator';
import { DestinationSelectionByDriveTime } from './DestinationSelectionByDriveTime';
import { DriveTimeCategoryService } from './DriveTimeCategoryService';

// Re-export types and constraints for backward compatibility
export type { DriveTimeConstraints, DriveTimeTarget };

export class DriveTimeBalancingService {
  /**
   * Calculate balanced drive time targets for trip days
   */
  static calculateDriveTimeTargets(
    totalDistance: number,
    totalDays: number,
    avgSpeedMph: number = 50
  ): DriveTimeTarget[] {
    return DriveTimeTargetCalculator.calculateDriveTimeTargets(totalDistance, totalDays, avgSpeedMph);
  }

  /**
   * Find best destination within drive time constraints with strong destination city preference
   */
  static findBestDestinationByDriveTime(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    avgSpeedMph: number = 50
  ): TripStop | null {
    return DestinationSelectionByDriveTime.findBestDestinationByDriveTime(
      currentStop,
      availableStops,
      driveTimeTarget,
      avgSpeedMph
    );
  }

  /**
   * Validate and adjust trip for balanced drive times
   */
  static validateDriveTimeBalance(
    segments: Array<{ distance: number; driveTimeHours: number }>,
    targets: DriveTimeTarget[]
  ): {
    isBalanced: boolean;
    issues: string[];
    suggestions: string[];
  } {
    return DriveTimeConstraints.validateDriveTimeBalance(segments, targets);
  }

  static getDriveTimeCategory(driveTimeHours: number): {
    category: 'short' | 'optimal' | 'long' | 'extreme';
    message: string;
    color: string;
  } {
    return DriveTimeCategoryService.getDriveTimeCategory(driveTimeHours);
  }
}
