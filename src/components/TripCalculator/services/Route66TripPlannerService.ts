
import { EnhancedSupabaseDataService } from './data/EnhancedSupabaseDataService';
import { TripPlanBuilder, TripPlan, DailySegment, SegmentTiming } from './planning/TripPlanBuilder';
import { TripPlanValidator } from './planning/TripPlanValidator';
import { UnifiedTripPlanningService } from './planning/UnifiedTripPlanningService';
import { CityDisplayService } from './utils/CityDisplayService';
import { DistanceCalculationService } from './utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './planning/StrictDestinationCityEnforcer';
import { CityStateDisambiguationService } from './utils/CityStateDisambiguationService';
import { TripCompletionService, TripCompletionAnalysis } from './planning/TripCompletionService';

// Re-export types for backward compatibility
export type { DailySegment, TripPlan, SegmentTiming, TripCompletionAnalysis };
export type TripStop = import('../types/TripStop').TripStop;

export interface EnhancedTripPlanResult {
  tripPlan: TripPlan;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays: number;
  optimizationSummary?: string;
  debugInfo?: any;
  validationResults?: any;
  warnings?: string[];
}

export class Route66TripPlannerService {
  /**
   * Enhanced trip planning with constraint enforcement and debug information
   */
  static async planTripWithAnalysis(
    startLocation: string,
    endLocation: string,
    requestedDays: number,
    tripStyle: string = 'balanced'
  ): Promise<EnhancedTripPlanResult> {
    console.log(`🚀 ENHANCED TRIP PLANNING WITH ANALYSIS: ${startLocation} → ${endLocation}`);
    
    try {
      // Load all stops
      const allStops = await EnhancedSupabaseDataService.getAllStops();
      
      // Use the unified planning service
      const planningResult = await UnifiedTripPlanningService.planTrip(
        startLocation,
        endLocation,
        requestedDays,
        tripStyle as 'balanced' | 'destination-focused'
      );
      
      if (!planningResult.success || !planningResult.tripPlan || planningResult.tripPlan.segments.length === 0) {
        throw new Error(`Trip planning failed: ${planningResult.error || 'No segments generated'}`);
      }
      
      // Create enhanced trip plan with summary
      const tripPlan: TripPlan = {
        segments: planningResult.tripPlan.segments,
        totalDays: planningResult.tripPlan.totalDays,
        totalDistance: planningResult.tripPlan.totalDistance,
        totalDrivingTime: planningResult.tripPlan.totalDrivingTime || planningResult.tripPlan.segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0),
        summary: {
          totalDays: planningResult.tripPlan.totalDays,
          totalDistance: planningResult.tripPlan.totalDistance,
          totalDriveTime: planningResult.tripPlan.totalDrivingTime || planningResult.tripPlan.segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0),
          startLocation,
          endLocation,
          tripStyle
        }
      };
      
      // Create completion analysis
      const completionAnalysis: TripCompletionAnalysis = {
        isCompleted: planningResult.tripPlan.totalDays !== requestedDays,
        originalDays: requestedDays,
        optimizedDays: planningResult.tripPlan.totalDays,
        adjustmentReason: planningResult.tripPlan.totalDays > requestedDays 
          ? 'Extended for drive time safety' 
          : 'Optimized for better pacing',
        confidence: planningResult.success ? 0.95 : 0.7,
        qualityMetrics: {
          driveTimeBalance: planningResult.driveTimeValidation?.violations === 0 ? 'excellent' : 'good',
          routeEfficiency: planningResult.warnings && planningResult.warnings.length === 0 ? 'excellent' : 'poor',
          attractionCoverage: 'good',
          overallScore: planningResult.success ? 0.9 : 0.6
        },
        recommendations: planningResult.warnings || []
      };
      
      console.log(`✅ ENHANCED PLANNING SUCCESS: ${tripPlan.segments.length} segments, valid: ${planningResult.success}`);
      
      return {
        tripPlan,
        completionAnalysis,
        originalRequestedDays: requestedDays,
        debugInfo: planningResult.validationInfo,
        validationResults: planningResult.driveTimeValidation,
        warnings: planningResult.warnings || []
      };
      
    } catch (error) {
      console.error('❌ Enhanced trip planning failed:', error);
      throw error;
    }
  }

  /**
   * Enhanced trip planning with completion analysis
   */
  static async planTrip(
    startCityName: string, 
    endCityName: string, 
    tripDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): Promise<TripPlan> {
    const result = await this.planTripWithAnalysis(startCityName, endCityName, tripDays, tripStyle);
    return result.tripPlan;
  }

  /**
   * Get data source status for debugging
   */
  static getDataSourceStatus(): string {
    return EnhancedSupabaseDataService.getDataSourceMessage();
  }

  /**
   * Check if using fallback data
   */
  static isUsingFallbackData(): boolean {
    return EnhancedSupabaseDataService.isUsingFallback();
  }

  /**
   * Get count of destination cities only
   */
  static async getDestinationCitiesCount(): Promise<number> {
    const allStops = await EnhancedSupabaseDataService.fetchAllStops();
    const destinationCitiesOnly = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    return destinationCitiesOnly.length;
  }
}
