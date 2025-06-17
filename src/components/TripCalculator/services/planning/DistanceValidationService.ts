
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { calculateRealisticDriveTime } from '../../utils/distanceCalculator';

export interface DistanceValidationResult {
  isValid: boolean;
  distance: number;
  driveTime: number;
  exceedsLimit: boolean;
  maxAllowedDistance: number;
  recommendation?: string;
}

export class DistanceValidationService {
  private static readonly MAX_DRIVE_HOURS = 8;
  private static readonly AVG_SPEED_MPH = 50;
  private static readonly MAX_DAILY_DISTANCE = DistanceValidationService.MAX_DRIVE_HOURS * DistanceValidationService.AVG_SPEED_MPH;

  /**
   * Validate if a segment distance is within acceptable limits
   */
  static validateSegmentDistance(
    startStop: TripStop,
    endStop: TripStop,
    maxDailyDriveHours: number = 8
  ): DistanceValidationResult {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const driveTime = calculateRealisticDriveTime(distance);
    const maxAllowedDistance = maxDailyDriveHours * this.AVG_SPEED_MPH;
    const isValid = driveTime <= maxDailyDriveHours && distance <= maxAllowedDistance;
    const exceedsLimit = distance > maxAllowedDistance;

    console.log(`🚦 DISTANCE VALIDATION: ${startStop.name} → ${endStop.name}`, {
      distance: distance.toFixed(1),
      driveTime: driveTime.toFixed(1),
      maxHours: maxDailyDriveHours,
      maxDistance: maxAllowedDistance,
      isValid,
      exceedsLimit
    });

    let recommendation: string | undefined;
    if (exceedsLimit) {
      recommendation = `Distance of ${distance.toFixed(0)}mi (${driveTime.toFixed(1)}h) exceeds ${maxDailyDriveHours}h limit. Consider intermediate stops.`;
    }

    return {
      isValid,
      distance,
      driveTime,
      exceedsLimit,
      maxAllowedDistance,
      recommendation
    };
  }

  /**
   * Filter destinations that are within acceptable distance limits
   */
  static filterValidDistanceDestinations(
    currentStop: TripStop,
    destinations: TripStop[],
    maxDailyDriveHours: number = 8
  ): TripStop[] {
    const validDestinations = destinations.filter(destination => {
      const validation = this.validateSegmentDistance(currentStop, destination, maxDailyDriveHours);
      
      if (!validation.isValid) {
        console.log(`🚫 FILTERED OUT: ${destination.name} - ${validation.recommendation}`);
      }
      
      return validation.isValid;
    });

    console.log(`✅ DISTANCE FILTER: ${validDestinations.length}/${destinations.length} destinations within ${maxDailyDriveHours}h limit`);
    return validDestinations;
  }

  /**
   * Find the maximum safe distance for a given drive time limit
   */
  static getMaxSafeDistance(maxDriveHours: number): number {
    return maxDriveHours * this.AVG_SPEED_MPH;
  }

  /**
   * Calculate recommended number of days for a given total distance
   */
  static calculateRecommendedDays(
    startStop: TripStop,
    endStop: TripStop,
    maxDailyDriveHours: number = 8
  ): number {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const maxDailyDistance = this.getMaxSafeDistance(maxDailyDriveHours);
    const recommendedDays = Math.ceil(totalDistance / maxDailyDistance);

    console.log(`📊 RECOMMENDED DAYS: ${recommendedDays} for ${totalDistance.toFixed(0)}mi (max ${maxDailyDistance}mi/day)`);
    
    return Math.max(recommendedDays, 2); // Minimum 2 days
  }
}
