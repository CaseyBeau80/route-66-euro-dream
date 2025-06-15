
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface RecommendedStop {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  distanceFromRoute: number;
  relevanceScore: number;
  type: 'attraction' | 'hidden_gem' | 'waypoint';
}

export class StopRecommendationService {
  private static readonly MAX_DISTANCE_FROM_ROUTE = 100; // Increased for better coverage
  private static readonly DEFAULT_MAX_STOPS = 3;

  /**
   * Get recommended stops for a daily segment
   */
  static getRecommendedStopsForSegment(
    segment: DailySegment,
    allStops: TripStop[],
    maxStops: number = this.DEFAULT_MAX_STOPS
  ): RecommendedStop[] {
    console.log(`🎯 [DEBUG] Starting getRecommendedStopsForSegment for ${segment.startCity} → ${segment.endCity}`);
    console.log(`📊 [DEBUG] Input data:`, {
      totalStops: allStops.length,
      maxStops,
      segmentInfo: {
        day: segment.day,
        startCity: segment.startCity,
        endCity: segment.endCity
      },
      categoryCounts: allStops.reduce((acc, stop) => {
        acc[stop.category] = (acc[stop.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      sampleStops: allStops.slice(0, 5).map(s => ({ 
        id: s.id, 
        name: s.name, 
        category: s.category, 
        city: s.city_name 
      }))
    });

    // Filter stops that are geographically relevant to this segment
    const geographicallyRelevantStops = this.filterStopsByRouteGeography(segment, allStops);
    console.log(`📍 [DEBUG] Geographically relevant stops: ${geographicallyRelevantStops.length}`);
    console.log(`📍 [DEBUG] Geographic filter results:`, 
      geographicallyRelevantStops.map(s => ({ 
        name: s.name, 
        category: s.category, 
        city: s.city_name, 
        state: s.state 
      }))
    );
    
    // Score and rank stops by relevance
    const scoredStops = this.scoreStopRelevance(segment, geographicallyRelevantStops);
    console.log(`⭐ [DEBUG] Scored stops: ${scoredStops.length}`);
    console.log(`⭐ [DEBUG] Top scored stops:`, 
      scoredStops.slice(0, 10).map(s => ({ 
        name: s.name, 
        category: s.category, 
        city: s.city_name, 
        score: s.relevanceScore 
      }))
    );
    
    // Select diverse and high-quality stops
    const selectedStops = this.selectDiverseStops(scoredStops, maxStops);
    
    console.log(`✅ [DEBUG] Final selected ${selectedStops.length} recommended stops:`, 
      selectedStops.map(s => ({ 
        name: s.name, 
        city: s.city, 
        category: s.category, 
        score: s.relevanceScore,
        type: s.type
      }))
    );
    
    if (selectedStops.length === 0) {
      console.error(`❌ [DEBUG] NO STOPS SELECTED! Debug info:`, {
        originalStopsCount: allStops.length,
        afterGeographicFilter: geographicallyRelevantStops.length,
        afterScoring: scoredStops.length,
        segmentEndCity: segment.endCity,
        availableCategories: allStops.map(s => s.category).filter((v, i, a) => a.indexOf(v) === i)
      });
    }
    
    return selectedStops;
  }

  /**
   * Enhanced geographic filtering based on route progression
   */
  private static filterStopsByRouteGeography(
    segment: DailySegment,
    allStops: TripStop[]
  ): TripStop[] {
    console.log(`🗺️ [DEBUG] Starting enhanced route-based geographic filtering for ${allStops.length} stops`);
    
    const relevantStops = allStops.filter(stop => {
      const startCity = segment.startCity?.toLowerCase() || '';
      const endCity = segment.endCity?.toLowerCase() || '';
      const stopCity = stop.city_name?.toLowerCase() || '';
      const stopState = stop.state?.toLowerCase() || '';
      
      console.log(`🔍 [DEBUG] Checking stop: ${stop.name} in ${stop.city_name}, ${stop.state} (category: ${stop.category})`);
      
      // 1. Check if stop is in or near the start city
      const isNearStart = 
        stopCity.includes(startCity) || 
        startCity.includes(stopCity) ||
        stopCity === startCity;

      // 2. Check if stop is in or near the destination city
      const isNearDestination = 
        stopCity.includes(endCity) || 
        endCity.includes(stopCity) ||
        stopCity === endCity;

      // 3. Check if stop is in the same state as either start or end city
      const startState = this.extractStateFromCity(segment.startCity);
      const endState = this.extractStateFromCity(segment.endCity);
      const isInRouteStates = 
        (startState && stopState === startState.toLowerCase()) ||
        (endState && stopState === endState.toLowerCase());

      // 4. Check if stop is on a major Route 66 corridor between start and end
      const isOnRoute66Corridor = this.isOnRoute66Corridor(stop, segment);

      const isRelevant = isNearStart || isNearDestination || isInRouteStates || isOnRoute66Corridor;
      
      console.log(`🔍 [DEBUG] Geography check for ${stop.name}:`, {
        isNearStart,
        isNearDestination, 
        isInRouteStates,
        isOnRoute66Corridor,
        finalDecision: isRelevant ? 'INCLUDE' : 'EXCLUDE'
      });

      if (isRelevant) {
        console.log(`✅ [DEBUG] Including ${stop.category}: ${stop.name} in ${stop.city_name}, ${stop.state}`);
      }

      return isRelevant;
    });

    console.log(`📍 [DEBUG] Enhanced geographic filtering complete: ${relevantStops.length}/${allStops.length} stops passed`);
    return relevantStops;
  }

  /**
   * Extract state from city string (format: "City, ST" or "City, State")
   */
  private static extractStateFromCity(cityWithState: string): string | null {
    if (!cityWithState || !cityWithState.includes(',')) {
      return null;
    }
    
    const parts = cityWithState.split(',');
    if (parts.length < 2) {
      return null;
    }
    
    return parts[1].trim();
  }

  /**
   * Check if a stop is on the Route 66 corridor between start and end cities
   */
  private static isOnRoute66Corridor(stop: TripStop, segment: DailySegment): boolean {
    // Define major Route 66 states in order from east to west
    const route66States = ['il', 'mo', 'ks', 'ok', 'tx', 'nm', 'az', 'ca'];
    
    const startState = this.extractStateFromCity(segment.startCity)?.toLowerCase();
    const endState = this.extractStateFromCity(segment.endCity)?.toLowerCase();
    const stopState = stop.state?.toLowerCase();
    
    if (!startState || !endState || !stopState) {
      return false;
    }
    
    const startIndex = route66States.indexOf(startState);
    const endIndex = route66States.indexOf(endState);
    const stopIndex = route66States.indexOf(stopState);
    
    // If any state is not on Route 66, can't determine corridor
    if (startIndex === -1 || endIndex === -1 || stopIndex === -1) {
      return false;
    }
    
    // Check if stop state is between start and end states on Route 66
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);
    
    const isOnCorridor = stopIndex >= minIndex && stopIndex <= maxIndex;
    
    console.log(`🛣️ [DEBUG] Route 66 corridor check for ${stop.name}:`, {
      startState, endState, stopState,
      startIndex, endIndex, stopIndex,
      minIndex, maxIndex,
      isOnCorridor
    });
    
    return isOnCorridor;
  }

  /**
   * Score stops by relevance to the segment with enhanced criteria
   */
  private static scoreStopRelevance(
    segment: DailySegment,
    stops: TripStop[]
  ): (TripStop & { relevanceScore: number })[] {
    console.log(`🏆 [DEBUG] Starting enhanced scoring for ${stops.length} stops`);
    
    const scoredStops = stops.map(stop => {
      let score = 0;

      // Base score by category - prioritize attractions and hidden gems
      switch (stop.category) {
        case 'attraction':
          score += 20; // Higher priority for attractions
          break;
        case 'hidden_gem':
          score += 18; // High priority for hidden gems
          break;
        case 'drive_in':
          score += 15; // Good priority for drive-ins
          break;
        case 'waypoint':
          score += 10;
          break;
        default:
          score += 8;
      }

      // Bonus for featured/popular stops
      if (stop.featured) {
        score += 12;
      }

      // Bonus for stops with good descriptions
      if (stop.description && stop.description.length > 50) {
        score += 8;
      }

      // Enhanced city relevance scoring
      const cityRelevance = this.calculateEnhancedCityRelevance(stop, segment);
      score += cityRelevance;

      // Route 66 corridor bonus
      if (this.isOnRoute66Corridor(stop, segment)) {
        score += 15;
      }

      console.log(`🏆 [DEBUG] Scored ${stop.name}: ${score} points (category: ${stop.category}, city: ${stop.city_name})`);

      return { ...stop, relevanceScore: score };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log(`🏆 [DEBUG] Enhanced scoring complete. Top 5 scores:`, 
      scoredStops.slice(0, 5).map(s => ({ 
        name: s.name, 
        score: s.relevanceScore, 
        category: s.category 
      }))
    );
    
    return scoredStops;
  }

  /**
   * Calculate enhanced city relevance bonus
   */
  private static calculateEnhancedCityRelevance(stop: TripStop, segment: DailySegment): number {
    const stopCity = stop.city_name?.toLowerCase() || '';
    const startCity = segment.startCity.toLowerCase();
    const endCity = segment.endCity?.toLowerCase() || '';

    // Exact city match gets highest bonus
    if (stopCity === endCity || stopCity === startCity) {
      return 25;
    }

    // Partial city match gets good bonus
    if (stopCity.includes(endCity) || endCity.includes(stopCity) ||
        stopCity.includes(startCity) || startCity.includes(stopCity)) {
      return 15;
    }

    // Same state as start or end gets small bonus
    const startState = this.extractStateFromCity(segment.startCity)?.toLowerCase();
    const endState = this.extractStateFromCity(segment.endCity)?.toLowerCase();
    const stopState = stop.state?.toLowerCase();
    
    if ((startState && stopState === startState) || (endState && stopState === endState)) {
      return 8;
    }

    return 0;
  }

  /**
   * Select diverse stops ensuring variety in types
   */
  private static selectDiverseStops(
    scoredStops: (TripStop & { relevanceScore: number })[],
    maxStops: number
  ): RecommendedStop[] {
    console.log(`🎯 [DEBUG] Starting diverse selection from ${scoredStops.length} scored stops (max: ${maxStops})`);
    
    const selectedStops: RecommendedStop[] = [];
    const categoryCount: Record<string, number> = {};

    for (const stop of scoredStops) {
      if (selectedStops.length >= maxStops) {
        console.log(`🎯 [DEBUG] Reached max stops limit (${maxStops}), stopping selection`);
        break;
      }

      const category = stop.category || 'other';
      const currentCategoryCount = categoryCount[category] || 0;

      // Ensure diversity - don't select more than 2 stops of the same category for small lists
      const maxPerCategory = maxStops <= 3 ? 2 : Math.ceil(maxStops / 2);
      if (currentCategoryCount >= maxPerCategory) {
        console.log(`⚠️ [DEBUG] Skipping ${stop.name} - too many ${category} stops already (${currentCategoryCount}/${maxPerCategory})`);
        continue;
      }

      const recommendedStop: RecommendedStop = {
        id: stop.id,
        name: stop.name,
        category: stop.category || 'attraction',
        city: stop.city_name || 'Unknown',
        state: stop.state || 'Unknown',
        distanceFromRoute: 0, // Would calculate actual distance in a real implementation
        relevanceScore: stop.relevanceScore,
        type: this.mapCategoryToType(stop.category)
      };

      selectedStops.push(recommendedStop);
      categoryCount[category] = currentCategoryCount + 1;
      
      console.log(`✅ [DEBUG] Selected: ${stop.name} (${stop.category}) - Score: ${stop.relevanceScore}`);
    }

    console.log(`🎯 [DEBUG] Selection complete. Final counts by category:`, categoryCount);
    console.log(`🎯 [DEBUG] Selected stops:`, selectedStops.map(s => ({ name: s.name, category: s.category, type: s.type })));
    
    return selectedStops;
  }

  /**
   * Map category to type
   */
  private static mapCategoryToType(category?: string): 'attraction' | 'hidden_gem' | 'waypoint' {
    switch (category) {
      case 'hidden_gem':
        return 'hidden_gem';
      case 'waypoint':
      case 'route66_waypoint':
        return 'waypoint';
      default:
        return 'attraction';
    }
  }

  /**
   * Format stop for display
   */
  static formatStopForDisplay(stop: RecommendedStop): {
    name: string;
    location: string;
    category: string;
    icon: string;
  } {
    const icons = {
      attraction: '🎯',
      hidden_gem: '💎',
      waypoint: '📍'
    };

    const categoryLabels = {
      attraction: 'Attraction',
      hidden_gem: 'Hidden Gem',
      waypoint: 'Route 66 Waypoint',
      drive_in: 'Drive-In Theater',
      restaurant: 'Restaurant',
      museum: 'Museum',
      park: 'Park'
    };

    return {
      name: stop.name,
      location: `${stop.city}, ${stop.state}`,
      category: categoryLabels[stop.category as keyof typeof categoryLabels] || stop.category,
      icon: icons[stop.type] || '🎯'
    };
  }
}
