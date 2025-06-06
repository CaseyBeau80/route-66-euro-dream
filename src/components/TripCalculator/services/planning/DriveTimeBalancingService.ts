
export interface DriveTimeTarget {
  day: number; // Add day property
  targetHours: number;
  minHours: number;
  maxHours: number;
  priority: 'short' | 'balanced' | 'long';
}

export class DriveTimeBalancingService {
  /**
   * Get drive time category with proper message property
   */
  static getDriveTimeCategory(driveTimeHours: number): {
    category: 'short' | 'optimal' | 'long' | 'extreme';
    color: string;
    message: string;
  } {
    if (driveTimeHours < 3) {
      return {
        category: 'short',
        color: 'text-green-700',
        message: 'Short drive day - perfect for exploring attractions along the way'
      };
    } else if (driveTimeHours <= 6) {
      return {
        category: 'optimal',
        color: 'text-blue-700',
        message: 'Optimal drive time - balanced between driving and sightseeing'
      };
    } else if (driveTimeHours <= 8) {
      return {
        category: 'long',
        color: 'text-orange-700',
        message: 'Long drive day - consider breaking up with more stops'
      };
    } else {
      return {
        category: 'extreme',
        color: 'text-red-700',
        message: 'Very long drive - recommend splitting this day'
      };
    }
  }

  /**
   * Calculate balanced drive time targets
   */
  static calculateBalancedTargets(
    totalDistance: number,
    totalDays: number
  ): DriveTimeTarget[] {
    const averageDriveTime = (totalDistance / totalDays) / 65; // 65 mph average
    const targets: DriveTimeTarget[] = [];

    for (let day = 1; day <= totalDays; day++) {
      targets.push({
        day,
        targetHours: averageDriveTime,
        minHours: averageDriveTime * 0.7,
        maxHours: averageDriveTime * 1.3,
        priority: 'balanced'
      });
    }

    return targets;
  }
}
