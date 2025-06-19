
/**
 * Comprehensive object safety validator to prevent undefined property access
 */
export class ObjectSafetyValidator {
  /**
   * Validate any object has required coordinate properties before accessing them
   */
  static validateObjectWithCoordinates(obj: any, context: string = 'unknown'): { isValid: boolean; error?: string } {
    console.log(`🔍 SAFETY CHECK: Validating object in ${context}:`, {
      obj,
      hasObj: !!obj,
      type: typeof obj,
      isNull: obj === null,
      isUndefined: obj === undefined,
      keys: obj ? Object.keys(obj) : 'N/A',
      context,
      stack: new Error().stack?.split('\n').slice(1, 6).join('\n')
    });

    if (!obj) {
      const error = `Object is null/undefined in ${context}`;
      console.error(`❌ SAFETY CHECK FAILED: ${error}`);
      return { isValid: false, error };
    }

    if (typeof obj !== 'object') {
      const error = `Object is not an object (${typeof obj}) in ${context}`;
      console.error(`❌ SAFETY CHECK FAILED: ${error}`);
      return { isValid: false, error };
    }

    if (!('latitude' in obj)) {
      const error = `Object missing latitude property in ${context}`;
      console.error(`❌ SAFETY CHECK FAILED: ${error}`, { 
        availableKeys: Object.keys(obj),
        obj 
      });
      return { isValid: false, error };
    }

    if (!('longitude' in obj)) {
      const error = `Object missing longitude property in ${context}`;
      console.error(`❌ SAFETY CHECK FAILED: ${error}`, { 
        availableKeys: Object.keys(obj),
        obj 
      });
      return { isValid: false, error };
    }

    if (typeof obj.latitude !== 'number') {
      const error = `Latitude is not a number (${typeof obj.latitude}) in ${context}`;
      console.error(`❌ SAFETY CHECK FAILED: ${error}`, { 
        latitude: obj.latitude,
        obj 
      });
      return { isValid: false, error };
    }

    if (typeof obj.longitude !== 'number') {
      const error = `Longitude is not a number (${typeof obj.longitude}) in ${context}`;
      console.error(`❌ SAFETY CHECK FAILED: ${error}`, { 
        longitude: obj.longitude,
        obj 
      });
      return { isValid: false, error };
    }

    console.log(`✅ SAFETY CHECK PASSED: Valid coordinates in ${context}`);
    return { isValid: true };
  }

  /**
   * Safe property access with detailed logging
   */
  static safePropertyAccess(obj: any, property: string, context: string = 'unknown'): any {
    const validation = this.validateObjectWithCoordinates(obj, `${context}-${property}`);
    
    if (!validation.isValid) {
      console.error(`❌ SAFE ACCESS FAILED: Cannot access ${property} - ${validation.error}`);
      return null;
    }

    const value = obj[property];
    console.log(`✅ SAFE ACCESS: ${property} = ${value} in ${context}`);
    return value;
  }

  /**
   * Wrap any function that accesses coordinates to prevent undefined errors
   */
  static wrapCoordinateAccess<T>(
    fn: () => T, 
    context: string, 
    fallbackValue: T
  ): T {
    try {
      console.log(`🛡️ WRAPPING COORDINATE ACCESS: ${context}`);
      const result = fn();
      console.log(`✅ COORDINATE ACCESS SUCCESS: ${context}`);
      return result;
    } catch (error) {
      console.error(`❌ COORDINATE ACCESS ERROR in ${context}:`, {
        error,
        stack: error instanceof Error ? error.stack : 'No stack trace',
        fallbackValue
      });
      return fallbackValue;
    }
  }
}
