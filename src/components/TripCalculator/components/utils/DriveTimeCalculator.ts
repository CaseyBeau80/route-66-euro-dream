
export class DriveTimeCalculator {
  /**
   * FIXED: Calculate and format drive time using the SAME logic as preview/shared views
   */
  static formatDriveTime(segment: any): string {
    console.log('🚗 CONSISTENT: DriveTimeCalculator using same logic as preview/shared views for', segment.endCity, {
      segmentStructure: {
        driveTimeHours: segment.driveTimeHours,
        drivingTime: segment.drivingTime,
        distance: segment.distance,
        startCity: segment.startCity,
        endCity: segment.endCity,
        day: segment.day
      }
    });
    
    // CONSISTENT: Priority 1 - Use driveTimeHours if available (same as shared views)
    if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
      return this.formatHours(segment.driveTimeHours);
    }
    
    // CONSISTENT: Priority 2 - Use drivingTime if available (same as shared views)
    if (typeof segment.drivingTime === 'number' && segment.drivingTime > 0) {
      return this.formatHours(segment.drivingTime);
    }
    
    // CONSISTENT: Priority 3 - Calculate from distance if available (same as shared views)
    if (typeof segment.distance === 'number' && segment.distance > 0) {
      const estimatedHours = segment.distance / 55; // 55 mph average (same as shared views)
      return this.formatHours(estimatedHours);
    }
    
    // CONSISTENT: Final fallback (same as shared views)
    console.log('⚠️ CONSISTENT: Using final fallback for', segment.endCity);
    return '2h 30m';
  }

  /**
   * CONSISTENT: Format hours into readable string (same as shared views)
   */
  static formatHours(hours: number): string {
    if (!hours || hours === 0) {
      return '0h 0m';
    }
    
    // CONSISTENT: Same formatting logic as shared views
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  }

  /**
   * Calculate total driving time for multiple segments
   */
  static calculateTotalDriveTime(segments: any[]): number {
    let total = 0;
    
    segments.forEach((segment) => {
      // CONSISTENT: Use same priority logic as formatDriveTime
      if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
        total += segment.driveTimeHours;
      } else if (typeof segment.drivingTime === 'number' && segment.drivingTime > 0) {
        total += segment.drivingTime;
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
}
