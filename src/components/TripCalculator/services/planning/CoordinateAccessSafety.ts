
/**
 * PHASE 3: Comprehensive coordinate access safety service
 * Prevents all undefined coordinate access errors with bulletproof validation
 */
export class CoordinateAccessSafety {
  /**
   * Safely extract coordinates with comprehensive validation
   */
  static safeGetCoordinates(obj: any, context: string = 'unknown'): { latitude: number; longitude: number } | null {
    console.log(`🔐 COORDINATE SAFETY: Extracting coordinates in ${context}`, {
      hasObj: !!obj,
      objType: typeof obj,
      objKeys: obj ? Object.keys(obj) : 'none',
      context,
      stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
    });

    // PHASE 2: BULLETPROOF null/undefined checks
    if (obj === null) {
      console.error(`❌ COORDINATE SAFETY: Object is null in ${context}`);
      return null;
    }

    if (obj === undefined) {
      console.error(`❌ COORDINATE SAFETY: Object is undefined in ${context}`);
      return null;
    }

    if (typeof obj !== 'object') {
      console.error(`❌ COORDINATE SAFETY: Object is not an object (${typeof obj}) in ${context}`);
      return null;
    }

    // PHASE 2: Property existence checks
    if (!('latitude' in obj)) {
      console.error(`❌ COORDINATE SAFETY: Missing latitude property in ${context}`, {
        availableKeys: Object.keys(obj),
        obj
      });
      return null;
    }

    if (!('longitude' in obj)) {
      console.error(`❌ COORDINATE SAFETY: Missing longitude property in ${context}`, {
        availableKeys: Object.keys(obj),
        obj
      });
      return null;
    }

    // PHASE 2: Type and value validation
    const lat = obj.latitude;
    const lng = obj.longitude;

    if (typeof lat !== 'number') {
      console.error(`❌ COORDINATE SAFETY: Latitude is not a number (${typeof lat}) in ${context}`, { latitude: lat });
      return null;
    }

    if (typeof lng !== 'number') {
      console.error(`❌ COORDINATE SAFETY: Longitude is not a number (${typeof lng}) in ${context}`, { longitude: lng });
      return null;
    }

    if (isNaN(lat) || isNaN(lng)) {
      console.error(`❌ COORDINATE SAFETY: Coordinates are NaN in ${context}`, { latitude: lat, longitude: lng });
      return null;
    }

    if (!isFinite(lat) || !isFinite(lng)) {
      console.error(`❌ COORDINATE SAFETY: Coordinates are not finite in ${context}`, { latitude: lat, longitude: lng });
      return null;
    }

    // PHASE 2: Range validation
    if (lat < -90 || lat > 90) {
      console.error(`❌ COORDINATE SAFETY: Latitude out of range in ${context}`, { latitude: lat });
      return null;
    }

    if (lng < -180 || lng > 180) {
      console.error(`❌ COORDINATE SAFETY: Longitude out of range in ${context}`, { longitude: lng });
      return null;
    }

    console.log(`✅ COORDINATE SAFETY: Valid coordinates extracted in ${context}`, { latitude: lat, longitude: lng });
    return { latitude: lat, longitude: lng };
  }

  /**
   * Validate that an object can safely provide coordinates
   */
  static canSafelyAccessCoordinates(obj: any, context: string = 'unknown'): boolean {
    return this.safeGetCoordinates(obj, context) !== null;
  }

  /**
   * Wrap coordinate access operations with safety
   */
  static wrapCoordinateOperation<T>(
    operation: () => T,
    context: string,
    fallback: T
  ): T {
    try {
      console.log(`🛡️ WRAPPING OPERATION: ${context}`);
      const result = operation();
      console.log(`✅ OPERATION SUCCESS: ${context}`);
      return result;
    } catch (error) {
      console.error(`❌ OPERATION FAILED: ${context}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      return fallback;
    }
  }
}
