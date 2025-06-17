
import { TripStop } from '../../types/TripStop';
import { TripPlan } from './TripPlanTypes';
import { HeritageCitiesPlanningService } from './HeritageCitiesPlanningService';

export class DestinationFocusedPlanningService {
  /**
   * @deprecated Use HeritageCitiesPlanningService.planHeritageCitiesTrip instead
   */
  static async planDestinationFocusedTrip(
    startCityName: string,
    endCityName: string,
    tripDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🔄 REDIRECTING: DestinationFocusedPlanningService -> HeritageCitiesPlanningService`);
    return HeritageCitiesPlanningService.planHeritageCitiesTrip(startCityName, endCityName, tripDays, allStops);
  }
}
