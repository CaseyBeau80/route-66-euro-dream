
import { PlanningAdjustment } from './PlanningPolicy';
import { TripAdjustmentNotice } from './TripAdjustmentService';

export interface TripPlan {
  id: string;
  title: string;
  startCity: string;
  endCity: string;
  startLocation: string;
  endLocation: string;
  startDate: Date;
  totalDays: number;
  totalDistance: number;
  totalMiles: number;
  totalDrivingTime: number;
  segments: DailySegment[];
  dailySegments: DailySegment[];
  stops: any[];
  tripStyle: string;
  lastUpdated: Date;
  stopsLimited?: boolean;
  limitMessage?: string;
  
  // New constraint-related fields
  planningAdjustments?: PlanningAdjustment[];
  adjustmentNotice?: TripAdjustmentNotice | null;
  originalRequestedDays?: number;
  
  // Additional properties used by components
  summary?: {
    startLocation: string;
    endLocation: string;
    totalDriveTime?: number;
    totalDays?: number;
    totalDistance?: number;
    tripStyle?: string; // Add missing tripStyle property
  };
  startCityImage?: string;
  endCityImage?: string;
  
  // PDF export properties
  isEnriched?: boolean;
  exportTimestamp?: number;
  enrichmentStatus?: {
    weatherData?: boolean;
    stopsData?: boolean;
    validationComplete?: boolean;
  };
}

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  distance: number;
  approximateMiles: number;
  driveTimeHours?: number;
  drivingTime?: number; // Legacy property for backward compatibility
  destination: DestinationInfo;
  recommendedStops: RecommendedStop[];
  isGoogleMapsData?: boolean;
  attractions: Attraction[];
  stops?: any[]; // For segments that have stop data
  
  // Weather data properties
  weather?: WeatherData;
  weatherData?: WeatherData;
  
  // Additional properties used by components
  driveTimeCategory?: DriveTimeCategory;
  driveTimeWarning?: string;
  subStopTimings?: SubStopTiming[];
  routeSection?: string;
  notes?: string;
  recommendations?: string[];
  dataAccuracy?: string;
}

export interface SubStopTiming {
  fromStop: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    category: string;
    city_name: string;
    state: string;
    city: string;
  };
  toStop: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    category: string;
    city_name: string;
    state: string;
    city: string;
  };
  distanceMiles: number;
  driveTimeHours: number;
  // Legacy properties for backward compatibility - make both required to match SegmentTiming
  distance: number; // Required
  drivingTime: number; // Changed from optional to required
}

// Alias for backward compatibility
export type SegmentTiming = SubStopTiming;

export interface DestinationInfo {
  city: string;
  state: string;
}

export interface Attraction {
  name: string;
  title: string;
  description: string;
  city: string;
  category: string; // Required property that was missing
}

// Enhanced WeatherData interface with all the properties used in the codebase
export interface WeatherData {
  temperature?: number;
  condition?: string;
  humidity?: number;
  windSpeed?: number;
  forecast?: any[];
  
  // Additional weather properties used in PDF components
  main?: {
    temp?: number;
    temp_min?: number;
    temp_max?: number;
    humidity?: number;
  };
  temp?: {
    day?: number;
    min?: number;
    max?: number;
  };
  weather?: Array<{
    main?: string;
    description?: string;
    icon?: string;
  }>;
  description?: string;
  icon?: string;
  isActualForecast?: boolean;
  
  // High/low temperature properties
  highTemp?: number;
  lowTemp?: number;
  
  // City name for weather data
  cityName?: string;
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

export interface DriveTimeCategory {
  category: 'short' | 'optimal' | 'long' | 'extreme';
  message: string;
  color?: string;
}

// Additional type for drive time balance calculations
export interface DriveTimeBalance {
  totalHours: number;
  averageDriveTime: number; // Add missing property
  averageHours: number;
  maxHours: number;
  minHours: number;
  isBalanced: boolean;
  variance?: number; // Add missing variance property
  driveTimeRange: { min: number; max: number }; // Add missing driveTimeRange property
  balanceQuality?: 'excellent' | 'good' | 'fair' | 'poor'; // Add missing balanceQuality property
  segments: {
    day: number;
    hours: number;
    category: 'light' | 'moderate' | 'heavy' | 'extreme';
  }[];
}
