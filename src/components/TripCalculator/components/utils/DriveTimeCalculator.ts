
export class DriveTimeCalculator {
  /**
   * FIXED: Calculate and format drive time from segment data using working logic
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
    
    // FIXED: Priority 1 - Use driveTimeHours if available and valid
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
    
    // FIXED: Priority 2 - Calculate from distance if available  
    if (typeof segment.distance === 'number' && segment.distance > 0) {
      const estimatedHours = segment.distance / 60; // 60 mph average for highways
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
    
    // FIXED: Use Route 66 segment distances as Priority 3
    const route66Segments: { [key: string]: { distance: number, driveHours: number } } = {
      'Springfield, IL': { distance: 200, driveHours: 3.5 },
      'St. Louis, MO': { distance: 100, driveHours: 1.8 },
      'Springfield, MO': { distance: 220, driveHours: 3.8 },
      'Joplin, MO': { distance: 70, driveHours: 1.2 },
      'Tulsa, OK': { distance: 105, driveHours: 1.8 },
      'Oklahoma City, OK': { distance: 105, driveHours: 1.8 },
      'Elk City, OK': { distance: 110, driveHours: 1.9 },
      'Shamrock, TX': { distance: 25, driveHours: 0.4 },
      'Amarillo, TX': { distance: 142, driveHours: 2.4 },
      'Tucumcari, NM': { distance: 115, driveHours: 2.0 },
      'Santa Rosa, NM': { distance: 55, driveHours: 1.0 },
      'Santa Fe, NM': { distance: 65, driveHours: 1.2 },
      'Albuquerque, NM': { distance: 65, driveHours: 1.2 },
      'Gallup, NM': { distance: 140, driveHours: 2.5 },
      'Holbrook, AZ': { distance: 95, driveHours: 1.7 },
      'Winslow, AZ': { distance: 33, driveHours: 0.6 },
      'Flagstaff, AZ': { distance: 55, driveHours: 1.0 },
      'Williams, AZ': { distance: 32, driveHours: 0.6 },
      'Seligman, AZ': { distance: 43, driveHours: 0.8 },
      'Kingman, AZ': { distance: 87, driveHours: 1.5 },
      'Needles, CA': { distance: 100, driveHours: 1.7 },
      'Barstow, CA': { distance: 142, driveHours: 2.4 },
      'Santa Monica, CA': { distance: 125, driveHours: 2.2 }
    };
    
    const segmentInfo = route66Segments[segment.endCity];
    if (segmentInfo) {
      const hours = Math.floor(segmentInfo.driveHours);
      const minutes = Math.round((segmentInfo.driveHours - hours) * 60);
      const formatted = `${hours}h ${minutes}m`;
      
      console.log('🗺️ FIXED: Using Route 66 drive time for', segment.endCity, {
        distance: segmentInfo.distance,
        driveHours: segmentInfo.driveHours,
        formattedResult: formatted
      });
      return formatted;
    }
    
    // Final fallback
    console.warn('⚠️ FIXED: Using final fallback for', segment.endCity);
    return '2h 30m';
  }

  /**
   * Calculate total driving time for multiple segments
   */
  static calculateTotalDriveTime(segments: any[]): number {
    let total = 0;
    
    segments.forEach((segment) => {
      if (typeof segment.driveTimeHours === 'number' && segment.driveTimeHours > 0) {
        total += segment.driveTimeHours;
      } else if (typeof segment.distance === 'number' && segment.distance > 0) {
        const estimated = segment.distance / 60;
        total += estimated;
      } else {
        // Use Route 66 data as fallback
        const route66Segments: { [key: string]: number } = {
          'Springfield, IL': 3.5,
          'St. Louis, MO': 1.8,
          'Springfield, MO': 3.8,
          'Joplin, MO': 1.2,
          'Tulsa, OK': 1.8,
          'Oklahoma City, OK': 1.8,
          'Elk City, OK': 1.9,
          'Shamrock, TX': 0.4,
          'Amarillo, TX': 2.4,
          'Tucumcari, NM': 2.0,
          'Santa Rosa, NM': 1.0,
          'Santa Fe, NM': 1.2,
          'Albuquerque, NM': 1.2,
          'Gallup, NM': 2.5,
          'Holbrook, AZ': 1.7,
          'Winslow, AZ': 0.6,
          'Flagstaff, AZ': 1.0,
          'Williams, AZ': 0.6,
          'Seligman, AZ': 0.8,
          'Kingman, AZ': 1.5,
          'Needles, CA': 1.7,
          'Barstow, CA': 2.4,
          'Santa Monica, CA': 2.2
        };
        
        total += route66Segments[segment.endCity] || 2.5;
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
