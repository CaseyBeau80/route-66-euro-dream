
export class DistanceCalculationService {
  /**
   * Calculate distance between two points using Haversine formula
   * Returns distance in miles
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    // Validate input coordinates
    if (!this.isValidCoordinate(lat1, lon1) || !this.isValidCoordinate(lat2, lon2)) {
      console.warn('⚠️ Invalid coordinates provided to distance calculation:', {
        lat1, lon1, lat2, lon2
      });
      return 0;
    }

    const R = 3958.756; // Radius of Earth in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    console.log(`📏 Distance calculation:`, {
      from: `${lat1.toFixed(4)}, ${lon1.toFixed(4)}`,
      to: `${lat2.toFixed(4)}, ${lon2.toFixed(4)}`,
      distance: `${distance.toFixed(1)} miles`
    });

    return Math.max(0, distance); // Ensure non-negative distance
  }

  /**
   * Validate that coordinates are reasonable
   */
  private static isValidCoordinate(lat: number, lon: number): boolean {
    return (
      typeof lat === 'number' && 
      typeof lon === 'number' &&
      !isNaN(lat) && 
      !isNaN(lon) &&
      lat >= -90 && lat <= 90 &&
      lon >= -180 && lon <= 180 &&
      lat !== 0 && lon !== 0 // Exclude null island
    );
  }

  /**
   * Convert degrees to radians
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate estimated drive time in hours
   * Assumes average speed of 55 mph for Route 66
   */
  static calculateDriveTime(distanceMiles: number): number {
    const averageSpeed = 55; // mph for Route 66
    const driveTime = distanceMiles / averageSpeed;
    
    console.log(`⏱️ Drive time calculation: ${distanceMiles.toFixed(1)} miles ÷ ${averageSpeed} mph = ${driveTime.toFixed(1)} hours`);
    
    return Math.max(0, driveTime);
  }
}
