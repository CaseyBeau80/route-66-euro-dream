
import { StyleConfig } from './SegmentRebalancingService';

export type TripStyle = 'balanced' | 'destination-focused';

export interface TripStyleConfig {
  maxDriveTimeHours: number;
  preferredDriveTimeHours: number;
  allowExtendedDays: boolean;
  maxDailyDriveHours: number;
  style: TripStyle;
  preferDestinationCities: boolean;
  enforcementLevel?: 'strict' | 'moderate' | 'relaxed';
}

export class TripStyleLogic {
  /**
   * Get configuration for different trip styles
   */
  static getStyleConfig(tripStyle: TripStyle): TripStyleConfig {
    switch (tripStyle) {
      case 'destination-focused':
        return {
          maxDriveTimeHours: 8,
          preferredDriveTimeHours: 6,
          allowExtendedDays: false,
          maxDailyDriveHours: 12,
          style: tripStyle,
          preferDestinationCities: true,
          enforcementLevel: 'strict'
        };
      case 'balanced':
        return {
          maxDriveTimeHours: 10,
          preferredDriveTimeHours: 7,
          allowExtendedDays: true,
          maxDailyDriveHours: 10,
          style: tripStyle,
          preferDestinationCities: false,
          enforcementLevel: 'moderate'
        };
      default:
        return {
          maxDriveTimeHours: 8,
          preferredDriveTimeHours: 6,
          allowExtendedDays: false,
          maxDailyDriveHours: 8,
          style: 'balanced',
          preferDestinationCities: false,
          enforcementLevel: 'moderate'
        };
    }
  }

  /**
   * Filter stops by trip style preferences
   */
  static filterStopsByStyle(stops: any[], config: TripStyleConfig): any[] {
    if (config.preferDestinationCities) {
      return stops.filter(stop => stop.category === 'destination_city');
    }
    return stops;
  }

  /**
   * Calculate style metrics for trip planning
   */
  static calculateStyleMetrics(
    totalDistance: number,
    totalDays: number,
    config: TripStyleConfig
  ): {
    dailyDistanceTarget: number;
    dailyDriveTimeTarget: number;
    isWithinLimits: boolean;
    recommendation?: string;
    requiresRebalancing: boolean;
  } {
    const dailyDistanceTarget = totalDistance / totalDays;
    const dailyDriveTimeTarget = dailyDistanceTarget / 55; // 55 mph average

    const isWithinLimits = dailyDriveTimeTarget <= config.maxDailyDriveHours;
    const requiresRebalancing = dailyDriveTimeTarget > config.preferredDriveTimeHours;

    let recommendation;
    if (!isWithinLimits) {
      recommendation = `Consider extending trip to ${Math.ceil(totalDistance / (config.maxDailyDriveHours * 55))} days`;
    } else if (requiresRebalancing) {
      recommendation = 'Drive times may exceed preferred limits on some days';
    }

    return {
      dailyDistanceTarget,
      dailyDriveTimeTarget,
      isWithinLimits,
      recommendation,
      requiresRebalancing
    };
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
