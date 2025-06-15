
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class SegmentValidationService {
  /**
   * Validate segment to ensure it's meaningful
   */
  static isValidSegment(fromStop: TripStop, toStop: TripStop, minDistanceMiles: number = 5): boolean {
    if (fromStop.id === toStop.id) {
      return false;
    }
    
    const distance = DistanceCalculationService.calculateDistance(
      fromStop.latitude, fromStop.longitude,
      toStop.latitude, toStop.longitude
    );
    
    return distance >= minDistanceMiles;
  }
}
