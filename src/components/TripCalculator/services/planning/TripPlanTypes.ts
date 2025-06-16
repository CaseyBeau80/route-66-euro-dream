

import { TripStop } from '../data/SupabaseDataService';

export interface DriveTimeCategory {
  category: string;
  message: string;
  color?: string; // Add missing color property
}

export interface RecommendedStop {
  stopId: string; // Add missing stopId property
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
  isActualForecast?: boolean; // Add missing property
  main?: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  }; // Add missing main property
  temp?: {
    day: number;
    min: number;
    max: number;
  }; // Add missing temp property
  weather?: Array<{
    description: string;
    icon: string;
    main: string;
  }>; // Add missing weather array property
  icon?: string; // Add missing icon property
  source?: string; // Add source property
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
  originalDays?: number; // Add missing property
  driveTimeBalance?: string; // Add missing property
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
  
  // Add missing properties that are used throughout the codebase
  subStopTimings?: SegmentTiming[];
  notes?: string;
  recommendations?: string[];
  weather?: WeatherData;
  weatherData?: WeatherData;
}
