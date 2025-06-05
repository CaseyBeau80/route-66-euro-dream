
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget, DriveTimeConstraints } from './DriveTimeConstraints';

export class DestinationScoring {
  /**
   * Find best destination within drive time constraints with massive destination city preference
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

    // Separate destination cities from other stops for prioritization
    const destinationCities = availableStops.filter(stop => stop.category === 'destination_city');
    const otherStops = availableStops.filter(stop => stop.category !== 'destination_city');

    console.log(`🏙️ Evaluating ${destinationCities.length} destination cities and ${otherStops.length} other stops`);

    // Try destination cities first with MASSIVE preference
    for (const stop of destinationCities) {
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

      // MASSIVE bonus for destination cities - this is the key fix
      score -= 15.0; // Enormous preference for destination cities

      // Bonus for major stops
      if (stop.is_major_stop) {
        score -= 1.0;
      }

      // Bonus for being in optimal range
      if (driveTimeHours >= constraints.optimal.min && 
          driveTimeHours <= constraints.optimal.max) {
        score -= 0.5;
      }

      console.log(`🏙️ Destination city ${stop.name}: ${driveTimeHours.toFixed(1)}h drive, score: ${score.toFixed(2)} (MASSIVE BONUS APPLIED)`);

      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }

    // If we found a destination city, use it
    if (bestStop) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        bestStop.latitude, bestStop.longitude
      );
      const actualDriveTime = distance / avgSpeedMph;
      
      console.log(`✅ Selected destination city ${bestStop.name}: ${Math.round(distance)}mi, ${actualDriveTime.toFixed(1)}h drive`);
      return bestStop;
    }

    // Only if no destination cities work, try other stops
    console.log(`🔄 No destination cities available, trying other stops`);
    
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
        score -= 0.5;
      }

      // Bonus for being in optimal range
      if (driveTimeHours >= constraints.optimal.min && 
          driveTimeHours <= constraints.optimal.max) {
        score -= 0.3;
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
