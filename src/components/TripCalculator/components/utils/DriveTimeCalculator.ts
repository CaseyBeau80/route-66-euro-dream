
export class DriveTimeCalculator {
  /**
   * FIXED: Calculate and format drive time using the SAME priority logic as shared views
   * Priority: drivingTime first (correct values), then driveTimeHours (often incorrect defaults)
   */
  static formatDriveTime(segment: any): string {
    console.log('🚗 FIXED: DriveTimeCalculator using CORRECT priority logic for', segment.endCity, {
      segmentStructure: {
        drivingTime: segment.drivingTime, // PRIORITY 1 - correct calculated values
        driveTimeHours: segment.driveTimeHours, // PRIORITY 2 - often incorrect defaults
        distance: segment.distance,
        startCity: segment.startCity,
        endCity: segment.endCity,
        day: segment.day
      }
    });
    
    // FIXED: Priority 1 - Use drivingTime if available (contains CORRECT calculated values)
    if (typeof segment.drivingTime === 'number' && segment.drivingTime > 0) {
      console.log('✅ FIXED: Using drivingTime (correct values):', segment.drivingTime);
      return this.formatHours(segment.drivingTime);
    }
    
    // FIXED: Priority 2 - Use driveTimeHours if available (often contains incorrect defaults)
    if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
      console.log('⚠️ FIXED: Using driveTimeHours (may be default):', segment.driveTimeHours);
      return this.formatHours(segment.driveTimeHours);
    }
    
    // FIXED: Priority 3 - Calculate from distance if available (same as shared views)
    if (typeof segment.distance === 'number' && segment.distance > 0) {
      const estimatedHours = segment.distance / 55; // 55 mph average (same as shared views)
      console.log('🧮 FIXED: Calculating from distance:', { distance: segment.distance, estimatedHours });
      return this.formatHours(estimatedHours);
    }
    
    // FIXED: Final fallback (same as shared views)
    console.log('⚠️ FIXED: Using final fallback for', segment.endCity);
    return '2h 30m';
  }

  /**
   * FIXED: Format hours into readable string (same as shared views)
   */
  static formatHours(hours: number): string {
    if (!hours || hours === 0) {
      return '0h 0m';
    }
    
    // FIXED: Same formatting logic as shared views
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  }

  /**
   * FIXED: Calculate total driving time using correct priority logic
   */
  static calculateTotalDriveTime(segments: any[]): number {
    let total = 0;
    
    segments.forEach((segment) => {
      // FIXED: Use same priority logic as formatDriveTime - drivingTime first
      if (typeof segment.drivingTime === 'number' && segment.drivingTime > 0) {
        total += segment.drivingTime;
      } else if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
        total += segment.driveTimeHours;
      } else if (typeof segment.distance === 'number' && segment.distance > 0) {
        const estimated = segment.distance / 55; // 55 mph average
        total += estimated;
      } else {
        // Fallback
        total += 2.5;
      }
    });
    
    return total;
  }

  /**
   * FIXED: Get actual drive time using correct priority logic
   */
  static getActualDriveTime(segment: any): number {
    // FIXED: Priority 1 - Use drivingTime (correct values)
    if (typeof segment.drivingTime === 'number' && segment.drivingTime > 0) {
      return segment.drivingTime;
    }
    
    // FIXED: Priority 2 - Use driveTimeHours (may be defaults)
    if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
      return segment.driveTimeHours;
    }
    
    // FIXED: Priority 3 - Calculate from distance
    if (typeof segment.distance === 'number' && segment.distance > 0) {
      return segment.distance / 55;
    }
    
    // FIXED: Final fallback
    return 2.5;
  }
}
