
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SubStopTimingCalculator, SegmentTiming } from './SubStopTimingCalculator';
import { DriveTimeBalancingService } from './DriveTimeBalancingService';
import { DriveTimeCategory } from './TripPlanBuilder';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';

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
    
    // CRITICAL FIX: Always use DriveTimeEnforcementService for drive time calculation
    let totalSegmentDriveTime = 0;
    if (segmentTimings.length > 0) {
      totalSegmentDriveTime = segmentTimings.reduce((total, timing) => total + timing.driveTimeHours, 0);
    } else {
      // CRITICAL: Use DriveTimeEnforcementService instead of local calculation
      totalSegmentDriveTime = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);
    }

    // CRITICAL: Ensure the total drive time is also enforced
    totalSegmentDriveTime = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);

    console.log(`🚗 SEGMENT TIMING FIX: ${currentStop.name} → ${dayDestination.name}:`, {
      segmentDistance: segmentDistance.toFixed(1),
      enforcedDriveTime: totalSegmentDriveTime.toFixed(1),
      usingEnforcementService: true,
      absoluteMaxHours: 10
    });

    if (totalSegmentDriveTime > 10) {
      console.error(`❌ CRITICAL ERROR: SegmentTimingCalculator still producing drive time > 10h: ${totalSegmentDriveTime.toFixed(1)}h`);
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
  static getDriveTimeCategory(totalSegmentDriveTime: number): DriveTimeCategory {
    return DriveTimeBalancingService.getDriveTimeCategory(totalSegmentDriveTime) as DriveTimeCategory;
  }
}
