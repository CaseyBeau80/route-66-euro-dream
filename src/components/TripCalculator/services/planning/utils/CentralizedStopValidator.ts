
import { TripStop } from '../../../types/TripStop';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class CentralizedStopValidator {
  /**
   * BULLETPROOF validation for TripStop objects - prevents all undefined coordinate access
   */
  static validateTripStop(stop: any, context: string = 'unknown'): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // CRITICAL: First check - absolute null/undefined safety
    if (stop === null) {
      errors.push(`Stop is null in ${context}`);
      console.error(`❌ CRITICAL: Stop is null in ${context}`, { 
        stop, 
        context,
        stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
      });
      return { isValid: false, errors, warnings };
    }

    if (stop === undefined) {
      errors.push(`Stop is undefined in ${context}`);
      console.error(`❌ CRITICAL: Stop is undefined in ${context}`, { 
        stop, 
        context,
        stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
      });
      return { isValid: false, errors, warnings };
    }

    if (typeof stop !== 'object') {
      errors.push(`Stop is not an object (${typeof stop}) in ${context}`);
      console.error(`❌ CRITICAL: Stop is not an object in ${context}`, { 
        stop, 
        type: typeof stop,
        context,
        stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
      });
      return { isValid: false, errors, warnings };
    }

    // Required string properties with bulletproof checking
    if (!('id' in stop) || stop.id === null || stop.id === undefined || typeof stop.id !== 'string' || stop.id.trim() === '') {
      errors.push(`Invalid or missing ID in ${context}`);
      console.error(`❌ CRITICAL: Invalid ID in ${context}`, { 
        hasId: 'id' in stop,
        id: stop.id,
        idType: typeof stop.id,
        context
      });
    }

    if (!('name' in stop) || stop.name === null || stop.name === undefined || typeof stop.name !== 'string' || stop.name.trim() === '') {
      errors.push(`Invalid or missing name in ${context}`);
      console.error(`❌ CRITICAL: Invalid name in ${context}`, { 
        hasName: 'name' in stop,
        name: stop.name,
        nameType: typeof stop.name,
        context
      });
    }

    // BULLETPROOF coordinate validation - this is where the error occurs
    if (!('latitude' in stop)) {
      errors.push(`Missing latitude property in ${context}`);
      console.error(`❌ CRITICAL: Missing latitude property in ${context}`, { 
        stop: JSON.stringify(stop, null, 2),
        properties: Object.keys(stop),
        context
      });
    } else if (stop.latitude === null || stop.latitude === undefined) {
      errors.push(`Latitude is null/undefined in ${context}`);
      console.error(`❌ CRITICAL: Latitude is null/undefined in ${context}`, { 
        latitude: stop.latitude,
        context
      });
    } else if (typeof stop.latitude !== 'number') {
      errors.push(`Latitude is not a number (${typeof stop.latitude}) in ${context}`);
      console.error(`❌ CRITICAL: Latitude is not a number in ${context}`, { 
        latitude: stop.latitude,
        type: typeof stop.latitude,
        context
      });
    } else if (isNaN(stop.latitude)) {
      errors.push(`Latitude is NaN in ${context}`);
      console.error(`❌ CRITICAL: Latitude is NaN in ${context}`, { 
        latitude: stop.latitude,
        context
      });
    } else if (stop.latitude < -90 || stop.latitude > 90) {
      errors.push(`Latitude out of valid range (${stop.latitude}) in ${context}`);
      console.error(`❌ CRITICAL: Latitude out of range in ${context}`, { 
        latitude: stop.latitude,
        context
      });
    }

    if (!('longitude' in stop)) {
      errors.push(`Missing longitude property in ${context}`);
      console.error(`❌ CRITICAL: Missing longitude property in ${context}`, { 
        stop: JSON.stringify(stop, null, 2),
        properties: Object.keys(stop),
        context
      });
    } else if (stop.longitude === null || stop.longitude === undefined) {
      errors.push(`Longitude is null/undefined in ${context}`);
      console.error(`❌ CRITICAL: Longitude is null/undefined in ${context}`, { 
        longitude: stop.longitude,
        context
      });
    } else if (typeof stop.longitude !== 'number') {
      errors.push(`Longitude is not a number (${typeof stop.longitude}) in ${context}`);
      console.error(`❌ CRITICAL: Longitude is not a number in ${context}`, { 
        longitude: stop.longitude,
        type: typeof stop.longitude,
        context
      });
    } else if (isNaN(stop.longitude)) {
      errors.push(`Longitude is NaN in ${context}`);
      console.error(`❌ CRITICAL: Longitude is NaN in ${context}`, { 
        longitude: stop.longitude,
        context
      });
    } else if (stop.longitude < -180 || stop.longitude > 180) {
      errors.push(`Longitude out of valid range (${stop.longitude}) in ${context}`);
      console.error(`❌ CRITICAL: Longitude out of range in ${context}`, { 
        longitude: stop.longitude,
        context
      });
    }

    // Zero coordinate warning
    if (stop.latitude === 0 && stop.longitude === 0) {
      warnings.push(`Coordinates are both zero (likely missing data) in ${context}`);
      console.warn(`⚠️ Zero coordinates in ${context}`, { 
        name: stop.name,
        context
      });
    }

    const isValid = errors.length === 0;

    if (!isValid) {
      console.error(`❌ VALIDATION FAILED in ${context}:`, { 
        stopName: stop?.name || 'unknown',
        stopId: stop?.id || 'unknown',
        errors, 
        warnings,
        stopKeys: Object.keys(stop || {}),
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
    } else if (warnings.length > 0) {
      console.warn(`⚠️ VALIDATION WARNINGS in ${context}:`, { 
        stopName: stop.name,
        warnings 
      });
    } else {
      console.log(`✅ VALIDATION PASSED in ${context}: ${stop.name}`);
    }

    return { isValid, errors, warnings };
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
