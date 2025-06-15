
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStopConverter } from '../../utils/TripStopConverter';
import { DriveTimeCategoryHelper } from '../../utils/DriveTimeCategoryHelper';

export class DestinationFocusedPlanningService {
  static async planTrip(startCity: string, endCity: string, totalDays: number): Promise<TripPlan> {
    console.log('🎯 DestinationFocusedPlanningService: Planning destination-focused trip');
    
    // Mock implementation for now
    const segments: DailySegment[] = [];
    let totalDistance = 0;
    let totalDrivingTime = 0;
    
    for (let day = 1; day <= totalDays; day++) {
      const distance = 250; // Mock distance
      const driveTimeHours = 3.5; // Mock drive time
      
      const segment: DailySegment = {
        day,
        startCity: day === 1 ? startCity : `Stop ${day - 1}`,
        endCity: day === totalDays ? endCity : `Stop ${day}`,
        distance,
        driveTimeHours,
        approximateMiles: Math.round(distance),
        drivingTime: driveTimeHours,
        // Use converter for attractions
        attractions: TripStopConverter.convertSimpleAttractionsToTripStops([
          {
            name: `Destination Attraction ${day}`,
            description: `Key attraction for day ${day}`,
            city: day === totalDays ? endCity : `Stop ${day}`
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
      tripStyle: 'destination-focused',
      title: `${startCity} to ${endCity} Route 66 Trip`
    };
  }
}
