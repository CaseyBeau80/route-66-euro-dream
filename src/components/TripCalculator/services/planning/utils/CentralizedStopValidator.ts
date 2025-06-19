import { TripStop } from '../../../types/TripStop';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class CentralizedStopValidator {
  /**
   * PHASE 1-4: BULLETPROOF validation for TripStop objects - prevents all undefined coordinate access
   */
  static validateTripStop(stop: any, context: string = 'unknown'): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    console.log(`🛡️ PHASE 1 DEBUG: Validating TripStop in ${context}:`, {
      stop: {
        exists: !!stop,
        type: typeof stop,
        isNull: stop === null,
        isUndefined: stop === undefined,
        keys: stop ? Object.keys(stop) : 'none',
        name: stop?.name || 'unnamed',
        hasLatitude: stop && 'latitude' in stop,
        hasLongitude: stop && 'longitude' in stop,
        latitude: stop?.latitude,
        longitude: stop?.longitude
      },
      context,
      stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
    });

    // PHASE 2: CRITICAL - First check - absolute null/undefined safety
    if (stop === null) {
      const error = `Stop is null in ${context}`;
      errors.push(error);
      console.error(`❌ PHASE 2 CRITICAL: ${error}`, { 
        stop, 
        context,
        stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
      });
      return { isValid: false, errors, warnings };
    }

    if (stop === undefined) {
      const error = `Stop is undefined in ${context}`;
      errors.push(error);
      console.error(`❌ PHASE 2 CRITICAL: ${error}`, { 
        stop, 
        context,
        stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
      });
      return { isValid: false, errors, warnings };
    }

    if (typeof stop !== 'object') {
      const error = `Stop is not an object (${typeof stop}) in ${context}`;
      errors.push(error);
      console.error(`❌ PHASE 2 CRITICAL: ${error}`, { 
        stop, 
        type: typeof stop,
        context,
        stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
      });
      return { isValid: false, errors, warnings };
    }

    // PHASE 2: Required string properties with bulletproof checking
    if (!this.hasValidProperty(stop, 'id', 'string')) {
      const error = `Invalid or missing ID in ${context}`;
      errors.push(error);
      console.error(`❌ PHASE 2 CRITICAL: ${error}`, { 
        hasId: 'id' in stop,
        id: stop.id,
        idType: typeof stop.id,
        context
      });
    }

    if (!this.hasValidProperty(stop, 'name', 'string')) {
      const error = `Invalid or missing name in ${context}`;
      errors.push(error);
      console.error(`❌ PHASE 2 CRITICAL: ${error}`, { 
        hasName: 'name' in stop,
        name: stop.name,
        nameType: typeof stop.name,
        context
      });
    }

    // PHASE 2: BULLETPROOF coordinate validation - this is where the error occurs
    const latitudeValidation = this.validateCoordinateProperty(stop, 'latitude', context);
    if (!latitudeValidation.isValid) {
      errors.push(...latitudeValidation.errors);
      warnings.push(...latitudeValidation.warnings);
    }

    const longitudeValidation = this.validateCoordinateProperty(stop, 'longitude', context);
    if (!longitudeValidation.isValid) {
      errors.push(...longitudeValidation.errors);
      warnings.push(...longitudeValidation.warnings);
    }

    // PHASE 4: Zero coordinate warning
    if (stop.latitude === 0 && stop.longitude === 0) {
      const warning = `Coordinates are both zero (likely missing data) in ${context}`;
      warnings.push(warning);
      console.warn(`⚠️ PHASE 4: ${warning}`, { 
        name: stop.name,
        context
      });
    }

    const isValid = errors.length === 0;

    if (!isValid) {
      console.error(`❌ PHASE 2: VALIDATION FAILED in ${context}:`, { 
        stopName: stop?.name || 'unknown',
        stopId: stop?.id || 'unknown',
        errors, 
        warnings,
        stopKeys: Object.keys(stop || {}),
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
    } else if (warnings.length > 0) {
      console.warn(`⚠️ PHASE 4: VALIDATION WARNINGS in ${context}:`, { 
        stopName: stop.name,
        warnings 
      });
    } else {
      console.log(`✅ PHASE 5: VALIDATION PASSED in ${context}: ${stop.name}`);
    }

    return { isValid, errors, warnings };
  }

  /**
   * PHASE 2: Validate coordinate property with comprehensive error checking
   */
  private static validateCoordinateProperty(
    stop: any, 
    property: 'latitude' | 'longitude', 
    context: string
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!(property in stop)) {
      errors.push(`Missing ${property} property in ${context}`);
      console.error(`❌ PHASE 2 CRITICAL: Missing ${property} property in ${context}`, { 
        stop: JSON.stringify(stop, null, 2),
        properties: Object.keys(stop),
        context
      });
      return { isValid: false, errors, warnings };
    }

    const value = stop[property];

    if (value === null || value === undefined) {
      errors.push(`${property} is ${value === null ? 'null' : 'undefined'} in ${context}`);
      console.error(`❌ PHASE 2 CRITICAL: ${property} is ${value === null ? 'null' : 'undefined'} in ${context}`, { 
        [property]: value,
        context
      });
      return { isValid: false, errors, warnings };
    }

    if (typeof value !== 'number') {
      errors.push(`${property} is not a number (${typeof value}) in ${context}`);
      console.error(`❌ PHASE 2 CRITICAL: ${property} is not a number in ${context}`, { 
        [property]: value,
        type: typeof value,
        context
      });
      return { isValid: false, errors, warnings };
    }

    if (isNaN(value)) {
      errors.push(`${property} is NaN in ${context}`);
      console.error(`❌ PHASE 2 CRITICAL: ${property} is NaN in ${context}`, { 
        [property]: value,
        context
      });
      return { isValid: false, errors, warnings };
    }

    // PHASE 2: Validate coordinate ranges
    if (property === 'latitude' && (value < -90 || value > 90)) {
      errors.push(`Latitude out of valid range (${value}) in ${context}`);
      console.error(`❌ PHASE 2 CRITICAL: Latitude out of range in ${context}`, { 
        latitude: value,
        context
      });
      return { isValid: false, errors, warnings };
    }

    if (property === 'longitude' && (value < -180 || value > 180)) {
      errors.push(`Longitude out of valid range (${value}) in ${context}`);
      console.error(`❌ PHASE 2 CRITICAL: Longitude out of range in ${context}`, { 
        longitude: value,
        context
      });
      return { isValid: false, errors, warnings };
    }

    return { isValid: true, errors, warnings };
  }

  /**
   * PHASE 2: Helper to validate object properties safely
   */
  private static hasValidProperty(obj: any, property: string, expectedType: string): boolean {
    if (!(property in obj)) return false;
    if (obj[property] === null || obj[property] === undefined) return false;
    if (typeof obj[property] !== expectedType) return false;
    if (expectedType === 'string' && obj[property].trim() === '') return false;
    return true;
  }

  /**
   * Filter array to only valid TripStops with comprehensive logging
   */
  static filterValidStops(stops: any[], context: string = 'unknown'): TripStop[] {
    if (!Array.isArray(stops)) {
      console.error(`❌ FILTER: Not an array in ${context}:`, {
        type: typeof stops,
        value: stops,
        stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
      });
      return [];
    }

    const validStops: TripStop[] = [];
    const validationResults: Array<{ index: number; result: ValidationResult; stop: any }> = [];

    stops.forEach((stop, index) => {
      const result = this.validateTripStop(stop, `${context}[${index}]`);
      validationResults.push({ index, result, stop });

      if (result.isValid) {
        validStops.push(stop as TripStop);
      } else {
        console.error(`❌ FILTER: Rejecting invalid stop at index ${index}:`, {
          stop: stop,
          errors: result.errors,
          context: `${context}[${index}]`
        });
      }
    });

    // Summary logging
    const totalErrors = validationResults.reduce((sum, vr) => sum + vr.result.errors.length, 0);
    const totalWarnings = validationResults.reduce((sum, vr) => sum + vr.result.warnings.length, 0);

    console.log(`🔍 FILTER SUMMARY for ${context}:`, {
      total: stops.length,
      valid: validStops.length,
      invalid: stops.length - validStops.length,
      totalErrors,
      totalWarnings
    });

    return validStops;
  }

  /**
   * BULLETPROOF coordinate extraction with comprehensive safety
   */
  static safeGetCoordinates(obj: any, context: string = 'unknown'): { latitude: number; longitude: number } | null {
    console.log(`🔍 COORDINATE EXTRACTION in ${context}`, {
      hasObj: !!obj,
      objType: typeof obj,
      objKeys: obj ? Object.keys(obj) : 'none'
    });

    const validation = this.validateTripStop(obj, `coordinate-extraction-${context}`);
    
    if (!validation.isValid) {
      console.error(`❌ COORDINATES: Cannot extract - validation failed in ${context}`, {
        errors: validation.errors,
        obj: obj,
        stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
      });
      return null;
    }

    const coordinates = {
      latitude: obj.latitude,
      longitude: obj.longitude
    };

    console.log(`✅ COORDINATES: Successfully extracted in ${context}`, coordinates);
    return coordinates;
  }

  /**
   * Batch validate multiple stops with summary report
   */
  static batchValidate(stops: any[], context: string = 'batch'): {
    validStops: TripStop[];
    invalidStops: Array<{ stop: any; errors: string[] }>;
    summary: {
      total: number;
      valid: number;
      invalid: number;
      errorCount: number;
      warningCount: number;
    };
  } {
    const validStops: TripStop[] = [];
    const invalidStops: Array<{ stop: any; errors: string[] }> = [];
    let errorCount = 0;
    let warningCount = 0;

    if (!Array.isArray(stops)) {
      console.error(`❌ BATCH VALIDATE: Not an array in ${context}:`, {
        type: typeof stops,
        value: stops
      });
      return {
        validStops: [],
        invalidStops: [],
        summary: { total: 0, valid: 0, invalid: 0, errorCount: 1, warningCount: 0 }
      };
    }

    stops.forEach((stop, index) => {
      const result = this.validateTripStop(stop, `${context}[${index}]`);
      
      errorCount += result.errors.length;
      warningCount += result.warnings.length;

      if (result.isValid) {
        validStops.push(stop as TripStop);
      } else {
        invalidStops.push({ stop, errors: result.errors });
      }
    });

    const summary = {
      total: stops.length,
      valid: validStops.length,
      invalid: invalidStops.length,
      errorCount,
      warningCount
    };

    console.log(`📊 BATCH VALIDATION SUMMARY for ${context}:`, summary);

    return { validStops, invalidStops, summary };
  }
}
