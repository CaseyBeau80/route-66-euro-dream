
import { TripStop } from '../../../types/TripStop';
import { ObjectSafetyValidator } from './ObjectSafetyValidator';

export class CoordinateValidator {
  /**
   * Safely access latitude with detailed error logging
   */
  static safeGetLatitude(obj: any, context: string = 'unknown'): number | null {
    const validation = ObjectSafetyValidator.validateObjectWithCoordinates(obj, `${context}-latitude`);
    
    if (!validation.isValid) {
      console.error(`❌ COORDINATE ACCESS: ${validation.error}`);
      return null;
    }

    return ObjectSafetyValidator.safePropertyAccess(obj, 'latitude', context);
  }

  /**
   * Safely access longitude with detailed error logging
   */
  static safeGetLongitude(obj: any, context: string = 'unknown'): number | null {
    const validation = ObjectSafetyValidator.validateObjectWithCoordinates(obj, `${context}-longitude`);
    
    if (!validation.isValid) {
      console.error(`❌ COORDINATE ACCESS: ${validation.error}`);
      return null;
    }

    return ObjectSafetyValidator.safePropertyAccess(obj, 'longitude', context);
  }

  /**
   * Safely get both coordinates with validation
   */
  static safeGetCoordinates(obj: any, context: string = 'unknown'): { latitude: number; longitude: number } | null {
    const validation = ObjectSafetyValidator.validateObjectWithCoordinates(obj, `${context}-coordinates`);
    
    if (!validation.isValid) {
      console.error(`❌ COORDINATE ACCESS: Cannot get coordinates - ${validation.error}`);
      return null;
    }

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
    const validation = ObjectSafetyValidator.validateObjectWithCoordinates(obj, 'validation-check');
    return validation.isValid;
  }
}
