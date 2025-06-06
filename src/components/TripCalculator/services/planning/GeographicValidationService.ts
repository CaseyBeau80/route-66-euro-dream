
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class GeographicValidationService {
  /**
   * Validate geographic progression toward final destination
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
    const isProgressing = candidateToFinal < currentToFinal;
    
    if (!isProgressing) {
      console.log(`⚠️ ${candidateStop.name} rejected - not progressing toward destination`);
    }
    
    return isProgressing;
  }
}
