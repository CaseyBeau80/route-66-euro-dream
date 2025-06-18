
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SubStopTimingCalculator, SegmentTiming } from './SubStopTimingCalculator';
import { DriveTimeBalancingService } from './DriveTimeBalancingService';
import { DriveTimeCategory } from './TripPlanBuilder';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';
import { EnhancedDistanceService } from '../EnhancedDistanceService';

export class SegmentTimingCalculator {
  /**
   * Calculate segment timings with Google Maps integration and ABSOLUTE drive time enforcement
   */
  static async calculateSegmentTimings(
    currentStop: TripStop,
    dayDestination: TripStop,
    segmentStops: TripStop[]
  ): Promise<{
    segmentTimings: SegmentTiming[];
    totalSegmentDriveTime: number;
    segmentDistance: number;
    isGoogleMapsData: boolean;
    dataAccuracy: string;
  }> {
    // Use EnhancedDistanceService for Google Maps integration
    const distanceResult = await EnhancedDistanceService.calculateDistance(
      currentStop,
      dayDestination
    );

    console.log(`🚗 ENHANCED SEGMENT: ${currentStop.name} → ${dayDestination.name}:`, {
      distance: distanceResult.distance.toFixed(1),
      driveTimeHours: distanceResult.driveTimeHours.toFixed(1),
      isGoogleData: distanceResult.isGoogleData,
      accuracy: distanceResult.accuracy,
      enforcementMethod: 'EnhancedDistanceService with Google Maps'
    });

    // CRITICAL VALIDATION: Verify we never exceed 10 hours
    if (distanceResult.driveTimeHours > 10) {
      console.error(`❌ CRITICAL ERROR: SegmentTimingCalculator STILL producing drive time > 10h: ${distanceResult.driveTimeHours.toFixed(1)}h`);
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
      totalSegmentDriveTime: distanceResult.driveTimeHours,
      segmentDistance: distanceResult.distance,
      isGoogleMapsData: distanceResult.isGoogleData,
      dataAccuracy: distanceResult.accuracy
    };
  }

  /**
   * Get drive time category for a segment
   */
  static getDriveTimeCategory(totalSegmentDriveTime: number): DriveTimeCategory {
    return DriveTimeBalancingService.getDriveTimeCategory(totalSegmentDriveTime) as DriveTimeCategory;
  }
}
