import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class StopValidationService {
  private static readonly MIN_STOP_DISTANCE_MILES = 10;
  private static readonly MAX_REASONABLE_DISTANCE_MILES = 800;

  /**
   * Validate and deduplicate stops to prevent circular references and duplicates
   */
  static validateAndDeduplicateStops(
    stops: TripStop[],
    startStop: TripStop,
    endStop: TripStop
  ): TripStop[] {
    console.log(`🔍 Validating ${stops.length} stops for circular references and duplicates`);
    
    const validStops: TripStop[] = [];
    const usedStopIds = new Set<string>();
    
    // Add start and end stop IDs to prevent duplication
    usedStopIds.add(startStop.id);
    usedStopIds.add(endStop.id);

    for (const stop of stops) {
      // Skip if already used
      if (usedStopIds.has(stop.id)) {
        console.log(`⚠️ Skipping duplicate stop: ${stop.name}`);
        continue;
      }

      // Validate stop has required properties
      if (!this.isValidStop(stop)) {
        console.log(`⚠️ Skipping invalid stop: ${stop.name}`);
        continue;
      }

      // Check minimum distance from start and end
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );

      const distanceFromEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );

      // Skip stops too close to start or end
      if (distanceFromStart < this.MIN_STOP_DISTANCE_MILES || 
          distanceFromEnd < this.MIN_STOP_DISTANCE_MILES) {
        console.log(`⚠️ Skipping stop too close to endpoints: ${stop.name}`);
        continue;
      }

      // Skip stops with unreasonable distances
      if (distanceFromStart > this.MAX_REASONABLE_DISTANCE_MILES || 
          distanceFromEnd > this.MAX_REASONABLE_DISTANCE_MILES) {
        console.log(`⚠️ Skipping stop with unreasonable distance: ${stop.name}`);
        continue;
      }

      // Check proximity to already selected stops
      let tooCloseToExisting = false;
      for (const existingStop of validStops) {
        const distance = DistanceCalculationService.calculateDistance(
          existingStop.latitude, existingStop.longitude,
          stop.latitude, stop.longitude
        );

        if (distance < this.MIN_STOP_DISTANCE_MILES) {
          // Prioritize destination cities
          if (stop.category === 'destination_city' && existingStop.category !== 'destination_city') {
            // Replace existing with destination city
            const index = validStops.indexOf(existingStop);
            validStops[index] = stop;
            usedStopIds.delete(existingStop.id);
            usedStopIds.add(stop.id);
            console.log(`🏙️ Replaced ${existingStop.name} with destination city ${stop.name}`);
            tooCloseToExisting = true;
            break;
          } else if (existingStop.category === 'destination_city' && stop.category !== 'destination_city') {
            // Keep existing destination city
            console.log(`🏙️ Keeping destination city ${existingStop.name} over ${stop.name}`);
            tooCloseToExisting = true;
            break;
          } else {
            // Regular proximity check
            console.log(`⚠️ Skipping stop too close to ${existingStop.name}: ${stop.name}`);
            tooCloseToExisting = true;
            break;
          }
        }
      }

      if (!tooCloseToExisting && !usedStopIds.has(stop.id)) {
        validStops.push(stop);
        usedStopIds.add(stop.id);
      }
    }

    console.log(`✅ Validated stops: ${stops.length} → ${validStops.length} (removed ${stops.length - validStops.length} duplicates/invalid)`);
    return validStops;
  }

  /**
   * Validate that a stop has all required properties
   */
  private static isValidStop(stop: TripStop): boolean {
    return (
      stop.id && 
      stop.name && 
      typeof stop.latitude === 'number' && 
      typeof stop.longitude === 'number' &&
      stop.latitude >= -90 && stop.latitude <= 90 &&
      stop.longitude >= -180 && stop.longitude <= 180
    );
  }

  /**
   * Validate segment timings for circular references
   */
  static validateSegmentTimings(timings: Array<{ fromStop: TripStop; toStop: TripStop }>): boolean {
    const invalidTimings = timings.filter(timing => 
      timing.fromStop.id === timing.toStop.id
    );

    if (invalidTimings.length > 0) {
      console.error(`❌ Found ${invalidTimings.length} circular reference(s) in segment timings`);
      invalidTimings.forEach(timing => 
        console.error(`   - ${timing.fromStop.name} → ${timing.toStop.name}`)
      );
      return false;
    }

    return true;
  }
}
