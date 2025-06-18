import { TripStop } from '../../types/TripStop';

export interface DriveTimeTarget {
  day: number;
  targetHours: number;
}

export interface RecommendedStop {
  stopId: string;
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  city_name: string;
  state: string;
  city: string;
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

export interface DriveTimeCategory {
  category: 'short' | 'optimal' | 'long' | 'extreme';
  message: string;
}

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  distance: number;
  approximateMiles: number;
  driveTimeHours: number;
  drivingTime?: number;
  stops: TripStop[];
  destination: {
    city: string;
    state: string;
  };
  recommendedStops?: RecommendedStop[];
  attractions?: Array<{
    name: string;
    title: string;
    description: string;
    city: string;
  }>;
  subStopTimings?: SegmentTiming[];
  driveTimeCategory?: DriveTimeCategory;
  routeSection?: string;
  driveTimeWarning?: string;
  isGoogleMapsData?: boolean;
  dataAccuracy?: string;
}

export interface TripPlan {
  startLocation: string;
  endLocation: string;
  totalDistance: number;
  totalDays: number;
  segments: DailySegment[];
  stops: TripStop[];
}
