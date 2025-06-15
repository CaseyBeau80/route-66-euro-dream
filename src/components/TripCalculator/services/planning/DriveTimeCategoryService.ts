
import { DriveTimeConstraints } from './DriveTimeConstraints';
import { DriveTimeCategory } from './TripPlanTypes';

export class DriveTimeCategoryService {
  static getDriveTimeCategory(driveTimeHours: number): DriveTimeCategory {
    const constraints = DriveTimeConstraints.CONSTRAINTS;
    
    if (driveTimeHours < constraints.optimalMinHours) {
      return {
        category: 'light',
        message: 'Light driving day - great for exploring stops!',
        color: 'text-green-600'
      };
    } else if (driveTimeHours <= constraints.optimalMaxHours) {
      return {
        category: 'moderate',
        message: 'Perfect driving time for a comfortable day',
        color: 'text-blue-600'
      };
    } else if (driveTimeHours <= constraints.absoluteMaxHours) {
      return {
        category: 'heavy',
        message: 'Longer driving day - plan for more rest stops',
        color: 'text-orange-600'
      };
    } else {
      return {
        category: 'extreme',
        message: 'Very long driving day - consider breaking it up',
        color: 'text-red-600'
      };
    }
  }
}
