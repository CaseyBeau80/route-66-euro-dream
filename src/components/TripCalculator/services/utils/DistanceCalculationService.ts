
export class DistanceCalculationService {
  /**
   * Calculate distance between two points with comprehensive validation
   */
  static calculateDistance(
    lat1: number | undefined,
    lng1: number | undefined,
    lat2: number | undefined,
    lng2: number | undefined
  ): number {
    console.log(`📏 PHASE 1 DEBUG: Distance calculation requested`, {
      lat1: { value: lat1, type: typeof lat1, isValid: this.isValidCoordinate(lat1) },
      lng1: { value: lng1, type: typeof lng1, isValid: this.isValidCoordinate(lng1) },
      lat2: { value: lat2, type: typeof lat2, isValid: this.isValidCoordinate(lat2) },
      lng2: { value: lng2, type: typeof lng2, isValid: this.isValidCoordinate(lng2) },
      stack: new Error().stack?.split('\n').slice(1, 4).join('\n')
    });

    // PHASE 2: BULLETPROOF validation - check each coordinate individually
    const validationResults = {
      lat1: this.validateCoordinate(lat1, 'latitude', 'lat1'),
      lng1: this.validateCoordinate(lng1, 'longitude', 'lng1'),
      lat2: this.validateCoordinate(lat2, 'latitude', 'lat2'),
      lng2: this.validateCoordinate(lng2, 'longitude', 'lng2')
    };

    // If any validation fails, return 0 and log detailed error
    const failedValidations = Object.entries(validationResults).filter(([_, result]) => !result.isValid);
    if (failedValidations.length > 0) {
      console.error('❌ PHASE 2: Distance calculation failed - invalid coordinates:', {
        failedValidations: failedValidations.map(([key, result]) => ({ [key]: result })),
        allInputs: { lat1, lng1, lat2, lng2 }
      });
      return 0;
    }

    try {
      // PHASE 4: Safe calculation with validated coordinates
      const R = 3959; // Earth's radius in miles
      const dLat = (lat2! - lat1!) * Math.PI / 180;
      const dLon = (lng2! - lng1!) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1! * Math.PI / 180) * Math.cos(lat2! * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      console.log(`✅ PHASE 4: Distance calculated successfully: ${distance.toFixed(1)} miles`);
      return distance;
    } catch (error) {
      console.error('❌ PHASE 3: Distance calculation error caught:', {
        error,
        inputs: { lat1, lng1, lat2, lng2 },
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      return 0;
    }
  }

  /**
   * PHASE 2: Comprehensive coordinate validation
   */
  private static validateCoordinate(
    coord: number | undefined,
    type: 'latitude' | 'longitude',
    paramName: string
  ): { isValid: boolean; error?: string } {
    if (coord === undefined || coord === null) {
      return { isValid: false, error: `${paramName} is ${coord === undefined ? 'undefined' : 'null'}` };
    }
    
    if (typeof coord !== 'number') {
      return { isValid: false, error: `${paramName} is not a number (${typeof coord})` };
    }
    
    if (isNaN(coord)) {
      return { isValid: false, error: `${paramName} is NaN` };
    }
    
    if (!isFinite(coord)) {
      return { isValid: false, error: `${paramName} is not finite` };
    }
    
    // Check coordinate ranges
    if (type === 'latitude' && (coord < -90 || coord > 90)) {
      return { isValid: false, error: `${paramName} out of latitude range: ${coord}` };
    }
    
    if (type === 'longitude' && (coord < -180 || coord > 180)) {
      return { isValid: false, error: `${paramName} out of longitude range: ${coord}` };
    }
    
    return { isValid: true };
  }

  /**
   * PHASE 2: Quick coordinate validation helper
   */
  private static isValidCoordinate(coord: any): boolean {
    return typeof coord === 'number' && !isNaN(coord) && isFinite(coord);
  }

  /**
   * Safe distance calculation between two objects with coordinates
   */
  static calculateDistanceBetweenObjects(obj1: any, obj2: any): number {
    console.log(`📏 PHASE 1 DEBUG: Object distance calculation requested`, {
      obj1: {
        exists: !!obj1,
        type: typeof obj1,
        hasLatitude: obj1 && 'latitude' in obj1,
        hasLongitude: obj1 && 'longitude' in obj1,
        latitude: obj1?.latitude,
        longitude: obj1?.longitude,
        name: obj1?.name || 'unnamed'
      },
      obj2: {
        exists: !!obj2,
        type: typeof obj2,
        hasLatitude: obj2 && 'latitude' in obj2,
        hasLongitude: obj2 && 'longitude' in obj2,
        latitude: obj2?.latitude,
        longitude: obj2?.longitude,
        name: obj2?.name || 'unnamed'
      },
      stack: new Error().stack?.split('\n').slice(1, 4).join('\n')
    });

    // PHASE 2: BULLETPROOF object validation
    const obj1Validation = this.validateObject(obj1, 'obj1');
    const obj2Validation = this.validateObject(obj2, 'obj2');

    if (!obj1Validation.isValid) {
      console.error('❌ PHASE 2: Object 1 validation failed:', obj1Validation.error);
      return 0;
    }

    if (!obj2Validation.isValid) {
      console.error('❌ PHASE 2: Object 2 validation failed:', obj2Validation.error);
      return 0;
    }

    // PHASE 4: Extract coordinates safely
    const lat1 = obj1.latitude;
    const lng1 = obj1.longitude;
    const lat2 = obj2.latitude;
    const lng2 = obj2.longitude;

    return this.calculateDistance(lat1, lng1, lat2, lng2);
  }

  /**
   * PHASE 2: Comprehensive object validation
   */
  private static validateObject(obj: any, paramName: string): { isValid: boolean; error?: string } {
    if (!obj) {
      return { isValid: false, error: `${paramName} is ${obj === null ? 'null' : 'undefined'}` };
    }

    if (typeof obj !== 'object') {
      return { isValid: false, error: `${paramName} is not an object (${typeof obj})` };
    }

    if (!('latitude' in obj)) {
      return { isValid: false, error: `${paramName} missing latitude property` };
    }

    if (!('longitude' in obj)) {
      return { isValid: false, error: `${paramName} missing longitude property` };
    }

    const latValidation = this.validateCoordinate(obj.latitude, 'latitude', `${paramName}.latitude`);
    if (!latValidation.isValid) {
      return { isValid: false, error: latValidation.error };
    }

    const lngValidation = this.validateCoordinate(obj.longitude, 'longitude', `${paramName}.longitude`);
    if (!lngValidation.isValid) {
      return { isValid: false, error: lngValidation.error };
    }

    return { isValid: true };
  }

  /**
   * Calculate realistic drive time for Route 66 trips with absolute 10-hour maximum
   */
  static calculateDriveTime(distance: number): number {
    console.log(`🚨 STRICT CALCULATION: Computing drive time for ${distance.toFixed(1)} miles with ABSOLUTE 10h limit`);
    
    // Absolute constants - no exceptions
    const ABSOLUTE_MAX_DRIVE_HOURS = 10; // NEVER exceed this
    const RECOMMENDED_MAX_HOURS = 8;     // Comfortable maximum
    const OPTIMAL_MAX_HOURS = 6;         // Ideal range top
    const MIN_MEANINGFUL_HOURS = 2;      // Minimum useful drive time
    
    // Handle edge cases
    if (distance <= 0 || !isFinite(distance) || isNaN(distance)) {
      console.log(`🚨 Invalid distance ${distance}, returning 2h minimum`);
      return MIN_MEANINGFUL_HOURS;
    }
    
    // Calculate realistic Route 66 speed based on distance and road conditions
    let avgSpeed: number;
    
    if (distance < 100) {
      avgSpeed = 40; // City driving, frequent stops, tourist areas
    } else if (distance < 200) {
      avgSpeed = 45; // Mixed driving with some highway
    } else if (distance < 300) {
      avgSpeed = 50; // Mostly highway driving
    } else if (distance < 400) {
      avgSpeed = 52; // Long highway stretches
    } else {
      avgSpeed = 55; // Maximum for very long distances
    }
    
    const baseTime = distance / avgSpeed;
    
    // Add realistic buffer for Route 66 experience (stops, sightseeing, traffic)
    const bufferMultiplier = 1.20; // 20% buffer for Route 66 attractions and stops
    const calculatedTime = baseTime * bufferMultiplier;
    
    // ABSOLUTE ENFORCEMENT: Never allow more than 10 hours
    let finalTime = calculatedTime;
    
    if (calculatedTime > ABSOLUTE_MAX_DRIVE_HOURS) {
      console.error(`🚨 CRITICAL: ${calculatedTime.toFixed(1)}h exceeds ABSOLUTE 10h limit - FORCING to 10h`);
      finalTime = ABSOLUTE_MAX_DRIVE_HOURS;
    } else if (calculatedTime > RECOMMENDED_MAX_HOURS) {
      console.warn(`⚠️ LONG DAY: ${calculatedTime.toFixed(1)}h exceeds recommended ${RECOMMENDED_MAX_HOURS}h`);
    }
    
    // Ensure minimum meaningful time
    finalTime = Math.max(finalTime, MIN_MEANINGFUL_HOURS);
    
    // Log calculation details
    console.log(`✅ STRICT drive time calculation:`, {
      distance: distance.toFixed(1),
      avgSpeed,
      baseTime: baseTime.toFixed(1),
      withBuffer: calculatedTime.toFixed(1),
      finalTime: finalTime.toFixed(1),
      wasForced: calculatedTime > ABSOLUTE_MAX_DRIVE_HOURS,
      category: finalTime <= OPTIMAL_MAX_HOURS ? 'optimal' : 
                finalTime <= RECOMMENDED_MAX_HOURS ? 'acceptable' : 
                finalTime < ABSOLUTE_MAX_DRIVE_HOURS ? 'long' : 'maximum'
    });
    
    return finalTime;
  }

  /**
   * PHASE 5: Testing and validation helper
   */
  static validateDistanceInputs(obj1: any, obj2: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    const obj1Validation = this.validateObject(obj1, 'start');
    const obj2Validation = this.validateObject(obj2, 'end');
    
    if (!obj1Validation.isValid) {
      errors.push(`Start location: ${obj1Validation.error}`);
    }
    
    if (!obj2Validation.isValid) {
      errors.push(`End location: ${obj2Validation.error}`);
    }
    
    return { isValid: errors.length === 0, errors };
  }
}
