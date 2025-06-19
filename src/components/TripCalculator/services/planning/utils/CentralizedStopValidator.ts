
import { TripStop } from '../../../types/TripStop';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class CentralizedStopValidator {
  /**
   * Comprehensive validation for TripStop objects
   */
  static validateTripStop(stop: any, context: string = 'unknown'): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic existence check
    if (!stop) {
      errors.push(`Stop is null/undefined in ${context}`);
      return { isValid: false, errors, warnings };
    }

    if (typeof stop !== 'object') {
      errors.push(`Stop is not an object (${typeof stop}) in ${context}`);
      return { isValid: false, errors, warnings };
    }

    // Required string properties
    if (!stop.id || typeof stop.id !== 'string' || stop.id.trim() === '') {
      errors.push(`Invalid or missing ID in ${context}`);
    }

    if (!stop.name || typeof stop.name !== 'string' || stop.name.trim() === '') {
      errors.push(`Invalid or missing name in ${context}`);
    }

    // Required coordinate properties
    if (typeof stop.latitude !== 'number') {
      errors.push(`Latitude is not a number (${typeof stop.latitude}) in ${context}`);
    } else if (isNaN(stop.latitude)) {
      errors.push(`Latitude is NaN in ${context}`);
    } else if (stop.latitude < -90 || stop.latitude > 90) {
      errors.push(`Latitude out of valid range (${stop.latitude}) in ${context}`);
    }

    if (typeof stop.longitude !== 'number') {
      errors.push(`Longitude is not a number (${typeof stop.longitude}) in ${context}`);
    } else if (isNaN(stop.longitude)) {
      errors.push(`Longitude is NaN in ${context}`);
    } else if (stop.longitude < -180 || stop.longitude > 180) {
      errors.push(`Longitude out of valid range (${stop.longitude}) in ${context}`);
    }

    // Zero coordinate warning
    if (stop.latitude === 0 && stop.longitude === 0) {
      warnings.push(`Coordinates are both zero (likely missing data) in ${context}`);
    }

    // Optional property checks
    if (stop.city_name && typeof stop.city_name !== 'string') {
      warnings.push(`city_name should be string but is ${typeof stop.city_name} in ${context}`);
    }

    if (stop.state && typeof stop.state !== 'string') {
      warnings.push(`state should be string but is ${typeof stop.state} in ${context}`);
    }

    const isValid = errors.length === 0;

    if (!isValid) {
      console.error(`❌ VALIDATION FAILED in ${context}:`, { stop, errors, warnings });
    } else if (warnings.length > 0) {
      console.warn(`⚠️ VALIDATION WARNINGS in ${context}:`, { stop, warnings });
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
      console.error(`❌ FILTER: Not an array in ${context}:`, typeof stops);
      return [];
    }

    const validStops: TripStop[] = [];
    const validationResults: Array<{ index: number; result: ValidationResult; stop: any }> = [];

    stops.forEach((stop, index) => {
      const result = this.validateTripStop(stop, `${context}[${index}]`);
      validationResults.push({ index, result, stop });

      if (result.isValid) {
        validStops.push(stop as TripStop);
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
   * Safely extract coordinates from any object
   */
  static safeGetCoordinates(obj: any, context: string = 'unknown'): { latitude: number; longitude: number } | null {
    const validation = this.validateTripStop(obj, context);
    
    if (!validation.isValid) {
      console.error(`❌ COORDINATES: Cannot extract coordinates - validation failed in ${context}`);
      return null;
    }

    return {
      latitude: obj.latitude,
      longitude: obj.longitude
    };
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
      console.error(`❌ BATCH VALIDATE: Not an array in ${context}:`, typeof stops);
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
