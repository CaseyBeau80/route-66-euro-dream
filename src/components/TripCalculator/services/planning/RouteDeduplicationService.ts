
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class RouteDeduplicationService {
  private static readonly PROXIMITY_THRESHOLD_MILES = 8;

  /**
   * Deduplication that absolutely protects destination cities
   */
  static deduplicateWithDestinationCityProtection(stops: TripStop[]): TripStop[] {
    const deduplicated: TripStop[] = [];

    for (const stop of stops) {
      let shouldSkip = false;

      for (const existing of deduplicated) {
        const distance = DistanceCalculationService.calculateDistance(
          existing.latitude, existing.longitude,
          stop.latitude, stop.longitude
        );

        if (distance < this.PROXIMITY_THRESHOLD_MILES) {
          const currentIsDestinationCity = stop.category === 'destination_city';
          const existingIsDestinationCity = existing.category === 'destination_city';
          
          if (currentIsDestinationCity && !existingIsDestinationCity) {
            // ALWAYS replace non-destination city with destination city
            const existingIndex = deduplicated.indexOf(existing);
            deduplicated[existingIndex] = stop;
            shouldSkip = true;
            console.log(`🏙️ Replaced ${existing.name} with destination city ${stop.name}`);
            break;
          } else if (!currentIsDestinationCity && existingIsDestinationCity) {
            // ALWAYS keep destination city, skip current
            shouldSkip = true;
            console.log(`🏙️ Keeping destination city ${existing.name} over ${stop.name}`);
            break;
          } else if (currentIsDestinationCity && existingIsDestinationCity) {
            // Both are destination cities, keep the one with higher priority
            const currentPriority = stop.is_major_stop ? 2 : 1;
            const existingPriority = existing.is_major_stop ? 2 : 1;
            
            if (currentPriority > existingPriority) {
              const existingIndex = deduplicated.indexOf(existing);
              deduplicated[existingIndex] = stop;
              shouldSkip = true;
              console.log(`🏙️ Replaced destination city ${existing.name} with higher priority ${stop.name}`);
              break;
            } else {
              shouldSkip = true;
              break;
            }
          } else {
            // Neither is destination city, use existing logic
            shouldSkip = true;
            break;
          }
        }
      }

      if (!shouldSkip) {
        deduplicated.push(stop);
      }
    }

    console.log(`🔧 Deduplicated ${stops.length} stops to ${deduplicated.length} with destination city protection`);
    return deduplicated;
  }
}
