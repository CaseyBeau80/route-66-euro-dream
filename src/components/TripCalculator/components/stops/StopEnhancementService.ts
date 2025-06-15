
import { TripStop } from '../../types/TripStop';

export class StopEnhancementService {
  static async enhanceStopsForSegment(
    startCity: string,
    endCity: string,
    segmentDay: number,
    maxStops: number
  ): Promise<TripStop[]> {
    console.log(`🚫 StopEnhancementService: Enhancement disabled for ${startCity} → ${endCity}`);
    return [];
  }
}
