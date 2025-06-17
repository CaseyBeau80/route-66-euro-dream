
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

export interface DriveTimeBalance {
  isBalanced: boolean;
  averageDriveTime: number;
  variance: number;
  driveTimeRange: { min: number; max: number };
  balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
  qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  overallScore: number;
  suggestions: string[];
  reason: string;
}

export interface DailySegment {
  day: number;
  startCity: string;
  endCity: string;
  distance: number;
  driveTimeHours: number;
  drivingTime?: number; // Add this missing property
  stops: TripStop[]; // Add this required property
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
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  distanceFromLastStop: number;
  driveTimeHours: number;
  fromStop: TripStop;
  toStop: TripStop;
  distance: number;
  driveTime: number;
  distanceMiles: number;
  drivingTime: number;
}

export interface TripPlan {
  id?: string;
  segments: DailySegment[];
  dailySegments?: DailySegment[];
  totalDays: number;
  totalDistance: number;
  totalDrivingTime: number;
  totalDriveTime?: number;
  totalMiles?: number;
  startCity?: string;
  endCity?: string;
  startDate?: Date; // Add this missing property
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
  driveTimeBalance?: DriveTimeBalance;
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
  static validateTripPlan(tripPlan: TripPlan): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!tripPlan) {
      issues.push('Trip plan is null or undefined');
      return { isValid: false, issues };
    }
    
    if (!tripPlan.segments || tripPlan.segments.length === 0) {
      issues.push('No segments found in trip plan');
    }
    
    if (tripPlan.totalDays <= 0) {
      issues.push('Invalid total days');
    }
    
    return { isValid: issues.length === 0, issues };
  }
  
  static validateDailySegment(segment: DailySegment, context?: string): boolean {
    if (!segment) return false;
    return !!(segment.day && segment.startCity && segment.endCity);
  }

  // Add the missing sanitizeTripPlan method
  static sanitizeTripPlan(tripPlan: TripPlan): TripPlan {
    const sanitized: TripPlan = {
      ...tripPlan,
      segments: (tripPlan.segments || []).map(segment => ({
        ...segment,
        stops: segment.stops || [], // Ensure stops property exists
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
          drivingTime: driveTimeHours, // Add drivingTime property
          stops: [currentStop, nextStop], // Add stops property
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
          drivingTime: driveTimeHours, // Add drivingTime property
          stops: [currentStop, endStop], // Add stops property
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
      startDate: new Date(), // Add startDate
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
