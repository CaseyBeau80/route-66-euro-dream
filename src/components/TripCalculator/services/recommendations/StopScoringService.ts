
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { RecommendedStop } from './RecommendedStopTypes';

export class StopScoringService {
  /**
   * Score stops by relevance to the segment with enhanced criteria
   */
  static scoreStopRelevance(
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
  static selectDiverseStops(
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

  // Helper methods from the geography filter
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
