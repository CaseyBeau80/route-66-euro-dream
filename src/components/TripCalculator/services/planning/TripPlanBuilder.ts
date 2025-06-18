
import { TripStop } from '../../types/TripStop';
import { TripPlan, DailySegment, DriveTimeBalance, WeatherData, RecommendedStop, DriveTimeCategory } from './TripPlanTypes';

export interface DriveTimeTarget {
  day: number;
  targetHours: number;
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

export interface RouteProgression {
  segmentNumber: number;
  progressPercentage: number;
  cumulativeDistance: number;
  totalDistance: number;
}

// Re-export the TripPlan interface from TripPlanTypes for convenience
export type { TripPlan, DailySegment, DriveTimeBalance, WeatherData, RecommendedStop, DriveTimeCategory } from './TripPlanTypes';

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
      title: tripPlan.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`,
      startLocation: tripPlan.startLocation || tripPlan.startCity || '',
      endLocation: tripPlan.endLocation || tripPlan.endCity || '',
      stops: tripPlan.stops || [],
      dailySegments: tripPlan.dailySegments || tripPlan.segments || [],
      startDate: tripPlan.startDate || new Date(),
      totalMiles: tripPlan.totalMiles || Math.round(tripPlan.totalDistance || 0),
      tripStyle: tripPlan.tripStyle || 'balanced',
      lastUpdated: tripPlan.lastUpdated || new Date(),
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
