
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
  };
}

export class UnifiedTripPlanningService {
  /**
   * Create a trip plan using the specified planning style
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
        const destinationResult = DestinationFocusedPlanningService.createDestinationFocusedPlan(
          startStop,
          endStop,
          allStops,
          requestedDays,
          inputStartCity,
          inputEndCity
        );

        console.log(`✅ Destination-focused plan created with ${destinationResult.warnings.length} warnings`);

        return {
          tripPlan: destinationResult.tripPlan,
          tripStyle: 'destination-focused',
          warnings: destinationResult.warnings,
          routeAssessment: destinationResult.routeAssessment
        };
      } catch (error) {
        console.error('❌ Destination-focused planning failed, falling back to balanced:', error);
        
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
          warnings: ['Destination-focused planning failed, using balanced approach instead']
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
        return 'Destination-Focused';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get trip style description
   */
  static getTripStyleDescription(tripStyle: TripStyle): string {
    switch (tripStyle) {
      case 'balanced':
        return 'Evenly distributes driving time across all days for consistent daily travel';
      case 'destination-focused':
        return 'Prioritizes major Route 66 destination cities as stopping points, drive times may vary';
      default:
        return 'Unknown trip style';
    }
  }
}
