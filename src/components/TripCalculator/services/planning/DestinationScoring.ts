
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget, DriveTimeConstraints } from './DriveTimeConstraints';
import { DestinationCityValidator } from './DestinationCityValidator';

export class DestinationScoring {
  /**
   * Find best destination within drive time constraints with validated destination city preference
   */
  static findBestDestinationByDriveTime(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget,
    avgSpeedMph: number = 50
  ): TripStop | null {
    if (availableStops.length === 0) return null;

    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;
    const constraints = DriveTimeConstraints.CONSTRAINTS;

    console.log(`🕒 Finding destination for ${driveTimeTarget.targetHours.toFixed(1)}h target (${driveTimeTarget.minHours.toFixed(1)}-${driveTimeTarget.maxHours.toFixed(1)}h range)`);

    // Separate and validate destination cities from other stops
    const rawDestinationCities = availableStops.filter(stop => stop.category === 'destination_city');
    const validatedDestinationCities = DestinationCityValidator.filterValidDestinationCities(rawDestinationCities);
    const otherStops = availableStops.filter(stop => stop.category !== 'destination_city');

    console.log(`🏙️ Evaluating ${validatedDestinationCities.length} validated destination cities (filtered from ${rawDestinationCities.length}) and ${otherStops.length} other stops`);

    // Log filtered out cities for debugging
    const filteredOutCities = rawDestinationCities.filter(city => 
      !validatedDestinationCities.find(valid => valid.id === city.id)
    );
    if (filteredOutCities.length > 0) {
      console.log(`🚫 Filtered out cities:`, filteredOutCities.map(city => city.name));
    }

    // Try validated destination cities first with MASSIVE preference
    for (const stop of validatedDestinationCities) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );
      
      const driveTimeHours = distance / avgSpeedMph;
      
      // Skip if outside absolute constraints
      if (driveTimeHours < driveTimeTarget.minHours || driveTimeHours > driveTimeTarget.maxHours) {
        continue;
      }

      // Calculate score based on how close to target
      const timeDiff = Math.abs(driveTimeHours - driveTimeTarget.targetHours);
      let score = timeDiff;

      // MASSIVE bonus for validated destination cities - this is the key fix
      const importanceScore = DestinationCityValidator.getDestinationImportanceScore(stop);
      score -= (importanceScore / 5.0); // Convert importance to significant bonus

      // Additional bonuses
      if (stop.is_major_stop) {
        score -= 2.0;
      }

      // Bonus for being in optimal range
      if (driveTimeHours >= constraints.optimalMinHours && 
          driveTimeHours <= constraints.optimalMaxHours) {
        score -= 1.0;
      }

      console.log(`🏙️ Validated destination city ${stop.name}: ${driveTimeHours.toFixed(1)}h drive, importance: ${importanceScore}, score: ${score.toFixed(2)}`);

      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }

    // If we found a validated destination city, use it
    if (bestStop) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        bestStop.latitude, bestStop.longitude
      );
      const actualDriveTime = distance / avgSpeedMph;
      
      console.log(`✅ Selected validated destination city ${bestStop.name}: ${Math.round(distance)}mi, ${actualDriveTime.toFixed(1)}h drive`);
      return bestStop;
    }

    // Only if no validated destination cities work, try other stops
    console.log(`🔄 No validated destination cities available, trying other stops`);
    
    for (const stop of otherStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );
      
      const driveTimeHours = distance / avgSpeedMph;
      
      // Skip if outside absolute constraints
      if (driveTimeHours < driveTimeTarget.minHours || driveTimeHours > driveTimeTarget.maxHours) {
        continue;
      }

      // Calculate score based on how close to target
      const timeDiff = Math.abs(driveTimeHours - driveTimeTarget.targetHours);
      let score = timeDiff;

      // Bonus for major stops
      if (stop.is_major_stop) {
        score -= 1.0;
      }

      // Bonus for being in optimal range
      if (driveTimeHours >= constraints.optimalMinHours && 
          driveTimeHours <= constraints.optimalMaxHours) {
        score -= 0.5;
      }

      console.log(`📊 ${stop.name} (${stop.category}): ${driveTimeHours.toFixed(1)}h drive, score: ${score.toFixed(2)}`);

      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }

    if (bestStop) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        bestStop.latitude, bestStop.longitude
      );
      const actualDriveTime = distance / avgSpeedMph;
      
      console.log(`✅ Selected ${bestStop.name} (${bestStop.category}): ${Math.round(distance)}mi, ${actualDriveTime.toFixed(1)}h drive`);
    } else {
      console.log(`❌ No suitable destination found within drive time constraints`);
    }

    return bestStop;
  }
}
