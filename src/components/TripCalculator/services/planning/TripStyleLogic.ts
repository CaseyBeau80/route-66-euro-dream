
export interface TripStyleConfig {
  name: string;
  style: 'destination-focused';
  maxDailyDriveTime: number;
  maxDailyDriveHours: number;
  preferredDailyDistance: number;
  preferredDriveTime: number;
  minDailyDriveHours: number;
  flexibility: number;
  prioritizeDestinationCities: boolean;
  allowLongerDrivesForBetterDestinations: boolean;
  balanceFactors: {
    distance: number;
    driveTime: number;
    destinations: number;
  };
}

export class TripStyleLogic {
  /**
   * Configure trip style parameters - now only supports destination-focused
   */
  static configureTripStyle(tripStyle: 'destination-focused'): TripStyleConfig {
    console.log(`🎨 TripStyleLogic: Configuring ${tripStyle} trip style with 10h max drive time`);

    return {
      name: 'Heritage Cities',
      style: 'destination-focused',
      maxDailyDriveTime: 10, // Enforced 10-hour limit
      maxDailyDriveHours: 10, // Enforced 10-hour limit
      preferredDailyDistance: 400, // Increased to accommodate longer drives
      preferredDriveTime: 7, // Preferred 7 hours
      minDailyDriveHours: 3,
      flexibility: 0.8,
      prioritizeDestinationCities: true,
      allowLongerDrivesForBetterDestinations: true,
      balanceFactors: {
        distance: 0.3,
        driveTime: 0.2,
        destinations: 0.5
      }
    };
  }

  /**
   * Get style configuration for validation purposes
   */
  static getStyleConfig(tripStyle: 'destination-focused'): TripStyleConfig {
    return this.configureTripStyle(tripStyle);
  }
}
