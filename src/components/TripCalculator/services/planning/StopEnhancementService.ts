
import { TripStop } from '../data/SupabaseDataService';
import { StopDeduplicationService } from './StopDeduplicationService';
import { GeographicDiversityService } from './GeographicDiversityService';
import { TripDayCalculationService } from './TripDayCalculationService';
import { SegmentValidationService } from './SegmentValidationService';

// Re-export types and constants for backward compatibility
export type { RouteSection } from './RouteSection';
export { ROUTE_SECTIONS } from './RouteSection';

export class StopEnhancementService {
  /**
   * Enhanced deduplication with strict major destination city protection
   */
  static deduplicateStops(stops: TripStop[]): TripStop[] {
    return StopDeduplicationService.deduplicateStops(stops);
  }

  /**
   * Enhanced geographic diversity with destination city preference and route ordering
   */
  static ensureGeographicDiversity(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[]
  ): TripStop[] {
    return GeographicDiversityService.ensureGeographicDiversity(startStop, endStop, availableStops);
  }

  /**
   * Smart trip day calculation based on total distance with conservative limits
   */
  static calculateOptimalTripDays(totalDistanceMiles: number, requestedDays: number): number {
    return TripDayCalculationService.calculateOptimalTripDays(totalDistanceMiles, requestedDays);
  }

  /**
   * Validate segment to ensure it's meaningful
   */
  static isValidSegment(fromStop: TripStop, toStop: TripStop, minDistanceMiles: number = 5): boolean {
    return SegmentValidationService.isValidSegment(fromStop, toStop, minDistanceMiles);
  }

  /**
   * Calculate how far along the route (0-100%) a stop is positioned
   * Exposed for external use
   */
  static calculateRouteProgress(
    startStop: TripStop,
    endStop: TripStop,
    stop: TripStop,
    totalDistance: number
  ): number {
    return GeographicDiversityService.calculateRouteProgress(startStop, endStop, stop, totalDistance);
  }
}
