
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
  private static readonly MAX_DISTANCE_FROM_ROUTE = 25; // miles
  private static readonly DEFAULT_MAX_STOPS = 3;

  /**
   * Get recommended stops for a daily segment
   */
  static getRecommendedStopsForSegment(
    segment: DailySegment,
    allStops: TripStop[],
    maxStops: number = this.DEFAULT_MAX_STOPS
  ): RecommendedStop[] {
    console.log(`🎯 Getting recommended stops for ${segment.startCity} → ${segment.endCity}`);
    console.log(`📊 Available stops data:`, {
      totalStops: allStops.length,
      categories: [...new Set(allStops.map(s => s.category))],
      sampleStops: allStops.slice(0, 5).map(s => ({ name: s.name, city: s.city_name, category: s.category }))
    });

    // Filter stops that are geographically relevant to this segment
    const geographicallyRelevantStops = this.filterStopsByGeography(segment, allStops);
    console.log(`📍 Geographically relevant stops: ${geographicallyRelevantStops.length}`);
    
    // Score and rank stops by relevance
    const scoredStops = this.scoreStopRelevance(segment, geographicallyRelevantStops);
    console.log(`⭐ Scored stops: ${scoredStops.length}`);
    
    // Select diverse and high-quality stops
    const selectedStops = this.selectDiverseStops(scoredStops, maxStops);
    
    console.log(`✅ Selected ${selectedStops.length} recommended stops for segment:`, 
      selectedStops.map(s => ({ name: s.name, city: s.city, score: s.relevanceScore }))
    );
    return selectedStops;
  }

  /**
   * Filter stops by geographical relevance to the segment route
   */
  private static filterStopsByGeography(
    segment: DailySegment,
    allStops: TripStop[]
  ): TripStop[] {
    const relevantStops = allStops.filter(stop => {
      // Skip destination cities (they're already part of the route)
      if (stop.category === 'destination_city') {
        return false;
      }

      // Get the destination city for this segment
      const destinationCity = segment.endCity?.toLowerCase() || '';
      const stopCity = stop.city_name?.toLowerCase() || '';
      const stopState = stop.state?.toLowerCase() || '';
      
      // Check if stop is near the destination city
      const isNearDestination = 
        stopCity.includes(destinationCity) || 
        destinationCity.includes(stopCity) ||
        stopCity === destinationCity;

      // Also check against start city for broader coverage
      const startCity = segment.startCity?.toLowerCase() || '';
      const isNearStart = 
        stopCity.includes(startCity) || 
        startCity.includes(stopCity) ||
        stopCity === startCity;

      // For better geographic coverage, also include stops in the same state as the destination
      const isInSameState = segment.endCity && this.isStopInCityState(stop, segment.endCity);

      const isRelevant = isNearDestination || isNearStart || isInSameState;
      
      if (isRelevant) {
        console.log(`✅ Including stop: ${stop.name} in ${stop.city_name}, ${stop.state} (${stop.category})`);
      }

      return isRelevant;
    });

    console.log(`📍 Filtered to ${relevantStops.length} geographically relevant stops for ${segment.endCity}`);
    return relevantStops;
  }

  /**
   * Check if a stop is in the same state as a city
   */
  private static isStopInCityState(stop: TripStop, cityWithState: string): boolean {
    // Extract state from city string (format: "City, ST" or "City, State")
    const cityParts = cityWithState.split(',');
    if (cityParts.length < 2) return false;
    
    const stateFromCity = cityParts[1].trim().toLowerCase();
    const stopState = stop.state?.toLowerCase() || '';
    
    // Handle both abbreviations and full state names
    const stateAbbreviations: Record<string, string> = {
      'illinois': 'il', 'il': 'il',
      'missouri': 'mo', 'mo': 'mo',
      'kansas': 'ks', 'ks': 'ks',
      'oklahoma': 'ok', 'ok': 'ok',
      'texas': 'tx', 'tx': 'tx',
      'new mexico': 'nm', 'nm': 'nm',
      'arizona': 'az', 'az': 'az',
      'california': 'ca', 'ca': 'ca'
    };
    
    const normalizedCityState = stateAbbreviations[stateFromCity] || stateFromCity;
    const normalizedStopState = stateAbbreviations[stopState] || stopState;
    
    return normalizedCityState === normalizedStopState;
  }

  /**
   * Score stops by relevance to the segment
   */
  private static scoreStopRelevance(
    segment: DailySegment,
    stops: TripStop[]
  ): (TripStop & { relevanceScore: number })[] {
    return stops.map(stop => {
      let score = 0;

      // Base score by category
      switch (stop.category) {
        case 'attraction':
          score += 10;
          break;
        case 'hidden_gem':
          score += 8;
          break;
        case 'waypoint':
          score += 6;
          break;
        default:
          score += 5;
      }

      // Bonus for featured/popular stops - safely check if featured exists
      if (stop.featured) {
        score += 5;
      }

      // Bonus for stops with good descriptions
      if (stop.description && stop.description.length > 50) {
        score += 3;
      }

      // Bonus for city name relevance
      const cityRelevance = this.calculateCityRelevance(stop, segment);
      score += cityRelevance;

      return { ...stop, relevanceScore: score };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Calculate city relevance bonus
   */
  private static calculateCityRelevance(stop: TripStop, segment: DailySegment): number {
    const stopCity = stop.city_name?.toLowerCase() || '';
    const startCity = segment.startCity.toLowerCase();
    const endCity = segment.endCity?.toLowerCase() || '';

    // Exact city match gets highest bonus
    if (stopCity === endCity || stopCity === startCity) {
      return 15;
    }

    // Partial city match gets medium bonus
    if (stopCity.includes(endCity) || endCity.includes(stopCity) ||
        stopCity.includes(startCity) || startCity.includes(stopCity)) {
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
    const selectedStops: RecommendedStop[] = [];
    const categoryCount: Record<string, number> = {};

    for (const stop of scoredStops) {
      if (selectedStops.length >= maxStops) {
        break;
      }

      const category = stop.category || 'other';
      const currentCategoryCount = categoryCount[category] || 0;

      // Ensure diversity - don't select more than 2 stops of the same category
      if (currentCategoryCount >= 2) {
        continue;
      }

      selectedStops.push({
        id: stop.id,
        name: stop.name,
        category: stop.category || 'attraction',
        city: stop.city_name || 'Unknown',
        state: stop.state || 'Unknown',
        distanceFromRoute: 0, // Would calculate actual distance
        relevanceScore: stop.relevanceScore,
        type: this.mapCategoryToType(stop.category)
      });

      categoryCount[category] = currentCategoryCount + 1;
    }

    console.log(`🎯 Selected diverse stops by category:`, categoryCount);
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

    return {
      name: stop.name,
      location: `${stop.city}, ${stop.state}`,
      category: stop.category,
      icon: icons[stop.type] || '📍'
    };
  }
}
