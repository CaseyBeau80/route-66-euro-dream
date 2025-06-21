
export class DistanceCalculationService {
  /**
   * Calculate distance between two points using Haversine formula
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }

  /**
   * Calculate distance between two TripStop objects
   */
  static calculateDistanceBetweenObjects(stop1: any, stop2: any): number {
    if (!stop1 || !stop2 || !stop1.latitude || !stop1.longitude || !stop2.latitude || !stop2.longitude) {
      return 0;
    }
    
    return this.calculateDistance(
      stop1.latitude,
      stop1.longitude,
      stop2.latitude,
      stop2.longitude
    );
  }

  /**
   * Validate inputs for distance calculation
   */
  static validateDistanceInputs(stop1: any, stop2: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!stop1) {
      errors.push('First stop is null or undefined');
    } else {
      if (typeof stop1.latitude !== 'number' || isNaN(stop1.latitude)) {
        errors.push('First stop latitude is not a valid number');
      }
      if (typeof stop1.longitude !== 'number' || isNaN(stop1.longitude)) {
        errors.push('First stop longitude is not a valid number');
      }
    }
    
    if (!stop2) {
      errors.push('Second stop is null or undefined');
    } else {
      if (typeof stop2.latitude !== 'number' || isNaN(stop2.latitude)) {
        errors.push('Second stop latitude is not a valid number');
      }
      if (typeof stop2.longitude !== 'number' || isNaN(stop2.longitude)) {
        errors.push('Second stop longitude is not a valid number');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert degrees to radians
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate driving time based on distance
   */
  static calculateDrivingTime(distanceMiles: number, averageSpeedMph: number = 50): number {
    return distanceMiles / averageSpeedMph;
  }

  /**
   * Alias for calculateDrivingTime for backward compatibility
   */
  static calculateDriveTime(distanceMiles: number, averageSpeedMph: number = 50): number {
    return this.calculateDrivingTime(distanceMiles, averageSpeedMph);
  }
}
