
import { TripStop } from '../../../types/TripStop';

export class CoordinateValidator {
  /**
   * Safely access latitude with detailed error logging
   */
  static safeGetLatitude(obj: any, context: string = 'unknown'): number | null {
    if (!obj) {
      console.error(`❌ COORDINATE ACCESS: Object is null/undefined when accessing latitude in ${context}:`, {
        obj,
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return null;
    }

    if (typeof obj !== 'object') {
      console.error(`❌ COORDINATE ACCESS: Object is not an object when accessing latitude in ${context}:`, {
        obj,
        type: typeof obj,
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return null;
    }

    if (!('latitude' in obj)) {
      console.error(`❌ COORDINATE ACCESS: Object missing latitude property in ${context}:`, {
        obj,
        keys: Object.keys(obj),
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return null;
    }

    if (typeof obj.latitude !== 'number') {
      console.error(`❌ COORDINATE ACCESS: Latitude is not a number in ${context}:`, {
        latitude: obj.latitude,
        type: typeof obj.latitude,
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return null;
    }

    return obj.latitude;
  }

  /**
   * Safely access longitude with detailed error logging
   */
  static safeGetLongitude(obj: any, context: string = 'unknown'): number | null {
    if (!obj) {
      console.error(`❌ COORDINATE ACCESS: Object is null/undefined when accessing longitude in ${context}:`, {
        obj,
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return null;
    }

    if (typeof obj !== 'object') {
      console.error(`❌ COORDINATE ACCESS: Object is not an object when accessing longitude in ${context}:`, {
        obj,
        type: typeof obj,
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return null;
    }

    if (!('longitude' in obj)) {
      console.error(`❌ COORDINATE ACCESS: Object missing longitude property in ${context}:`, {
        obj,
        keys: Object.keys(obj),
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return null;
    }

    if (typeof obj.longitude !== 'number') {
      console.error(`❌ COORDINATE ACCESS: Longitude is not a number in ${context}:`, {
        longitude: obj.longitude,
        type: typeof obj.longitude,
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return null;
    }

    return obj.longitude;
  }

  /**
   * Safely get both coordinates with validation
   */
  static safeGetCoordinates(obj: any, context: string = 'unknown'): { latitude: number; longitude: number } | null {
    const latitude = this.safeGetLatitude(obj, context);
    const longitude = this.safeGetLongitude(obj, context);

    if (latitude === null || longitude === null) {
      return null;
    }

    return { latitude, longitude };
  }

  /**
   * Validate that an object has safe coordinate access
   */
  static hasSafeCoordinates(obj: any): obj is TripStop {
    return this.safeGetCoordinates(obj, 'validation-check') !== null;
  }
}
