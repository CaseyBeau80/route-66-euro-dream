
import { TripPlan } from './TripPlanTypes';

export class TripPlanningService {
  static async createTripPlan(
    startCity: string,
    endCity: string,
    totalDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<TripPlan> {
    console.log('🎯 TripPlanningService: Creating trip plan');
    
    // Mock implementation
    const mockSegments: any[] = [];
    let totalDistance = 0;
    let totalDrivingTime = 0;
    
    for (let day = 1; day <= totalDays; day++) {
      const distance = 250;
      const driveTime = 4;
      
      mockSegments.push({
        day,
        startCity: day === 1 ? startCity : `Day ${day - 1} End`,
        endCity: day === totalDays ? endCity : `Day ${day} End`,
        distance,
        driveTimeHours: driveTime
      });
      
      totalDistance += distance;
      totalDrivingTime += driveTime;
    }
    
    return {
      title: `${startCity} to ${endCity} Route 66 Trip`,
      segments: mockSegments,
      totalDays,
      totalDistance,
      totalDrivingTime, // Add the missing required property
      tripStyle,
      startCity,
      endCity
    };
  }
}
