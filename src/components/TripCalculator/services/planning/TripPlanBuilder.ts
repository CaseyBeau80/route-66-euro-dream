import { TripStop } from '../data/SupabaseDataService';

export interface DailySegment {
  day: number;
  startCity: string;
  endCity: string;
  distance: number;
  driveTimeHours: number;
  stops: TripStop[];
  driveTimeWarning?: string;
}

export interface SegmentTiming {
  startTime: string;
  endTime: string;
}

export interface TripPlan {
  segments: DailySegment[];
  totalDays: number;
  totalDistance: number;
  totalDrivingTime: number; // Keep this as the main property
  totalDriveTime?: number; // Add as optional for backward compatibility
  summary?: {
    totalDays: number;
    totalDistance: number;
    totalDriveTime: number;
    startLocation: string;
    endLocation: string;
    tripStyle?: string;
  };
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
  ): TripPlan {
    const segments: DailySegment[] = [];
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
          stops: [currentStop, nextStop]
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
          stops: [currentStop, endStop]
        });
        break;
      }

      day++;
    }

    // Calculate totals
    const totalDistance = segments.reduce((sum, segment) => sum + segment.distance, 0);
    const totalDrivingTime = segments.reduce((sum, segment) => sum + segment.driveTimeHours, 0);

    return {
      segments,
      totalDays: travelDays,
      totalDistance,
      totalDrivingTime,
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
