
export interface TripStyleConfig {
  name: string;
  maxDailyDriveTime: number;
  maxDailyDriveHours: number; // New property that other services expect
  preferredDailyDistance: number;
  preferredDriveTime: number; // New property for drive time preferences
  minDailyDriveHours: number; // New property for minimum drive hours
  flexibility: number; // New property for flexibility score (0-1)
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
   * Configure trip style parameters
   */
  static configureTripStyle(tripStyle: 'balanced' | 'destination-focused'): TripStyleConfig {
    console.log(`🎨 TripStyleLogic: Configuring ${tripStyle} trip style`);

    if (tripStyle === 'destination-focused') {
      return {
        name: 'Destination-Focused',
        maxDailyDriveTime: 10,
        maxDailyDriveHours: 10,
        preferredDailyDistance: 350,
        preferredDriveTime: 6,
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
    } else {
      // Default to balanced
      return {
        name: 'Balanced',
        maxDailyDriveTime: 7,
        maxDailyDriveHours: 7,
        preferredDailyDistance: 300,
        preferredDriveTime: 5,
        minDailyDriveHours: 2,
        flexibility: 0.6,
        prioritizeDestinationCities: false,
        allowLongerDrivesForBetterDestinations: false,
        balanceFactors: {
          distance: 0.4,
          driveTime: 0.4,
          destinations: 0.2
        }
      };
    }
  }

  /**
   * Get style configuration for validation purposes
   */
  static getStyleConfig(tripStyle: 'balanced' | 'destination-focused'): TripStyleConfig {
    return this.configureTripStyle(tripStyle);
  }
}
