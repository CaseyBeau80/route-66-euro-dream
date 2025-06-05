import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopEnhancementService } from './StopEnhancementService';

export class RouteStopSelectionService {
  /**
   * Get stops that are along the route with strict destination city prioritization
   */
  static getStopsAlongRoute(startStop: TripStop, endStop: TripStop, allStops: TripStop[], maxStops: number = 40): TripStop[] {
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
      
      // Much more lenient tolerance for destination cities
      const isDestinationCity = stop.category === 'destination_city';
      const tolerance = isDestinationCity ? 1.8 : (totalDistance > 1000 ? 1.4 : 1.3);
      const isOnRoute = distanceFromStart + distanceFromEnd <= totalDistance * tolerance;
      
      // Very small minimum distance for destination cities
      const minDistance = isDestinationCity ? 3 : 8;
      const farEnoughFromStart = distanceFromStart >= minDistance;
      const farEnoughFromEnd = distanceFromEnd >= minDistance;
      
      return isOnRoute && farEnoughFromStart && farEnoughFromEnd;
    });

    // Enhanced prioritization with destination city supremacy
    const prioritizedStops = this.prioritizeStopsWithDestinationCitySupremacy(routeStops, startStop);
    
    // Deduplicate with destination city protection
    const deduplicatedStops = this.deduplicateWithDestinationCityProtection(prioritizedStops);

    console.log(`🛤️ Route stops: ${deduplicatedStops.length} unique stops found along ${Math.round(totalDistance)}mi route`);
    return deduplicatedStops.slice(0, maxStops);
  }

  /**
   * Prioritization that absolutely favors destination cities
   */
  private static prioritizeStopsWithDestinationCitySupremacy(stops: TripStop[], startStop: TripStop): TripStop[] {
    return stops.sort((a, b) => {
      // Priority scoring system with destination city supremacy
      const getPriorityScore = (stop: TripStop): number => {
        let score = 0;
        
        // Destination cities get overwhelming priority
        if (stop.category === 'destination_city') {
          score += 2000;
          if (stop.is_major_stop) score += 1000; // Extra massive boost
        }
        
        // Major waypoints get second priority
        if (stop.category === 'route66_waypoint' && stop.is_major_stop) {
          score += 800;
        }
        
        // Regular waypoints
        if (stop.category === 'route66_waypoint') {
          score += 600;
        }
        
        // Attractions and hidden gems get much lower priority
        if (stop.category === 'attraction') score += 200;
        if (stop.category === 'hidden_gem') score += 100;
        
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
   * Deduplication that absolutely protects destination cities
   */
  private static deduplicateWithDestinationCityProtection(stops: TripStop[]): TripStop[] {
    const deduplicated: TripStop[] = [];
    const PROXIMITY_THRESHOLD_MILES = 8;

    for (const stop of stops) {
      let shouldSkip = false;

      for (const existing of deduplicated) {
        const distance = DistanceCalculationService.calculateDistance(
          existing.latitude, existing.longitude,
          stop.latitude, stop.longitude
        );

        if (distance < PROXIMITY_THRESHOLD_MILES) {
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

  /**
   * Enhanced next day destination selection with destination city supremacy
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
    const minDailyDistance = 30;
    const maxDailyDistance = 500;

    // Separate destination cities from other stops
    const destinationCities = availableStops.filter(stop => 
      stop.category === 'destination_city'
    );
    
    const majorWaypoints = availableStops.filter(stop => 
      stop.category === 'route66_waypoint' && stop.is_major_stop
    );
    
    const otherStops = availableStops.filter(stop => 
      stop.category !== 'destination_city' && 
      !(stop.category === 'route66_waypoint' && stop.is_major_stop)
    );

    let bestStop = availableStops[0] || finalDestination;
    let bestScore = Number.MAX_VALUE;

    // Absolutely prioritize destination cities first
    const candidateStops = destinationCities.length > 0 ? destinationCities : 
                          (majorWaypoints.length > 0 ? majorWaypoints : otherStops);

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

      // Enhanced scoring with massive destination city bonuses
      const distanceScore = Math.abs(distanceFromCurrent - targetDailyDistance);
      const progressScore = distanceToFinal * 0.1;
      
      // Massive bonuses for destination cities
      const destinationCityBonus = stop.category === 'destination_city' ? -500 : 0;
      const majorStopBonus = stop.is_major_stop ? -300 : 0;
      const waypointBonus = stop.category === 'route66_waypoint' ? -100 : 0;

      const finalScore = distanceScore + progressScore + destinationCityBonus + majorStopBonus + waypointBonus;

      if (finalScore < bestScore) {
        bestScore = finalScore;
        bestStop = stop;
      }
    }

    console.log(`🎯 Selected ${bestStop.name} (${bestStop.category}) as next destination`);
    return bestStop;
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
      
      // Very lenient tolerance for destination cities
      const isDestinationCity = stop.category === 'destination_city';
      const tolerance = isDestinationCity ? 1.5 : (segmentDistance > 500 ? 1.3 : 1.2);
      const isInSegment = distFromStart + distFromEnd <= segmentDistance * tolerance;
      
      // Very small minimum distance for destination cities
      const minDistance = isDestinationCity ? 3 : 8;
      const farEnoughFromStart = distFromStart >= minDistance;
      const farEnoughFromEnd = distFromEnd >= minDistance;
      
      return isInSegment && farEnoughFromStart && farEnoughFromEnd;
    });

    // Use the enhanced deduplication with destination city protection
    const deduplicatedCandidates = this.deduplicateWithDestinationCityProtection(candidateStops);

    // Enhanced prioritization with destination city supremacy
    const prioritizedStops = this.prioritizeStopsWithDestinationCitySupremacy(deduplicatedCandidates, startStop);

    const selectedStops = prioritizedStops.slice(0, maxStops);
    console.log(`🎯 Segment stops: ${selectedStops.length}/${candidateStops.length} selected for ${Math.round(segmentDistance)}mi segment`);
    
    return selectedStops;
  }
}
