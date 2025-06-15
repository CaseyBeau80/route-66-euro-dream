
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SubStopTimingCalculator, SegmentTiming } from './SubStopTimingCalculator';
import { DriveTimeBalancingService } from './DriveTimeBalancingService';
import { DriveTimeCategory } from './TripPlanBuilder';

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
      // Fallback to direct calculation if no timings - use realistic speed
      totalSegmentDriveTime = this.calculateDirectDriveTime(segmentDistance);
    }

    // Validate drive time is reasonable (max 8 hours per day)
    if (totalSegmentDriveTime > 8) {
      console.warn(`⚠️ Excessive drive time ${totalSegmentDriveTime.toFixed(1)}h for ${segmentDistance}mi, using direct route`);
      totalSegmentDriveTime = this.calculateDirectDriveTime(segmentDistance);
    }

    console.log(`🚗 Segment ${currentStop.name} → ${dayDestination.name}: ${segmentDistance.toFixed(0)}mi in ${totalSegmentDriveTime.toFixed(1)}h`);

    return {
      segmentTimings,
      totalSegmentDriveTime,
      segmentDistance
    };
  }

  /**
   * Calculate direct drive time using realistic speeds
   */
  private static calculateDirectDriveTime(distance: number): number {
    let avgSpeed: number;
    
    if (distance < 50) {
      avgSpeed = 45; // Urban/city driving
    } else if (distance < 150) {
      avgSpeed = 55; // Mixed roads
    } else {
      avgSpeed = 65; // Highway
    }
    
    const baseTime = distance / avgSpeed;
    const bufferMultiplier = distance < 100 ? 1.1 : 1.05;
    
    return Math.max(baseTime * bufferMultiplier, 0.5);
  }

  /**
   * Get drive time category for a segment
   */
  static getDriveTimeCategory(totalSegmentDriveTime: number): DriveTimeCategory {
    return DriveTimeBalancingService.getDriveTimeCategory(totalSegmentDriveTime) as DriveTimeCategory;
  }
}
