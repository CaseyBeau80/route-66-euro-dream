import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { RouteStopSelectionService } from './RouteStopSelectionService';
import { StopEnhancementService } from './StopEnhancementService';
import { DailySegmentCreator, DailySegment, SubStopTiming } from './DailySegmentCreator';
import { DriveTimeBalancingService } from './DriveTimeBalancingService';

// Re-export types for backward compatibility
export type { DailySegment, SubStopTiming };

export interface TripPlan {
  title: string;
  startCityImage?: string;
  endCityImage?: string;
  totalDays: number;
  totalMiles: number;
  dailySegments: DailySegment[];
  wasAdjusted?: boolean;
  originalDays?: number;
  driveTimeBalance?: {
    isBalanced: boolean;
    averageDriveTime: number;
    driveTimeRange: { min: number; max: number };
    balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

export class TripPlanBuilder {
  /**
   * Build a complete trip plan with balanced drive time distribution
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
    const optimalDays = this.calculateOptimalDaysForBalancedDriving(totalDistance, requestedDays);
    const wasAdjusted = optimalDays !== requestedDays;
    
    if (wasAdjusted) {
      console.log(`🔄 Adjusted trip from ${requestedDays} to ${optimalDays} days for balanced drive times`);
    }

    // Get and enhance stops along the route with destination city priority
    const routeStops = RouteStopSelectionService.getStopsAlongRoute(startStop, endStop, allStops);
    const enhancedStops = StopEnhancementService.ensureGeographicDiversity(startStop, endStop, routeStops);
    
    console.log(`🛤️ Enhanced route: ${enhancedStops.length} diverse stops selected with destination city priority`);

    // Plan daily segments with balanced drive time distribution
    const dailySegments = DailySegmentCreator.createBalancedDailySegments(
      startStop,
      endStop,
      enhancedStops,
      optimalDays,
      totalDistance
    );

    // Calculate drive time balance metrics
    const driveTimeBalance = this.analyzeDriveTimeBalance(dailySegments);

    const tripTitle = CityDisplayService.createTripTitle(startStop, endStop);

    return {
      title: tripTitle,
      startCityImage: startStop.image_url,
      endCityImage: endStop.image_url,
      totalDays: optimalDays,
      totalMiles: Math.round(totalDistance),
      dailySegments,
      wasAdjusted,
      originalDays: wasAdjusted ? requestedDays : undefined,
      driveTimeBalance
    };
  }

  /**
   * Calculate optimal days considering balanced drive times
   */
  private static calculateOptimalDaysForBalancedDriving(
    totalDistance: number, 
    requestedDays: number
  ): number {
    const avgSpeedMph = 50;
    const totalDriveTimeHours = totalDistance / avgSpeedMph;
    
    // Calculate what the average daily drive time would be
    const avgDailyDriveTime = totalDriveTimeHours / requestedDays;
    
    console.log(`⏱️ Drive time analysis: ${totalDriveTimeHours.toFixed(1)}h total, ${avgDailyDriveTime.toFixed(1)}h average for ${requestedDays} days`);
    
    // Optimal drive time range: 4-6 hours per day
    const OPTIMAL_MIN = 4;
    const OPTIMAL_MAX = 6;
    const ABSOLUTE_MAX = 8;
    
    // If average is within optimal range, keep requested days
    if (avgDailyDriveTime >= OPTIMAL_MIN && avgDailyDriveTime <= OPTIMAL_MAX) {
      console.log(`✅ Requested ${requestedDays} days works well for balanced driving`);
      return requestedDays;
    }
    
    // If average is too low, reduce days
    if (avgDailyDriveTime < OPTIMAL_MIN) {
      const optimalDays = Math.ceil(totalDriveTimeHours / OPTIMAL_MIN);
      console.log(`📉 Reducing from ${requestedDays} to ${optimalDays} days to reach minimum drive time`);
      return Math.max(optimalDays, Math.max(2, requestedDays - 2)); // Don't reduce too drastically
    }
    
    // If average is too high, increase days
    if (avgDailyDriveTime > OPTIMAL_MAX) {
      const optimalDays = Math.ceil(totalDriveTimeHours / OPTIMAL_MAX);
      console.log(`📈 Increasing from ${requestedDays} to ${optimalDays} days for comfortable drive times`);
      return Math.min(optimalDays, requestedDays + 3); // Don't increase too drastically
    }
    
    return requestedDays;
  }

  /**
   * Analyze drive time balance across daily segments
   */
  private static analyzeDriveTimeBalance(dailySegments: DailySegment[]): {
    isBalanced: boolean;
    averageDriveTime: number;
    driveTimeRange: { min: number; max: number };
    balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
  } {
    const driveTimes = dailySegments.map(s => s.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);
    const timeRange = maxTime - minTime;
    
    // Determine balance quality
    let balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
    let isBalanced = true;
    
    if (timeRange <= 1.5) {
      balanceQuality = 'excellent';
    } else if (timeRange <= 2.5) {
      balanceQuality = 'good';
    } else if (timeRange <= 3.5) {
      balanceQuality = 'fair';
    } else {
      balanceQuality = 'poor';
      isBalanced = false;
    }
    
    // Check for extreme days
    const hasExtremeDays = driveTimes.some(time => time > 8 || time < 2);
    if (hasExtremeDays) {
      isBalanced = false;
      if (balanceQuality === 'excellent' || balanceQuality === 'good') {
        balanceQuality = 'fair';
      }
    }
    
    console.log(`⚖️ Drive time balance: ${balanceQuality} (${minTime.toFixed(1)}-${maxTime.toFixed(1)}h range, ${averageDriveTime.toFixed(1)}h avg)`);
    
    return {
      isBalanced,
      averageDriveTime: Math.round(averageDriveTime * 10) / 10,
      driveTimeRange: { 
        min: Math.round(minTime * 10) / 10, 
        max: Math.round(maxTime * 10) / 10 
      },
      balanceQuality
    };
  }
}
