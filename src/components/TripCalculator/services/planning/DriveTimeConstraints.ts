
export interface DriveTimeConstraints {
  absoluteMaxHours: number;
  recommendedMaxHours: number;
  optimalMaxHours: number;
  optimalMinHours: number;
  minimumHours: number;
}

export interface DriveTimeTarget {
  targetHours: number;
  minHours: number;
  maxHours: number;
  isOptimal?: boolean;
}

export class DriveTimeConstraints {
  static readonly CONSTRAINTS: DriveTimeConstraints = {
    absoluteMaxHours: 10,     // STRICT LIMIT - never exceed (updated from previous values)
    recommendedMaxHours: 8,   // Recommended maximum
    optimalMaxHours: 6,       // Upper bound of optimal range
    optimalMinHours: 4,       // Lower bound of optimal range
    minimumHours: 2,          // Minimum meaningful drive time
  };

  /**
   * Create a drive time target with proper constraints
   */
  static createTarget(
    targetHours: number,
    allowedVariance: number = 1.5
  ): DriveTimeTarget {
    const constraints = this.CONSTRAINTS;
    
    return {
      targetHours: Math.max(constraints.minimumHours, 
                   Math.min(constraints.recommendedMaxHours, targetHours)),
      minHours: Math.max(constraints.minimumHours, targetHours - allowedVariance),
      maxHours: Math.min(constraints.absoluteMaxHours, targetHours + allowedVariance),
      isOptimal: targetHours >= constraints.optimalMinHours && 
                targetHours <= constraints.optimalMaxHours
    };
  }

  /**
   * Validate if a drive time meets constraints - STRICT 10h enforcement
   */
  static validateDriveTime(driveTimeHours: number): {
    isValid: boolean;
    isOptimal: boolean;
    violationType?: 'too_short' | 'too_long' | 'extreme';
    recommendation?: string;
  } {
    const constraints = this.CONSTRAINTS;

    // STRICT: Any drive time over 10 hours is completely invalid
    if (driveTimeHours > constraints.absoluteMaxHours) {
      return {
        isValid: false,
        isOptimal: false,
        violationType: 'extreme',
        recommendation: `${driveTimeHours.toFixed(1)}h exceeds absolute 10-hour maximum. Trip must be split into more days.`
      };
    }

    if (driveTimeHours > constraints.recommendedMaxHours) {
      return {
        isValid: true,
        isOptimal: false,
        violationType: 'too_long',
        recommendation: `${driveTimeHours.toFixed(1)}h is long but under 10h limit. Consider adding stops for comfort.`
      };
    }

    if (driveTimeHours < constraints.minimumHours) {
      return {
        isValid: true,
        isOptimal: false,
        violationType: 'too_short',
        recommendation: `${driveTimeHours.toFixed(1)}h is very short. Consider combining with adjacent day.`
      };
    }

    const isOptimal = driveTimeHours >= constraints.optimalMinHours && 
                     driveTimeHours <= constraints.optimalMaxHours;

    return {
      isValid: true,
      isOptimal,
      recommendation: isOptimal ? 'Perfect drive time balance' : 'Acceptable drive time'
    };
  }
}
