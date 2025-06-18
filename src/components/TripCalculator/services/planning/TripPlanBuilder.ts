

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
  stops?: TripStop[];
  destination: {
    city: string;
    state: string;
  };
  recommendedStops: RecommendedStop[];
  attractions: Array<{
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
  isGoogleMapsData?: boolean;
  dataAccuracy?: string;
  notes?: string;
  recommendations?: string[];
  weather?: WeatherData;
  weatherData?: WeatherData;
}

export interface TripPlan {
  // Core properties that must exist
  id: string;
  startLocation: string;
  endLocation: string;
  totalDistance: number;
  totalDays: number;
  segments: DailySegment[];
  stops: TripStop[];
  
  // Additional properties that components expect
  startCity: string;
  endCity: string;
  startDate: Date;
  totalMiles?: number;
  totalDrivingTime?: number;
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

// Enhanced TripPlanDataValidator with proper return types
export class TripPlanDataValidator {
  static validate(tripPlan: TripPlan): boolean {
    return !!(tripPlan.id && tripPlan.startLocation && tripPlan.endLocation && tripPlan.segments?.length > 0);
  }

  static validateTripPlan(tripPlan: TripPlan): boolean {
    return this.validate(tripPlan);
  }

  static sanitizeTripPlan(tripPlan: TripPlan): TripPlan {
    return {
      ...tripPlan,
      // Ensure required properties exist
      startLocation: tripPlan.startLocation || tripPlan.startCity || '',
      endLocation: tripPlan.endLocation || tripPlan.endCity || '',
      stops: tripPlan.stops || [],
      dailySegments: tripPlan.dailySegments || tripPlan.segments || [],
      startDate: tripPlan.startDate || new Date(),
      // Sanitize segments to ensure they have proper driveTimeCategory and recommendedStops
      segments: (tripPlan.segments || []).map(segment => ({
        ...segment,
        recommendedStops: segment.recommendedStops || [],
        driveTimeCategory: segment.driveTimeCategory ? {
          ...segment.driveTimeCategory,
          category: ['short', 'optimal', 'long', 'extreme'].includes(segment.driveTimeCategory.category as any) 
            ? segment.driveTimeCategory.category as 'short' | 'optimal' | 'long' | 'extreme'
            : 'optimal'
        } : undefined
      }))
    };
  }

  // Additional validation methods that components might expect
  static validateSegments(segments: DailySegment[]): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!segments || segments.length === 0) {
      issues.push('No segments provided');
    }
    
    segments.forEach((segment, index) => {
      if (!segment.recommendedStops) {
        issues.push(`Segment ${index + 1} missing recommendedStops`);
      }
      if (!segment.destination?.city) {
        issues.push(`Segment ${index + 1} missing destination city`);
      }
    });
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }

  static validateTripPlanStructure(tripPlan: TripPlan): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!tripPlan.startLocation) issues.push('Missing startLocation');
    if (!tripPlan.endLocation) issues.push('Missing endLocation');
    if (!tripPlan.stops) issues.push('Missing stops array');
    if (!tripPlan.segments || tripPlan.segments.length === 0) issues.push('Missing or empty segments');
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

export const getDestinationCityName = (segment: DailySegment): string => {
  return segment.destination?.city || segment.endCity || 'Unknown';
};

