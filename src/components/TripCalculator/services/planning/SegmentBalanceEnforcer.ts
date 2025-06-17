import { DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeConstraints } from './DriveTimeConstraints';

export interface BalanceViolation {
  day: number;
  type: 'too_short' | 'too_long' | 'extreme' | 'zero_distance';
  currentValue: number;
  recommendedValue: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface BalanceAdjustment {
  originalDays: number;
  adjustedDays: number;
  reason: string;
  expectedImprovement: string;
}

export class SegmentBalanceEnforcer {
  private static readonly AVG_SPEED_MPH = 50;
  private static readonly MIN_MEANINGFUL_DISTANCE = 25; // miles

  /**
   * Analyze segments for balance violations
   */
  static analyzeSegmentBalance(
    startStop: TripStop,
    destinations: TripStop[],
    endStop: TripStop
  ): BalanceViolation[] {
    const violations: BalanceViolation[] = [];
    let currentStop = startStop;

    for (let day = 1; day <= destinations.length + 1; day++) {
      const isLastDay = day === destinations.length + 1;
      const dayDestination = isLastDay ? endStop : destinations[day - 1];

      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      const driveTimeHours = distance / this.AVG_SPEED_MPH;
      const validation = DriveTimeConstraints.validateDriveTime(driveTimeHours);

      // Check for violations
      if (!validation.isValid || distance < this.MIN_MEANINGFUL_DISTANCE) {
        violations.push({
          day,
          type: distance === 0 ? 'zero_distance' : 
                validation.violationType || 'too_short',
          currentValue: driveTimeHours,
          recommendedValue: this.getRecommendedDriveTime(driveTimeHours),
          severity: this.getSeverity(distance, driveTimeHours)
        });
      }

      currentStop = dayDestination;
    }

    return violations;
  }

  /**
   * Suggest trip duration adjustment based on violations
   */
  static suggestDaysAdjustment(
    totalDistance: number,
    currentDays: number,
    violations: BalanceViolation[]
  ): BalanceAdjustment | null {
    const constraints = DriveTimeConstraints.CONSTRAINTS;
    const totalDriveTime = totalDistance / this.AVG_SPEED_MPH;
    
    const criticalViolations = violations.filter(v => v.severity === 'critical');
    const extremeViolations = violations.filter(v => v.type === 'extreme' || v.type === 'too_long');
    const shortViolations = violations.filter(v => v.type === 'too_short' || v.type === 'zero_distance');

    // If too many long days, increase trip duration
    if (criticalViolations.length > 0 || extremeViolations.length >= 2) {
      const optimalDays = Math.ceil(totalDriveTime / constraints.optimalMaxHours);
      const safeDays = Math.ceil(totalDriveTime / constraints.recommendedMaxHours);
      const adjustedDays = Math.max(optimalDays, safeDays, currentDays + 1);

      return {
        originalDays: currentDays,
        adjustedDays,
        reason: `${criticalViolations.length + extremeViolations.length} days exceed safe driving limits`,
        expectedImprovement: `Max daily drive time reduced to ~${(totalDriveTime / adjustedDays).toFixed(1)}h`
      };
    }

    // If too many short days and total drive time allows, reduce days
    if (shortViolations.length >= 3 && totalDriveTime / (currentDays - 1) <= constraints.recommendedMaxHours) {
      const minOptimalDays = Math.ceil(totalDriveTime / constraints.optimalMaxHours);
      const adjustedDays = Math.max(minOptimalDays, currentDays - 1);

      if (adjustedDays < currentDays) {
        return {
          originalDays: currentDays,
          adjustedDays,
          reason: `${shortViolations.length} days have very short drive times`,
          expectedImprovement: `Better balance with average ${(totalDriveTime / adjustedDays).toFixed(1)}h per day`
        };
      }
    }

    return null;
  }

  /**
   * Enforce hard constraints on segment planning
   */
  static enforceHardConstraints(
    startStop: TripStop,
    endStop: TripStop,
    requestedDays: number
  ): {
    isValid: boolean;
    minRequiredDays: number;
    maxReasonableDays: number;
    recommendedDays: number;
    reason: string;
  } {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const totalDriveTime = totalDistance / this.AVG_SPEED_MPH;
    const constraints = DriveTimeConstraints.CONSTRAINTS;

    // Calculate boundaries
    const minRequiredDays = Math.ceil(totalDriveTime / constraints.absoluteMaxHours);
    const maxReasonableDays = Math.floor(totalDriveTime / constraints.minimumHours);
    const recommendedDays = Math.ceil(totalDriveTime / constraints.optimalMaxHours);

    // Validate requested days
    const avgDailyDriveTime = totalDriveTime / requestedDays;
    
    if (avgDailyDriveTime > constraints.absoluteMaxHours) {
      return {
        isValid: false,
        minRequiredDays,
        maxReasonableDays,
        recommendedDays: Math.max(recommendedDays, minRequiredDays),
        reason: `Average ${avgDailyDriveTime.toFixed(1)}h/day exceeds absolute maximum of ${constraints.absoluteMaxHours}h`
      };
    }

    if (requestedDays > maxReasonableDays && maxReasonableDays >= 3) {
      return {
        isValid: false,
        minRequiredDays,
        maxReasonableDays,
        recommendedDays: Math.min(recommendedDays, maxReasonableDays),
        reason: `${requestedDays} days creates too many very short segments`
      };
    }

    return {
      isValid: true,
      minRequiredDays,
      maxReasonableDays,
      recommendedDays: requestedDays,
      reason: 'Trip duration is within acceptable constraints'
    };
  }

  /**
   * Get recommended drive time for a violation
   */
  private static getRecommendedDriveTime(currentTime: number): number {
    const constraints = DriveTimeConstraints.CONSTRAINTS;
    
    if (currentTime < constraints.minimumHours) {
      return constraints.optimalMinHours;
    }
    
    if (currentTime > constraints.recommendedMaxHours) {
      return constraints.optimalMaxHours;
    }
    
    return currentTime;
  }

  /**
   * Determine violation severity
   */
  private static getSeverity(
    distance: number, 
    driveTimeHours: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    const constraints = DriveTimeConstraints.CONSTRAINTS;
    
    if (distance === 0) return 'high';
    if (driveTimeHours > constraints.absoluteMaxHours) return 'critical';
    if (driveTimeHours > constraints.recommendedMaxHours) return 'high';
    if (driveTimeHours < constraints.minimumHours) return 'medium';
    if (distance < this.MIN_MEANINGFUL_DISTANCE) return 'medium';
    
    return 'low';
  }
}
