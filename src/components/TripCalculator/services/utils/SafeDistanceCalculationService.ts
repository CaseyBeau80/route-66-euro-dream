
import { CoordinateValidator } from '../planning/utils/CoordinateValidator';
import { ObjectSafetyValidator } from '../planning/utils/ObjectSafetyValidator';

export class SafeDistanceCalculationService {
  /**
   * Calculate distance with comprehensive error handling and validation
   */
  static calculateDistance(
    obj1: any, 
    obj2: any,
    context: string = 'distance-calculation'
  ): number {
    console.log(`📏 Safe distance calculation between objects in ${context}`);

    // ENHANCED: Use comprehensive object validation first
    const obj1Validation = ObjectSafetyValidator.validateObjectWithCoordinates(obj1, `${context}-obj1`);
    const obj2Validation = ObjectSafetyValidator.validateObjectWithCoordinates(obj2, `${context}-obj2`);

    if (!obj1Validation.isValid) {
      console.error(`❌ DISTANCE CALC: Object 1 validation failed: ${obj1Validation.error}`);
      return 0;
    }

    if (!obj2Validation.isValid) {
      console.error(`❌ DISTANCE CALC: Object 2 validation failed: ${obj2Validation.error}`);
      return 0;
    }

    // Safely get coordinates with detailed error reporting
    const coords1 = CoordinateValidator.safeGetCoordinates(obj1, `${context}-obj1`);
    const coords2 = CoordinateValidator.safeGetCoordinates(obj2, `${context}-obj2`);

    if (!coords1) {
      console.error(`❌ DISTANCE CALC: Failed to get coordinates for first object in ${context}:`, {
        obj1,
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return 0;
    }

    if (!coords2) {
      console.error(`❌ DISTANCE CALC: Failed to get coordinates for second object in ${context}:`, {
        obj2,
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return 0;
    }

    // Wrap the actual calculation in safety wrapper
    return ObjectSafetyValidator.wrapCoordinateAccess(() => {
      // Haversine formula
      const R = 3959; // Earth's radius in miles
      const dLat = (coords2.latitude - coords1.latitude) * Math.PI / 180;
      const dLon = (coords2.longitude - coords1.longitude) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coords1.latitude * Math.PI / 180) * Math.cos(coords2.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      console.log(`📏 Safe distance calculated: ${distance.toFixed(1)} miles in ${context}`);
      return distance;
    }, `haversine-calculation-${context}`, 0);
  }

  /**
   * Legacy method for backward compatibility - use lat/lng directly
   */
  static calculateDistanceByCoords(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    if (typeof lat1 !== 'number' || typeof lng1 !== 'number' || 
        typeof lat2 !== 'number' || typeof lng2 !== 'number') {
      console.error('❌ DISTANCE CALC: Invalid coordinate types:', {
        lat1: { value: lat1, type: typeof lat1 },
        lng1: { value: lng1, type: typeof lng1 },
        lat2: { value: lat2, type: typeof lat2 },
        lng2: { value: lng2, type: typeof lng2 }
      });
      return 0;
    }

    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
