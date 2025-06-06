
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopEnhancementService } from './StopEnhancementService';
import { DailySegmentCreator, DailySegment } from './DailySegmentCreator';
import { DriveTimeValidationService } from './DriveTimeValidationService';
import { TripDaysOptimizer } from './TripDaysOptimizer';
import { DriveTimeBalanceCalculator } from './DriveTimeBalanceCalculator';

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

export class TripPlanFactory {
  /**
   * Create a complete trip plan with enhanced drive time balancing
   */
  static createTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string
  ): TripPlan {
    console.log(`🏗️ Building ${requestedDays}-day trip plan from ${startStop.name} to ${endStop.name}`);

    // Calculate total distance
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Optimize trip days for balanced driving
    const optimizedDays = TripDaysOptimizer.calculateOptimalDaysForBalancedDriving(
      totalDistance,
      requestedDays
    );

    const wasAdjusted = optimizedDays !== requestedDays;
    console.log(`📊 Trip days: requested ${requestedDays}, optimized ${optimizedDays}, adjusted: ${wasAdjusted}`);

    // Create enhanced stops array (filtered and enhanced for the route)
    const enhancedStops = StopEnhancementService.enhanceStopsWithPrioritization(
      startStop,
      endStop,
      allStops,
      optimizedDays
    );

    // Create daily segments
    let dailySegments = DailySegmentCreator.createBalancedDailySegments(
      startStop,
      endStop,
      enhancedStops,
      optimizedDays,
      totalDistance
    );

    // Validate and fix drive times
    const validationResult = DriveTimeValidationService.validateAndFixDriveTimes(dailySegments);
    
    if (!validationResult.isValid && validationResult.adjustedSegments) {
      console.log('🔧 Applied drive time corrections:', validationResult.issues);
      dailySegments = validationResult.adjustedSegments;
    }

    // Calculate total driving time from segments
    const totalDrivingTime = dailySegments.reduce((total, segment) => {
      return total + (segment.drivingTime || 0);
    }, 0);

    // Calculate drive time balance metrics
    const driveTimeBalance = DriveTimeBalanceCalculator.calculateDriveTimeBalance(dailySegments);

    // Build the complete trip plan
    const tripPlan: TripPlan = {
      title: `${inputStartCity} to ${inputEndCity} (${optimizedDays} days)`,
      startCity: inputStartCity,
      endCity: inputEndCity,
      totalMiles: Math.round(totalDistance),
      totalDistance: Math.round(totalDistance),
      totalDrivingTime,
      totalDays: optimizedDays,
      dailySegments: dailySegments,
      segments: dailySegments,
      wasAdjusted,
      originalDays: wasAdjusted ? requestedDays : undefined,
      driveTimeBalance
    };

    console.log(`✅ Trip plan completed: ${tripPlan.totalDistance} miles, ${tripPlan.totalDrivingTime.toFixed(1)}h driving`);
    return tripPlan;
  }
}
