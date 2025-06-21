
import { TripStyleConfig } from './TripStyleLogic';

export interface DriveTimeTarget {
  day: number;
  targetHours: number;
  minHours: number;
  maxHours: number;
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
        minHours: styleConfig.minDailyDriveHours,
        maxHours: styleConfig.maxDailyDriveHours,
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
        minHours: styleConfig.minDailyDriveHours,
        maxHours: styleConfig.maxDailyDriveHours,
        category: 'optimal',
        flexibility: styleConfig.flexibility
      });
    }

    return targets;
  }

  static createBalancedDriveTimeTargets(
    totalDistance: number,
    totalDays: number
  ): DriveTimeTarget[] {
    console.log(`🎯 Creating balanced drive time targets for ${totalDistance} miles over ${totalDays} days`);
    
    const averageDistancePerDay = totalDistance / totalDays;
    const averageDriveTimePerDay = averageDistancePerDay / 50; // Assume 50 mph average
    
    const targets: DriveTimeTarget[] = [];
    
    for (let day = 1; day <= totalDays; day++) {
      targets.push({
        day,
        targetHours: averageDriveTimePerDay,
        minHours: Math.max(2, averageDriveTimePerDay * 0.7),
        maxHours: Math.min(10, averageDriveTimePerDay * 1.3),
        category: this.getDriveTimeCategory(averageDriveTimePerDay),
        flexibility: 0.3
      });
    }
    
    return targets;
  }

  static calculateDriveTimeBalance(
    totalDistance: number,
    totalDays: number
  ): DriveTimeBalance {
    console.log(`📊 Calculating drive time balance for ${totalDistance} miles over ${totalDays} days`);
    
    const averageDriveTimePerDay = (totalDistance / totalDays) / 50; // Assume 50 mph
    const isBalanced = averageDriveTimePerDay <= 10; // Max 10 hours per day
    
    const recommendations: string[] = [];
    
    if (!isBalanced) {
      recommendations.push('Consider increasing the number of days to reduce daily drive time');
    }
    
    if (averageDriveTimePerDay < 3) {
      recommendations.push('Trip may have very short daily drives - consider fewer days');
    }
    
    return {
      isBalanced,
      variance: Math.abs(averageDriveTimePerDay - 6), // 6 hours is ideal
      recommendations
    };
  }

  static getDriveTimeCategory(driveTimeHours: number): 'short' | 'optimal' | 'long' | 'extreme' {
    if (driveTimeHours <= 3) return 'short';
    if (driveTimeHours <= 6) return 'optimal';
    if (driveTimeHours <= 9) return 'long';
    return 'extreme';
  }
}
