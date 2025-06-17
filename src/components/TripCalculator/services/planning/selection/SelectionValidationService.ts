
import { TripStop } from '../../data/SupabaseDataService';
import { DistanceValidationService } from '../DistanceValidationService';

export class SelectionValidationService {
  /**
   * Validate the final selection to ensure no segments exceed limits
   */
  static validateFinalSelection(
    startStop: TripStop,
    endStop: TripStop,
    selectedDestinations: TripStop[],
    maxDailyDriveHours: number
  ): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];
    const allStops = [startStop, ...selectedDestinations, endStop];

    for (let i = 0; i < allStops.length - 1; i++) {
      const currentStop = allStops[i];
      const nextStop = allStops[i + 1];
      
      const validation = DistanceValidationService.validateSegmentDistance(
        currentStop, nextStop, maxDailyDriveHours
      );

      if (!validation.isValid) {
        violations.push(`Day ${i + 1}: ${currentStop.name} → ${nextStop.name} - ${validation.recommendation}`);
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }
}
