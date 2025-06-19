
import { CoordinateValidator } from '../planning/utils/CoordinateValidator';

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

    try {
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
    } catch (error) {
      console.error(`❌ DISTANCE CALC: Error in calculation for ${context}:`, {
        error,
        coords1,
        coords2,
        context,
        stack: new Error().stack?.split('\n').slice(1, 5).join('\n')
      });
      return 0;
    }
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
