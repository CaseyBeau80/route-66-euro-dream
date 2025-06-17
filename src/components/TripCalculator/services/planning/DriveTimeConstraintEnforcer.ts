
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { calculateRealisticDriveTime } from '../../utils/distanceCalculator';

export interface DriveTimeConstraint {
  maxDailyHours: number;
  maxSegmentDistance: number;
  enforcementLevel: 'strict' | 'flexible';
}

export interface DriveTimeValidationResult {
  isValid: boolean;
  actualHours: number;
  maxAllowed: number;
  exceedsBy: number;
  recommendation: string;
}

export class DriveTimeConstraintEnforcer {
  /**
   * ABSOLUTE drive time enforcement - no exceptions
   */
  static enforceAbsoluteMaxDriveTime(
    startStop: TripStop,
    endStop: TripStop,
    constraints: DriveTimeConstraint
  ): DriveTimeValidationResult {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const actualHours = calculateRealisticDriveTime(distance);
    const maxAllowed = constraints.maxDailyHours;
    const exceedsBy = Math.max(0, actualHours - maxAllowed);
    const isValid = actualHours <= maxAllowed;
    
    console.log(`🚨 ABSOLUTE DRIVE TIME CHECK: ${startStop.name} → ${endStop.name}`, {
      distance: distance.toFixed(1),
      actualHours: actualHours.toFixed(1),
      maxAllowed,
      isValid,
      exceedsBy: exceedsBy.toFixed(1)
    });
    
    let recommendation = '';
    if (!isValid) {
      if (exceedsBy > 2) {
        recommendation = `CRITICAL: Drive time exceeds limit by ${exceedsBy.toFixed(1)}h - segment must be split`;
      } else {
        recommendation = `Drive time exceeds limit by ${exceedsBy.toFixed(1)}h - consider intermediate stop`;
      }
    } else {
      recommendation = `Valid drive time within ${maxAllowed}h limit`;
    }
    
    return {
      isValid,
      actualHours,
      maxAllowed,
      exceedsBy,
      recommendation
    };
  }
  
  /**
   * Filter destinations to only those within drive time limits
   */
  static filterDestinationsByDriveTime(
    currentStop: TripStop,
    candidates: TripStop[],
    constraints: DriveTimeConstraint
  ): {
    validDestinations: TripStop[];
    rejectedDestinations: Array<{ stop: TripStop; reason: string; exceedsBy: number }>;
  } {
    const validDestinations: TripStop[] = [];
    const rejectedDestinations: Array<{ stop: TripStop; reason: string; exceedsBy: number }> = [];
    
    for (const candidate of candidates) {
      const validation = this.enforceAbsoluteMaxDriveTime(currentStop, candidate, constraints);
      
      if (validation.isValid) {
        validDestinations.push(candidate);
      } else {
        rejectedDestinations.push({
          stop: candidate,
          reason: validation.recommendation,
          exceedsBy: validation.exceedsBy
        });
      }
    }
    
    console.log(`🚦 DRIVE TIME FILTER: ${validDestinations.length} valid, ${rejectedDestinations.length} rejected`);
    
    return { validDestinations, rejectedDestinations };
  }
  
  /**
   * Calculate minimum trip days required for given distance constraints
   */
  static calculateMinimumTripDays(
    startStop: TripStop,
    endStop: TripStop,
    constraints: DriveTimeConstraint
  ): {
    minimumDays: number;
    totalDistance: number;
    averageDailyDistance: number;
    recommendation: string;
  } {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const maxDailyDistance = constraints.maxSegmentDistance;
    const minimumDays = Math.ceil(totalDistance / maxDailyDistance);
    const averageDailyDistance = totalDistance / minimumDays;
    
    let recommendation = '';
    if (minimumDays <= 7) {
      recommendation = `${minimumDays} days is feasible for a comfortable Route 66 trip`;
    } else if (minimumDays <= 14) {
      recommendation = `${minimumDays} days recommended for a thorough Route 66 experience`;
    } else {
      recommendation = `${minimumDays} days required due to distance constraints - consider flying to reduce driving`;
    }
    
    console.log(`📊 MINIMUM DAYS CALCULATION:`, {
      totalDistance: totalDistance.toFixed(1),
      maxDailyDistance,
      minimumDays,
      averageDailyDistance: averageDailyDistance.toFixed(1)
    });
    
    return {
      minimumDays,
      totalDistance,
      averageDailyDistance,
      recommendation
    };
  }
  
  /**
   * Create default drive time constraints based on trip style
   */
  static createConstraintsForTripStyle(tripStyle: string): DriveTimeConstraint {
    switch (tripStyle) {
      case 'relaxed':
        return {
          maxDailyHours: 6,
          maxSegmentDistance: 300,
          enforcementLevel: 'strict'
        };
      case 'balanced':
        return {
          maxDailyHours: 8,
          maxSegmentDistance: 400,
          enforcementLevel: 'strict'
        };
      case 'fast':
        return {
          maxDailyHours: 10,
          maxSegmentDistance: 500,
          enforcementLevel: 'flexible'
        };
      default:
        return {
          maxDailyHours: 8,
          maxSegmentDistance: 400,
          enforcementLevel: 'strict'
        };
    }
  }
}
