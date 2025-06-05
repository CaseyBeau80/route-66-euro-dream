import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopEnhancementService } from './StopEnhancementService';

export class RouteStopSelectionService {
  /**
   * Get stops that are along the route with enhanced filtering and major city prioritization
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
      
      // More lenient tolerance for major cities
      const isMajorCity = stop.category === 'destination_city' || stop.is_major_stop;
      const tolerance = isMajorCity ? 1.5 : (totalDistance > 1000 ? 1.4 : 1.3);
      const isOnRoute = distanceFromStart + distanceFromEnd <= totalDistance * tolerance;
      
      // Reduced minimum distance for major cities to ensure they're included
      const minDistance = isMajorCity ? 5 : 10;
      const farEnoughFromStart = distanceFromStart >= minDistance;
      const farEnoughFromEnd = distanceFromEnd >= minDistance;
      
      return isOnRoute && farEnoughFromStart && farEnoughFromEnd;
    });

    // Enhanced prioritization with major city preference
    const prioritizedStops = this.prioritizeStopsWithMajorCityPreference(routeStops, startStop);
    
    // Deduplicate with major city protection
    const deduplicatedStops = this.deduplicateWithMajorCityProtection(prioritizedStops);

    console.log(`🛤️ Route stops: ${deduplicatedStops.length} unique stops found along ${Math.round(totalDistance)}mi route`);
    return deduplicatedStops.slice(0, maxStops);
  }

  /**
   * Enhanced prioritization that heavily favors major destination cities
   */
  private static prioritizeStopsWithMajorCityPreference(stops: TripStop[], startStop: TripStop): TripStop[] {
    return stops.sort((a, b) => {
      // Priority scoring system
      const getPriorityScore = (stop: TripStop): number => {
        let score = 0;
        
        // Major destination cities get highest priority
        if (stop.category === 'destination_city') {
          score += 1000;
          if (stop.is_major_stop) score += 500; // Extra boost for major destination cities
        }
        
        // Major waypoints get second highest priority
        if (stop.category === 'route66_waypoint' && stop.is_major_stop) {
          score += 800;
        }
        
        // Regular waypoints
        if (stop.category === 'route66_waypoint') {
          score += 600;
        }
        
        // Attractions and hidden gems get lower priority
        if (stop.category === 'attraction') score += 400;
        if (stop.category === 'hidden_gem') score += 200;
        
        return score;
      };

      const priorityA = getPriorityScore(a);
      const priorityB = getPriorityScore(b);
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Higher priority first
      }
      
      // If same priority, prefer stops closer to start for better route flow
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
  }

  /**
   * Deduplication that protects major destination cities
   */
  private static deduplicateWithMajorCityProtection(stops: TripStop[]): TripStop[] {
    const deduplicated: TripStop[] = [];
    const PROXIMITY_THRESHOLD_MILES = 10; // Increased threshold for better deduplication

    for (const stop of stops) {
      let shouldSkip = false;

      for (const existing of deduplicated) {
        const distance = DistanceCalculationService.calculateDistance(
          existing.latitude, existing.longitude,
          stop.latitude, stop.longitude
        );

        if (distance < PROXIMITY_THRESHOLD_MILES) {
          // If current stop is a major destination city and existing isn't, replace existing
          const currentIsMajorCity = stop.category === 'destination_city';
          const existingIsMajorCity = existing.category === 'destination_city';
          
          if (currentIsMajorCity && !existingIsMajorCity) {
            // Replace existing with current major city
            const existingIndex = deduplicated.indexOf(existing);
            deduplicated[existingIndex] = stop;
            shouldSkip = true;
            console.log(`🏙️ Replaced ${existing.name} with major city ${stop.name}`);
            break;
          } else if (!currentIsMajorCity && existingIsMajorCity) {
            // Keep existing major city, skip current
            shouldSkip = true;
            console.log(`🏙️ Keeping major city ${existing.name} over ${stop.name}`);
            break;
          } else if (currentIsMajorCity && existingIsMajorCity) {
            // Both are major cities, keep the one with higher priority
            const currentPriority = stop.is_major_stop ? 2 : 1;
            const existingPriority = existing.is_major_stop ? 2 : 1;
            
            if (currentPriority > existingPriority) {
              const existingIndex = deduplicated.indexOf(existing);
              deduplicated[existingIndex] = stop;
              shouldSkip = true;
              console.log(`🏙️ Replaced major city ${existing.name} with higher priority ${stop.name}`);
              break;
            } else {
              shouldSkip = true;
              break;
            }
          } else {
            // Neither is major city, use existing logic
            shouldSkip = true;
            break;
          }
        }
      }

      if (!shouldSkip) {
        deduplicated.push(stop);
      }
    }

    console.log(`🔧 Deduplicated ${stops.length} stops to ${deduplicated.length} with major city protection`);
    return deduplicated;
  }

  /**
   * Enhanced next day destination selection with major city preference
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
    const minDailyDistance = 50;
    const maxDailyDistance = 600;

    // Separate major cities from other stops
    const majorCities = availableStops.filter(stop => 
      stop.category === 'destination_city' || 
      (stop.category === 'route66_waypoint' && stop.is_major_stop)
    );
    
    const otherStops = availableStops.filter(stop => 
      stop.category !== 'destination_city' && 
      !(stop.category === 'route66_waypoint' && stop.is_major_stop)
    );

    let bestStop = availableStops[0] || finalDestination;
    let bestScore = Number.MAX_VALUE;

    // Prioritize major cities first
    const candidateStops = majorCities.length > 0 ? majorCities : otherStops;

    for (const stop of candidateStops) {
      const distanceFromCurrent = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      if (distanceFromCurrent < minDailyDistance || distanceFromCurrent > maxDailyDistance) {
        continue;
      }

      const distanceToFinal = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        finalDestination.latitude, finalDestination.longitude
      );

      // Enhanced scoring with major city bonuses
      const distanceScore = Math.abs(distanceFromCurrent - targetDailyDistance);
      const progressScore = distanceToFinal * 0.1;
      
      // Significant bonuses for major cities
      const majorCityBonus = stop.category === 'destination_city' ? -300 : 0;
      const majorStopBonus = stop.is_major_stop ? -200 : 0;
      const waypointBonus = stop.category === 'route66_waypoint' ? -100 : 0;

      const finalScore = distanceScore + progressScore + majorCityBonus + majorStopBonus + waypointBonus;

      if (finalScore < bestScore) {
        bestScore = finalScore;
        bestStop = stop;
      }
    }

    console.log(`🎯 Selected ${bestStop.name} (${bestStop.category}) as next destination`);
    return bestStop;
  }

  /**
   * Enhanced stop selection for segments with major city awareness
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
      
      // More lenient tolerance for major cities
      const isMajorCity = stop.category === 'destination_city' || stop.is_major_stop;
      const tolerance = isMajorCity ? 1.4 : (segmentDistance > 500 ? 1.3 : 1.2);
      const isInSegment = distFromStart + distFromEnd <= segmentDistance * tolerance;
      
      // Reduced minimum distance for major cities
      const minDistance = isMajorCity ? 5 : 10;
      const farEnoughFromStart = distFromStart >= minDistance;
      const farEnoughFromEnd = distFromEnd >= minDistance;
      
      return isInSegment && farEnoughFromStart && farEnoughFromEnd;
    });

    // Use the enhanced deduplication with major city protection
    const deduplicatedCandidates = this.deduplicateWithMajorCityProtection(candidateStops);

    // Enhanced prioritization with major city preference
    const prioritizedStops = this.prioritizeStopsWithMajorCityPreference(deduplicatedCandidates, startStop);

    const selectedStops = prioritizedStops.slice(0, maxStops);
    console.log(`🎯 Segment stops: ${selectedStops.length}/${candidateStops.length} selected for ${Math.round(segmentDistance)}mi segment`);
    
    return selectedStops;
  }
}
