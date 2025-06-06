import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SegmentDestinationPlanner } from './SegmentDestinationPlanner';

export interface DriveTimeConstraints {
  maxDailyHours: number;
  optimalDailyHours: number;
  minDailyHours: number;
  absoluteMaxHours: number;
}

export interface BalancedSegment {
  day: number;
  startStop: TripStop;
  endStop: TripStop;
  distance: number;
  driveTimeHours: number;
  isBalanced: boolean;
  needsAdjustment: boolean;
}

export interface BalanceResult {
  isBalanced: boolean;
  segments: BalancedSegment[];
  recommendedDays: number;
  averageDriveTime: number;
  maxDriveTime: number;
  violationCount: number;
  adjustmentsMade: string[];
}

export class EnhancedDriveTimeBalancer {
  private static readonly CONSTRAINTS: DriveTimeConstraints = {
    maxDailyHours: 8,
    optimalDailyHours: 6,
    minDailyHours: 3,
    absoluteMaxHours: 10
  };

  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Analyze and balance drive times for a trip with aggressive optimization
   */
  static analyzeAndBalance(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): BalanceResult {
    console.log(`🎯 EnhancedDriveTimeBalancer: Analyzing trip for ${requestedDays} days`);

    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance.toFixed(0)} miles`);

    // Calculate what the optimal days should be based on distance
    const totalDriveTime = totalDistance / this.AVG_SPEED_MPH;
    const theoreticalOptimalDays = Math.ceil(totalDriveTime / this.CONSTRAINTS.optimalDailyHours);
    const minimumSafeDays = Math.ceil(totalDriveTime / this.CONSTRAINTS.maxDailyHours);

    console.log(`📊 Drive time analysis: ${totalDriveTime.toFixed(1)}h total`);
    console.log(`📊 Theoretical optimal: ${theoreticalOptimalDays} days, minimum safe: ${minimumSafeDays} days`);

    // Initial analysis with requested days
    let currentAnalysis = this.analyzeWithDays(startStop, endStop, allStops, requestedDays);
    const adjustmentsMade: string[] = [];

    // If the analysis shows problems, calculate better days
    if (!currentAnalysis.isBalanced || currentAnalysis.maxDriveTime > this.CONSTRAINTS.maxDailyHours) {
      console.log(`⚠️ Initial analysis problematic: max ${currentAnalysis.maxDriveTime.toFixed(1)}h, violations: ${currentAnalysis.violationCount}`);
      
      // Use the safer calculation - ensure we don't exceed max drive time
      const betterDays = Math.max(
        minimumSafeDays,
        theoreticalOptimalDays,
        requestedDays + 1 // At minimum, add one day if there are issues
      );

      if (betterDays > requestedDays) {
        console.log(`📈 Recalculating with ${betterDays} days for better balance`);
        currentAnalysis = this.analyzeWithDays(startStop, endStop, allStops, betterDays);
        currentAnalysis.recommendedDays = betterDays;
        adjustmentsMade.push(`Increased trip duration from ${requestedDays} to ${betterDays} days for safer drive times`);
      }
    }

    return {
      ...currentAnalysis,
      adjustmentsMade
    };
  }

  /**
   * Analyze drive times with a specific number of days
   */
  private static analyzeWithDays(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    days: number
  ): BalanceResult {
    // Get optimal destinations for the specified days
    const destinations = SegmentDestinationPlanner.selectDailyDestinations(
      startStop,
      endStop,
      allStops,
      days
    );

    // Create segments and analyze drive times
    const segments = this.createSegments(startStop, endStop, destinations);
    const analysis = this.analyzeSegments(segments);

    return {
      isBalanced: analysis.isBalanced,
      segments,
      recommendedDays: days,
      averageDriveTime: analysis.averageDriveTime,
      maxDriveTime: analysis.maxDriveTime,
      violationCount: analysis.violationCount,
      adjustmentsMade: []
    };
  }

  /**
   * Create balanced segments from destinations
   */
  private static createSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[]
  ): BalancedSegment[] {
    const segments: BalancedSegment[] = [];
    let currentStop = startStop;

    // Create segments for each day
    for (let day = 1; day <= destinations.length + 1; day++) {
      const isLastDay = day === destinations.length + 1;
      const dayDestination = isLastDay ? endStop : destinations[day - 1];

      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      const driveTimeHours = distance / this.AVG_SPEED_MPH;
      const isBalanced = driveTimeHours <= this.CONSTRAINTS.maxDailyHours;
      const needsAdjustment = driveTimeHours > this.CONSTRAINTS.maxDailyHours;

      segments.push({
        day,
        startStop: currentStop,
        endStop: dayDestination,
        distance,
        driveTimeHours,
        isBalanced,
        needsAdjustment
      });

      currentStop = dayDestination;
    }

    return segments;
  }

  /**
   * Analyze segments for balance metrics
   */
  private static analyzeSegments(segments: BalancedSegment[]) {
    const driveTimes = segments.map(s => s.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const maxDriveTime = Math.max(...driveTimes);
    const violationCount = segments.filter(s => s.needsAdjustment).length;
    const isBalanced = violationCount === 0 && maxDriveTime <= this.CONSTRAINTS.maxDailyHours;

    return {
      isBalanced,
      averageDriveTime,
      maxDriveTime,
      violationCount
    };
  }

  /**
   * Calculate optimal number of days based on total distance
   */
  private static calculateOptimalDays(totalDistance: number, requestedDays: number): number {
    const totalDriveTime = totalDistance / this.AVG_SPEED_MPH;
    const currentAvgDriveTime = totalDriveTime / requestedDays;

    // If current average exceeds max, calculate minimum required days
    if (currentAvgDriveTime > this.CONSTRAINTS.maxDailyHours) {
      const minRequiredDays = Math.ceil(totalDriveTime / this.CONSTRAINTS.maxDailyHours);
      console.log(`📊 Min required days: ${minRequiredDays} (current avg: ${currentAvgDriveTime.toFixed(1)}h)`);
      return Math.max(minRequiredDays, requestedDays + 1);
    }

    // If current average is much lower than optimal, could reduce days
    if (currentAvgDriveTime < this.CONSTRAINTS.minDailyHours && requestedDays > 3) {
      const maxReasonableDays = Math.floor(totalDriveTime / this.CONSTRAINTS.minDailyHours);
      return Math.max(3, Math.min(maxReasonableDays, requestedDays));
    }

    return requestedDays;
  }

  /**
   * Validate if a trip plan meets drive time constraints
   */
  static validateTripPlan(segments: BalancedSegment[]): {
    isValid: boolean;
    violations: string[];
    recommendations: string[];
  } {
    const violations: string[] = [];
    const recommendations: string[] = [];

    segments.forEach(segment => {
      if (segment.driveTimeHours > this.CONSTRAINTS.absoluteMaxHours) {
        violations.push(`Day ${segment.day}: ${segment.driveTimeHours.toFixed(1)}h exceeds absolute maximum (${this.CONSTRAINTS.absoluteMaxHours}h)`);
      } else if (segment.driveTimeHours > this.CONSTRAINTS.maxDailyHours) {
        violations.push(`Day ${segment.day}: ${segment.driveTimeHours.toFixed(1)}h exceeds recommended maximum (${this.CONSTRAINTS.maxDailyHours}h)`);
        recommendations.push(`Consider adding an intermediate stop on Day ${segment.day}`);
      }
    });

    const driveTimes = segments.map(s => s.driveTimeHours);
    const variance = this.calculateVariance(driveTimes);
    
    if (variance > 2) {
      recommendations.push('Consider redistributing stops for more balanced daily drive times');
    }

    return {
      isValid: violations.length === 0,
      violations,
      recommendations
    };
  }

  /**
   * Calculate variance in drive times
   */
  private static calculateVariance(driveTimes: number[]): number {
    const mean = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const squaredDifferences = driveTimes.map(time => Math.pow(time - mean, 2));
    return Math.sqrt(squaredDifferences.reduce((sum, diff) => sum + diff, 0) / driveTimes.length);
  }
}
