
export class DriveTimeCalculator {
  /**
   * CRITICAL FIX: Calculate and format drive time from segment data
   */
  static formatDriveTime(segment: any): string {
    console.log('🚗 CRITICAL FIX: DriveTimeCalculator for', segment.endCity, {
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
      
      console.log('✅ CRITICAL FIX: Using actual driveTimeHours for', segment.endCity, { 
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
      
      console.log('⚠️ CRITICAL FIX: Calculating from distance for', segment.endCity, { 
        distance: segment.distance, 
        estimatedHours: estimatedHours.toFixed(2),
        formattedResult: formatted 
      });
      return formatted;
    }
    
    // CRITICAL FIX: Debug missing data
    console.error('❌ CRITICAL FIX: No valid drive time data for', segment.endCity, {
      segment: {
        driveTimeHours: segment.driveTimeHours,
        distance: segment.distance,
        hasProperties: Object.keys(segment || {}),
        segmentType: typeof segment
      }
    });
    
    // CRITICAL FIX: Use actual distance from Route 66 data if available
    const route66Distances: { [key: string]: number } = {
      'Chicago, IL': 0,
      'Springfield, IL': 200,
      'St. Louis, MO': 300,
      'Springfield, MO': 400,
      'Tulsa, OK': 500,
      'Oklahoma City, OK': 600,
      'Amarillo, TX': 800,
      'Santa Fe, NM': 1000,
      'Albuquerque, NM': 1100,
      'Flagstaff, AZ': 1300,
      'Seligman, AZ': 1400,
      'Kingman, AZ': 1500,
      'Needles, CA': 1600,
      'Barstow, CA': 1700,
      'Santa Monica, CA': 2000
    };
    
    const endCityDistance = route66Distances[segment.endCity];
    const startCityDistance = route66Distances[segment.startCity];
    
    if (endCityDistance !== undefined && startCityDistance !== undefined) {
      const segmentDistance = endCityDistance - startCityDistance;
      if (segmentDistance > 0) {
        const estimatedHours = segmentDistance / 55;
        const hours = Math.floor(estimatedHours);
        const minutes = Math.round((estimatedHours - hours) * 60);
        const formatted = `${hours}h ${minutes}m`;
        
        console.log('🗺️ CRITICAL FIX: Using Route 66 distance calculation for', segment.endCity, {
          segmentDistance,
          estimatedHours: estimatedHours.toFixed(2),
          formattedResult: formatted
        });
        return formatted;
      }
    }
    
    // Final fallback
    return '4h 30m';
  }

  /**
   * Calculate total driving time for multiple segments
   */
  static calculateTotalDriveTime(segments: any[]): number {
    let total = 0;
    
    segments.forEach((segment, index) => {
      if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
        total += segment.driveTimeHours;
      } else if (typeof segment.distance === 'number' && segment.distance > 0) {
        const estimated = segment.distance / 55;
        total += estimated;
      } else {
        total += 4.5;
      }
    });
    
    return total;
  }

  /**
   * Format hours into readable string
   */
  static formatHours(hours: number): string {
    if (!hours || hours === 0) {
      return '0h 0m';
    }
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  }
}
