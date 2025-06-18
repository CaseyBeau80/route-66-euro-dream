
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { EnhancedHeritageCitiesService } from './EnhancedHeritageCitiesService';

export class HeritageCitiesPlanningService {
  /**
   * Plan a Heritage Cities focused trip using the enhanced service
   */
  static async planHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ HeritageCitiesPlanningService: Delegating to Enhanced Service`);
    
    // Validate minimum days - fix the 0-day bug
    const validatedTravelDays = Math.max(1, Math.floor(travelDays));
    
    if (validatedTravelDays !== travelDays) {
      console.warn(`⚠️ Fixed invalid travel days: ${travelDays} → ${validatedTravelDays}`);
    }

    return await EnhancedHeritageCitiesService.planEnhancedHeritageCitiesTrip(
      startLocation,
      endLocation,
      validatedTravelDays,
      allStops
    );
  }
}
