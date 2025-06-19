
import { TripStop } from '../../../types/TripStop';

export class DestinationValidator {
  /**
   * Enhanced validation to check if an object is a valid TripStop with coordinates
   */
  static isValidTripStop(obj: any): obj is TripStop {
    // First check: ensure obj exists and is an object
    if (!obj || typeof obj !== 'object') {
      console.warn('⚠️ VALIDATION: Object is null, undefined, or not an object:', obj);
      return false;
    }

    // Check required string properties with more thorough validation
    if (!obj.id || typeof obj.id !== 'string' || obj.id.trim() === '') {
      console.warn('⚠️ VALIDATION: Invalid or missing ID:', { id: obj.id });
      return false;
    }

    if (!obj.name || typeof obj.name !== 'string' || obj.name.trim() === '') {
      console.warn('⚠️ VALIDATION: Invalid or missing name:', { name: obj.name });
      return false;
    }

    // CRITICAL: Check coordinate properties with comprehensive validation
    if (typeof obj.latitude !== 'number') {
      console.warn('⚠️ VALIDATION: Latitude is not a number:', { latitude: obj.latitude, type: typeof obj.latitude });
      return false;
    }

    if (typeof obj.longitude !== 'number') {
      console.warn('⚠️ VALIDATION: Longitude is not a number:', { longitude: obj.longitude, type: typeof obj.longitude });
      return false;
    }

    if (isNaN(obj.latitude) || isNaN(obj.longitude)) {
      console.warn('⚠️ VALIDATION: Coordinates are NaN:', { latitude: obj.latitude, longitude: obj.longitude });
      return false;
    }

    // Check for zero coordinates (which might indicate missing data)
    if (obj.latitude === 0 && obj.longitude === 0) {
      console.warn('⚠️ VALIDATION: Coordinates are both zero (likely missing data):', { id: obj.id, name: obj.name });
      return false;
    }

    // Validate coordinate ranges (basic sanity check)
    if (obj.latitude < -90 || obj.latitude > 90) {
      console.warn('⚠️ VALIDATION: Latitude out of valid range:', { latitude: obj.latitude });
      return false;
    }

    if (obj.longitude < -180 || obj.longitude > 180) {
      console.warn('⚠️ VALIDATION: Longitude out of valid range:', { longitude: obj.longitude });
      return false;
    }

    return true;
  }

  /**
   * Filter array to only valid TripStops with comprehensive safety checks
   */
  static filterValidStops(allStops: any[]): TripStop[] {
    if (!Array.isArray(allStops)) {
      console.error('❌ VALIDATION: allStops is not an array:', typeof allStops);
      return [];
    }

    const validStops: TripStop[] = [];
    
    for (let i = 0; i < allStops.length; i++) {
      const stop = allStops[i];
      
      if (!stop) {
        console.warn(`⚠️ VALIDATION: Stop at index ${i} is null/undefined`);
        continue;
      }
      
      if (this.isValidTripStop(stop)) {
        validStops.push(stop as TripStop);
      } else {
        console.warn(`⚠️ VALIDATION: Skipping invalid stop at index ${i}:`, {
          id: (stop && typeof stop === 'object' && 'id' in stop) ? stop.id : 'no-id',
          name: (stop && typeof stop === 'object' && 'name' in stop) ? stop.name : 'no-name',
          hasLatitude: (stop && typeof stop === 'object' && 'latitude' in stop),
          hasLongitude: (stop && typeof stop === 'object' && 'longitude' in stop),
          latitudeType: (stop && typeof stop === 'object' && 'latitude' in stop) ? typeof stop.latitude : 'missing',
          longitudeType: (stop && typeof stop === 'object' && 'longitude' in stop) ? typeof stop.longitude : 'missing'
        });
      }
    }
    
    console.log(`✅ VALIDATION: Filtered ${allStops.length} stops to ${validStops.length} valid stops`);
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
    // Validate input parameters first
    if (!Array.isArray(canonicalStops)) {
      console.error('❌ VALIDATION: canonicalStops is not an array');
      return [];
    }

    if (!this.isValidTripStop(startStop)) {
      console.error('❌ VALIDATION: startStop is invalid in filterAvailableCities');
      return [];
    }

    if (!this.isValidTripStop(endStop)) {
      console.error('❌ VALIDATION: endStop is invalid in filterAvailableCities');
      return [];
    }

    const availableCities: TripStop[] = [];
    
    for (const city of canonicalStops) {
      // Check validity first
      if (!this.isValidTripStop(city)) {
        console.warn(`⚠️ VALIDATION: Filtering out invalid city:`, {
          id: (city && typeof city === 'object' && 'id' in city) ? city.id : 'no-id',
          name: (city && typeof city === 'object' && 'name' in city) ? city.name : 'no-name'
        });
        continue;
      }
      
      const isNotStartStop = city.id !== startStop.id;
      const isNotEndStop = city.id !== endStop.id;
      
      if (isNotStartStop && isNotEndStop) {
        availableCities.push(city);
      } else {
        console.log(`🚫 VALIDATION: Filtering out city:`, {
          id: city.id,
          name: city.name,
          reason: city.id === startStop.id ? 'is start stop' : 'is end stop'
        });
      }
    }
    
    console.log(`✅ VALIDATION: Filtered to ${availableCities.length} available cities`);
    return availableCities;
  }
}
