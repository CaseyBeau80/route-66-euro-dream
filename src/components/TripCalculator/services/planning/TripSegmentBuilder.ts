
import { DailySegment } from './TripPlanTypes';
import { TripStopConverter } from '../../utils/TripStopConverter';
import { DriveTimeCategoryHelper } from '../../utils/DriveTimeCategoryHelper';

export class TripSegmentBuilder {
  static buildSegment(day: number, startCity: string, endCity: string): DailySegment {
    console.log(`🏗️ TripSegmentBuilder: Building segment for day ${day}`);
    
    const distance = 280; // Mock distance
    const driveTimeHours = 4.5; // Mock drive time
    
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
          name: `Built Attraction ${day}`,
          description: `Attraction built for day ${day}`,
          city: endCity
        }
      ]),
      // Use proper drive time categories with DriveTimeCategoryHelper
      driveTimeCategory: DriveTimeCategoryHelper.getDriveTimeCategory(driveTimeHours)
    };
  }
}
