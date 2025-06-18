
import { TripStop } from '../../../types/TripStop';

export class DestinationValidator {
  /**
   * Enhanced validation to check if an object is a valid TripStop with coordinates
   */
  static isValidTripStop(obj: any): obj is TripStop {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    // Check required string properties
    if (typeof obj.id !== 'string' || !obj.id) {
      return false;
    }

    if (typeof obj.name !== 'string' || !obj.name) {
      return false;
    }

    // Check coordinate properties
    if (typeof obj.latitude !== 'number' || isNaN(obj.latitude) || obj.latitude === 0) {
      return false;
    }

    if (typeof obj.longitude !== 'number' || isNaN(obj.longitude) || obj.longitude === 0) {
      return false;
    }

    return true;
  }

  /**
   * Filter array to only valid TripStops with comprehensive safety checks
   */
  static filterValidStops(allStops: any[]): TripStop[] {
    const validStops: TripStop[] = [];
    
    for (const stop of allStops) {
      if (!stop || typeof stop !== 'object') {
        console.warn(`⚠️ SKIPPING: stop is not a valid object`);
        continue;
      }
      
      if (this.isValidTripStop(stop)) {
        validStops.push(stop);
      } else {
        // Safe property access for invalid objects
        console.warn(`⚠️ SKIPPING invalid stop:`, {
          id: (stop && typeof stop === 'object' && 'id' in stop) ? stop.id : 'no-id',
          name: (stop && typeof stop === 'object' && 'name' in stop) ? stop.name : 'no-name',
          hasLatitude: (stop && typeof stop === 'object' && 'latitude' in stop) ? typeof stop.latitude === 'number' : false,
          hasLongitude: (stop && typeof stop === 'object' && 'longitude' in stop) ? typeof stop.longitude === 'number' : false
        });
      }
    }
    
    return validStops;
  }

  /**
   * Remove start and end cities from available cities with safe filtering
   */
  static filterAvailableCities(
    canonicalStops: TripStop[], 
    startStop: TripStop, 
    endStop: TripStop
  ): TripStop[] {
    const availableCities: TripStop[] = [];
    
    for (const city of canonicalStops) {
      // Check validity first, before the type guard narrows the type
      const isValidCity = this.isValidTripStop(city);
      
      if (!isValidCity) {
        // Use type assertion to handle the narrowed type issue
        const cityAsAny = city as any;
        console.warn(`⚠️ FILTERING OUT city: invalid coordinates`, {
          id: (cityAsAny && typeof cityAsAny === 'object' && 'id' in cityAsAny) ? cityAsAny.id : 'no-id',
          name: (cityAsAny && typeof cityAsAny === 'object' && 'name' in cityAsAny) ? cityAsAny.name : 'no-name'
        });
        continue;
      }
      
      const isNotStartStop = city.id !== startStop.id;
      const isNotEndStop = city.id !== endStop.id;
      
      if (isNotStartStop && isNotEndStop) {
        availableCities.push(city);
      } else {
        console.warn(`⚠️ FILTERING OUT city:`, {
          id: city.id,
          name: city.name,
          reason: city.id === startStop.id ? 'is start stop' : 'is end stop'
        });
      }
    }
    
    return availableCities;
  }
}
