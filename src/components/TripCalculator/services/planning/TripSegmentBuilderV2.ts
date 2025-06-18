
import { DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { DistanceValidationService } from './DistanceValidationService';
import { TripStyleConfig } from './TripStyleLogic';
import { SegmentValidationService } from './validation/SegmentValidationService';
import { SegmentCreationService } from './segments/SegmentCreationService';
import { SegmentSplitService } from './segments/SegmentSplitService';
import { EmergencyFallbackService } from './segments/EmergencyFallbackService';

export class TripSegmentBuilderV2 {
  /**
   * Build segments with ABSOLUTE drive time enforcement from the start
   */
  static async buildSegmentsWithDestinationCities(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment[]> {
    console.log(`🏗️ V2 SEGMENT BUILDER: ABSOLUTE drive time enforcement from start`);
    console.log(`🏗️ Config: max ${styleConfig.maxDailyDriveHours}h/day, ${styleConfig.style} style`);
    
    // STEP 1: Validate trip feasibility with current constraints
    const validatedTripDays = SegmentValidationService.validateTripFeasibility(
      startStop, endStop, tripDays, styleConfig.maxDailyDriveHours
    );

    // STEP 2: Create segments with absolute validation
    const validatedSegments = await this.createValidatedSegments(
      startStop, endStop, destinationCities, validatedTripDays, styleConfig
    );

    // STEP 3: Final safety check
    const finalValidation = SegmentValidationService.performFinalValidation(
      validatedSegments, styleConfig.maxDailyDriveHours
    );
    
    if (!finalValidation.isValid) {
      console.error(`❌ FINAL VALIDATION FAILED:`, finalValidation.violations);
      // Return emergency fallback segments
      return await EmergencyFallbackService.createEmergencyFallbackSegments(startStop, endStop, styleConfig);
    }

    console.log(`✅ V2 SEGMENTS CREATED: ${validatedSegments.length} segments, all within ${styleConfig.maxDailyDriveHours}h limit`);
    return validatedSegments;
  }

  /**
   * Create segments with validation at each step
   */
  private static async createValidatedSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment[]> {
    const segments: DailySegment[] = [];
    const allTripStops = [startStop, ...destinationCities, endStop];
    
    console.log(`🗺️ CREATING SEGMENTS: ${allTripStops.length} stops for ${tripDays} days`);

    for (let i = 0; i < allTripStops.length - 1; i++) {
      const currentStop = allTripStops[i];
      const nextStop = allTripStops[i + 1];
      const day = i + 1;

      // ABSOLUTE VALIDATION: Check if this segment is acceptable
      const validation = await DistanceValidationService.validateSegmentDistance(
        currentStop, nextStop, styleConfig.maxDailyDriveHours
      );

      if (!validation.isValid) {
        console.error(`❌ INVALID SEGMENT: Day ${day} - ${validation.recommendation}`);
        
        // Try to split this segment
        const splitSegments = await SegmentSplitService.attemptSegmentSplit(
          currentStop, nextStop, day, styleConfig, destinationCities
        );
        
        if (splitSegments.length > 0) {
          console.log(`✅ SPLIT SUCCESSFUL: Created ${splitSegments.length} segments for Day ${day}`);
          segments.push(...splitSegments);
          continue;
        } else {
          console.error(`❌ SPLIT FAILED: Cannot create valid segment for Day ${day}`);
          // Create a capped segment as last resort
          const cappedSegment = await SegmentCreationService.createCappedSegment(currentStop, nextStop, day, styleConfig);
          segments.push(cappedSegment);
          continue;
        }
      }

      // Create valid segment
      const segment = await SegmentCreationService.createValidatedSegment(currentStop, nextStop, day, styleConfig);
      if (segment) {
        segments.push(segment);
        console.log(`✅ VALID SEGMENT: Day ${day} - ${currentStop.name} → ${nextStop.name} (${validation.driveTime.toFixed(1)}h)`);
      }
    }

    return segments;
  }
}
