
import { DriveTimeCategory } from '../services/planning/TripPlanTypes';

export class DriveTimeCategoryHelper {
  static getDriveTimeCategory(driveTimeHours: number): DriveTimeCategory {
    if (driveTimeHours < 3) {
      return {
        category: 'light',
        color: 'text-green-700',
        message: 'Light drive day - perfect for exploring attractions along the way'
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'moderate',
        color: 'text-blue-700',
        message: 'Moderate drive time - balanced between driving and sightseeing'
      };
    } else if (driveTimeHours <= 8) {
      return {
        category: 'heavy',
        color: 'text-orange-700',
        message: 'Heavy drive day - consider breaking up with more stops'
      };
    } else {
      return {
        category: 'extreme',
        color: 'text-red-700',
        message: 'Very long drive - recommend splitting this day'
      };
    }
  }
}
