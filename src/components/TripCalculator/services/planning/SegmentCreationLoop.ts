
import { DailySegment } from './TripPlanTypes';
import { TripStopConverter } from '../../utils/TripStopConverter';

export class SegmentCreationLoop {
  static createSegments(cities: string[], totalDays: number): DailySegment[] {
    console.log('🔄 SegmentCreationLoop: Creating segments for cities');
    
    const segments: DailySegment[] = [];
    
    for (let day = 1; day <= totalDays; day++) {
      const startCity = day === 1 ? cities[0] : cities[day - 1];
      const endCity = day === totalDays ? cities[cities.length - 1] : cities[day];
      
      const segment: DailySegment = {
        day,
        startCity,
        endCity,
        distance: 200, // Mock distance
        driveTimeHours: 3, // Mock drive time
        approximateMiles: 200,
        drivingTime: 3,
        // Use converter for attractions
        attractions: TripStopConverter.convertSimpleAttractionsToTripStops([
          {
            name: `Segment Attraction ${day}`,
            description: `Attraction for segment ${day}`,
            city: endCity
          }
        ])
      };
      
      segments.push(segment);
    }
    
    return segments;
  }
}
