
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class GeographicProgression {
  /**
   * Validate geographic progression to ensure we're moving toward the destination
   */
  static validateGeographicProgression(
    currentStop: TripStop,
    candidateStop: TripStop,
    finalDestination: TripStop
  ): boolean {
    const currentToFinal = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    const candidateToFinal = DistanceCalculationService.calculateDistance(
      candidateStop.latitude, candidateStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    // Ensure we're getting closer to the final destination
    return candidateToFinal < currentToFinal;
  }
}
