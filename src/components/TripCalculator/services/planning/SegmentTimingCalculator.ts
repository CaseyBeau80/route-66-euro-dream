
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SubStopTimingCalculator, SegmentTiming } from './SubStopTimingCalculator';
import { DriveTimeBalancingService } from './DriveTimeBalancingService';
import { DriveTimeCategory } from './TripPlanBuilder';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';

export class SegmentTimingCalculator {
  /**
   * FIXED: Calculate segment timings with ABSOLUTE drive time enforcement
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

    // ABSOLUTE FIX: ALWAYS use DriveTimeEnforcementService - no exceptions
    const totalSegmentDriveTime = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);

    console.log(`🚗 ABSOLUTE SEGMENT FIX: ${currentStop.name} → ${dayDestination.name}:`, {
      segmentDistance: segmentDistance.toFixed(1),
      absoluteEnforcedDriveTime: totalSegmentDriveTime.toFixed(1),
      maxAllowed: 10,
      isCompliant: totalSegmentDriveTime <= 10,
      enforcementMethod: 'DriveTimeEnforcementService - ABSOLUTE'
    });

    // CRITICAL VALIDATION: Verify we never exceed 10 hours
    if (totalSegmentDriveTime > 10) {
      console.error(`❌ CRITICAL ERROR: SegmentTimingCalculator STILL producing drive time > 10h: ${totalSegmentDriveTime.toFixed(1)}h`);
      console.error(`❌ This should be IMPOSSIBLE with DriveTimeEnforcementService!`);
    }

    // Calculate segment timings for route progression display (but don't use for total time)
    const segmentTimings = SubStopTimingCalculator.calculateSegmentTimings(
      currentStop, 
      dayDestination, 
      segmentStops
    );

    return {
      segmentTimings,
      totalSegmentDriveTime, // ALWAYS use the enforced time
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
