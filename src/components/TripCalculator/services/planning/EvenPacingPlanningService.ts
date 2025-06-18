
import { TripStop } from '../../types/TripStop';
import { TripPlan } from './TripPlanTypes';

export class EvenPacingPlanningService {
  static async planEvenPacingTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log('⚖️ EvenPacingPlanningService: planEvenPacingTrip stub');
    
    // Mock implementation
    return {
      id: `even-pacing-${Date.now()}`,
      startCity: startLocation,
      endCity: endLocation,
      startLocation,
      endLocation,
      startDate: new Date(),
      totalDays: travelDays,
      totalDistance: 2400, // Mock total distance
      totalDrivingTime: 40, // Mock total driving time
      segments: [],
      dailySegments: [],
      stops: [],
      summary: {
        totalDays: travelDays,
        totalDistance: 2400,
        totalDriveTime: 40,
        startLocation,
        endLocation,
        tripStyle: 'balanced'
      }
    };
  }
}
