
import { route66Towns } from '@/types/route66';
import { DistanceEstimationService } from '../utils/DistanceEstimationService';

export interface TripValidationResult {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
  suggestedDays?: number;
  feasibilityScore: number; // 0-100
  canBeOptimized: boolean;
  optimizationSuggestions: OptimizationSuggestion[];
}

export interface OptimizationSuggestion {
  type: 'increase_days' | 'decrease_days' | 'change_cities' | 'optimize_route';
  title: string;
  description: string;
  actionValue?: number;
  priority: 'high' | 'medium' | 'low';
}

export class TripValidationService {
  private static readonly MAX_DAILY_DRIVE_HOURS = 10;
  private static readonly MIN_DAILY_DRIVE_HOURS = 2;
  private static readonly AVERAGE_SPEED_MPH = 55;
  private static readonly COMFORT_DRIVE_HOURS = 6;

  static validateTrip(
    startLocation: string,
    endLocation: string,
    requestedDays: number
  ): TripValidationResult {
    console.log('🔍 TripValidationService: Validating trip parameters:', {
      startLocation,
      endLocation,
      requestedDays
    });

    const result: TripValidationResult = {
      isValid: true,
      issues: [],
      recommendations: [],
      feasibilityScore: 100,
      canBeOptimized: false,
      optimizationSuggestions: []
    };

    // Check if locations exist in Route 66 towns
    const startTown = this.findTownByName(startLocation);
    const endTown = this.findTownByName(endLocation);

    if (!startTown) {
      result.isValid = false;
      result.issues.push(`Start location "${startLocation}" not found on Route 66`);
      result.feasibilityScore -= 30;
      return result;
    }

    if (!endTown) {
      result.isValid = false;
      result.issues.push(`End location "${endLocation}" not found on Route 66`);
      result.feasibilityScore -= 30;
      return result;
    }

    // Estimate distance
    const estimatedDistance = DistanceEstimationService.estimateDistance(startLocation, endLocation);
    
    if (!estimatedDistance) {
      result.isValid = false;
      result.issues.push('Could not calculate route distance');
      result.feasibilityScore -= 40;
      return result;
    }

    console.log('📏 Route metrics:', {
      distance: Math.round(estimatedDistance),
      requestedDays
    });

    // Calculate optimal and feasible day ranges
    const minDaysNeeded = Math.ceil(estimatedDistance / (this.MAX_DAILY_DRIVE_HOURS * this.AVERAGE_SPEED_MPH));
    const maxComfortableDays = Math.ceil(estimatedDistance / (this.MIN_DAILY_DRIVE_HOURS * this.AVERAGE_SPEED_MPH));
    const optimalDays = Math.ceil(estimatedDistance / (this.COMFORT_DRIVE_HOURS * this.AVERAGE_SPEED_MPH));

    console.log('📊 Day calculations:', {
      minDaysNeeded,
      optimalDays,
      maxComfortableDays,
      requestedDays
    });

    // Validate against minimum requirements
    if (requestedDays < minDaysNeeded) {
      result.isValid = false;
      result.issues.push(
        `${requestedDays} days is too short. Minimum ${minDaysNeeded} days needed for ${Math.round(estimatedDistance)} miles (max ${this.MAX_DAILY_DRIVE_HOURS}h/day driving).`
      );
      result.feasibilityScore = Math.max(0, result.feasibilityScore - 50);
      result.canBeOptimized = true;
      result.optimizationSuggestions.push({
        type: 'increase_days',
        title: `Increase to ${minDaysNeeded} Days`,
        description: `Minimum ${minDaysNeeded} days needed for safe driving limits`,
        actionValue: minDaysNeeded,
        priority: 'high'
      });
    }

    // Check if it's too long (inefficient)
    if (requestedDays > maxComfortableDays) {
      result.recommendations.push(
        `${requestedDays} days might be more than needed. You could complete this trip comfortably in ${optimalDays} days.`
      );
      result.feasibilityScore = Math.max(60, result.feasibilityScore - 20);
      result.canBeOptimized = true;
      result.optimizationSuggestions.push({
        type: 'decrease_days',
        title: `Optimize to ${optimalDays} Days`,
        description: `Perfect balance of driving and sightseeing time`,
        actionValue: optimalDays,
        priority: 'medium'
      });
    }

    // Calculate feasibility score based on how close to optimal
    if (result.isValid) {
      const daysDifference = Math.abs(requestedDays - optimalDays);
      const maxDifference = Math.max(optimalDays - minDaysNeeded, maxComfortableDays - optimalDays);
      
      if (maxDifference > 0) {
        const proximityScore = Math.max(0, 100 - (daysDifference / maxDifference) * 30);
        result.feasibilityScore = Math.min(result.feasibilityScore, proximityScore);
      }

      // Store suggested days
      result.suggestedDays = optimalDays;
    }

    // Add route optimization suggestion if not optimal
    if (result.isValid && requestedDays !== optimalDays) {
      result.canBeOptimized = true;
      result.optimizationSuggestions.push({
        type: 'optimize_route',
        title: 'Auto-Generate Optimal Trip',
        description: `Let us create the perfect ${optimalDays}-day itinerary for you`,
        actionValue: optimalDays,
        priority: 'low'
      });
    }

    // Add alternative route suggestions for invalid trips
    if (!result.isValid && result.issues.some(issue => issue.includes('too short'))) {
      result.optimizationSuggestions.push({
        type: 'change_cities',
        title: 'Choose Closer Cities',
        description: 'Select start and end points that work better for your available time',
        priority: 'medium'
      });
    }

    console.log('✅ Validation complete:', {
      isValid: result.isValid,
      feasibilityScore: result.feasibilityScore,
      suggestedDays: result.suggestedDays,
      optimizationCount: result.optimizationSuggestions.length
    });

    return result;
  }

  private static findTownByName(cityName: string) {
    const normalizedName = cityName.toLowerCase().trim();
    
    return route66Towns.find(town => {
      const townName = town.name.toLowerCase();
      
      // Exact match
      if (townName === normalizedName) return true;
      
      // Match city part (e.g., "Chicago" matches "Chicago, IL")
      const cityPart = townName.split(',')[0].trim();
      if (cityPart === normalizedName) return true;
      
      // Partial match
      return townName.includes(normalizedName) || normalizedName.includes(cityPart);
    });
  }

  static getDrivingTimeCategory(hours: number): 'short' | 'optimal' | 'long' | 'extreme' {
    if (hours <= 4) return 'short';
    if (hours <= 6) return 'optimal';
    if (hours <= 8) return 'long';
    return 'extreme';
  }

  static getDrivingTimeDescription(category: string): string {
    switch (category) {
      case 'short': return 'Light driving day';
      case 'optimal': return 'Perfect driving time';
      case 'long': return 'Extended driving day';
      case 'extreme': return 'Very long driving day';
      default: return 'Unknown';
    }
  }
}
