import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { RouteStopSelectionService } from './RouteStopSelectionService';
import { StopEnhancementService } from './StopEnhancementService';
import { DailySegmentCreator, DailySegment } from './DailySegmentCreator';
import { TripPlanValidator } from './TripPlanValidator';
import { DriveTimeAnalyzer } from './DriveTimeAnalyzer';
import { TripDaysOptimizer } from './TripDaysOptimizer';
import { DriveTimeValidationService } from './DriveTimeValidationService';
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
    const enhancedStops = StopEnhancementService.enhanceStopsForRoute(
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
    const driveTimeBalance = this.calculateDriveTimeBalance(dailySegments);

    // Build the complete trip plan
    const tripPlan: TripPlan = {
      title: `${inputStartCity} to ${inputEndCity} (${optimizedDays} days)`,
      startCity: inputStartCity,
      endCity: inputEndCity,
      totalDistance: Math.round(totalDistance),
      totalDrivingTime,
      totalDays: optimizedDays,
      segments: dailySegments,
      wasAdjusted,
      originalDays: wasAdjusted ? requestedDays : undefined,
      driveTimeBalance
    };

    console.log(`✅ Trip plan completed: ${tripPlan.totalDistance} miles, ${tripPlan.totalDrivingTime.toFixed(1)}h driving`);
    return tripPlan;
  }

  private calculateDriveTimeBalance(dailySegments: DailySegment[]): {
    isBalanced: boolean;
    averageDriveTime: number;
    driveTimeRange: { min: number; max: number };
    balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
    qualityGrade?: 'A' | 'B' | 'C' | 'D' | 'F';
    overallScore?: number;
    variance?: number;
    suggestions?: string[];
  } {
    const totalDrivingTime = dailySegments.reduce((total, segment) => total + segment.drivingTime, 0);
    const averageDriveTime = totalDrivingTime / dailySegments.length;
    const driveTimeRange = {
      min: Math.min(...dailySegments.map(segment => segment.drivingTime)),
      max: Math.max(...dailySegments.map(segment => segment.drivingTime))
    };
    const balanceQuality = this.getDriveTimeBalanceQuality(averageDriveTime, driveTimeRange);

    return {
      isBalanced: balanceQuality === 'excellent',
      averageDriveTime,
      driveTimeRange,
      balanceQuality,
      qualityGrade: this.getDriveTimeQualityGrade(averageDriveTime, driveTimeRange),
      overallScore: this.getOverallDriveTimeScore(averageDriveTime, driveTimeRange),
      variance: this.getDriveTimeVariance(averageDriveTime, driveTimeRange),
      suggestions: this.getDriveTimeBalanceSuggestions(averageDriveTime, driveTimeRange)
    };
  }

  private getDriveTimeBalanceQuality(averageDriveTime: number, driveTimeRange: { min: number; max: number }): 'excellent' | 'good' | 'fair' | 'poor' {
    if (averageDriveTime < driveTimeRange.min) {
      return 'poor';
    } else if (averageDriveTime < driveTimeRange.min + 10) {
      return 'fair';
    } else if (averageDriveTime < driveTimeRange.max - 10) {
      return 'good';
    } else {
      return 'excellent';
    }
  }

  private getDriveTimeQualityGrade(averageDriveTime: number, driveTimeRange: { min: number; max: number }): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (averageDriveTime < driveTimeRange.min) {
      return 'F';
    } else if (averageDriveTime < driveTimeRange.min + 10) {
      return 'D';
    } else if (averageDriveTime < driveTimeRange.max - 10) {
      return 'C';
    } else {
      return 'A';
    }
  }

  private getOverallDriveTimeScore(averageDriveTime: number, driveTimeRange: { min: number; max: number }): number {
    const score = (averageDriveTime - driveTimeRange.min) / (driveTimeRange.max - driveTimeRange.min);
    return Math.round(score * 100);
  }

  private getDriveTimeVariance(averageDriveTime: number, driveTimeRange: { min: number; max: number }): number {
    const variance = Math.max(...dailySegments.map(segment => Math.abs(segment.drivingTime - averageDriveTime)));
    return Math.round(variance * 100);
  }

  private getDriveTimeBalanceSuggestions(averageDriveTime: number, driveTimeRange: { min: number; max: number }): string[] {
    const suggestions: string[] = [];
    if (averageDriveTime < driveTimeRange.min) {
      suggestions.push('Consider adding more stops to balance drive times.');
    } else if (averageDriveTime < driveTimeRange.min + 10) {
      suggestions.push('Consider adding more stops to balance drive times.');
    } else if (averageDriveTime < driveTimeRange.max - 10) {
      suggestions.push('Consider adding more stops to balance drive times.');
    } else {
      suggestions.push('Drive times are well-balanced.');
    }
    return suggestions;
  }
}
