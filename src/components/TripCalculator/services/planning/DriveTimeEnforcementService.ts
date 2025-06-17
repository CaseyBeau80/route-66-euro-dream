export interface DriveTimeValidation {
  isValid: boolean;
  actualDriveTime: number;
  maxAllowed: number;
  recommendation: string;
}

export class DriveTimeEnforcementService {
  private static readonly MAX_DAILY_DRIVE_HOURS = 8;
  private static readonly ABSOLUTE_EMERGENCY_CAP = 10; // Never exceed this under any circumstances
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * EMERGENCY FIX: Calculate realistic drive time with ABSOLUTE limits
   */
  static calculateRealisticDriveTime(distance: number): number {
    console.log(`🚨 EMERGENCY DRIVE TIME FIX: ${distance.toFixed(1)} miles`);
    
    // Handle edge cases
    if (distance <= 0 || !isFinite(distance) || isNaN(distance)) {
      console.log(`🚨 Invalid distance, returning 2h`);
      return 2;
    }
    
    // EMERGENCY CHECK: If distance suggests impossible drive time, cap it immediately
    if (distance > 500) {
      console.error(`🚨 EMERGENCY: Distance ${distance.toFixed(1)}mi > 500mi - This suggests a route planning error!`);
      console.error(`🚨 EMERGENCY: Capping to maximum ${this.ABSOLUTE_EMERGENCY_CAP}h to prevent impossible drives`);
      return this.ABSOLUTE_EMERGENCY_CAP;
    }
    
    // Calculate realistic drive time
    let avgSpeed: number;
    if (distance < 100) {
      avgSpeed = 45; // City driving, stops
    } else if (distance < 200) {
      avgSpeed = 50; // Mixed driving
    } else if (distance < 400) {
      avgSpeed = 55; // Highway driving
    } else {
      avgSpeed = 60; // Long highway segments
    }
    
    const baseTime = distance / avgSpeed;
    const timeWithBuffer = baseTime * 1.2; // Add 20% buffer for stops, traffic
    
    // ABSOLUTE EMERGENCY CAP: Never exceed 10 hours under any circumstances
    const finalTime = Math.min(timeWithBuffer, this.ABSOLUTE_EMERGENCY_CAP);
    
    console.log(`✅ EMERGENCY CALC: ${distance.toFixed(1)}mi = ${finalTime.toFixed(1)}h (emergency capped at ${this.ABSOLUTE_EMERGENCY_CAP}h)`);
    
    // Final safety check - if still too high, force to max
    if (finalTime > this.ABSOLUTE_EMERGENCY_CAP) {
      console.error(`🚨 CRITICAL EMERGENCY: Final time ${finalTime}h > ${this.ABSOLUTE_EMERGENCY_CAP}h - FORCING to cap`);
      return this.ABSOLUTE_EMERGENCY_CAP;
    }
    
    return Math.max(finalTime, 1); // Minimum 1 hour
  }

  /**
   * EMERGENCY: Validate segment distance and split if needed
   */
  static validateAndFixSegmentDistance(
    startStop: any,
    endStop: any,
    maxDriveHours: number = 8
  ): {
    isValid: boolean;
    needsSplitting: boolean;
    recommendedSplits: number;
    actualDistance: number;
    actualDriveTime: number;
  } {
    const distance = this.calculateDistance(
      startStop.latitude, 
      startStop.longitude, 
      endStop.latitude, 
      endStop.longitude
    );
    
    const driveTime = this.calculateRealisticDriveTime(distance);
    const isValid = driveTime <= maxDriveHours;
    const needsSplitting = distance > 400 || driveTime > maxDriveHours;
    
    // Calculate how many segments this should be split into
    const recommendedSplits = needsSplitting ? Math.ceil(driveTime / maxDriveHours) : 1;
    
    console.log(`🔍 EMERGENCY VALIDATION: ${startStop.name} → ${endStop.name}:`, {
      distance: distance.toFixed(1),
      driveTime: driveTime.toFixed(1),
      isValid,
      needsSplitting,
      recommendedSplits,
      maxAllowed: maxDriveHours
    });
    
    if (needsSplitting) {
      console.error(`❌ EMERGENCY: Segment needs splitting into ${recommendedSplits} parts!`);
    }
    
    return {
      isValid,
      needsSplitting,
      recommendedSplits,
      actualDistance: distance,
      actualDriveTime: driveTime
    };
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
