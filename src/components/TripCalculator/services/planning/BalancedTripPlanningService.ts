
import { TripStop } from '../../types/TripStop';
import { TripPlan } from './TripPlanTypes';
import { EvenPacingPlanningService } from './EvenPacingPlanningService';

export class BalancedTripPlanningService {
  /**
   * @deprecated Use EvenPacingPlanningService.planEvenPacingTrip instead
   */
  static async planBalancedTrip(
    startCityName: string,
    endCityName: string,
    tripDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🔄 REDIRECTING: BalancedTripPlanningService -> EvenPacingPlanningService`);
    return EvenPacingPlanningService.planEvenPacingTrip(startCityName, endCityName, tripDays, allStops);
  }
}
