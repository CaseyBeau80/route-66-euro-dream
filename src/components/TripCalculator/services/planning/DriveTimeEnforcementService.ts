
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
}
