
import { TripStop } from '../../types/TripStop';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { EnhancedTripStyleLogic } from './EnhancedTripStyleLogic';
import { HeritageScoringService } from './HeritageScoringService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class EnhancedDestinationPriorityService {
  /**
   * Select destination with heritage priority
   */
  static selectDestinationWithHeritagePriority(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    tripStyle: 'destination-focused'
  ): TripStop | null {
    const enhancedConfig = EnhancedTripStyleLogic.getEnhancedConfig(tripStyle);

    if (availableStops.length === 0) return null;

    let bestDestination: TripStop | null = null;
    let bestScore = -1;

    for (const candidate of availableStops) {
      // Calculate distance from current stop
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        candidate.latitude, candidate.longitude
      );

      // Estimate drive time (assuming 50 mph average)
      const estimatedDriveTime = distance / 50;

      // Check if within drive time constraints
      if (estimatedDriveTime > driveTimeTarget.maxHours) {
        continue; // Skip if too far
      }

      // Calculate heritage score
      const heritageScore = HeritageScoringService.calculateHeritageScore(candidate);

      // Calculate distance score (closer to target is better)
      const targetDistance = driveTimeTarget.targetHours * 50;
      const distanceScore = 100 - Math.abs(distance - targetDistance) / targetDistance * 100;
      const clampedDistanceScore = Math.max(0, Math.min(100, distanceScore));

      // Calculate combined score
      const combinedScore = heritageScore.heritageScore * enhancedConfig.heritageWeight + 
                           clampedDistanceScore * (1 - enhancedConfig.heritageWeight);

      if (combinedScore > bestScore) {
        bestScore = combinedScore;
        bestDestination = candidate;
      }
    }

    return bestDestination;
  }
}
