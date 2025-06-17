
export interface DriveTimeValidation {
  isValid: boolean;
  actualDriveTime: number;
  maxAllowed: number;
  recommendation: string;
}

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

  /**
   * Validate segment drive time against constraints
   */
  static validateSegmentDriveTime(
    startStop: any,
    endStop: any,
    styleConfig: any
  ): DriveTimeValidation {
    // Calculate distance between stops
    const distance = this.calculateDistance(
      startStop.latitude, 
      startStop.longitude, 
      endStop.latitude, 
      endStop.longitude
    );
    
    const actualDriveTime = this.calculateRealisticDriveTime(distance);
    const maxAllowed = styleConfig?.maxDailyDriveHours || this.MAX_DAILY_DRIVE_HOURS;
    const isValid = actualDriveTime <= maxAllowed;
    
    let recommendation = '';
    if (!isValid) {
      recommendation = `Drive time of ${actualDriveTime.toFixed(1)}h exceeds ${maxAllowed}h limit. Consider splitting this segment.`;
    } else if (actualDriveTime > maxAllowed * 0.8) {
      recommendation = `Drive time of ${actualDriveTime.toFixed(1)}h is close to the ${maxAllowed}h limit. Monitor for fatigue.`;
    } else {
      recommendation = `Drive time of ${actualDriveTime.toFixed(1)}h is within acceptable limits.`;
    }
    
    console.log(`🔍 SEGMENT VALIDATION: ${startStop.name} → ${endStop.name} = ${actualDriveTime.toFixed(1)}h (${isValid ? 'VALID' : 'INVALID'})`);
    
    return {
      isValid,
      actualDriveTime,
      maxAllowed,
      recommendation
    };
  }

  /**
   * Calculate distance between two points in miles
   */
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }

  private static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
