
import { TripStop } from '../data/SupabaseDataService';

// Re-export types from the unified location
export type { 
  DriveTimeCategory, 
  RecommendedStop, 
  WeatherData, 
  DriveTimeBalance, 
  TripPlan, 
  DailySegment, 
  SegmentTiming 
} from './TripPlanTypes';

// Add utility functions that components expect
export const getDestinationCityName = (segment: DailySegment | { city: string; state: string }): string => {
  if ('endCity' in segment) {
    return segment.endCity || segment.destination?.city || 'Unknown';
  }
  return segment.city || 'Unknown';
};

export class TripPlanDataValidator {
  static validateTripPlan(tripPlan: any): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!tripPlan) {
      issues.push('Trip plan is null or undefined');
      return { isValid: false, issues };
    }
    
    if (!tripPlan.segments || tripPlan.segments.length === 0) {
      issues.push('No segments found in trip plan');
    }
    
    if (!tripPlan.totalDays || tripPlan.totalDays <= 0) {
      issues.push('Invalid total days');
    }
    
    return { isValid: issues.length === 0, issues };
  }
  
  static validateDailySegment(segment: any, context?: string): boolean {
    if (!segment) return false;
    return !!(segment.day && segment.startCity && segment.endCity);
  }

  static sanitizeTripPlan(tripPlan: any): any {
    const sanitized = {
      ...tripPlan,
      segments: (tripPlan.segments || []).map((segment: any) => ({
        ...segment,
        stops: segment.stops || [],
        drivingTime: segment.drivingTime || segment.driveTimeHours || 0,
        distance: segment.distance || 0,
        driveTimeHours: segment.driveTimeHours || 0
      })),
      totalDays: tripPlan.totalDays || 0,
      totalDistance: tripPlan.totalDistance || 0,
      totalDrivingTime: tripPlan.totalDrivingTime || 0
    };

    return sanitized;
  }
}

export class TripPlanBuilder {
  static createTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    travelDays: number,
    startLocation: string,
    endLocation: string,
    tripStyle: string = 'balanced'
  ): any {
    const segments: any[] = [];
    let currentCity = startStop.name;
    let currentStop = startStop;
    let day = 1;

    // Basic segment creation logic
    while (day <= travelDays) {
      // Find the next stop
      const nextStop = allStops.find(stop => stop.name !== currentCity && stop.city_name !== endStop.city_name);

      if (nextStop) {
        // Create a segment
        const distance = this.calculateDistance(currentStop.latitude, currentStop.longitude, nextStop.latitude, nextStop.longitude);
        const driveTimeHours = distance / 60; // Example calculation

        segments.push({
          day,
          startCity: currentCity,
          endCity: nextStop.name,
          distance,
          driveTimeHours,
          drivingTime: driveTimeHours,
          stops: [currentStop, nextStop],
          approximateMiles: distance,
          title: `${currentCity} to ${nextStop.name}`,
          destination: {
            city: nextStop.name,
            state: nextStop.state || ''
          },
          recommendedStops: [],
          attractions: []
        });

        currentCity = nextStop.name;
        currentStop = nextStop;
      } else {
        // If no more stops, create a segment to the end city
        const distance = this.calculateDistance(currentStop.latitude, currentStop.longitude, endStop.latitude, endStop.longitude);
        const driveTimeHours = distance / 60; // Example calculation

        segments.push({
          day,
          startCity: currentCity,
          endCity: endStop.name,
          distance,
          driveTimeHours,
          drivingTime: driveTimeHours,
          stops: [currentStop, endStop],
          approximateMiles: distance,
          title: `${currentCity} to ${endStop.name}`,
          destination: {
            city: endStop.name,
            state: endStop.state || ''
          },
          recommendedStops: [],
          attractions: []
        });
        break;
      }

      day++;
    }

    // Calculate totals
    const totalDistance = segments.reduce((sum, segment) => sum + segment.distance, 0);
    const totalDrivingTime = segments.reduce((sum, segment) => sum + segment.driveTimeHours, 0);

    return {
      id: `trip-${Date.now()}`,
      segments,
      dailySegments: segments,
      totalDays: travelDays,
      totalDistance,
      totalDrivingTime,
      totalMiles: totalDistance,
      startCity: startLocation,
      endCity: endLocation,
      startDate: new Date(),
      title: `${startLocation} to ${endLocation} Adventure`,
      tripStyle,
      summary: {
        totalDays: travelDays,
        totalDistance,
        totalDriveTime: totalDrivingTime,
        startLocation,
        endLocation,
        tripStyle
      }
    };
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3958.8; // Radius of the earth in miles
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
