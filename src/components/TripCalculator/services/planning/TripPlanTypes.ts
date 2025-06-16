import { TripStop } from '../data/SupabaseDataService';

export interface DriveTimeCategory {
  category: string;
  message: string;
}

export interface RecommendedStop {
  stopId: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export interface SegmentTiming {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  distanceFromLastStop: number;
  driveTimeHours: number;
}

export interface TripPlan {
  id: string;
  startCity: string;
  endCity: string;
  startDate: Date;
  totalDays: number;
  totalDistance: number;
  totalMiles?: number;
  totalDrivingTime?: number;
  segments: DailySegment[];
  dailySegments: DailySegment[];
  startCityImage?: string;
  endCityImage?: string;
  title?: string;
}

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  distance: number;
  approximateMiles: number;
  driveTimeHours: number;
  destination: {
    city: string;
    state: string;
  };
  recommendedStops: TripStop[];
  attractions: {
    name: string;
    title: string;
    description: string;
    city: string;
  }[];
  driveTimeCategory?: DriveTimeCategory;
  routeSection?: string;
  driveTimeWarning?: string; // New property for drive-time validation warnings
}
