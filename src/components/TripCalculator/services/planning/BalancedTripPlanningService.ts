
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStopConverter } from '../../utils/TripStopConverter';
import { DriveTimeCategoryHelper } from '../../utils/DriveTimeCategoryHelper';

export class BalancedTripPlanningService {
  static async planTrip(startCity: string, endCity: string, totalDays: number): Promise<TripPlan> {
    console.log('🎯 BalancedTripPlanningService: Planning balanced trip');
    
    // Mock implementation for now
    const segments: DailySegment[] = [];
    let totalDistance = 0;
    let totalDrivingTime = 0;
    
    for (let day = 1; day <= totalDays; day++) {
      const distance = 300; // Mock distance
      const driveTimeHours = 4; // Mock drive time
      
      const segment: DailySegment = {
        day,
        startCity: day === 1 ? startCity : `City ${day - 1}`,
        endCity: day === totalDays ? endCity : `City ${day}`,
        distance,
        driveTimeHours,
        approximateMiles: Math.round(distance),
        drivingTime: driveTimeHours,
        // Use converter for attractions
        attractions: TripStopConverter.convertSimpleAttractionsToTripStops([
          {
            name: `Attraction ${day}`,
            description: `Sample attraction for day ${day}`,
            city: day === totalDays ? endCity : `City ${day}`
          }
        ]),
        // Use proper drive time categories
        driveTimeCategory: DriveTimeCategoryHelper.getDriveTimeCategory(driveTimeHours)
      };
      
      segments.push(segment);
      totalDistance += distance;
      totalDrivingTime += driveTimeHours;
    }
    
    return {
      startCity,
      endCity,
      totalDays,
      totalDistance,
      totalDrivingTime, // Include this required property
      segments,
      tripStyle: 'balanced',
      title: `${startCity} to ${endCity} Route 66 Trip`
    };
  }
}
