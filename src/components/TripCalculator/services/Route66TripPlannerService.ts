
import { TripPlan } from './planning/TripPlanTypes';
import { EvenPacingPlanningService } from './planning/EvenPacingPlanningService';
import { HeritageCitiesPlanningService } from './planning/HeritageCitiesPlanningService';
import { SupabaseDataService } from './data/SupabaseDataService';

export interface EnhancedTripPlanResult {
  tripPlan: TripPlan | null;
  debugInfo: any;
  validationResults: any;
  warnings: string[];
}

export class Route66TripPlannerService {
  /**
   * Plan a Route 66 trip using the appropriate algorithm based on trip style
   */
  static async planTripWithAnalysis(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: string
  ): Promise<EnhancedTripPlanResult> {
    console.log(`🚗 PLANNING TRIP: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle} style`);
    
    const warnings: string[] = [];
    const debugInfo = {
      startLocation,
      endLocation,
      travelDays,
      tripStyle,
      timestamp: new Date().toISOString()
    };

    try {
      // Load all stops
      const allStops = await SupabaseDataService.getAllStops();
      
      if (!allStops || allStops.length === 0) {
        throw new Error('No Route 66 stops available');
      }

      console.log(`📍 Loaded ${allStops.length} Route 66 stops`);

      let tripPlan: TripPlan;

      // Use the appropriate planning service based on trip style
      if (tripStyle === 'balanced') {
        console.log(`⚖️ Using Even Pacing planning algorithm`);
        tripPlan = await EvenPacingPlanningService.planEvenPacingTrip(
          startLocation,
          endLocation,
          travelDays,
          allStops
        );
      } else if (tripStyle === 'destination-focused') {
        console.log(`🏛️ Using Heritage Cities planning algorithm`);
        tripPlan = await HeritageCitiesPlanningService.planHeritageCitiesTrip(
          startLocation,
          endLocation,
          travelDays,
          allStops
        );
      } else {
        // Default to Even Pacing for unknown styles
        console.log(`⚖️ Unknown trip style '${tripStyle}', defaulting to Even Pacing`);
        warnings.push(`Unknown trip style '${tripStyle}', using Even Pacing instead`);
        tripPlan = await EvenPacingPlanningService.planEvenPacingTrip(
          startLocation,
          endLocation,
          travelDays,
          allStops
        );
      }

      // Validate the trip plan
      const validationResults = this.validateTripPlan(tripPlan, tripStyle);
      
      if (validationResults.warnings.length > 0) {
        warnings.push(...validationResults.warnings);
      }

      console.log(`✅ Trip planning completed with ${tripPlan.segments?.length || 0} segments and ${warnings.length} warnings`);

      return {
        tripPlan,
        debugInfo: {
          ...debugInfo,
          segmentCount: tripPlan.segments?.length || 0,
          totalDistance: tripPlan.totalDistance,
          totalDrivingTime: tripPlan.totalDrivingTime
        },
        validationResults,
        warnings
      };

    } catch (error) {
      console.error('❌ Trip planning failed:', error);
      
      return {
        tripPlan: null,
        debugInfo: {
          ...debugInfo,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        validationResults: { isValid: false, violations: [error instanceof Error ? error.message : 'Unknown error'] },
        warnings: [error instanceof Error ? error.message : 'Trip planning failed']
      };
    }
  }

  /**
   * Validate the generated trip plan
   */
  private static validateTripPlan(tripPlan: TripPlan, tripStyle: string): {
    isValid: boolean;
    warnings: string[];
    driveTimeValidation: any;
    sequenceValidation: any;
  } {
    const warnings: string[] = [];
    
    if (!tripPlan.segments || tripPlan.segments.length === 0) {
      warnings.push('No trip segments generated');
      return {
        isValid: false,
        warnings,
        driveTimeValidation: { isValid: false },
        sequenceValidation: { isValid: false }
      };
    }

    // Validate drive times based on trip style
    let maxAllowedDriveTime = 8; // Default
    if (tripStyle === 'balanced') {
      maxAllowedDriveTime = 7; // Even pacing prefers shorter drives
    } else if (tripStyle === 'destination-focused') {
      maxAllowedDriveTime = 10; // Heritage cities allow longer drives
    }

    const longDriveDays = tripPlan.segments.filter(segment => 
      segment.driveTimeHours > maxAllowedDriveTime
    );

    if (longDriveDays.length > 0) {
      warnings.push(`${longDriveDays.length} days exceed ${maxAllowedDriveTime}h drive time limit for ${tripStyle} style`);
    }

    // Check for very short drives
    const shortDriveDays = tripPlan.segments.filter(segment => 
      segment.driveTimeHours < 2
    );

    if (shortDriveDays.length > 0) {
      warnings.push(`${shortDriveDays.length} days have very short drive times (< 2h)`);
    }

    const isValid = warnings.length === 0;

    return {
      isValid,
      warnings,
      driveTimeValidation: { 
        isValid: longDriveDays.length === 0,
        maxDriveTime: Math.max(...tripPlan.segments.map(s => s.driveTimeHours)),
        allowedLimit: maxAllowedDriveTime
      },
      sequenceValidation: { isValid: true } // Route sequence is enforced by the planning services
    };
  }
}
