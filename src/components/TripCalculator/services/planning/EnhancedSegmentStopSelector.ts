
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopValidationService } from './StopValidationService';

export interface StopCurationConfig {
  maxStops: number;
  attractionRatio: number; // 0.5 = 50% attractions, 50% waypoints
  preferDestinationCities: boolean;
  diversityBonus: boolean;
}

export interface CuratedStopSelection {
  attractions: TripStop[];
  waypoints: TripStop[];
  hiddenGems: TripStop[];
  totalSelected: number;
}

export class EnhancedSegmentStopSelector {
  private static readonly DEFAULT_CONFIG: StopCurationConfig = {
    maxStops: 4,
    attractionRatio: 0.6, // Prefer attractions slightly
    preferDestinationCities: true,
    diversityBonus: true
  };

  /**
   * Select curated stops for a segment with intelligent categorization
   */
  static selectCuratedStopsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    expectedDriveTime: number,
    config: Partial<StopCurationConfig> = {}
  ): CuratedStopSelection {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    console.log(`🎯 Curating stops for segment: ${startStop.name} → ${endStop.name} (${finalConfig.maxStops} max stops)`);
    
    // Calculate segment distance and filter relevant stops
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Get candidates along the route
    const routeCandidates = this.getRouteCandidates(startStop, endStop, availableStops, segmentDistance);
    
    // Categorize stops by type
    const categorizedStops = this.categorizeStops(routeCandidates);
    
    // Calculate target numbers for each category
    const targetNumbers = this.calculateTargetNumbers(finalConfig, expectedDriveTime);
    
    // Select best stops from each category
    const selectedStops = this.selectBestStopsFromCategories(
      categorizedStops,
      targetNumbers,
      startStop,
      endStop,
      finalConfig
    );

    console.log(`✅ Selected ${selectedStops.totalSelected} curated stops: ${selectedStops.attractions.length} attractions, ${selectedStops.waypoints.length} waypoints, ${selectedStops.hiddenGems.length} hidden gems`);
    
    return selectedStops;
  }

  /**
   * Filter stops that are reasonably along the route
   */
  private static getRouteCandidates(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    segmentDistance: number
  ): TripStop[] {
    return availableStops.filter(stop => {
      // Skip if it's the start or end stop
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      const startToStop = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      const stopToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // Check if stop is roughly on the route path (allow some detour)
      const totalViaStop = startToStop + stopToEnd;
      const detourFactor = totalViaStop / segmentDistance;
      
      // More lenient filtering for longer segments, stricter for shorter ones
      const maxDetourFactor = segmentDistance > 300 ? 1.2 : 1.15;
      
      return detourFactor <= maxDetourFactor && startToStop < segmentDistance * 0.8;
    });
  }

  /**
   * Categorize stops by their type and priority
   */
  private static categorizeStops(stops: TripStop[]): {
    attractions: TripStop[];
    waypoints: TripStop[];
    hiddenGems: TripStop[];
    destinationCities: TripStop[];
  } {
    const attractions: TripStop[] = [];
    const waypoints: TripStop[] = [];
    const hiddenGems: TripStop[] = [];
    const destinationCities: TripStop[] = [];

    stops.forEach(stop => {
      switch (stop.category) {
        case 'attraction':
          attractions.push(stop);
          break;
        case 'route66_waypoint':
          waypoints.push(stop);
          break;
        case 'hidden_gem':
          hiddenGems.push(stop);
          break;
        case 'destination_city':
          destinationCities.push(stop);
          break;
        default:
          // Default to waypoints for unknown categories
          waypoints.push(stop);
      }
    });

    return { attractions, waypoints, hiddenGems, destinationCities };
  }

  /**
   * Calculate target numbers for each category based on config and drive time
   */
  private static calculateTargetNumbers(
    config: StopCurationConfig,
    expectedDriveTime: number
  ): {
    attractions: number;
    waypoints: number;
    hiddenGems: number;
  } {
    // Adjust max stops based on drive time (longer drives = more stops)
    let adjustedMaxStops = config.maxStops;
    if (expectedDriveTime > 6) {
      adjustedMaxStops = Math.min(6, config.maxStops + 1);
    } else if (expectedDriveTime < 3) {
      adjustedMaxStops = Math.max(2, config.maxStops - 1);
    }

    const attractionCount = Math.ceil(adjustedMaxStops * config.attractionRatio);
    const waypointCount = Math.floor(adjustedMaxStops * (1 - config.attractionRatio));
    const hiddenGemCount = Math.max(1, Math.floor(adjustedMaxStops * 0.25)); // At least 1 hidden gem if possible

    // Ensure we don't exceed max stops
    const totalTarget = attractionCount + waypointCount + hiddenGemCount;
    if (totalTarget > adjustedMaxStops) {
      return {
        attractions: Math.max(1, attractionCount - 1),
        waypoints: Math.max(1, waypointCount),
        hiddenGems: Math.max(0, hiddenGemCount - 1)
      };
    }

    return {
      attractions: attractionCount,
      waypoints: waypointCount,
      hiddenGems: hiddenGemCount
    };
  }

  /**
   * Select the best stops from each category using scoring
   */
  private static selectBestStopsFromCategories(
    categorizedStops: any,
    targetNumbers: any,
    startStop: TripStop,
    endStop: TripStop,
    config: StopCurationConfig
  ): CuratedStopSelection {
    // Score and select attractions
    const selectedAttractions = this.selectTopScoredStops(
      categorizedStops.attractions,
      targetNumbers.attractions,
      startStop,
      config
    );

    // Score and select waypoints (include destination cities here)
    const allWaypoints = [...categorizedStops.waypoints, ...categorizedStops.destinationCities];
    const selectedWaypoints = this.selectTopScoredStops(
      allWaypoints,
      targetNumbers.waypoints,
      startStop,
      config
    );

    // Score and select hidden gems
    const selectedHiddenGems = this.selectTopScoredStops(
      categorizedStops.hiddenGems,
      targetNumbers.hiddenGems,
      startStop,
      config
    );

    return {
      attractions: selectedAttractions,
      waypoints: selectedWaypoints,
      hiddenGems: selectedHiddenGems,
      totalSelected: selectedAttractions.length + selectedWaypoints.length + selectedHiddenGems.length
    };
  }

  /**
   * Select top-scored stops from a category
   */
  private static selectTopScoredStops(
    stops: TripStop[],
    targetCount: number,
    startStop: TripStop,
    config: StopCurationConfig
  ): TripStop[] {
    if (stops.length === 0 || targetCount === 0) return [];

    // Score each stop
    const scoredStops = stops.map(stop => ({
      stop,
      score: this.calculateStopScore(stop, startStop, config)
    }));

    // Sort by score (highest first) and take top N
    scoredStops.sort((a, b) => b.score - a.score);
    
    return scoredStops
      .slice(0, Math.min(targetCount, scoredStops.length))
      .map(item => item.stop);
  }

  /**
   * Calculate score for a stop based on various factors
   */
  private static calculateStopScore(
    stop: TripStop,
    startStop: TripStop,
    config: StopCurationConfig
  ): number {
    let score = 0;

    // Base score for major stops
    if (stop.is_major_stop) {
      score += 10;
    }

    // Category-specific bonuses
    switch (stop.category) {
      case 'destination_city':
        score += config.preferDestinationCities ? 15 : 5;
        break;
      case 'attraction':
        score += 8;
        break;
      case 'route66_waypoint':
        score += 6;
        break;
      case 'hidden_gem':
        score += 7;
        break;
    }

    // Distance factor (prefer stops that are not too close to start)
    const distanceFromStart = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      stop.latitude, stop.longitude
    );
    
    // Sweet spot is 30-100 miles from start
    if (distanceFromStart >= 30 && distanceFromStart <= 100) {
      score += 5;
    } else if (distanceFromStart < 15) {
      score -= 3; // Penalize very close stops
    }

    // Diversity bonus for different stop types
    if (config.diversityBonus) {
      // This would be enhanced with historical selection tracking
      score += Math.random() * 2; // Small random factor for variety
    }

    return score;
  }

  /**
   * Combine all selected stops into a single array for backward compatibility
   */
  static combineSelectedStops(selection: CuratedStopSelection): TripStop[] {
    return [
      ...selection.attractions,
      ...selection.waypoints,
      ...selection.hiddenGems
    ];
  }
}
