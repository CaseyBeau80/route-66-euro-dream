
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { calculateRealisticDriveTime } from '../../utils/distanceCalculator';

export interface SubStopTiming {
  fromStop: TripStop;
  toStop: TripStop;
  distance: number;
  driveTimeHours: number;
  drivingTime: number;
  distanceMiles: number;
}

export interface SegmentTimingResult {
  segmentTimings: SubStopTiming[];
  totalSegmentDriveTime: number;
  segmentDistance: number;
  isGoogleMapsData: boolean;
  dataAccuracy: string;
}

export class SegmentTimingCalculator {
  /**
   * Calculate segment timings including all sub-stops
   */
  static async calculateSegmentTimings(
    startStop: TripStop,
    endStop: TripStop,
    segmentStops: TripStop[]
  ): Promise<SegmentTimingResult> {
    console.log(`⏱️ SegmentTimingCalculator: Calculating timings for segment ${startStop.name} → ${endStop.name}`);

    const segmentTimings: SubStopTiming[] = [];
    let totalSegmentDriveTime = 0;
    let segmentDistance = 0;

    // Create the complete route: start → intermediate stops → end
    const completeRoute = [startStop, ...segmentStops, endStop];

    // Calculate timing for each leg of the journey
    for (let i = 0; i < completeRoute.length - 1; i++) {
      const fromStop = completeRoute[i];
      const toStop = completeRoute[i + 1];

      const distance = DistanceCalculationService.calculateDistance(
        fromStop.latitude,
        fromStop.longitude,
        toStop.latitude,
        toStop.longitude
      );

      const driveTimeHours = calculateRealisticDriveTime(distance);

      const timing: SubStopTiming = {
        fromStop,
        toStop,
        distance,
        driveTimeHours,
        drivingTime: driveTimeHours,
        distanceMiles: Math.round(distance)
      };

      segmentTimings.push(timing);
      totalSegmentDriveTime += driveTimeHours;
      segmentDistance += distance;
    }

    console.log(`✅ SegmentTimingCalculator: Segment complete - ${segmentDistance.toFixed(0)}mi, ${totalSegmentDriveTime.toFixed(1)}h`);

    return {
      segmentTimings,
      totalSegmentDriveTime,
      segmentDistance,
      isGoogleMapsData: false, // Using calculated estimates
      dataAccuracy: 'estimated'
    };
  }

  /**
   * Categorize drive time into ranges
   */
  static categorizedriveTime(driveTimeHours: number): 'short' | 'optimal' | 'long' | 'extreme' {
    if (driveTimeHours < 3) return 'short';
    if (driveTimeHours <= 6) return 'optimal';
    if (driveTimeHours <= 8) return 'long';
    return 'extreme';
  }
}
