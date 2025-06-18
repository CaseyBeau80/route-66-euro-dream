
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
  category?: string; // Made optional to match TripPlanTypes
  city_name?: string; // Made optional to match TripPlanTypes
  state?: string; // Made optional to match TripPlanTypes
  city?: string; // Made optional to match TripPlanTypes
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
  color?: string;
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

export interface RouteProgression {
  segmentNumber: number;
  progressPercentage: number;
  cumulativeDistance: number;
  totalDistance: number;
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
  stops?: TripStop[]; // Made optional to match TripPlanTypes
  destination: {
    city: string;
    state: string;
  };
  recommendedStops?: RecommendedStop[]; // Made optional to match TripPlanTypes
  attractions?: Array<{
    name: string;
    title: string;
    description: string;
    city: string;
  }>;
  subStopTimings?: SegmentTiming[];
  driveTimeCategory?: DriveTimeCategory;
  routeSection?: string;
  routeProgression?: RouteProgression;
  driveTimeWarning?: string;
  isGoogleMapsData?: boolean; // Added missing property
  dataAccuracy?: string;
  notes?: string;
  recommendations?: string[];
  weather?: WeatherData;
  weatherData?: WeatherData;
}

export interface TripPlan {
  // Core properties that must exist
  id: string; // Made required to match TripPlanTypes expectations
  startLocation: string;
  endLocation: string;
  totalDistance: number;
  totalDays: number;
  segments: DailySegment[];
  stops: TripStop[];
  
  // Additional properties from TripPlanTypes that components expect
  startCity: string;
  endCity: string;
  startDate?: Date;
  totalMiles?: number;
  totalDrivingTime?: number;
  dailySegments?: DailySegment[];
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

// Add missing exports that other components expect
export class TripPlanDataValidator {
  static validate(tripPlan: TripPlan): boolean {
    return !!(tripPlan.id && tripPlan.startLocation && tripPlan.endLocation && tripPlan.segments?.length > 0);
  }
}

export const getDestinationCityName = (segment: DailySegment): string => {
  return segment.destination?.city || segment.endCity || 'Unknown';
};
