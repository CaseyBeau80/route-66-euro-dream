
export class ScoreCalculationService {
  private static readonly AVG_SPEED_MPH = 50;
  private static readonly IDEAL_DRIVE_TIME = 6;
  private static readonly MIN_DRIVE_TIME = 3;
  private static readonly MAX_DRIVE_TIME = 8;

  /**
   * Calculate drive time score based on optimal ranges
   */
  static calculateDriveTimeScore(driveTimeHours: number): number {
    if (driveTimeHours < this.MIN_DRIVE_TIME) {
      // Too short - penalize
      return Math.max(0, 20 - (this.MIN_DRIVE_TIME - driveTimeHours) * 10);
    } else if (driveTimeHours > this.MAX_DRIVE_TIME) {
      // Too long - penalize heavily
      return Math.max(0, 20 - (driveTimeHours - this.MAX_DRIVE_TIME) * 15);
    } else {
      // In acceptable range - score based on proximity to ideal
      const deviation = Math.abs(driveTimeHours - this.IDEAL_DRIVE_TIME);
      return Math.max(0, 30 - deviation * 10);
    }
  }

  /**
   * Get category bonus for non-official destinations
   */
  static getCategoryBonus(category: string): number {
    switch (category) {
      case 'route66_waypoint':
        return 20;
      case 'attraction':
        return 15;
      case 'historic_site':
        return 10;
      case 'hidden_gem':
        return 5;
      default:
        return 0;
    }
  }

  /**
   * Calculate position score based on how close to target distance
   */
  static calculatePositionScore(distanceFromStart: number, targetDistanceFromStart: number): number {
    return Math.max(0, 100 - Math.abs(distanceFromStart - targetDistanceFromStart));
  }
}
