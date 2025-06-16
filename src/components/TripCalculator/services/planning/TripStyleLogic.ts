
import { TripStop } from '../data/SupabaseDataService';

export interface TripStyleConfig {
  style: 'balanced' | 'destination-focused';
  maxDailyDriveHours: number;
  preferDestinationCities: boolean;
  allowFlexibleStops: boolean;
  balancePriority: 'distance' | 'attractions' | 'heritage';
}

export class TripStyleLogic {
  /**
   * Get configuration based on trip style
   */
  static getStyleConfig(style: 'balanced' | 'destination-focused'): TripStyleConfig {
    switch (style) {
      case 'balanced':
        return {
          style: 'balanced',
          maxDailyDriveHours: 6,
          preferDestinationCities: false,
          allowFlexibleStops: true,
          balancePriority: 'distance'
        };
      
      case 'destination-focused':
        return {
          style: 'destination-focused',
          maxDailyDriveHours: 8,
          preferDestinationCities: true,
          allowFlexibleStops: false,
          balancePriority: 'heritage'
        };
      
      default:
        return this.getStyleConfig('balanced');
    }
  }

  /**
   * Filter stops based on trip style preferences
   */
  static filterStopsByStyle(
    stops: TripStop[], 
    config: TripStyleConfig
  ): TripStop[] {
    if (config.preferDestinationCities) {
      // For destination-focused, prioritize heritage cities
      const destinationCities = stops.filter(stop => 
        stop.category === 'destination_city'
      );
      
      // Add other stops only if we need more options
      if (destinationCities.length < 3) {
        const otherStops = stops.filter(stop => 
          stop.category !== 'destination_city'
        ).slice(0, 5); // Limit other stops
        return [...destinationCities, ...otherStops];
      }
      
      return destinationCities;
    }
    
    // For balanced, use all stops but prefer variety
    return stops;
  }

  /**
   * Calculate style-specific metrics
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
  } {
    const dailyDistanceTarget = totalDistance / totalDays;
    const dailyDriveTimeTarget = dailyDistanceTarget / 50; // Assume 50 mph average
    
    const isWithinLimits = dailyDriveTimeTarget <= config.maxDailyDriveHours;
    
    let recommendation: string | undefined;
    if (!isWithinLimits) {
      const minDaysNeeded = Math.ceil(totalDistance / (config.maxDailyDriveHours * 50));
      recommendation = `Consider ${minDaysNeeded}+ days for a comfortable ${config.style} trip`;
    }
    
    return {
      dailyDistanceTarget,
      dailyDriveTimeTarget,
      isWithinLimits,
      recommendation
    };
  }
}
