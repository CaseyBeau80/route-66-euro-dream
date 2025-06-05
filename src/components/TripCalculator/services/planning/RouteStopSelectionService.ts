
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopEnhancementService } from './StopEnhancementService';

export class RouteStopSelectionService {
  /**
   * Get stops that are along the route with enhanced filtering
   */
  static getStopsAlongRoute(startStop: TripStop, endStop: TripStop, allStops: TripStop[], maxStops: number = 50): TripStop[] {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude, 
      endStop.latitude, endStop.longitude
    );

    // Filter stops that are roughly between start and end points
    const routeStops = allStops.filter(stop => {
      // Skip start and end stops
      if (stop.id === startStop.id || stop.id === endStop.id) {
        return false;
      }

      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        stop.latitude, stop.longitude
      );
      const distanceFromEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude, 
        endStop.latitude, endStop.longitude
      );
      
      // Stop should be roughly on the path (more lenient tolerance for longer trips)
      const tolerance = totalDistance > 1000 ? 1.4 : 1.3;
      const isOnRoute = distanceFromStart + distanceFromEnd <= totalDistance * tolerance;
      
      // Must be at least 10 miles from start and end
      const minDistance = 10;
      const farEnoughFromStart = distanceFromStart >= minDistance;
      const farEnoughFromEnd = distanceFromEnd >= minDistance;
      
      return isOnRoute && farEnoughFromStart && farEnoughFromEnd;
    });

    // Deduplicate and ensure geographic diversity
    const deduplicatedStops = StopEnhancementService.deduplicateStops(routeStops);
    
    // Sort by distance from start point
    deduplicatedStops.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        b.latitude, b.longitude
      );
      return distA - distB;
    });

    console.log(`🛤️ Route stops: ${deduplicatedStops.length} unique stops found along ${Math.round(totalDistance)}mi route`);
    return deduplicatedStops.slice(0, maxStops);
  }

  /**
   * Enhanced next day destination selection
   */
  static selectNextDayDestination(
    currentStop: TripStop, 
    finalDestination: TripStop, 
    availableStops: TripStop[], 
    remainingDays: number
  ): TripStop {
    if (availableStops.length === 0 || remainingDays <= 1) {
      return finalDestination;
    }

    const totalRemainingDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    const targetDailyDistance = totalRemainingDistance / remainingDays;
    const minDailyDistance = 50; // Minimum 50 miles per day
    const maxDailyDistance = 600; // Maximum 600 miles per day

    let bestStop = availableStops[0] || finalDestination;
    let bestScore = Number.MAX_VALUE;

    for (const stop of availableStops) {
      const distanceFromCurrent = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      // Skip stops that are too close or too far
      if (distanceFromCurrent < minDailyDistance || distanceFromCurrent > maxDailyDistance) {
        continue;
      }

      const distanceToFinal = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        finalDestination.latitude, finalDestination.longitude
      );

      // Score based on target distance
      const distanceScore = Math.abs(distanceFromCurrent - targetDailyDistance);
      
      // Progress score (prefer stops that move us toward destination)
      const progressScore = distanceToFinal * 0.1;
      
      // Importance bonuses
      const majorStopBonus = stop.is_major_stop ? -100 : 0;
      const cityBonus = stop.category === 'destination_city' ? -50 : 0;
      const waypointBonus = stop.category === 'route66_waypoint' ? -25 : 0;

      const finalScore = distanceScore + progressScore + majorStopBonus + cityBonus + waypointBonus;

      if (finalScore < bestScore) {
        bestScore = finalScore;
        bestStop = stop;
      }
    }

    return bestStop;
  }

  /**
   * Enhanced stop selection for segments with diversity
   */
  static selectStopsForSegment(
    startStop: TripStop, 
    endStop: TripStop, 
    availableStops: TripStop[], 
    maxStops: number
  ): TripStop[] {
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Find stops between start and end for this segment
    const candidateStops = availableStops.filter(stop => {
      const distFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        stop.latitude, stop.longitude
      );
      const distFromEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude, 
        endStop.latitude, endStop.longitude
      );
      
      // Stop should be roughly between start and end (more lenient for longer segments)
      const tolerance = segmentDistance > 500 ? 1.3 : 1.2;
      const isInSegment = distFromStart + distFromEnd <= segmentDistance * tolerance;
      
      // Must be at least 10 miles from segment start and end
      const farEnoughFromStart = distFromStart >= 10;
      const farEnoughFromEnd = distFromEnd >= 10;
      
      return isInSegment && farEnoughFromStart && farEnoughFromEnd;
    });

    // Deduplicate stops in this segment
    const deduplicatedCandidates = StopEnhancementService.deduplicateStops(candidateStops);

    // Prioritize by category and features
    const prioritizedStops = deduplicatedCandidates.sort((a, b) => {
      const getStopPriority = (stop: TripStop): number => {
        if (stop.category === 'route66_waypoint' && stop.is_major_stop) return 1;
        if (stop.category === 'destination_city') return 2;
        if (stop.category === 'route66_waypoint') return 3;
        if (stop.category === 'attraction') return 4;
        if (stop.category === 'hidden_gem') return 5;
        return 6;
      };

      const priorityA = getStopPriority(a);
      const priorityB = getStopPriority(b);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, prefer stops closer to start (for better route flow)
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, 
        b.latitude, b.longitude
      );
      
      return distA - distB;
    });

    const selectedStops = prioritizedStops.slice(0, maxStops);
    console.log(`🎯 Segment stops: ${selectedStops.length}/${candidateStops.length} selected for ${Math.round(segmentDistance)}mi segment`);
    
    return selectedStops;
  }
}
