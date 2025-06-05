
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopEnhancementService } from './StopEnhancementService';

export interface SubStopTiming {
  fromStop: TripStop;
  toStop: TripStop;
  distanceMiles: number;
  driveTimeHours: number;
}

export class SubStopTimingCalculator {
  /**
   * Calculate sub-stop timings with enhanced validation
   */
  static calculateValidSubStopTimings(
    startStop: TripStop,
    endStop: TripStop,
    segmentStops: TripStop[]
  ): SubStopTiming[] {
    const timings: SubStopTiming[] = [];
    const fullPath = [startStop, ...segmentStops, endStop];
    
    for (let i = 0; i < fullPath.length - 1; i++) {
      const fromStop = fullPath[i];
      const toStop = fullPath[i + 1];
      
      // Enhanced validation - skip if invalid segment
      if (!StopEnhancementService.isValidSegment(fromStop, toStop, 5)) {
        console.log(`⚠️ Skipping invalid segment: ${fromStop.name} to ${toStop.name}`);
        continue;
      }
      
      const distance = DistanceCalculationService.calculateDistance(
        fromStop.latitude, fromStop.longitude,
        toStop.latitude, toStop.longitude
      );
      
      // Skip segments that are too short
      if (distance < 5) {
        console.log(`⚠️ Skipping too short segment: ${distance.toFixed(1)} miles`);
        continue;
      }
      
      const driveTime = distance / 50; // 50 mph average for more realistic timing
      
      timings.push({
        fromStop,
        toStop,
        distanceMiles: Math.round(distance * 10) / 10,
        driveTimeHours: Math.round(driveTime * 10) / 10
      });
    }
    
    return timings;
  }

  /**
   * Calculate total drive time from timings
   */
  static calculateTotalDriveTime(timings: SubStopTiming[]): number {
    const totalTime = timings.reduce((total, timing) => total + timing.driveTimeHours, 0);
    return totalTime > 0 ? totalTime : 0;
  }
}
