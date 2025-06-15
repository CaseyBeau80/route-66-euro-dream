
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class GeographicValidationService {
  /**
   * Validate geographic progression toward final destination with enhanced null safety
   */
  static validateGeographicProgression(
    currentStop: TripStop,
    candidateStop: TripStop,
    finalDestination: TripStop
  ): boolean {
    // Add comprehensive null safety checks
    if (!currentStop || !candidateStop || !finalDestination) {
      console.log('⚠️ Null safety check failed in validateGeographicProgression:', {
        currentStop: !!currentStop,
        candidateStop: !!candidateStop,
        finalDestination: !!finalDestination
      });
      return false;
    }

    // Check if all required properties exist
    if (typeof currentStop.latitude !== 'number' || typeof currentStop.longitude !== 'number' ||
        typeof candidateStop.latitude !== 'number' || typeof candidateStop.longitude !== 'number' ||
        typeof finalDestination.latitude !== 'number' || typeof finalDestination.longitude !== 'number') {
      console.log('⚠️ Invalid coordinates in validateGeographicProgression:', {
        currentStop: { lat: currentStop.latitude, lng: currentStop.longitude },
        candidateStop: { lat: candidateStop.latitude, lng: candidateStop.longitude },
        finalDestination: { lat: finalDestination.latitude, lng: finalDestination.longitude }
      });
      return false;
    }

    try {
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
        console.log(`⚠️ ${candidateStop.name} rejected - not progressing toward destination (${candidateToFinal.toFixed(1)}mi vs ${currentToFinal.toFixed(1)}mi)`);
      }
      
      return isProgressing;
    } catch (error) {
      console.log('⚠️ Error in validateGeographicProgression:', error);
      return false;
    }
  }
}
