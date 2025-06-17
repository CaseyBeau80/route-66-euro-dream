
import { TripStop } from '../../types/TripStop';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationScoring } from './DestinationScoring';
import { GeographicProgression } from './GeographicProgression';
import { IntermediateDestinationFinder } from './IntermediateDestinationFinder';

export class DestinationSelectionByDriveTime {
  /**
   * Find best destination within drive time constraints with massive destination city preference
   */
  static findBestDestinationByDriveTime(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    avgSpeedMph: number = 50
  ): TripStop | null {
    return DestinationScoring.findBestDestinationByDriveTime(
      currentStop,
      availableStops,
      driveTimeTarget,
      avgSpeedMph
    );
  }

  /**
   * Validate geographic progression to ensure we're moving toward the destination
   */
  static validateGeographicProgression(
    currentStop: TripStop,
    candidateStop: TripStop,
    finalDestination: TripStop
  ): boolean {
    return GeographicProgression.validateGeographicProgression(
      currentStop,
      candidateStop,
      finalDestination
    );
  }

  /**
   * Find intermediate destinations to balance drive times
   */
  static findIntermediateDestinations(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    return IntermediateDestinationFinder.findIntermediateDestinations(
      startStop,
      endStop,
      availableStops,
      totalDays
    );
  }
}
