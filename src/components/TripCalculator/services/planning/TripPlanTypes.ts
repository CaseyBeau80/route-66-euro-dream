
import { TripStop } from '../data/SupabaseDataService';

export interface DriveTimeCategory {
  category: 'light' | 'moderate' | 'heavy' | 'extreme';
  message: string;
  color?: string;
}

export interface RecommendedStop {
  id?: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  city?: string;
  city_name?: string;
  state?: string;
  type?: string;
  category?: string;
  duration?: number;
}

export interface SegmentTiming {
  fromStop: TripStop;
  toStop: TripStop;
  distance: number;
  driveTime: number;
  distanceMiles: number;
  driveTimeHours: number;
  drivingTime: number;
}

export interface TripPlan {
  id?: string;
  startCity: string;
  endCity: string;
  startDate?: Date;
  totalDays: number;
  totalDistance: number;
  totalMiles?: number;
  totalDrivingTime: number; // This should always be calculated properly
  segments: DailySegment[];
  dailySegments?: DailySegment[]; // Legacy compatibility
  route?: { lat: number; lng: number }[];
  title?: string;
  startCityImage?: string;
  endCityImage?: string;
  isEnriched?: boolean;
  lastUpdated?: Date;
  exportTimestamp?: number;
  originalDays?: number;
  driveTimeBalance?: any;
  wasAdjusted?: boolean;
  tripStyle?: string;
  warnings?: string[];
  enrichmentStatus?: {
    weatherData: boolean;
    stopsData: boolean;
    validationComplete: boolean;
  };
}

export interface DailySegment {
  day: number;
  startCity: string;
  endCity?: string;
  destination?: string | { city: string; state?: string };
  distance: number;
  approximateMiles?: number;
  driveTimeHours: number;
  drivingTime?: number;
  recommendedStops?: RecommendedStop[];
  stops?: RecommendedStop[];
  attractions?: TripStop[];
  subStops?: TripStop[];
  weather?: any;
  weatherData?: any;
  isEnriched?: boolean;
  notes?: string;
  recommendations?: string[];
  title?: string;
  routeSection?: string;
  driveTimeCategory?: DriveTimeCategory;
  subStopTimings?: SegmentTiming[];
}
