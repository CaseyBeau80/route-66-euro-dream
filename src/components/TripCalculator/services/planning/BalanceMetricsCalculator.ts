
import { DailySegment } from './TripPlanBuilder';
import { DriveTimeTarget } from './DriveTimeBalancingService';

export interface BalanceMetrics {
  overallScore: number; // 0-100, higher is better
  variance: number; // Standard deviation in hours
  averageDriveTime: number;
  driveTimeRange: { min: number; max: number };
  qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: string[];
  suggestions: string[];
  targetCompliance: number; // Percentage of days within target range
  destinationCityBalance: number; // Percentage of days ending at destination cities
}

export class BalanceMetricsCalculator {
  /**
   * Calculate standard deviation of drive times
   */
  static calculateStandardDeviation(driveTimes: number[]): number {
    const average = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const variance = driveTimes.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / driveTimes.length;
    return Math.sqrt(variance);
  }

  /**
   * Calculate target compliance percentage
   */
  static calculateTargetCompliance(
    segments: DailySegment[],
    driveTimeTargets?: DriveTimeTarget[]
  ): number {
    if (!driveTimeTargets) return 0;
    
    const compliantDays = segments.filter((segment, index) => {
      const target = driveTimeTargets[index];
      return segment.driveTimeHours >= target.minHours && segment.driveTimeHours <= target.maxHours;
    }).length;
    
    return (compliantDays / segments.length) * 100;
  }

  /**
   * Calculate destination city balance percentage
   */
  static calculateDestinationCityBalance(segments: DailySegment[]): number {
    const destinationCityDays = segments.filter(segment => {
      // Check if the day ends at a destination city or has destination city stops
      const hasDestinationCity = segment.recommendedStops.some(stop => stop.category === 'destination_city') ||
                                 segment.endCity.toLowerCase().includes('city') ||
                                 segment.endCity.toLowerCase().includes('town');
      return hasDestinationCity;
    }).length;
    
    return (destinationCityDays / segments.length) * 100;
  }

  /**
   * Calculate basic drive time statistics
   */
  static calculateBasicStats(segments: DailySegment[]) {
    const driveTimes = segments.map(s => s.driveTimeHours);
    const averageDriveTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    const minTime = Math.min(...driveTimes);
    const maxTime = Math.max(...driveTimes);
    const variance = this.calculateStandardDeviation(driveTimes);
    
    return {
      driveTimes,
      averageDriveTime,
      minTime,
      maxTime,
      variance
    };
  }
}
