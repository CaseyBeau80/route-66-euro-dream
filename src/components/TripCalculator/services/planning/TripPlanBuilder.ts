
import { TripStop } from '../data/SupabaseDataService';

export interface DriveTimeCategory {
  category: string;
  message: string;
  color?: string;
}

export interface RecommendedStop {
  stopId: string;
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category?: string;
  city_name?: string;
  state?: string;
  city?: string;
}

export interface WeatherData {
  temperature?: number;
  highTemp?: number;
  lowTemp?: number;
  description?: string;
  condition?: string;
  humidity?: number;
  windSpeed?: number;
  precipitation?: number;
  cloudCover?: number;
  isActualForecast?: boolean;
  main?: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  temp?: {
    day: number;
    min: number;
    max: number;
  };
  weather?: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  icon?: string;
  source?: string;
}

export interface DailySegment {
  day: number;
  startCity: string;
  endCity: string;
  distance: number;
  driveTimeHours: number;
  stops: TripStop[];
  driveTimeWarning?: string;
  title?: string;
  approximateMiles?: number;
  destination?: {
    city: string;
    state: string;
  };
  recommendedStops?: RecommendedStop[];
  attractions?: any[];
  driveTimeCategory?: DriveTimeCategory;
  routeSection?: string;
  subStopTimings?: any[];
  notes?: string;
  recommendations?: string[];
  weather?: WeatherData;
  weatherData?: WeatherData;
}

export interface SegmentTiming {
  startTime: string;
  endTime: string;
}

export interface TripPlan {
  id?: string;
  segments: DailySegment[];
  dailySegments?: DailySegment[];
  totalDays: number;
  totalDistance: number;
  totalDrivingTime: number; // Keep this as the main property
  totalDriveTime?: number; // Add as optional for backward compatibility
  totalMiles?: number;
  startCity?: string;
  endCity?: string;
  title?: string;
  startCityImage?: string;
  endCityImage?: string;
  isEnriched?: boolean;
  enrichmentStatus?: {
    weatherData?: boolean;
    stopsData?: boolean;
    validationComplete?: boolean;
  };
  lastUpdated?: Date;
  exportTimestamp?: number;
  summary?: {
    totalDays: number;
    totalDistance: number;
    totalDriveTime: number;
    startLocation: string;
    endLocation: string;
    tripStyle?: string;
  };
}

// Add utility functions that components expect
export const getDestinationCityName = (segment: DailySegment): string => {
  return segment.endCity || segment.destination?.city || 'Unknown';
};

export class TripPlanDataValidator {
  static validateTripPlan(tripPlan: TripPlan): boolean {
    return !!(tripPlan && tripPlan.segments && tripPlan.segments.length > 0);
  }
  
  static validateDailySegment(segment: DailySegment): boolean {
    return !!(segment && segment.day && segment.startCity && segment.endCity);
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
      title: `${startLocation} to ${endLocation} Adventure`,
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
