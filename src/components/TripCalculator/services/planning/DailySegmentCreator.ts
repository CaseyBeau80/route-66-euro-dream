
import { DailySegment } from './TripPlanTypes';
import { TripStopConverter } from '../../utils/TripStopConverter';
import { DriveTimeCategoryHelper } from '../../utils/DriveTimeCategoryHelper';

export class DailySegmentCreator {
  static createSegment(day: number, startCity: string, endCity: string, distance: number, driveTimeHours: number): DailySegment {
    console.log(`🏗️ DailySegmentCreator: Creating segment for day ${day}`);
    
    return {
      day,
      startCity,
      endCity,
      distance,
      driveTimeHours,
      approximateMiles: Math.round(distance),
      drivingTime: driveTimeHours,
      // Use converter for attractions
      attractions: TripStopConverter.convertSimpleAttractionsToTripStops([
        {
          name: `Sample Attraction`,
          description: `Attraction near ${endCity}`,
          city: endCity
        }
      ]),
      // Use proper drive time categories
      driveTimeCategory: DriveTimeCategoryHelper.getDriveTimeCategory(driveTimeHours)
    };
  }
}
