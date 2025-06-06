
import { TripStop } from '../data/SupabaseDataService';
import { TripPlan } from './TripPlanBuilder';
import { BalancedTripPlanningService } from './BalancedTripPlanningService';
import { DestinationFocusedPlanningService, DestinationFocusedResult } from './DestinationFocusedPlanningService';

export type TripStyle = 'balanced' | 'destination-focused';

export interface UnifiedPlanningResult {
  tripPlan: TripPlan;
  tripStyle: TripStyle;
  warnings?: string[];
  routeAssessment?: {
    isRecommended: boolean;
    summary: string;
    totalLongDrives: number;
    consecutivePairs?: number;
    optimizationScore?: number;
  };
  optimizationDetails?: {
    consecutivePairs: number;
    gapFillers: number;
    adjustmentsMade: string[];
    priorityScore: number;
  };
}

export class UnifiedTripPlanningService {
  /**
   * Create a trip plan using the specified planning style with enhanced optimization
   */
  static createTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number,
    inputStartCity: string,
    inputEndCity: string,
    tripStyle: TripStyle = 'balanced'
  ): UnifiedPlanningResult {
    console.log(`🚗 Creating ${tripStyle} trip plan: ${inputStartCity} → ${inputEndCity} in ${requestedDays} days`);

    if (tripStyle === 'destination-focused') {
      try {
        const destinationResult: DestinationFocusedResult = DestinationFocusedPlanningService.createDestinationFocusedPlan(
          startStop,
          endStop,
          allStops,
          requestedDays,
          inputStartCity,
          inputEndCity
        );

        console.log(`✅ Optimized destination-focused plan created with ${destinationResult.warnings.length} warnings`);

        // Log optimization details
        if (destinationResult.optimizationDetails) {
          console.log(`🔗 Optimization results: ${destinationResult.optimizationDetails.consecutivePairs} consecutive pairs, ` +
                     `${destinationResult.optimizationDetails.gapFillers} gap fillers, ` +
                     `priority score: ${destinationResult.optimizationDetails.priorityScore}`);
          
          destinationResult.optimizationDetails.adjustmentsMade.forEach(adjustment => {
            console.log(`📝 Adjustment: ${adjustment}`);
          });
        }

        return {
          tripPlan: destinationResult.tripPlan,
          tripStyle: 'destination-focused',
          warnings: destinationResult.warnings,
          routeAssessment: destinationResult.routeAssessment,
          optimizationDetails: destinationResult.optimizationDetails
        };
      } catch (error) {
        console.error('❌ Optimized destination-focused planning failed, falling back to balanced:', error);
        
        // Fallback to balanced planning
        const balancedPlan = BalancedTripPlanningService.createBalancedPlan(
          startStop,
          endStop,
          allStops,
          requestedDays,
          inputStartCity,
          inputEndCity
        );

        return {
          tripPlan: balancedPlan,
          tripStyle: 'balanced',
          warnings: ['Optimized destination-focused planning failed, using balanced approach instead']
        };
      }
    } else {
      // Balanced planning
      const balancedPlan = BalancedTripPlanningService.createBalancedPlan(
        startStop,
        endStop,
        allStops,
        requestedDays,
        inputStartCity,
        inputEndCity
      );

      console.log(`✅ Balanced plan created successfully`);

      return {
        tripPlan: balancedPlan,
        tripStyle: 'balanced'
      };
    }
  }

  /**
   * Get trip style display name
   */
  static getTripStyleDisplayName(tripStyle: TripStyle): string {
    switch (tripStyle) {
      case 'balanced':
        return 'Balanced';
      case 'destination-focused':
        return 'Heritage-Optimized Destination-Focused';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get trip style description with optimization context
   */
  static getTripStyleDescription(tripStyle: TripStyle): string {
    switch (tripStyle) {
      case 'balanced':
        return 'Evenly distributes driving time across all days for consistent daily travel';
      case 'destination-focused':
        return 'Prioritizes consecutive major Route 66 heritage cities, optimizing for authentic Mother Road experience';
      default:
        return 'Unknown trip style';
    }
  }

  /**
   * Get optimization summary for UI display
   */
  static getOptimizationSummary(result: UnifiedPlanningResult): string | null {
    if (!result.optimizationDetails) return null;

    const { consecutivePairs, gapFillers, priorityScore } = result.optimizationDetails;
    
    if (consecutivePairs > 0) {
      return `Route optimized with ${consecutivePairs} consecutive major city connections ` +
             `${gapFillers > 0 ? `and ${gapFillers} strategic stops` : ''} ` +
             `(Heritage Score: ${priorityScore}/100)`;
    }
    
    return `Route includes ${gapFillers} strategic stops for drive time management`;
  }
}
