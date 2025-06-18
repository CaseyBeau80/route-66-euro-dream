
import { TripStyleConfig } from './TripStyleLogic';

export interface DriveTimeTarget {
  day: number;
  targetHours: number;
  minHours: number;
  maxHours: number;
}

export class DriveTimeBalancingService {
  static calculateDriveTimeTargets(travelDays: number, styleConfig: TripStyleConfig) {
    const driveTimeTargets = this.generateDriveTimeTargets(travelDays, styleConfig);
    const balanceMetrics = {
      averageTarget: styleConfig.preferredDriveTime,
      maxVariation: styleConfig.flexibility * 2,
      totalDays: travelDays
    };

    return {
      driveTimeTargets,
      balanceMetrics
    };
  }

  static generateDriveTimeTargets(travelDays: number, styleConfig: TripStyleConfig): DriveTimeTarget[] {
    const targets: DriveTimeTarget[] = [];
    
    for (let day = 1; day <= travelDays; day++) {
      targets.push({
        day,
        targetHours: styleConfig.preferredDriveTime,
        minHours: styleConfig.minDailyDriveHours,
        maxHours: styleConfig.maxDailyDriveHours
      });
    }

    return targets;
  }
}
