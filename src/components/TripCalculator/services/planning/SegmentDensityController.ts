import { TripStop } from '../../types/TripStop';
import { TripStyleConfig } from './TripStyleLogic';

export interface DensityLimits {
  maxStopsPerDay: number;
  minMilesBetweenStops: number;
  maxDetourMiles: number;
  prioritizeQuality: boolean;
}

export class SegmentDensityController {
  /**
   * Get density limits based on trip style
   */
  static getDensityLimits(styleConfig: TripStyleConfig): DensityLimits {
    switch (styleConfig.style) {
      case 'balanced':
        return {
          maxStopsPerDay: 4,
          minMilesBetweenStops: 25,
          maxDetourMiles: 15,
          prioritizeQuality: true
        };
      
      case 'destination-focused':
        return {
          maxStopsPerDay: 2, // Fewer stops, but major ones
          minMilesBetweenStops: 50,
          maxDetourMiles: 30,
          prioritizeQuality: true
        };
      
      default:
        return this.getDensityLimits({ ...styleConfig, style: 'balanced' });
    }
  }
  
  /**
   * Filter stops to maintain proper density
   */
  static controlStopDensity(
    allStops: TripStop[],
    startStop: TripStop,
    endStop: TripStop,
    densityLimits: DensityLimits
  ): TripStop[] {
    console.log(`🎛️ Controlling stop density: max ${densityLimits.maxStopsPerDay} stops/day, ${densityLimits.minMilesBetweenStops}mi minimum`);
    
    // Filter out start and end stops
    const availableStops = allStops.filter(stop => 
      stop.id !== startStop.id && stop.id !== endStop.id
    );
    
    // Sort by priority (destination cities first if prioritizing quality)
    let sortedStops = availableStops;
    if (densityLimits.prioritizeQuality) {
      sortedStops = availableStops.sort((a, b) => {
        // Destination cities first
        if (a.category === 'destination_city' && b.category !== 'destination_city') return -1;
        if (b.category === 'destination_city' && a.category !== 'destination_city') return 1;
        
        // Then by distance from route
        return 0; // Keep existing order for same category
      });
    }
    
    // Apply density filtering
    const filteredStops: TripStop[] = [];
    
    for (const stop of sortedStops) {
      let tooClose = false;
      
      // Check distance from already selected stops
      for (const selectedStop of filteredStops) {
        const distance = this.calculateDistance(stop, selectedStop);
        if (distance < densityLimits.minMilesBetweenStops) {
          tooClose = true;
          break;
        }
      }
      
      // Check distance from start/end
      const distanceFromStart = this.calculateDistance(stop, startStop);
      const distanceFromEnd = this.calculateDistance(stop, endStop);
      
      if (!tooClose && 
          distanceFromStart >= densityLimits.minMilesBetweenStops &&
          distanceFromEnd >= densityLimits.minMilesBetweenStops) {
        filteredStops.push(stop);
      }
    }
    
    console.log(`🎛️ Density control: ${availableStops.length} → ${filteredStops.length} stops`);
    return filteredStops;
  }
  
  /**
   * Calculate distance between two stops (simple approximation)
   */
  private static calculateDistance(stop1: TripStop, stop2: TripStop): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (stop2.latitude - stop1.latitude) * Math.PI / 180;
    const dLon = (stop2.longitude - stop1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(stop1.latitude * Math.PI / 180) * Math.cos(stop2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  /**
   * Validate segment stop count against density limits
   */
  static validateSegmentDensity(
    stopsInSegment: TripStop[],
    segmentDistance: number,
    densityLimits: DensityLimits
  ): {
    isValid: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    
    if (stopsInSegment.length > densityLimits.maxStopsPerDay) {
      violations.push(`Too many stops (${stopsInSegment.length} > ${densityLimits.maxStopsPerDay})`);
    }
    
    // Check minimum distance between consecutive stops
    for (let i = 0; i < stopsInSegment.length - 1; i++) {
      const distance = this.calculateDistance(stopsInSegment[i], stopsInSegment[i + 1]);
      if (distance < densityLimits.minMilesBetweenStops) {
        violations.push(`Stops too close: ${distance.toFixed(1)}mi < ${densityLimits.minMilesBetweenStops}mi`);
      }
    }
    
    return {
      isValid: violations.length === 0,
      violations
    };
  }
}
