import { TripStop } from '../../types/TripStop';
import { TripStyleConfig } from './TripStyleLogic';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface PrePlanningValidationResult {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
  estimatedMinDays: number;
  estimatedMaxDays: number;
  warnings: string[];
}

export class TripPrePlanningValidator {
  /**
   * Validate trip parameters before detailed planning
   */
  static validateTripFeasibility(
    startStop: TripStop,
    endStop: TripStop,
    requestedDays: number,
    styleConfig: TripStyleConfig
  ): PrePlanningValidationResult {
    console.log(`🔍 Pre-planning validation: ${startStop.name} → ${endStop.name}, ${requestedDays} days, ${styleConfig.style} style`);
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    const warnings: string[] = [];
    
    // Calculate total distance
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    // Calculate time requirements based on style
    const maxDailyDistance = styleConfig.maxDailyDriveHours * 55; // 55 mph average
    const estimatedMinDays = Math.ceil(totalDistance / maxDailyDistance);
    const estimatedMaxDays = Math.ceil(totalDistance / (styleConfig.maxDailyDriveHours * 0.6 * 55)); // More leisurely pace
    
    console.log(`📊 Distance analysis:`, {
      totalDistance: totalDistance.toFixed(1),
      maxDailyDistance: maxDailyDistance.toFixed(1),
      estimatedMinDays,
      estimatedMaxDays,
      requestedDays
    });
    
    // Validate requested days against requirements
    if (requestedDays < estimatedMinDays) {
      issues.push(`${requestedDays} days is insufficient for ${totalDistance.toFixed(0)} miles with ${styleConfig.style} pacing`);
      recommendations.push(`Consider at least ${estimatedMinDays} days for comfortable ${styleConfig.style} travel`);
    }
    
    if (requestedDays < estimatedMinDays - 1) {
      issues.push(`Requested duration would require ${((totalDistance / requestedDays) / 55).toFixed(1)} hours of driving per day`);
    }
    
    // Style-specific validations
    if (styleConfig.style === 'balanced') {
      if (requestedDays < estimatedMinDays) {
        issues.push('Balanced trips prioritize comfortable pacing with max 6 hours driving per day');
        recommendations.push('Choose "Destination-focused" style for longer drive days, or add more days');
      }
      
      if (requestedDays > estimatedMaxDays * 1.5) {
        warnings.push('This duration allows for very leisurely pacing with extra exploration time');
      }
    }
    
    if (styleConfig.style === 'destination-focused') {
      if (requestedDays < Math.ceil(totalDistance / (8 * 55))) {
        issues.push('Even destination-focused trips cannot exceed 8 hours of daily driving');
      }
    }
    
    // Distance-specific warnings
    if (totalDistance > 2000) {
      warnings.push('This is a very long Route 66 journey - consider breaking into multiple trips');
    }
    
    if (totalDistance < 100) {
      warnings.push('This is a short Route 66 segment - you may want to extend your route');
    }
    
    const isValid = issues.length === 0;
    
    console.log(`✅ Pre-planning validation complete:`, {
      isValid,
      issues: issues.length,
      recommendations: recommendations.length,
      warnings: warnings.length
    });
    
    return {
      isValid,
      issues,
      recommendations,
      estimatedMinDays,
      estimatedMaxDays,
      warnings
    };
  }

  /**
   * Get detailed feasibility analysis
   */
  static getFeasibilityAnalysis(
    startStop: TripStop,
    endStop: TripStop,
    styleConfig: TripStyleConfig
  ): {
    totalDistance: number;
    minDaysRequired: number;
    comfortableDays: number;
    leisurelyDays: number;
    dailyDistanceComfortable: number;
  } {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const maxDailyDistance = styleConfig.maxDailyDriveHours * 55;
    const comfortableDailyDistance = styleConfig.maxDailyDriveHours * 0.8 * 55;
    const leisurelyDailyDistance = styleConfig.maxDailyDriveHours * 0.6 * 55;
    
    return {
      totalDistance,
      minDaysRequired: Math.ceil(totalDistance / maxDailyDistance),
      comfortableDays: Math.ceil(totalDistance / comfortableDailyDistance),
      leisurelyDays: Math.ceil(totalDistance / leisurelyDailyDistance),
      dailyDistanceComfortable: comfortableDailyDistance
    };
  }
}
