import { TripStop, SupabaseDataService } from '../data/SupabaseDataService';
import { UnifiedTripPlanningService } from './UnifiedTripPlanningService';
import { TripPlanOptimizer } from './TripPlanOptimizer';

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
   * Enhanced trip plan building with drive time balancing and optimization
   */
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): TripPlan {
    console.log(`🏗️ TripPlanBuilder: Building optimized trip plan with drive time balancing`);
    console.log(`📊 Available stops breakdown:`);
    
    // Log stop categories for debugging
    const officialDestinations = SupabaseDataService.getOfficialDestinationCities(allStops);
    const recommendedStops = SupabaseDataService.getRecommendedStops(allStops);
    
    console.log(`   🏙️ Official destination cities: ${officialDestinations.length}`);
    console.log(`   🎯 Recommended stops: ${recommendedStops.length}`);

    // Pre-flight validation
    const feasibilityCheck = TripPlanOptimizer.validateTripFeasibility(
      startStop,
      endStop,
      requestedDays
    );

    if (!feasibilityCheck.isFeasible) {
      console.warn(`⚠️ Trip feasibility issues:`, feasibilityCheck.issues);
      if (feasibilityCheck.recommendedDays) {
        console.log(`💡 Recommended days: ${feasibilityCheck.recommendedDays}`);
      }
    }

    // Use the enhanced optimizer for balanced trip planning
    const optimizationResult = TripPlanOptimizer.optimizeTripPlan(
      startStop,
      endStop,
      allStops,
      requestedDays,
      inputStartCity,
      inputEndCity
    );

    // Log optimization results
    if (optimizationResult.wasOptimized) {
      console.log(`🔧 Trip optimized! Steps taken:`);
      optimizationResult.optimizationSteps.forEach(step => console.log(`   • ${step}`));
    }

    console.log(`📈 Balance metrics:`, optimizationResult.balanceMetrics);
    console.log(`🎉 Enhanced trip plan created with balanced drive times`);

    return optimizationResult.finalPlan;
  }
}
