
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { RouteStopSelectionService } from './RouteStopSelectionService';
import { StopEnhancementService } from './StopEnhancementService';
import { DailySegmentCreator, DailySegment } from './DailySegmentCreator';
import { TripPlanValidator } from './TripPlanValidator';
import { DriveTimeAnalyzer } from './DriveTimeAnalyzer';
import { TripDaysOptimizer } from './TripDaysOptimizer';
import { SegmentTiming } from './SubStopTimingCalculator';

// Re-export types for backward compatibility
export type { DailySegment, SegmentTiming };

export interface TripPlan {
  title: string;
  startCity: string;
  endCity: string;
  startCityImage?: string;
  endCityImage?: string;
  totalDays: number;
  totalMiles: number;
  totalDistance: number; // Alias for totalMiles for compatibility
  totalDrivingTime: number;
  dailySegments: DailySegment[];
  segments: DailySegment[]; // Alias for dailySegments for compatibility
  wasAdjusted?: boolean;
  originalDays?: number;
  driveTimeBalance?: {
    isBalanced: boolean;
    averageDriveTime: number;
    driveTimeRange: { min: number; max: number };
    balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
    qualityGrade?: 'A' | 'B' | 'C' | 'D' | 'F';
    overallScore?: number;
    variance?: number;
    suggestions?: string[];
  };
}

export class TripPlanBuilder {
  /**
   * Build a complete trip plan with enhanced drive time balancing
   */
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    startCityName: string,
    endCityName: string
  ): TripPlan {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance} miles`);

    // Smart trip day calculation with drive time considerations
    const optimalDays = TripDaysOptimizer.calculateOptimalDaysForBalancedDriving(totalDistance, requestedDays);
    const wasAdjusted = optimalDays !== requestedDays;
    
    if (wasAdjusted) {
      console.log(`🔄 Adjusted trip from ${requestedDays} to ${optimalDays} days for balanced drive times`);
    }

    // Get and enhance stops along the route with destination city priority
    const routeStops = RouteStopSelectionService.getStopsAlongRoute(startStop, endStop, allStops);
    const enhancedStops = StopEnhancementService.ensureGeographicDiversity(startStop, endStop, routeStops);
    
    console.log(`🛤️ Enhanced route: ${enhancedStops.length} diverse stops selected with destination city priority`);

    // Create balanced daily segments using the new enhanced system
    const dailySegments = DailySegmentCreator.createBalancedDailySegments(
      startStop,
      endStop,
      enhancedStops,
      optimalDays,
      totalDistance
    );

    // Calculate total driving time from segments
    const totalDrivingTime = dailySegments.reduce((total, segment) => total + segment.drivingTime, 0);

    // Calculate enhanced drive time balance metrics
    const driveTimeBalance = DriveTimeAnalyzer.analyzeEnhancedDriveTimeBalance(dailySegments);

    const tripTitle = CityDisplayService.createTripTitle(startStop, endStop);

    return {
      title: tripTitle,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      startCityImage: startStop.image_url,
      endCityImage: endStop.image_url,
      totalDays: optimalDays,
      totalMiles: Math.round(totalDistance),
      totalDistance: Math.round(totalDistance), // Alias for compatibility
      totalDrivingTime,
      dailySegments,
      segments: dailySegments, // Alias for compatibility
      wasAdjusted,
      originalDays: wasAdjusted ? requestedDays : undefined,
      driveTimeBalance
    };
  }
}
