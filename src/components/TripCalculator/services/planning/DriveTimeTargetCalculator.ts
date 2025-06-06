
import { DriveTimeTarget, DriveTimeConstraints } from './DriveTimeConstraints';

export class DriveTimeTargetCalculator {
  /**
   * Calculate balanced drive time targets for trip days
   */
  static calculateDriveTimeTargets(
    totalDistance: number,
    totalDays: number,
    avgSpeedMph: number = 50
  ): DriveTimeTarget[] {
    const totalDriveTimeHours = totalDistance / avgSpeedMph;
    const baseTargetHours = totalDriveTimeHours / totalDays;
    
    console.log(`🎯 Drive time balancing: ${totalDriveTimeHours.toFixed(1)}h total / ${totalDays} days = ${baseTargetHours.toFixed(1)}h average`);

    const targets: DriveTimeTarget[] = [];
    const constraints = DriveTimeConstraints.CONSTRAINTS;
    
    for (let day = 1; day <= totalDays; day++) {
      let targetHours = baseTargetHours;
      
      // Adjust for optimal range if possible
      if (baseTargetHours < constraints.optimalMinHours) {
        targetHours = constraints.optimalMinHours;
      } else if (baseTargetHours > constraints.optimalMaxHours) {
        targetHours = constraints.optimalMaxHours;
      }

      const isOptimal = targetHours >= constraints.optimalMinHours && 
                       targetHours <= constraints.optimalMaxHours;

      targets.push({
        targetHours,
        minHours: Math.max(constraints.minimumHours, targetHours * 0.7),
        maxHours: Math.min(constraints.absoluteMaxHours, targetHours * 1.3),
        isOptimal
      });
    }

    return targets;
  }
}
