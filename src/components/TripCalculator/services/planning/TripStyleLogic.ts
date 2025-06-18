
export interface TripStyleConfig {
  name: string;
  maxDailyDriveTime: number;
  preferredDailyDistance: number;
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
        preferredDailyDistance: 350,
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
        preferredDailyDistance: 300,
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
