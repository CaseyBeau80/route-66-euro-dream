
import { DailySegment } from './TripPlanTypes';
import { TripStyleConfig } from './TripStyleLogic';

export class DriveTimeEnforcementService {
  static enforceDriveTimeLimits(segments: DailySegment[], styleConfig: TripStyleConfig): DailySegment[] {
    return segments.map(segment => {
      if (segment.driveTimeHours > styleConfig.maxDailyDriveHours) {
        console.warn(`Capping drive time for day ${segment.day} from ${segment.driveTimeHours}h to ${styleConfig.maxDailyDriveHours}h`);
        return {
          ...segment,
          driveTimeHours: styleConfig.maxDailyDriveHours,
          drivingTime: styleConfig.maxDailyDriveHours
        };
      }
      return segment;
    });
  }

  static validateAndFixSegmentDistance(
    segment: DailySegment, 
    styleConfig: TripStyleConfig
  ): DailySegment {
    // Validate and fix segment if drive time exceeds limits
    if (segment.driveTimeHours > styleConfig.maxDailyDriveHours) {
      const maxDistance = styleConfig.maxDailyDriveHours * 50; // Assuming 50 mph average
      
      console.warn(`Fixing segment distance from ${segment.distance} to ${maxDistance} miles`);
      
      return {
        ...segment,
        distance: maxDistance,
        approximateMiles: maxDistance,
        driveTimeHours: styleConfig.maxDailyDriveHours,
        drivingTime: styleConfig.maxDailyDriveHours
      };
    }
    
    return segment;
  }
}
