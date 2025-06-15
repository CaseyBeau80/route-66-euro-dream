
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { RecommendedStop } from './RecommendedStopTypes';

export class StopScoringService {
  /**
   * Score stop relevance with much more generous scoring
   */
  static scoreStopRelevance(segment: DailySegment, stops: TripStop[]): RecommendedStop[] {
    if (!segment?.endCity || stops.length === 0) {
      console.log('⭐ [SCORING] Invalid input for scoring');
      return [];
    }

    console.log(`⭐ [SCORING] Scoring ${stops.length} stops for ${segment.endCity}`);

    const scoredStops = stops.map(stop => {
      let score = 20; // Higher base score
      const reasons: string[] = [];

      // MAJOR BONUSES: Featured content gets huge priority
      if (stop.featured) {
        score += 60;
        reasons.push('featured');
      }

      // MAJOR STOPS: Official destinations and major waypoints
      if (stop.is_major_stop || stop.is_official_destination) {
        score += 50;
        reasons.push('major-stop');
      }

      // CONTENT QUALITY: Rich descriptions and images get big bonuses
      if (stop.description && stop.description.length > 30) {
        score += 35;
        reasons.push('rich-description');
      }

      if (stop.image_url || stop.thumbnail_url) {
        score += 30;
        reasons.push('has-image');
      }

      // CATEGORY BONUSES: All categories get decent bonuses
      const categoryBonus = this.getCategoryBonus(stop.category);
      score += categoryBonus;
      if (categoryBonus > 0) {
        reasons.push(`category-${stop.category}`);
      }

      // ROUTE 66 RELEVANCE: Keywords in name/description
      const route66Score = this.getRoute66RelevanceScore(stop);
      score += route66Score;
      if (route66Score > 0) {
        reasons.push('route66-relevant');
      }

      // DIVERSITY BONUSES: Ensure we have variety
      if (stop.website) {
        score += 15;
        reasons.push('has-website');
      }

      if (stop.latitude && stop.longitude) {
        score += 10;
        reasons.push('has-location');
      }

      // GENEROUS FALLBACK: Give every stop a decent minimum
      score = Math.max(score, 25);

      console.log(`⭐ [SCORING] ${stop.name}: ${score} points (${reasons.join(', ')})`);

      // Create the RecommendedStop
      const recommendedStop: RecommendedStop = {
        id: stop.id,
        name: stop.name,
        city: stop.city_name || stop.city || 'Unknown',
        state: stop.state || 'Unknown',
        category: stop.category || 'attraction',
        type: this.getStopType(stop),
        relevanceScore: score,
        originalStop: stop
      };

      return recommendedStop;
    });

    // Sort by score descending
    const sortedStops = scoredStops.sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log(`⭐ [SCORING] Scoring complete. Top 5:`, 
      sortedStops.slice(0, 5).map(s => ({ 
        name: s.name, 
        score: s.relevanceScore,
        category: s.category,
        hasDescription: !!s.originalStop.description,
        hasImage: !!(s.originalStop.image_url || s.originalStop.thumbnail_url)
      }))
    );

    return sortedStops;
  }

  /**
   * Select diverse stops with much more inclusive selection
   */
  static selectDiverseStops(scoredStops: RecommendedStop[], maxStops: number): RecommendedStop[] {
    if (scoredStops.length === 0) return [];

    console.log(`🎯 [DIVERSITY] Selecting ${maxStops} diverse stops from ${scoredStops.length} candidates`);

    const selected: RecommendedStop[] = [];
    const usedCategories = new Set<string>();

    // First pass: Select highest scoring stops with unique categories
    for (const stop of scoredStops) {
      if (selected.length >= maxStops) break;

      if (!usedCategories.has(stop.category)) {
        selected.push(stop);
        usedCategories.add(stop.category);
        console.log(`🎯 [DIVERSITY] Selected ${stop.name} (${stop.category}, score: ${stop.relevanceScore})`);
      }
    }

    // Second pass: Fill remaining slots with highest scoring stops regardless of category
    for (const stop of scoredStops) {
      if (selected.length >= maxStops) break;

      if (!selected.find(s => s.id === stop.id)) {
        selected.push(stop);
        console.log(`🎯 [DIVERSITY] Filled slot with ${stop.name} (score: ${stop.relevanceScore})`);
      }
    }

    console.log(`🎯 [DIVERSITY] Final selection: ${selected.length} stops`);
    return selected;
  }

  /**
   * Get category-specific bonus points - more generous
   */
  private static getCategoryBonus(category: string): number {
    const bonuses: Record<string, number> = {
      'destination_city': 40,
      'route66_waypoint': 35,
      'attraction': 30,
      'hidden_gem': 25,
      'drive_in': 20,
      'diner': 15,
      'motel': 10
    };

    return bonuses[category] || 15; // Give unknown categories a decent bonus too
  }

  /**
   * Get Route 66 relevance score based on keywords
   */
  private static getRoute66RelevanceScore(stop: TripStop): number {
    const route66Keywords = [
      'route 66', 'rt 66', 'route66', 'historic highway',
      'mother road', 'main street of america', 'will rogers highway'
    ];

    const searchText = `${stop.name} ${stop.description || ''}`.toLowerCase();
    
    for (const keyword of route66Keywords) {
      if (searchText.includes(keyword)) {
        return 25;
      }
    }

    return 0;
  }

  /**
   * Determine stop type for display
   */
  private static getStopType(stop: TripStop): 'destination' | 'major' | 'featured' | 'attraction' {
    if (stop.is_official_destination) return 'destination';
    if (stop.is_major_stop) return 'major';
    if (stop.featured) return 'featured';
    return 'attraction';
  }
}
