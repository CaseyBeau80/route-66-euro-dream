
import { TripPlan } from './TripPlanBuilder';
import { TripPlanValidator } from './TripPlanValidator';
import { EnhancedSupabaseDataService } from '../data/EnhancedSupabaseDataService';
import { HeritageEnforcedTripBuilder } from './HeritageEnforcedTripBuilder';
import { DestinationFocusedPlanningService } from './DestinationFocusedPlanningService';
import { BalancedTripPlanningService } from './BalancedTripPlanningService';

export interface UnifiedPlanningResult {
  success: boolean;
  tripPlan?: TripPlan;
  error?: string;
  warnings?: string[];
  driveTimeValidation?: any;
  validationInfo?: any;
  tripStyle?: 'balanced' | 'destination-focused';
}

export class UnifiedTripPlanningService {
  /**
   * Unified trip planning that selects the appropriate strategy based on trip style
   */
  static async planTrip(
    startLocation: string,
    endLocation: string,
    totalDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<UnifiedPlanningResult> {
    console.log(`🎯 UNIFIED TRIP PLANNING: ${tripStyle} style, ${startLocation} → ${endLocation}, ${totalDays} days`);

    try {
      // Load all stops
      const allStops = await EnhancedSupabaseDataService.getAllStops();
      
      let planningResult;
      let warnings: string[] = [];

      if (tripStyle === 'destination-focused') {
        console.log('🏛️ Using HERITAGE-ENFORCED TRIP BUILDER for destination-focused style');
        
        // Use the new heritage-enforced builder
        const heritageResult = HeritageEnforcedTripBuilder.buildHeritageEnforcedTrip(
          startLocation,
          endLocation,
          totalDays,
          allStops
        );

        if (!heritageResult.success || heritageResult.segments.length === 0) {
          console.log('⚠️ Heritage-enforced builder failed, falling back to standard destination-focused planning');
          
          // Fallback to standard destination-focused planning
          planningResult = await DestinationFocusedPlanningService.planDestinationFocusedTrip(
            startLocation,
            endLocation,
            totalDays,
            allStops
          );
          warnings.push('Heritage enforcement failed, used standard destination-focused planning');
        } else {
          console.log(`✅ Heritage-enforced trip successful: ${heritageResult.heritageStats.highHeritageCities} high-heritage cities included`);
          
          planningResult = {
            segments: heritageResult.segments,
            isValid: heritageResult.success,
            warnings: heritageResult.warnings,
            validationResults: {
              heritageStats: heritageResult.heritageStats,
              gapAnalysis: heritageResult.gapAnalysis
            }
          };
          
          warnings.push(`Heritage-enforced planning: ${heritageResult.heritageStats.highHeritageCities} high-heritage cities included`);
          warnings.push(...heritageResult.warnings);
        }
      } else {
        console.log('⚖️ Using BALANCED TRIP PLANNING for balanced style');
        
        // Use balanced planning service
        planningResult = await BalancedTripPlanningService.planBalancedTrip(
          startLocation,
          endLocation,
          totalDays,
          allStops
        );
      }

      if (!planningResult || !planningResult.segments || planningResult.segments.length === 0) {
        return {
          success: false,
          error: 'No valid trip segments could be generated',
          warnings,
          tripStyle
        };
      }

      // Create the final trip plan
      const totalDistance = planningResult.segments.reduce((sum, seg) => sum + seg.distance, 0);
      const totalDriveTime = planningResult.segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

      const tripPlan: TripPlan = {
        id: `trip-${Date.now()}`,
        startCity: startLocation,
        endCity: endLocation,
        startDate: new Date(),
        segments: planningResult.segments,
        dailySegments: planningResult.segments,
        totalDays: planningResult.segments.length,
        totalDistance,
        totalDrivingTime: totalDriveTime,
        summary: {
          totalDays: planningResult.segments.length,
          totalDistance,
          totalDriveTime: totalDriveTime,
          startLocation,
          endLocation,
          tripStyle
        }
      };

      // Validate the trip plan
      const validation = TripPlanValidator.validateTripPlan(tripPlan);
      
      console.log(`✅ Unified planning complete: ${tripPlan.segments.length} segments, ${totalDistance.toFixed(0)}mi, ${totalDriveTime.toFixed(1)}h`);

      return {
        success: true,
        tripPlan,
        warnings,
        driveTimeValidation: validation.driveTimeValidation,
        validationInfo: {
          ...validation,
          ...planningResult.validationResults
        },
        tripStyle
      };

    } catch (error) {
      console.error('❌ Unified trip planning failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown planning error',
        warnings: ['Trip planning service encountered an error'],
        tripStyle
      };
    }
  }
}
