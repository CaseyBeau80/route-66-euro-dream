
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
  isEnriched?: boolean;
  enrichmentStatus?: {
    weatherData?: boolean;
    stopsData?: boolean;
    validationComplete?: boolean;
  };
  lastUpdated?: Date;
  exportTimestamp?: number;
  originalDays?: number;
  driveTimeBalance?: DriveTimeBalance;
  tripStyle?: 'balanced' | 'destination-focused';
  summary?: {
    totalDays: number;
    totalDistance: number;
    totalDriveTime: number;
    startLocation: string;
    endLocation: string;
    tripStyle?: string;
  };
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
  stops?: TripStop[]; // Make this optional since many places don't provide it
  destination: {
    city: string;
    state: string;
  };
  recommendedStops: RecommendedStop[];
  attractions: {
    name: string;
    title: string;
    description: string;
    city: string;
  }[];
  driveTimeCategory?: DriveTimeCategory;
  routeSection?: string;
  driveTimeWarning?: string;
  subStopTimings?: SegmentTiming[];
  notes?: string;
  recommendations?: string[];
  weather?: WeatherData;
  weatherData?: WeatherData;
}
