
export class ScoreCalculationService {
  /**
   * Calculate position score based on how close to target distance
   */
  static calculatePositionScore(actualDistance: number, targetDistance: number): number {
    const distanceDiff = Math.abs(actualDistance - targetDistance);
    const maxPenalty = 50;
    
    // Perfect match gets highest score
    if (distanceDiff === 0) return 100;
    
    // Progressive penalty for distance from target
    const penalty = Math.min(maxPenalty, (distanceDiff / targetDistance) * 100);
    return Math.max(0, 100 - penalty);
  }

  /**
   * Calculate drive time score - prefer optimal drive times
   */
  static calculateDriveTimeScore(driveTimeHours: number): number {
    const constraints = {
      optimal: { min: 4, max: 6 },
      acceptable: { min: 2, max: 8 },
      maximum: 10
    };

    // Perfect score for optimal range
    if (driveTimeHours >= constraints.optimal.min && driveTimeHours <= constraints.optimal.max) {
      return 100;
    }

    // Good score for acceptable range
    if (driveTimeHours >= constraints.acceptable.min && driveTimeHours <= constraints.acceptable.max) {
      return 80;
    }

    // Penalty for too short or too long
    if (driveTimeHours < constraints.acceptable.min) {
      const shortPenalty = (constraints.acceptable.min - driveTimeHours) * 20;
      return Math.max(20, 60 - shortPenalty);
    }

    if (driveTimeHours <= constraints.maximum) {
      const longPenalty = (driveTimeHours - constraints.acceptable.max) * 15;
      return Math.max(10, 60 - longPenalty);
    }

    // Severe penalty for exceeding maximum
    return 0;
  }

  /**
   * Get category bonus for destination types
   */
  static getCategoryBonus(category: string): number {
    switch (category) {
      case 'destination_city':
        return 75; // Highest priority
      case 'route66_waypoint':
        return 25;
      case 'attraction':
        return 20;
      case 'historic_site':
        return 15;
      case 'hidden_gem':
        return 10;
      default:
        return 5;
    }
  }

  /**
   * Calculate geographic progression bonus
   */
  static calculateProgressionBonus(
    progressRatio: number,
    isMovingTowardDestination: boolean
  ): number {
    if (!isMovingTowardDestination) return -50; // Heavy penalty for wrong direction

    // Bonus for reasonable progress (not too little, not too much)
    if (progressRatio >= 0.15 && progressRatio <= 0.4) {
      return 30;
    }

    if (progressRatio >= 0.1 && progressRatio <= 0.5) {
      return 15;
    }

    return 0;
  }
}
