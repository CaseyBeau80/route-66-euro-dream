
import { StyleConfig } from './SegmentRebalancingService';

export type TripStyle = 'balanced' | 'destination-focused';

export class TripStyleLogic {
  /**
   * Get configuration for different trip styles
   */
  static getStyleConfig(tripStyle: TripStyle): StyleConfig {
    switch (tripStyle) {
      case 'destination-focused':
        return {
          maxDriveTimeHours: 8,
          preferredDriveTimeHours: 6,
          allowExtendedDays: false
        };
      case 'balanced':
        return {
          maxDriveTimeHours: 10,
          preferredDriveTimeHours: 7,
          allowExtendedDays: true
        };
      default:
        return {
          maxDriveTimeHours: 8,
          preferredDriveTimeHours: 6,
          allowExtendedDays: false
        };
    }
  }

  /**
   * Get display name for trip style
   */
  static getDisplayName(tripStyle: TripStyle): string {
    switch (tripStyle) {
      case 'destination-focused':
        return 'Destination-Focused';
      case 'balanced':
        return 'Balanced Adventure';
      default:
        return 'Unknown Style';
    }
  }

  /**
   * Get description for trip style
   */
  static getDescription(tripStyle: TripStyle): string {
    switch (tripStyle) {
      case 'destination-focused':
        return 'Prioritizes high-heritage destinations and cultural experiences';
      case 'balanced':
        return 'Balances drive time with destinations and attractions';
      default:
        return 'Custom trip style';
    }
  }
}
