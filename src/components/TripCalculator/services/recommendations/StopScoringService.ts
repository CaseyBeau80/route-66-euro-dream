
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { RecommendedStop } from './RecommendedStopTypes';

export class StopScoringService {
  /**
   * Score stop relevance for a segment
   */
  static scoreStopRelevance(segment: DailySegment, stops: TripStop[]): RecommendedStop[] {
    console.log(`⭐ [SCORING] Starting scoring for ${stops.length} stops near ${segment.endCity}`);

    if (stops.length === 0) {
      console.log(`❌ [SCORING] No stops to score`);
      return [];
    }

    const scoredStops = stops.map(stop => {
      const score = this.calculateRelevanceScore(stop, segment);
      const recommendedStop: RecommendedStop = {
        id: stop.id,
        name: stop.name,
        city: stop.city_name || stop.city || 'Unknown',
        state: stop.state || '',
        category: stop.category || 'attraction',
        type: this.getStopType(stop),
        relevanceScore: score,
        originalStop: stop
      };

      console.log(`⭐ [SCORING] ${stop.name}: score=${score}, category=${stop.category}`);
      return recommendedStop;
    });

    // Sort by relevance score (highest first)
    const sortedStops = scoredStops.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log(`✅ [SCORING] Scoring complete: ${sortedStops.length} scored stops`);
    console.log(`🏆 [SCORING] Top 3 scores:`, sortedStops.slice(0, 3).map(s => ({ 
      name: s.name, 
      score: s.relevanceScore,
      category: s.category 
    })));

    return sortedStops;
  }

  /**
   * Calculate relevance score for a stop
   */
  private static calculateRelevanceScore(stop: TripStop, segment: DailySegment): number {
    let score = 0;

    // Base score by category
    const categoryScores = {
      'destination_city': 20,
      'attraction': 15,
      'hidden_gem': 18,
      'diner': 12,
      'motel': 8,
      'route66_waypoint': 10
    };

    score += categoryScores[stop.category as keyof typeof categoryScores] || 10;

    // Bonus for major stops
    if (stop.is_major_stop) score += 10;
    if (stop.is_official_destination) score += 8;

    // Bonus for having description
    if (stop.description && stop.description.length > 20) score += 5;

    // Bonus for having images
    if (stop.image_url) score += 3;
    if (stop.thumbnail_url) score += 2;

    // Name quality bonus
    if (stop.name && stop.name.length > 5) score += 2;

    // Featured bonus
    if (stop.featured) score += 7;

    // City/location relevance
    const destinationCity = segment.endCity.split(',')[0].toLowerCase();
    const stopCity = (stop.city_name || stop.city || '').toLowerCase();
    
    if (stopCity.includes(destinationCity) || destinationCity.includes(stopCity)) {
      score += 15; // High bonus for same city
    }

    // State relevance
    const destinationState = segment.endCity.includes(',') ? segment.endCity.split(',')[1]?.trim().toLowerCase() : '';
    const stopState = (stop.state || '').toLowerCase();
    
    if (destinationState && stopState === destinationState) {
      score += 8; // Bonus for same state
    }

    return Math.max(0, score); // Ensure non-negative
  }

  /**
   * Get stop type for display
   */
  private static getStopType(stop: TripStop): string {
    const typeMapping = {
      'destination_city': 'Major Destination',
      'attraction': 'Tourist Attraction',
      'hidden_gem': 'Hidden Gem',
      'diner': 'Classic Diner',
      'motel': 'Historic Motel',
      'route66_waypoint': 'Route 66 Landmark'
    };

    return typeMapping[stop.category as keyof typeof typeMapping] || 'Point of Interest';
  }

  /**
   * Select diverse stops ensuring variety
   */
  static selectDiverseStops(scoredStops: RecommendedStop[], maxStops: number): RecommendedStop[] {
    if (scoredStops.length === 0) {
      console.log(`❌ [DIVERSITY] No scored stops to select from`);
      return [];
    }

    console.log(`🎯 [DIVERSITY] Selecting ${maxStops} diverse stops from ${scoredStops.length} candidates`);

    const selected: RecommendedStop[] = [];
    const usedCategories = new Set<string>();

    // First pass: select highest scoring stops from different categories
    for (const stop of scoredStops) {
      if (selected.length >= maxStops) break;

      if (!usedCategories.has(stop.category)) {
        selected.push(stop);
        usedCategories.add(stop.category);
        console.log(`✅ [DIVERSITY] Selected ${stop.name} (${stop.category}) - score: ${stop.relevanceScore}`);
      }
    }

    // Second pass: fill remaining slots with best remaining stops
    for (const stop of scoredStops) {
      if (selected.length >= maxStops) break;

      if (!selected.find(s => s.id === stop.id)) {
        selected.push(stop);
        console.log(`✅ [DIVERSITY] Added ${stop.name} (${stop.category}) - score: ${stop.relevanceScore}`);
      }
    }

    console.log(`🏁 [DIVERSITY] Final selection: ${selected.length} stops`);
    return selected;
  }
}
