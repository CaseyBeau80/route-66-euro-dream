
import { DailySegment } from '../TripPlanTypes';
import { TripStop } from '../../../types/TripStop';
import { DistanceValidationService } from '../DistanceValidationService';

export class SegmentValidationService {
  /**
   * Perform final validation on all segments
   */
  static performFinalValidation(
    segments: DailySegment[],
    maxDailyDriveHours: number
  ): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    segments.forEach(segment => {
      if (segment.driveTimeHours > maxDailyDriveHours) {
        violations.push(`Day ${segment.day}: ${segment.driveTimeHours.toFixed(1)}h exceeds ${maxDailyDriveHours}h limit`);
      }
    });

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Validate trip feasibility and adjust days if needed
   */
  static validateTripFeasibility(
    startStop: TripStop,
    endStop: TripStop,
    tripDays: number,
    maxDailyDriveHours: number
  ): number {
    const recommendedDays = DistanceValidationService.calculateRecommendedDays(
      startStop, endStop, maxDailyDriveHours
    );
    
    if (tripDays < recommendedDays) {
      console.warn(`⚠️ TRIP NOT FEASIBLE: Need ${recommendedDays} days, got ${tripDays}. Adjusting.`);
      return recommendedDays;
    }

    return tripDays;
  }
}
