
import { DailySegment } from '../TripPlanTypes';
import { TripStop } from '../../../types/TripStop';
import { DistanceCalculationService } from '../../utils/DistanceCalculationService';
import { TripStyleConfig } from '../TripStyleLogic';
import { DistanceValidationService } from '../DistanceValidationService';
import { SegmentCreationService } from './SegmentCreationService';

export class SegmentSplitService {
  /**
   * Attempt to split a long segment into multiple valid segments
   */
  static async attemptSegmentSplit(
    startStop: TripStop,
    endStop: TripStop,
    startingDay: number,
    styleConfig: TripStyleConfig,
    availableDestinations: TripStop[]
  ): Promise<DailySegment[]> {
    console.log(`🔧 ATTEMPTING SPLIT: ${startStop.name} → ${endStop.name}`);
    
    // Find intermediate destinations between start and end
    const intermediateStops = availableDestinations.filter(dest => {
      const distFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        dest.latitude, dest.longitude
      );
      const distToEnd = DistanceCalculationService.calculateDistance(
        dest.latitude, dest.longitude,
        endStop.latitude, endStop.longitude
      );
      const totalDist = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // Check if this destination is roughly between start and end
      const deviation = (distFromStart + distToEnd) - totalDist;
      return deviation < 50 && distFromStart > 50 && distToEnd > 50; // Reasonable intermediate point
    });

    if (intermediateStops.length === 0) {
      console.log(`🚫 NO INTERMEDIATE STOPS found for split`);
      return [];
    }

    // Try the closest intermediate stop that creates valid segments
    for (const intermediate of intermediateStops) {
      const firstSegmentValidation = await DistanceValidationService.validateSegmentDistance(
        startStop, intermediate, styleConfig.maxDailyDriveHours
      );
      const secondSegmentValidation = await DistanceValidationService.validateSegmentDistance(
        intermediate, endStop, styleConfig.maxDailyDriveHours
      );

      if (firstSegmentValidation.isValid && secondSegmentValidation.isValid) {
        console.log(`✅ SPLIT POSSIBLE: Using ${intermediate.name} as intermediate`);
        
        const firstSegment = await SegmentCreationService.createValidatedSegment(startStop, intermediate, startingDay, styleConfig);
        const secondSegment = await SegmentCreationService.createValidatedSegment(intermediate, endStop, startingDay + 1, styleConfig);
        
        if (firstSegment && secondSegment) {
          return [firstSegment, secondSegment];
        }
      }
    }

    console.log(`🚫 SPLIT FAILED: No valid intermediate destinations found`);
    return [];
  }
}
