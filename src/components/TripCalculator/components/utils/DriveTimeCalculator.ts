
export class DriveTimeCalculator {
  /**
   * Calculate and format drive time from segment data
   */
  static formatDriveTime(segment: any): string {
    console.log('🚗 DriveTimeCalculator: Calculating for', segment.endCity, {
      driveTimeHours: segment.driveTimeHours,
      distance: segment.distance,
      hasValidDriveTime: typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0,
      hasValidDistance: typeof segment.distance === 'number' && segment.distance > 0
    });
    
    // Priority 1: Use driveTimeHours if available and valid
    if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
      const hours = Math.floor(segment.driveTimeHours);
      const minutes = Math.round((segment.driveTimeHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      
      console.log('✅ DriveTimeCalculator: Using driveTimeHours for', segment.endCity, { 
        hours, 
        minutes, 
        total: segment.driveTimeHours, 
        formatted 
      });
      return formatted;
    }
    
    // Priority 2: Calculate from distance if available
    if (typeof segment.distance === 'number' && segment.distance > 0) {
      const estimatedHours = segment.distance / 55; // 55 mph average
      const hours = Math.floor(estimatedHours);
      const minutes = Math.round((estimatedHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      
      console.log('⚠️ DriveTimeCalculator: Using distance calculation for', segment.endCity, { 
        distance: segment.distance, 
        estimatedHours, 
        hours, 
        minutes, 
        formatted 
      });
      return formatted;
    }
    
    // Fallback
    console.log('❌ DriveTimeCalculator: Using fallback time for', segment.endCity);
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
