
export class DriveTimeEnforcementService {
  private static readonly MAX_DAILY_DRIVE_HOURS = 8;
  private static readonly ABSOLUTE_MAX_HOURS = 10;
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * NUCLEAR OPTION: Calculate realistic drive time with ABSOLUTE limits
   */
  static calculateRealisticDriveTime(distance: number): number {
    console.log(`🚨 NUCLEAR DRIVE TIME: ${distance.toFixed(1)} miles`);
    
    // Handle edge cases
    if (distance <= 0 || !isFinite(distance) || isNaN(distance)) {
      console.log(`🚨 Invalid distance, returning 1h`);
      return 1;
    }
    
    // ABSOLUTE ENFORCEMENT: No drive time can exceed 8 hours
    const maxDistance = this.MAX_DAILY_DRIVE_HOURS * this.AVG_SPEED_MPH; // 400 miles
    
    if (distance > maxDistance) {
      console.warn(`🚨 DISTANCE EXCEEDS LIMIT: ${distance.toFixed(1)}mi > ${maxDistance}mi - CAPPING to ${this.MAX_DAILY_DRIVE_HOURS}h`);
      return this.MAX_DAILY_DRIVE_HOURS;
    }
    
    // Calculate realistic drive time
    let avgSpeed: number;
    if (distance < 100) {
      avgSpeed = 45; // City driving, stops
    } else if (distance < 200) {
      avgSpeed = 50; // Mixed driving
    } else {
      avgSpeed = 55; // Highway driving
    }
    
    const baseTime = distance / avgSpeed;
    const timeWithBuffer = baseTime * 1.2; // Add 20% buffer for stops, traffic
    
    // ABSOLUTE CAP: Never exceed 8 hours
    const finalTime = Math.min(timeWithBuffer, this.MAX_DAILY_DRIVE_HOURS);
    
    console.log(`✅ NUCLEAR CALC: ${distance.toFixed(1)}mi = ${finalTime.toFixed(1)}h (capped at ${this.MAX_DAILY_DRIVE_HOURS}h)`);
    
    return Math.max(finalTime, 1); // Minimum 1 hour
  }

  /**
   * Validate if a distance is acceptable for daily driving
   */
  static validateDailyDistance(distance: number): {
    isValid: boolean;
    driveTime: number;
    recommendation: string;
  } {
    const driveTime = this.calculateRealisticDriveTime(distance);
    const isValid = driveTime <= this.MAX_DAILY_DRIVE_HOURS;
    
    let recommendation = '';
    if (!isValid) {
      recommendation = `Distance of ${distance.toFixed(0)}mi (${driveTime.toFixed(1)}h) exceeds daily limit. Split into multiple days.`;
    } else if (driveTime > 6) {
      recommendation = `Long drive day: ${driveTime.toFixed(1)}h. Consider breaks every 2 hours.`;
    } else {
      recommendation = `Comfortable drive time: ${driveTime.toFixed(1)}h`;
    }
    
    return {
      isValid,
      driveTime,
      recommendation
    };
  }
}
