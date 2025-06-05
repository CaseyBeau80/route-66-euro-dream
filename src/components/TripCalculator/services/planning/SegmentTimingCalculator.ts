
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SubStopTimingCalculator, SegmentTiming } from './SubStopTimingCalculator';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';

export class SegmentTimingCalculator {
  /**
   * Calculate segment timings and drive time information
   */
  static calculateSegmentTimings(
    currentStop: TripStop,
    dayDestination: TripStop,
    segmentStops: TripStop[]
  ): {
    segmentTimings: SegmentTiming[];
    totalSegmentDriveTime: number;
    segmentDistance: number;
  } {
    // Calculate direct distance between current stop and destination
    const segmentDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      dayDestination.latitude, dayDestination.longitude
    );

    // Calculate segment timings for route progression display
    const segmentTimings = SubStopTimingCalculator.calculateSegmentTimings(
      currentStop, 
      dayDestination, 
      segmentStops
    );
    
    // Calculate actual drive time from segment timings
    let totalSegmentDriveTime = 0;
    if (segmentTimings.length > 0) {
      totalSegmentDriveTime = segmentTimings.reduce((total, timing) => total + timing.driveTimeHours, 0);
    } else {
      // Fallback to direct calculation if no timings
      totalSegmentDriveTime = segmentDistance / 50; // 50 mph average
    }

    // Validate drive time is reasonable
    if (totalSegmentDriveTime > 15) {
      console.warn(`⚠️ Excessive drive time ${totalSegmentDriveTime.toFixed(1)}h, using direct route`);
      totalSegmentDriveTime = segmentDistance / 50;
    }

    return {
      segmentTimings,
      totalSegmentDriveTime,
      segmentDistance
    };
  }

  /**
   * Get drive time category for a segment
   */
  static getDriveTimeCategory(totalSegmentDriveTime: number) {
    return DriveTimeBalancingService.getDriveTimeCategory(totalSegmentDriveTime);
  }
}
