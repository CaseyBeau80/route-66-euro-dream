
import { TripStop, SupabaseDataService } from '../data/SupabaseDataService';
import { UnifiedTripPlanningService } from './UnifiedTripPlanningService';

export interface SubStopTiming {
  fromStop: TripStop;
  toStop: TripStop;
  distanceMiles: number;
  driveTimeHours: number;
}

export interface DailySegment {
  day: number;
  title?: string;
  startCity: string;
  endCity: string;
  distance?: number;
  approximateMiles: number;
  driveTimeHours: number;
  destination?: TripStop;
  recommendedStops?: TripStop[];
  attractions?: string[];
  driveTimeCategory?: {
    category: 'short' | 'optimal' | 'long' | 'extreme';
    message: string;
    color?: string;
  };
  curatedStops?: {
    attractions: TripStop[];
    waypoints: TripStop[];
    hiddenGems: TripStop[];
  };
  subStopTimings?: SubStopTiming[];
  routeSection?: string;
  drivingTime?: number;
}

export interface TripPlan {
  title: string;
  startCity: string;
  endCity: string;
  startCityImage?: string;
  endCityImage?: string;
  totalDays: number;
  originalDays?: number;
  totalDistance: number;
  totalMiles?: number; // Alias for totalDistance
  totalDrivingTime: number;
  segments: DailySegment[];
  dailySegments?: DailySegment[]; // Alias for segments
  wasAdjusted?: boolean;
  driveTimeBalance?: {
    isBalanced: boolean;
    averageDriveTime: number;
    reason?: string;
    balanceQuality?: 'excellent' | 'good' | 'fair' | 'poor';
    driveTimeRange?: { min: number; max: number };
    qualityGrade?: 'A' | 'B' | 'C' | 'D' | 'F';
    overallScore?: number;
    variance?: number;
    suggestions?: string[];
  };
}

export interface SegmentTiming {
  targetHours: number;
  minHours: number;
  maxHours: number;
  category: 'short' | 'optimal' | 'long' | 'extreme';
}

export class TripPlanBuilder {
  /**
   * Enhanced trip plan building with destination city prioritization
   */
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): TripPlan {
    console.log(`🏗️ TripPlanBuilder: Building enhanced trip plan`);
    console.log(`📊 Available stops breakdown:`);
    
    // Log stop categories for debugging
    const officialDestinations = SupabaseDataService.getOfficialDestinationCities(allStops);
    const recommendedStops = SupabaseDataService.getRecommendedStops(allStops);
    
    console.log(`   🏙️ Official destination cities: ${officialDestinations.length}`);
    console.log(`   🎯 Recommended stops: ${recommendedStops.length}`);
    
    // Use the enhanced unified planning service
    const tripPlan = UnifiedTripPlanningService.createTripPlan(
      startStop,
      endStop,
      allStops,
      requestedDays,
      inputStartCity,
      inputEndCity
    );

    console.log(`🎉 Enhanced trip plan created with prioritized destination cities`);
    return tripPlan;
  }
}
