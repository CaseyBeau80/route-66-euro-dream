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
      const allStops = await SupabaseDataService.getAllStops();
      
      // Use the new enhanced planning service
      const planningResult = EnhancedTripPlanningService.planTripWithConstraints(
        startLocation,
        endLocation,
        requestedDays,
        tripStyle,
        allStops
      );
      
      if (!planningResult.isValid || planningResult.segments.length === 0) {
        throw new Error(`Trip planning failed: ${planningResult.warnings.join(', ')}`);
      }
      
      // Create trip plan
      const tripPlan: TripPlan = {
        segments: planningResult.segments,
        summary: {
          totalDays: planningResult.adjustedTripDays,
          totalDistance: planningResult.segments.reduce((sum, seg) => sum + seg.distance, 0),
          totalDriveTime: planningResult.segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0),
          startLocation,
          endLocation,
          tripStyle
        },
        totalDays: planningResult.adjustedTripDays,
        totalDistance: planningResult.segments.reduce((sum, seg) => sum + seg.distance, 0),
        totalDriveTime: planningResult.segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0)
      };
      
      // Create completion analysis
      const completionAnalysis: TripCompletionAnalysis = {
        isCompleted: planningResult.adjustedTripDays !== requestedDays,
        originalDays: requestedDays,
        optimizedDays: planningResult.adjustedTripDays,
        adjustmentReason: planningResult.adjustedTripDays > requestedDays 
          ? 'Extended for drive time safety' 
          : 'Optimized for better pacing',
        confidence: planningResult.isValid ? 0.95 : 0.7,
        qualityMetrics: {
          driveTimeBalance: planningResult.validationResults.driveTimeValidation.maxDailyDriveTime <= 8 ? 'excellent' : 'good',
          routeEfficiency: planningResult.validationResults.sequenceValidation.backtrackingSegments === 0 ? 'excellent' : 'poor',
          attractionCoverage: 'good',
          overallScore: planningResult.isValid ? 0.9 : 0.6
        },
        recommendations: planningResult.warnings
      };
      
      console.log(`✅ ENHANCED PLANNING SUCCESS: ${tripPlan.segments.length} segments, valid: ${planningResult.isValid}`);
      
      return {
        tripPlan,
        completionAnalysis,
        originalRequestedDays: requestedDays,
        debugInfo: planningResult.debugInfo,
        validationResults: planningResult.validationResults,
        warnings: planningResult.warnings
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
