
export class DriveTimeCalculator {
  private static readonly AVG_SPEED_MPH = 50;
  private static readonly MIN_DRIVE_TIME = 3;
  private static readonly MAX_DRIVE_TIME = 8;
  private static readonly IDEAL_DRIVE_TIME = 6;

  static calculateDriveTime(distance: number): number {
    return distance / this.AVG_SPEED_MPH;
  }

  static isOptimalDriveTime(driveTimeHours: number): boolean {
    return driveTimeHours >= this.MIN_DRIVE_TIME && driveTimeHours <= this.MAX_DRIVE_TIME;
  }

  static getIdealDriveTime(): number {
    return this.IDEAL_DRIVE_TIME;
  }

  static getMaxDriveTime(): number {
    return this.MAX_DRIVE_TIME;
  }

  static getMinDriveTime(): number {
    return this.MIN_DRIVE_TIME;
  }

  static categorizeeDriveTime(driveTimeHours: number): 'short' | 'optimal' | 'long' | 'extreme' {
    if (driveTimeHours <= 4) return 'short';
    if (driveTimeHours <= 6) return 'optimal';
    if (driveTimeHours <= 8) return 'long';
    return 'extreme';
  }
}
