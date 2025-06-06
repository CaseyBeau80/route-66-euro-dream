import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget, DriveTimeConstraints } from './DriveTimeConstraints';

export interface DriveTimeDistribution {
  dailyTargets: DriveTimeTarget[];
  totalDistance: number;
  totalDriveTime: number;
  averageDriveTime: number;
  isBalanced: boolean;
}

export class DriveTimeBalancer {
  /**
   * Calculate optimal drive time distribution for a trip
   */
  static calculateOptimalDistribution(
    startStop: TripStop,
    endStop: TripStop,
    totalDays: number,
    avgSpeedMph: number = 50
  ): DriveTimeDistribution {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const totalDriveTime = totalDistance / avgSpeedMph;
    const averageDriveTime = totalDriveTime / totalDays;
    const constraints = DriveTimeConstraints.CONSTRAINTS;

    console.log(`🎯 Calculating optimal drive time distribution:`, {
      totalDistance: Math.round(totalDistance),
      totalDriveTime: totalDriveTime.toFixed(1),
      averageDriveTime: averageDriveTime.toFixed(1),
      totalDays
    });

    // Check if the average drive time is within acceptable ranges
    const isBalanced = averageDriveTime >= constraints.short.min && 
                      averageDriveTime <= constraints.long.max;

    const dailyTargets: DriveTimeTarget[] = [];

    if (isBalanced && averageDriveTime <= constraints.optimal.max) {
      // If average is optimal, distribute evenly
      for (let day = 1; day <= totalDays; day++) {
        dailyTargets.push({
          targetHours: averageDriveTime,
          minHours: Math.max(constraints.short.min, averageDriveTime - 1.5),
          maxHours: Math.min(constraints.long.max, averageDriveTime + 1.5)
        });
      }
    } else {
      // Use intelligent distribution strategy
      dailyTargets.push(...this.createIntelligentDistribution(totalDriveTime, totalDays));
    }

    return {
      dailyTargets,
      totalDistance,
      totalDriveTime,
      averageDriveTime,
      isBalanced
    };
  }

  /**
   * Create an intelligent distribution that varies drive times appropriately
   */
  private static createIntelligentDistribution(
    totalDriveTime: number,
    totalDays: number
  ): DriveTimeTarget[] {
    const constraints = DriveTimeConstraints.CONSTRAINTS;
    const targets: DriveTimeTarget[] = [];
    
    // Strategy: Start with moderate days, have some longer days in the middle, 
    // and end with moderate days
    let remainingTime = totalDriveTime;
    let remainingDays = totalDays;

    for (let day = 1; day <= totalDays; day++) {
      let targetHours: number;
      
      if (day === 1 || day === totalDays) {
        // First and last days: moderate driving (4-6 hours)
        targetHours = Math.min(6, Math.max(4, remainingTime / remainingDays));
      } else if (day === Math.floor(totalDays / 2) || day === Math.ceil(totalDays / 2)) {
        // Middle days: can be longer if needed (up to 8 hours)
        targetHours = Math.min(8, Math.max(5, remainingTime / remainingDays));
      } else {
        // Other days: balanced approach
        targetHours = Math.min(7, Math.max(4, remainingTime / remainingDays));
      }

      // Ensure we don't exceed constraints
      targetHours = Math.max(constraints.short.min, 
                   Math.min(constraints.long.max, targetHours));

      // Adjust for remaining time
      if (remainingDays === 1) {
        targetHours = remainingTime; // Last day gets whatever is left
      }

      targets.push({
        targetHours,
        minHours: Math.max(constraints.short.min, targetHours - 1.5),
        maxHours: Math.min(constraints.long.max, targetHours + 1.5)
      });

      remainingTime -= targetHours;
      remainingDays--;
    }

    console.log(`🎯 Intelligent distribution created:`, targets.map((t, i) => 
      `Day ${i + 1}: ${t.targetHours.toFixed(1)}h (${t.minHours.toFixed(1)}-${t.maxHours.toFixed(1)}h)`
    ));

    return targets;
  }

  /**
   * Adjust trip duration if current distribution is too unbalanced
   */
  static suggestOptimalTripDuration(
    startStop: TripStop,
    endStop: TripStop,
    requestedDays: number,
    avgSpeedMph: number = 50
  ): {
    suggestedDays: number;
    reason: string;
    distribution: DriveTimeDistribution;
  } {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const totalDriveTime = totalDistance / avgSpeedMph;
    const averageDriveTime = totalDriveTime / requestedDays;
    const constraints = DriveTimeConstraints.CONSTRAINTS;

    let suggestedDays = requestedDays;
    let reason = '';

    if (averageDriveTime > constraints.extreme.max) {
      // Too much driving per day, need more days
      suggestedDays = Math.ceil(totalDriveTime / constraints.optimal.max);
      reason = `Drive time too long (${averageDriveTime.toFixed(1)}h/day average). Suggested ${suggestedDays} days for better balance.`;
    } else if (averageDriveTime < constraints.short.min && requestedDays > 3) {
      // Too little driving per day, could use fewer days
      suggestedDays = Math.max(3, Math.ceil(totalDriveTime / constraints.optimal.min));
      reason = `Drive time very short (${averageDriveTime.toFixed(1)}h/day average). Could complete in ${suggestedDays} days.`;
    }

    const distribution = this.calculateOptimalDistribution(
      startStop, 
      endStop, 
      suggestedDays, 
      avgSpeedMph
    );

    return {
      suggestedDays,
      reason,
      distribution
    };
  }
}
