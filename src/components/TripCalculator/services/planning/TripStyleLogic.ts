
export interface TripStyleConfig {
  style: 'balanced' | 'destination-focused';
  maxDailyDriveHours: number;
  minDailyDriveHours: number;
  preferredDriveTime: number;
  flexibility: number;
}

export class TripStyleLogic {
  static getStyleConfig(tripStyle: 'balanced' | 'destination-focused'): TripStyleConfig {
    if (tripStyle === 'destination-focused') {
      return {
        style: 'destination-focused',
        maxDailyDriveHours: 10,
        minDailyDriveHours: 3,
        preferredDriveTime: 8,
        flexibility: 0.8
      };
    }
    
    // Default to balanced
    return {
      style: 'balanced',
      maxDailyDriveHours: 7,
      minDailyDriveHours: 3,
      preferredDriveTime: 5,
      flexibility: 0.6
    };
  }

  static configureTripStyle(tripStyle: 'balanced' | 'destination-focused'): TripStyleConfig {
    return this.getStyleConfig(tripStyle);
  }
}
