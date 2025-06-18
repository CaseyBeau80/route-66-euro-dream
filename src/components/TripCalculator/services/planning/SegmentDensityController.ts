
export interface SegmentDensityConfig {
  targetStopsPerDay: number;
  minStopsPerDay: number;
  maxStopsPerDay: number;
  prioritizeDestinationCities: boolean;
}

export class SegmentDensityController {
  /**
   * Get density configuration based on trip style - FIXED: Only destination-focused
   */
  static getDensityConfig(tripStyle: 'destination-focused'): SegmentDensityConfig {
    console.log(`🎯 SegmentDensityController: Configuring for ${tripStyle} style`);
    
    // Only destination-focused configuration
    return {
      targetStopsPerDay: 3,
      minStopsPerDay: 2,
      maxStopsPerDay: 5,
      prioritizeDestinationCities: true
    };
  }

  /**
   * Calculate optimal stops per segment
   */
  static calculateOptimalStopsPerSegment(
    totalStops: number,
    numberOfDays: number,
    tripStyle: 'destination-focused'
  ): number[] {
    const config = this.getDensityConfig(tripStyle);
    const stopsPerDay: number[] = [];
    
    // Distribute stops evenly across days
    const baseStopsPerDay = Math.floor(totalStops / numberOfDays);
    const remainingStops = totalStops % numberOfDays;
    
    for (let i = 0; i < numberOfDays; i++) {
      let dailyStops = baseStopsPerDay;
      
      // Distribute remaining stops across early days
      if (i < remainingStops) {
        dailyStops++;
      }
      
      // Ensure within bounds
      dailyStops = Math.max(config.minStopsPerDay, Math.min(config.maxStopsPerDay, dailyStops));
      stopsPerDay.push(dailyStops);
    }
    
    return stopsPerDay;
  }
}
