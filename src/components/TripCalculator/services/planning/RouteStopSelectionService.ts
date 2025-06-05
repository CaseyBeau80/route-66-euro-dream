
import { TripStop } from '../data/SupabaseDataService';
import { RouteStopFilteringService } from './RouteStopFilteringService';
import { StopPrioritizationService } from './StopPrioritizationService';
import { RouteDeduplicationService } from './RouteDeduplicationService';
import { DestinationSelectionService } from './DestinationSelectionService';

export class RouteStopSelectionService {
  /**
   * Get stops that are along the route with strict destination city prioritization
   */
  static getStopsAlongRoute(startStop: TripStop, endStop: TripStop, allStops: TripStop[], maxStops: number = 40): TripStop[] {
    // Filter stops along the route
    const routeStops = RouteStopFilteringService.getStopsAlongRoute(startStop, endStop, allStops, maxStops);
    
    // Enhanced prioritization with destination city supremacy
    const prioritizedStops = StopPrioritizationService.prioritizeStopsWithDestinationCitySupremacy(routeStops, startStop);
    
    // Deduplicate with destination city protection
    const deduplicatedStops = RouteDeduplicationService.deduplicateWithDestinationCityProtection(prioritizedStops);

    console.log(`🛤️ Route stops: ${deduplicatedStops.length} unique stops found with destination city priority`);
    return deduplicatedStops.slice(0, maxStops);
  }

  /**
   * Enhanced next day destination selection with destination city supremacy
   */
  static selectNextDayDestination(
    currentStop: TripStop, 
    finalDestination: TripStop, 
    availableStops: TripStop[], 
    remainingDays: number
  ): TripStop {
    return DestinationSelectionService.selectNextDayDestination(
      currentStop, 
      finalDestination, 
      availableStops, 
      remainingDays
    );
  }

  /**
   * Enhanced stop selection for segments with destination city awareness
   */
  static selectStopsForSegment(
    startStop: TripStop, 
    endStop: TripStop, 
    availableStops: TripStop[], 
    maxStops: number
  ): TripStop[] {
    // Find stops between start and end for this segment
    const candidateStops = RouteStopFilteringService.getSegmentStops(startStop, endStop, availableStops);

    // Use the enhanced deduplication with destination city protection
    const deduplicatedCandidates = RouteDeduplicationService.deduplicateWithDestinationCityProtection(candidateStops);

    // Enhanced prioritization with destination city supremacy
    const prioritizedStops = StopPrioritizationService.prioritizeStopsWithDestinationCitySupremacy(deduplicatedCandidates, startStop);

    const selectedStops = prioritizedStops.slice(0, maxStops);
    
    const segmentDistance = require('../utils/DistanceCalculationService').DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    console.log(`🎯 Segment stops: ${selectedStops.length}/${candidateStops.length} selected for ${Math.round(segmentDistance)}mi segment`);
    
    return selectedStops;
  }
}
