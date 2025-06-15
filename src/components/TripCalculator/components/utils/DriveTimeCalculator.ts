
export class DriveTimeCalculator {
  /**
   * CRITICAL FIX: Calculate and format drive time from segment data
   */
  static formatDriveTime(segment: any): string {
    console.log('🚗 FIXED: DriveTimeCalculator for', segment.endCity, {
      segmentStructure: {
        driveTimeHours: segment.driveTimeHours,
        distance: segment.distance,
        startCity: segment.startCity,
        endCity: segment.endCity,
        day: segment.day
      },
      hasValidDriveTime: typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0,
      hasValidDistance: typeof segment.distance === 'number' && segment.distance > 0
    });
    
    // CRITICAL FIX: Priority 1 - Use driveTimeHours if available and valid
    if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
      const hours = Math.floor(segment.driveTimeHours);
      const minutes = Math.round((segment.driveTimeHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      
      console.log('✅ FIXED: Using actual driveTimeHours for', segment.endCity, { 
        originalHours: segment.driveTimeHours,
        formattedResult: formatted 
      });
      return formatted;
    }
    
    // CRITICAL FIX: Priority 2 - Calculate from distance if available  
    if (typeof segment.distance === 'number' && segment.distance > 0) {
      const estimatedHours = segment.distance / 55; // 55 mph average
      const hours = Math.floor(estimatedHours);
      const minutes = Math.round((estimatedHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      
      console.log('⚠️ FIXED: Calculating from distance for', segment.endCity, { 
        distance: segment.distance, 
        estimatedHours: estimatedHours.toFixed(2),
        formattedResult: formatted 
      });
      return formatted;
    }
    
    // CRITICAL FIX: Debug missing data
    console.error('❌ FIXED: No valid drive time data for', segment.endCity, {
      segment: {
        driveTimeHours: segment.driveTimeHours,
        distance: segment.distance,
        hasProperties: Object.keys(segment || {}),
        segmentType: typeof segment
      }
    });
    
    // Return a more realistic fallback based on typical Route 66 segments
    return '4h 30m';
  }

  /**
   * FIXED: Calculate total driving time for multiple segments
   */
  static calculateTotalDriveTime(segments: any[]): number {
    let total = 0;
    
    segments.forEach((segment, index) => {
      console.log(`🚗 FIXED: Calculating drive time for segment ${index + 1}:`, {
        endCity: segment.endCity,
        driveTimeHours: segment.driveTimeHours,
        distance: segment.distance
      });
      
      if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
        total += segment.driveTimeHours;
        console.log(`✅ FIXED: Added ${segment.driveTimeHours}h from driveTimeHours`);
      } else if (typeof segment.distance === 'number' && segment.distance > 0) {
        const estimated = segment.distance / 55;
        total += estimated;
        console.log(`⚠️ FIXED: Added ${estimated.toFixed(2)}h from distance calculation`);
      } else {
        total += 4.5; // More realistic fallback
        console.log(`❌ FIXED: Added 4.5h fallback for missing data`);
      }
    });
    
    console.log('🚗 FIXED: Total calculated drive time:', total.toFixed(2), 'hours');
    return total;
  }

  /**
   * FIXED: Format hours into readable string
   */
  static formatHours(hours: number): string {
    if (!hours || hours === 0) {
      console.warn('⚠️ FIXED: Invalid hours value:', hours);
      return '0h 0m';
    }
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    const result = `${wholeHours}h ${minutes}m`;
    
    console.log('🚗 FIXED: Formatted hours:', {
      input: hours,
      output: result
    });
    
    return result;
  }
}
