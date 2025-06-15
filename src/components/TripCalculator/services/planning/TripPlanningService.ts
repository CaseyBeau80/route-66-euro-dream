
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

  static buildTripPlan(
    startStop: any,
    endStop: any,
    allStops: any[],
    tripDays: number,
    startCityName: string,
    endCityName: string,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): TripPlan {
    console.log('🎯 TripPlanningService: Building trip plan');
    
    // Mock implementation for now
    const mockSegments: any[] = [];
    let totalDistance = 0;
    let totalDrivingTime = 0;
    
    for (let day = 1; day <= tripDays; day++) {
      const distance = 250;
      const driveTime = 4;
      
      mockSegments.push({
        day,
        startCity: day === 1 ? startCityName : `Day ${day - 1} End`,
        endCity: day === tripDays ? endCityName : `Day ${day} End`,
        distance,
        driveTimeHours: driveTime
      });
      
      totalDistance += distance;
      totalDrivingTime += driveTime;
    }
    
    return {
      title: `${startCityName} to ${endCityName} Route 66 Trip`,
      segments: mockSegments,
      totalDays: tripDays,
      totalDistance,
      totalDrivingTime,
      tripStyle,
      startCity: startCityName,
      endCity: endCityName
    };
  }
}
