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
    // CRITICAL: Validate all inputs before any calculation
    if (lat1 === undefined || lat1 === null || typeof lat1 !== 'number' || isNaN(lat1)) {
      console.error('❌ DISTANCE: Invalid lat1:', { lat1, type: typeof lat1 });
      return 0;
    }
    
    if (lng1 === undefined || lng1 === null || typeof lng1 !== 'number' || isNaN(lng1)) {
      console.error('❌ DISTANCE: Invalid lng1:', { lng1, type: typeof lng1 });
      return 0;
    }
    
    if (lat2 === undefined || lat2 === null || typeof lat2 !== 'number' || isNaN(lat2)) {
      console.error('❌ DISTANCE: Invalid lat2:', { lat2, type: typeof lat2 });
      return 0;
    }
    
    if (lng2 === undefined || lng2 === null || typeof lng2 !== 'number' || isNaN(lng2)) {
      console.error('❌ DISTANCE: Invalid lng2:', { lng2, type: typeof lng2 });
      return 0;
    }

    try {
      // Haversine formula
      const R = 3959; // Earth's radius in miles
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lng2 - lng1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return distance;
    } catch (error) {
      console.error('❌ DISTANCE CALCULATION ERROR:', error, {
        lat1, lng1, lat2, lng2
      });
      return 0;
    }
  }

  /**
   * Safe distance calculation between two objects with coordinates
   */
  static calculateDistanceBetweenObjects(obj1: any, obj2: any): number {
    // CRITICAL: Validate objects exist
    if (!obj1) {
      console.error('❌ DISTANCE: obj1 is null/undefined:', { obj1, stack: new Error().stack?.split('\n').slice(1, 3).join('\n') });
      return 0;
    }
    
    if (!obj2) {
      console.error('❌ DISTANCE: obj2 is null/undefined:', { obj2, stack: new Error().stack?.split('\n').slice(1, 3).join('\n') });
      return 0;
    }

    // CRITICAL: Validate objects are actually objects
    if (typeof obj1 !== 'object') {
      console.error('❌ DISTANCE: obj1 is not an object:', { obj1, type: typeof obj1 });
      return 0;
    }
    
    if (typeof obj2 !== 'object') {
      console.error('❌ DISTANCE: obj2 is not an object:', { obj2, type: typeof obj2 });
      return 0;
    }

    // Extract coordinates safely
    const lat1 = obj1.latitude;
    const lng1 = obj1.longitude;
    const lat2 = obj2.latitude;
    const lng2 = obj2.longitude;

    return this.calculateDistance(lat1, lng1, lat2, lng2);
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
}
