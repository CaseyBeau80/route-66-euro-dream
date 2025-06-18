
import { TripStyleConfig } from './TripStyleLogic';

export interface DriveTimeTarget {
  day: number;
  targetHours: number;
  category: 'short' | 'optimal' | 'long' | 'extreme';
  flexibility: number;
}

export interface DriveTimeBalance {
  isBalanced: boolean;
  variance: number;
  recommendations: string[];
}

export class DriveTimeBalancingService {
  static calculateDriveTimeTargets(
    travelDays: number,
    styleConfig: TripStyleConfig
  ): { driveTimeTargets: DriveTimeTarget[]; balanceMetrics: DriveTimeBalance } {
    const targets: DriveTimeTarget[] = [];
    
    for (let day = 1; day <= travelDays; day++) {
      targets.push({
        day,
        targetHours: styleConfig.preferredDriveTime,
        category: 'optimal',
        flexibility: styleConfig.flexibility
      });
    }

    const balanceMetrics: DriveTimeBalance = {
      isBalanced: true,
      variance: 0,
      recommendations: []
    };

    return { driveTimeTargets: targets, balanceMetrics };
  }

  static generateDriveTimeTargets(
    travelDays: number,
    styleConfig: TripStyleConfig
  ): DriveTimeTarget[] {
    const targets: DriveTimeTarget[] = [];
    
    for (let day = 1; day <= travelDays; day++) {
      targets.push({
        day,
        targetHours: styleConfig.preferredDriveTime,
        category: 'optimal',
        flexibility: styleConfig.flexibility
      });
    }

    return targets;
  }

  static getDriveTimeCategory(driveTimeHours: number): 'short' | 'optimal' | 'long' | 'extreme' {
    if (driveTimeHours <= 3) return 'short';
    if (driveTimeHours <= 6) return 'optimal';
    if (driveTimeHours <= 9) return 'long';
    return 'extreme';
  }
}
