
import { TripStop } from '../data/SupabaseDataService';

export interface TripStyleConfig {
  style: 'balanced' | 'destination-focused';
  maxDailyDriveHours: number;
  preferDestinationCities: boolean;
  allowFlexibleStops: boolean;
  balancePriority: 'distance' | 'attractions' | 'heritage';
  enforcementLevel: 'strict' | 'moderate' | 'flexible';
}

export class TripStyleLogic {
  /**
   * Get configuration based on trip style with correct drive time limits
   */
  static getStyleConfig(style: 'balanced' | 'destination-focused'): TripStyleConfig {
    switch (style) {
      case 'balanced':
        return {
          style: 'balanced',
          maxDailyDriveHours: 6,
          preferDestinationCities: false,
          allowFlexibleStops: true,
          balancePriority: 'distance',
          enforcementLevel: 'strict'
        };
      
      case 'destination-focused':
        return {
          style: 'destination-focused',
          maxDailyDriveHours: 10, // FIXED: Updated from 8 to 10 hours maximum
          preferDestinationCities: true,
          allowFlexibleStops: false,
          balancePriority: 'heritage',
          enforcementLevel: 'strict' // FIXED: Changed from moderate to strict enforcement
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
   * Calculate style-specific metrics with enhanced drive time validation
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
    const dailyDriveTimeTarget = dailyDistanceTarget / 50; // Assume 50 mph average
    
    const isWithinLimits = dailyDriveTimeTarget <= config.maxDailyDriveHours;
    const requiresRebalancing = dailyDriveTimeTarget > config.maxDailyDriveHours;
    
    let recommendation: string | undefined;
    if (!isWithinLimits) {
      const minDaysNeeded = Math.ceil(totalDistance / (config.maxDailyDriveHours * 50));
      recommendation = `Consider ${minDaysNeeded}+ days for a comfortable ${config.style} trip (current avg: ${dailyDriveTimeTarget.toFixed(1)}h/day, limit: ${config.maxDailyDriveHours}h/day)`;
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
   * Get enforcement strictness based on trip style
   */
  static shouldEnforceStrictDriveLimits(config: TripStyleConfig): boolean {
    return config.enforcementLevel === 'strict';
  }
}
