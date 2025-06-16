
import { TripStop } from '../data/SupabaseDataService';
import { TripStyleConfig } from './TripStyleLogic';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface DriveTimeValidationResult {
  isValid: boolean;
  actualDriveTime: number;
  maxAllowed: number;
  excessTime: number;
  recommendation?: string;
}

export class DriveTimeEnforcementService {
  /**
   * Validate if a segment meets drive-time requirements
   */
  static validateSegmentDriveTime(
    startStop: TripStop,
    endStop: TripStop,
    styleConfig: TripStyleConfig
  ): DriveTimeValidationResult {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const actualDriveTime = this.calculateRealisticDriveTime(distance);
    const maxAllowed = styleConfig.maxDailyDriveHours;
    const excessTime = Math.max(0, actualDriveTime - maxAllowed);
    const isValid = actualDriveTime <= maxAllowed;

    console.log(`🚗 Drive time validation: ${startStop.name} → ${endStop.name}`, {
      distance: distance.toFixed(1),
      actualDriveTime: actualDriveTime.toFixed(1),
      maxAllowed,
      isValid,
      excessTime: excessTime.toFixed(1)
    });

    let recommendation: string | undefined;
    if (!isValid) {
      recommendation = `Consider breaking this ${actualDriveTime.toFixed(1)}h drive into multiple days or adding intermediate stops`;
    }

    return {
      isValid,
      actualDriveTime,
      maxAllowed,
      excessTime,
      recommendation
    };
  }

  /**
   * Calculate realistic drive time with traffic and stops
   */
  static calculateRealisticDriveTime(distance: number): number {
    let avgSpeed: number;
    let bufferMultiplier: number;
    
    if (distance < 50) {
      avgSpeed = 45; // Urban/city driving
      bufferMultiplier = 1.2; // More traffic, lights
    } else if (distance < 150) {
      avgSpeed = 55; // Mixed roads
      bufferMultiplier = 1.15; // Some traffic
    } else if (distance < 300) {
      avgSpeed = 65; // Mostly highway
      bufferMultiplier = 1.1; // Light traffic
    } else {
      avgSpeed = 70; // Long highway stretches
      bufferMultiplier = 1.05; // Minimal stops
    }
    
    const baseTime = distance / avgSpeed;
    return Math.max(baseTime * bufferMultiplier, 0.5); // Minimum 30 minutes
  }

  /**
   * Get enforcement level based on trip style
   */
  static getEnforcementLevel(styleConfig: TripStyleConfig): 'strict' | 'moderate' | 'flexible' {
    switch (styleConfig.style) {
      case 'balanced':
        return 'strict'; // Enforce 6-hour limit strictly
      case 'destination-focused':
        return 'moderate'; // Allow up to 8 hours but warn
      default:
        return 'flexible';
    }
  }

  /**
   * Check if rebalancing is needed for trip segments
   */
  static requiresRebalancing(
    segments: Array<{ startStop: TripStop; endStop: TripStop }>,
    styleConfig: TripStyleConfig
  ): boolean {
    const enforcementLevel = this.getEnforcementLevel(styleConfig);
    
    if (enforcementLevel === 'flexible') {
      return false;
    }

    // Check if any segment violates drive-time limits
    for (const segment of segments) {
      const validation = this.validateSegmentDriveTime(
        segment.startStop,
        segment.endStop,
        styleConfig
      );
      
      if (!validation.isValid) {
        console.log(`⚠️ Rebalancing needed: ${segment.startStop.name} → ${segment.endStop.name} exceeds ${styleConfig.maxDailyDriveHours}h limit`);
        return true;
      }
    }

    return false;
  }
}
