
import { TripPlan } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';

export class EvenPacingPlanningService {
  static async planEvenPacingTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`⚖️ Planning Even Pacing trip: ${startLocation} to ${endLocation} in ${travelDays} days`);

    try {
      // Find start and end stops
      const startStop = allStops.find(stop => 
        stop.name.toLowerCase().includes(startLocation.toLowerCase()) ||
        stop.city?.toLowerCase().includes(startLocation.toLowerCase())
      );
      
      const endStop = allStops.find(stop => 
        stop.name.toLowerCase().includes(endLocation.toLowerCase()) ||
        stop.city?.toLowerCase().includes(endLocation.toLowerCase())
      );

      if (!startStop || !endStop) {
        throw new Error(`Could not find stops for ${startLocation} or ${endLocation}`);
      }

      // Calculate total distance (mock calculation)
      const totalDistance = this.calculateDistance(startStop, endStop);
      const totalDrivingTime = totalDistance / 55; // Assuming 55 mph average

      // Create the trip plan with all required properties
      const tripPlan: TripPlan = {
        id: `even-pacing-${Date.now()}`,
        title: `${startLocation} to ${endLocation} Route 66 Trip`,
        startCity: startLocation,
        endCity: endLocation,
        startLocation: startLocation,
        endLocation: endLocation,
        startDate: new Date(),
        totalDays: travelDays,
        totalDistance: totalDistance,
        totalMiles: Math.round(totalDistance),
        totalDrivingTime: totalDrivingTime,
        tripStyle: 'balanced' as const,
        lastUpdated: new Date(),
        segments: [], // Will be populated by actual planning logic
        dailySegments: [], // Will be populated by actual planning logic
        stops: [startStop, endStop],
        summary: {
          totalDays: travelDays,
          totalDistance: totalDistance,
          totalDriveTime: totalDrivingTime,
          startLocation: startLocation,
          endLocation: endLocation,
          tripStyle: 'balanced'
        }
      };

      console.log(`✅ Even Pacing trip plan created for ${startLocation} to ${endLocation}`);
      return tripPlan;

    } catch (error) {
      console.error('❌ Error in Even Pacing trip planning:', error);
      throw error;
    }
  }

  private static calculateDistance(startStop: TripStop, endStop: TripStop): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(endStop.latitude - startStop.latitude);
    const dLon = this.toRad(endStop.longitude - startStop.longitude);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(startStop.latitude)) * Math.cos(this.toRad(endStop.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance);
  }

  private static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
