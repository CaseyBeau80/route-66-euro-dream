
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { RecommendedStop } from './RecommendedStopTypes';

export class StopScoringService {
  /**
   * Score stop relevance for a segment with enhanced scoring algorithm
   */
  static scoreStopRelevance(segment: DailySegment, stops: TripStop[]): RecommendedStop[] {
    console.log(`⭐ [SCORING] Starting enhanced scoring for ${stops.length} stops near ${segment.endCity}`);

    if (stops.length === 0) {
      console.log(`❌ [SCORING] No stops to score`);
      return [];
    }

    const scoredStops = stops.map(stop => {
      const score = this.calculateEnhancedRelevanceScore(stop, segment);
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

      console.log(`⭐ [SCORING] ${stop.name}: score=${score}, category=${stop.category}, featured=${stop.featured}`);
      return recommendedStop;
    });

    // Sort by relevance score (highest first)
    const sortedStops = scoredStops.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log(`✅ [SCORING] Enhanced scoring complete: ${sortedStops.length} scored stops`);
    console.log(`🏆 [SCORING] Top 5 scores:`, sortedStops.slice(0, 5).map(s => ({ 
      name: s.name, 
      score: s.relevanceScore,
      category: s.category,
      featured: s.originalStop.featured 
    })));

    return sortedStops;
  }

  /**
   * Calculate enhanced relevance score for a stop
   */
  private static calculateEnhancedRelevanceScore(stop: TripStop, segment: DailySegment): number {
    let score = 0;

    // Base score by category (enhanced)
    const categoryScores = {
      'destination_city': 25,
      'attraction': 20,
      'hidden_gem': 22,
      'diner': 15,
      'motel': 10,
      'route66_waypoint': 18,
      'drive_in': 16
    };

    score += categoryScores[stop.category as keyof typeof categoryScores] || 12;

    // Enhanced feature bonuses
    if (stop.is_major_stop) score += 15;
    if (stop.is_official_destination) score += 12;
    if (stop.featured) score += 20; // Significant bonus for featured stops

    // Content quality bonuses
    if (stop.description && stop.description.length > 50) score += 8;
    if (stop.description && stop.description.length > 100) score += 4; // Additional bonus for detailed descriptions

    // Media bonuses
    if (stop.image_url) score += 6;
    if (stop.thumbnail_url) score += 4;

    // Name quality bonus
    if (stop.name && stop.name.length > 10) score += 3;

    // Location relevance (enhanced)
    const destinationCity = segment.endCity.split(',')[0].toLowerCase();
    const stopCity = (stop.city_name || stop.city || '').toLowerCase();
    
    if (stopCity === destinationCity) {
      score += 25; // Exact city match
    } else if (stopCity.includes(destinationCity) || destinationCity.includes(stopCity)) {
      score += 15; // Partial city match
    }

    // State relevance
    const destinationState = segment.endCity.includes(',') ? segment.endCity.split(',')[1]?.trim().toLowerCase() : '';
    const stopState = (stop.state || '').toLowerCase();
    
    if (destinationState && stopState === destinationState) {
      score += 10; // Same state bonus
    }

    // Route 66 authenticity bonus
    if (stop.name.toLowerCase().includes('route 66') || 
        stop.name.toLowerCase().includes('rt 66') ||
        stop.description?.toLowerCase().includes('route 66')) {
      score += 8;
    }

    // Historic/vintage bonus
    if (stop.name.toLowerCase().includes('historic') || 
        stop.name.toLowerCase().includes('vintage') ||
        stop.name.toLowerCase().includes('classic')) {
      score += 5;
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
      'route66_waypoint': 'Route 66 Landmark',
      'drive_in': 'Drive-In Theater'
    };

    return typeMapping[stop.category as keyof typeof typeMapping] || 'Point of Interest';
  }

  /**
   * Select diverse stops ensuring variety and quality
   */
  static selectDiverseStops(scoredStops: RecommendedStop[], maxStops: number): RecommendedStop[] {
    if (scoredStops.length === 0) {
      console.log(`❌ [DIVERSITY] No scored stops to select from`);
      return [];
    }

    console.log(`🎯 [DIVERSITY] Selecting ${maxStops} diverse stops from ${scoredStops.length} candidates`);

    const selected: RecommendedStop[] = [];
    const usedCategories = new Set<string>();

    // First pass: select highest scoring featured stops
    for (const stop of scoredStops) {
      if (selected.length >= maxStops) break;

      if (stop.originalStop.featured && !selected.find(s => s.id === stop.id)) {
        selected.push(stop);
        usedCategories.add(stop.category);
        console.log(`✅ [DIVERSITY] Selected featured stop: ${stop.name} (${stop.category}) - score: ${stop.relevanceScore}`);
      }
    }

    // Second pass: select highest scoring stops from different categories
    for (const stop of scoredStops) {
      if (selected.length >= maxStops) break;

      if (!usedCategories.has(stop.category) && !selected.find(s => s.id === stop.id)) {
        selected.push(stop);
        usedCategories.add(stop.category);
        console.log(`✅ [DIVERSITY] Selected diverse stop: ${stop.name} (${stop.category}) - score: ${stop.relevanceScore}`);
      }
    }

    // Third pass: fill remaining slots with best remaining stops
    for (const stop of scoredStops) {
      if (selected.length >= maxStops) break;

      if (!selected.find(s => s.id === stop.id)) {
        selected.push(stop);
        console.log(`✅ [DIVERSITY] Added remaining stop: ${stop.name} (${stop.category}) - score: ${stop.relevanceScore}`);
      }
    }

    console.log(`🏁 [DIVERSITY] Final selection: ${selected.length} stops with total score: ${selected.reduce((sum, s) => sum + s.relevanceScore, 0)}`);
    return selected;
  }
}
