
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { RecommendedStop } from './RecommendedStopTypes';

export class StopScoringService {
  /**
   * Score stops by relevance with HEAVY bias toward actual attractions
   */
  static scoreStopRelevance(
    segment: DailySegment,
    stops: TripStop[]
  ): (TripStop & { relevanceScore: number })[] {
    console.log(`🏆 [ATTRACTION-FOCUSED] Starting scoring for ${stops.length} stops`);
    
    const scoredStops = stops.map(stop => {
      let score = 0;

      // MASSIVE bonus for attractions and hidden gems - these are what we want!
      switch (stop.category) {
        case 'attraction':
          score += 50; // HUGE priority for attractions
          break;
        case 'hidden_gem':
          score += 45; // Very high priority for hidden gems
          break;
        case 'drive_in':
          score += 40; // High priority for drive-ins
          break;
        case 'waypoint':
        case 'route66_waypoint':
          score += 30; // Good priority for waypoints
          break;
        case 'museum':
          score += 35; // High priority for museums
          break;
        case 'diner':
        case 'restaurant':
          score += 25; // Good priority for dining
          break;
        default:
          score += 15; // Default for other categories
      }

      // HUGE bonus for featured stops
      if (stop.featured) {
        score += 30;
      }

      // Bonus for stops with substantial descriptions (indicates quality data)
      if (stop.description && stop.description.length > 100) {
        score += 20;
      } else if (stop.description && stop.description.length > 50) {
        score += 10;
      }

      // Enhanced city relevance scoring
      const cityRelevance = this.calculateEnhancedCityRelevance(stop, segment);
      score += cityRelevance;

      // Route 66 corridor bonus
      if (this.isOnRoute66Corridor(stop, segment)) {
        score += 25;
      }

      // PENALTY for generic names that sound like cities
      if (this.seemsLikeGenericLocation(stop)) {
        score -= 20;
        console.log(`⚠️ [ATTRACTION-FOCUSED] Generic location penalty: ${stop.name}`);
      }

      console.log(`🏆 [ATTRACTION-FOCUSED] Scored ${stop.name}: ${score} points (category: ${stop.category}, city: ${stop.city_name})`);

      return { ...stop, relevanceScore: score };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log(`🏆 [ATTRACTION-FOCUSED] Scoring complete. Top 10 scores:`, 
      scoredStops.slice(0, 10).map(s => ({ 
        name: s.name, 
        score: s.relevanceScore, 
        category: s.category,
        city: s.city_name
      }))
    );
    
    return scoredStops;
  }

  /**
   * Check if a stop seems like a generic location rather than a specific attraction
   */
  private static seemsLikeGenericLocation(stop: TripStop): boolean {
    const name = stop.name?.toLowerCase() || '';
    const cityName = stop.city_name?.toLowerCase() || '';
    
    // Check if name is just the city name or very similar
    if (name === cityName || name.includes('destination') || name.includes('attractions in')) {
      return true;
    }
    
    // Check for generic location indicators
    const genericTerms = [
      'points of interest',
      'tourist attractions',
      'things to do',
      'local attractions',
      'area attractions'
    ];
    
    return genericTerms.some(term => name.includes(term));
  }

  /**
   * Calculate enhanced city relevance bonus
   */
  private static calculateEnhancedCityRelevance(stop: TripStop, segment: DailySegment): number {
    const stopCity = stop.city_name?.toLowerCase() || '';
    const startCity = segment.startCity.toLowerCase();
    const endCity = segment.endCity?.toLowerCase() || '';

    // Extract just city names without state for comparison
    const startCityOnly = startCity.split(',')[0].trim();
    const endCityOnly = endCity.split(',')[0].trim();

    // Exact city match gets highest bonus
    if (stopCity === endCityOnly || stopCity === startCityOnly) {
      return 30;
    }

    // Partial city match gets good bonus
    if (stopCity.includes(endCityOnly) || endCityOnly.includes(stopCity) ||
        stopCity.includes(startCityOnly) || startCityOnly.includes(stopCity)) {
      return 20;
    }

    // Same state as start or end gets small bonus
    const startState = this.extractStateFromCity(segment.startCity)?.toLowerCase();
    const endState = this.extractStateFromCity(segment.endCity)?.toLowerCase();
    const stopState = stop.state?.toLowerCase();
    
    if ((startState && stopState === startState) || (endState && stopState === endState)) {
      return 10;
    }

    return 0;
  }

  /**
   * Select diverse stops ensuring variety in types and REAL attractions
   */
  static selectDiverseStops(
    scoredStops: (TripStop & { relevanceScore: number })[],
    maxStops: number
  ): RecommendedStop[] {
    console.log(`🎯 [ATTRACTION-FOCUSED] Starting selection from ${scoredStops.length} scored stops (max: ${maxStops})`);
    
    const selectedStops: RecommendedStop[] = [];
    const categoryCount: Record<string, number> = {};

    // FIRST PRIORITY: Select high-scoring attractions and hidden gems
    const priorityStops = scoredStops.filter(stop => 
      (stop.category === 'attraction' || stop.category === 'hidden_gem') && 
      stop.relevanceScore > 40 &&
      !this.seemsLikeGenericLocation(stop)
    );

    console.log(`🎯 [ATTRACTION-FOCUSED] Priority attractions found: ${priorityStops.length}`, 
      priorityStops.map(s => ({ name: s.name, score: s.relevanceScore, category: s.category }))
    );

    // Add priority stops first
    for (const stop of priorityStops) {
      if (selectedStops.length >= maxStops) break;
      
      const recommendedStop: RecommendedStop = {
        id: stop.id,
        name: stop.name,
        category: stop.category || 'attraction',
        city: stop.city_name || 'Unknown',
        state: stop.state || 'Unknown',
        distanceFromRoute: 0,
        relevanceScore: stop.relevanceScore,
        type: this.mapCategoryToType(stop.category)
      };

      selectedStops.push(recommendedStop);
      const category = stop.category || 'other';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      
      console.log(`✅ [ATTRACTION-FOCUSED] PRIORITY Selected: ${stop.name} (${stop.category}) - Score: ${stop.relevanceScore}`);
    }

    // Fill remaining slots with other high-scoring stops if needed
    const remainingSlots = maxStops - selectedStops.length;
    if (remainingSlots > 0) {
      const remainingStops = scoredStops.filter(stop => 
        !selectedStops.some(selected => selected.id === stop.id) &&
        !this.seemsLikeGenericLocation(stop)
      );

      for (const stop of remainingStops.slice(0, remainingSlots)) {
        const recommendedStop: RecommendedStop = {
          id: stop.id,
          name: stop.name,
          category: stop.category || 'attraction',
          city: stop.city_name || 'Unknown',
          state: stop.state || 'Unknown',
          distanceFromRoute: 0,
          relevanceScore: stop.relevanceScore,
          type: this.mapCategoryToType(stop.category)
        };

        selectedStops.push(recommendedStop);
        const category = stop.category || 'other';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
        
        console.log(`✅ [ATTRACTION-FOCUSED] SECONDARY Selected: ${stop.name} (${stop.category}) - Score: ${stop.relevanceScore}`);
      }
    }

    console.log(`🎯 [ATTRACTION-FOCUSED] Selection complete. Final counts by category:`, categoryCount);
    console.log(`🎯 [ATTRACTION-FOCUSED] Selected attractions:`, selectedStops.map(s => ({ name: s.name, category: s.category, type: s.type, score: s.relevanceScore })));
    
    return selectedStops;
  }

  /**
   * Check if a stop seems like a generic location rather than a specific attraction
   */
  private static seemsLikeGenericLocation(stop: TripStop): boolean {
    const name = stop.name?.toLowerCase() || '';
    const cityName = stop.city_name?.toLowerCase() || '';
    
    // Check if name is just the city name or very similar
    if (name === cityName || name.includes('destination') || name.includes('attractions in')) {
      return true;
    }
    
    // Check for generic location indicators
    const genericTerms = [
      'points of interest',
      'tourist attractions', 
      'things to do',
      'local attractions',
      'area attractions'
    ];
    
    return genericTerms.some(term => name.includes(term));
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

  // Helper methods
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

  private static isOnRoute66Corridor(stop: TripStop, segment: DailySegment): boolean {
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
    
    if (startIndex === -1 || endIndex === -1 || stopIndex === -1) {
      return false;
    }
    
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);
    
    return stopIndex >= minIndex && stopIndex <= maxIndex;
  }
}
