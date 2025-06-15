
export class DriveTimeCalculator {
  /**
   * CRITICAL FIX: Calculate and format drive time from segment data
   */
  static formatDriveTime(segment: any): string {
    console.log('🚗 CRITICAL FIX: DriveTimeCalculator for', segment.endCity, {
      driveTimeHours: segment.driveTimeHours,
      distance: segment.distance,
      hasValidDriveTime: typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0,
      hasValidDistance: typeof segment.distance === 'number' && segment.distance > 0,
      segmentStructure: {
        startCity: segment.startCity,
        endCity: segment.endCity,
        day: segment.day
      }
    });
    
    // CRITICAL FIX: Priority 1 - Use driveTimeHours if available and valid
    if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
      const hours = Math.floor(segment.driveTimeHours);
      const minutes = Math.round((segment.driveTimeHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      
      console.log('✅ CRITICAL FIX: Using actual driveTimeHours for', segment.endCity, { 
        originalHours: segment.driveTimeHours,
        formattedHours: hours, 
        formattedMinutes: minutes, 
        finalResult: formatted 
      });
      return formatted;
    }
    
    // CRITICAL FIX: Priority 2 - Calculate from distance if available
    if (typeof segment.distance === 'number' && segment.distance > 0) {
      const estimatedHours = segment.distance / 55; // 55 mph average
      const hours = Math.floor(estimatedHours);
      const minutes = Math.round((estimatedHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      
      console.log('⚠️ CRITICAL FIX: Calculating from distance for', segment.endCity, { 
        distance: segment.distance, 
        estimatedHours, 
        formattedHours: hours, 
        formattedMinutes: minutes, 
        finalResult: formatted 
      });
      return formatted;
    }
    
    // CRITICAL FIX: Fallback with warning
    console.warn('❌ CRITICAL FIX: Using fallback drive time for', segment.endCity, {
      reason: 'No valid driveTimeHours or distance found',
      segmentData: {
        driveTimeHours: segment.driveTimeHours,
        distance: segment.distance,
        hasProperties: Object.keys(segment)
      }
    });
    return '3h 30m';
  }

  /**
   * Calculate total driving time for multiple segments
   */
  static calculateTotalDriveTime(segments: any[]): number {
    return segments.reduce((total, segment) => {
      if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
        return total + segment.driveTimeHours;
      }
      
      if (typeof segment.distance === 'number' && segment.distance > 0) {
        return total + (segment.distance / 55);
      }
      
      return total + 3.5; // fallback 3.5 hours
    }, 0);
  }

  /**
   * Format hours into readable string
   */
  static formatHours(hours: number): string {
    if (!hours || hours === 0) {
      console.warn('⚠️ DriveTimeCalculator.formatHours: Invalid hours value:', hours);
      return '0h 0m';
    }
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  }
}
