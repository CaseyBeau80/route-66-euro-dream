
import { TripStop } from '../../types/TripStop';
import { DailySegment } from '../planning/TripPlanBuilder';
import { RecommendedStop } from './RecommendedStopTypes';

export class StopScoringService {
  /**
   * Score stop relevance with enhanced fallback bonuses
   */
  static scoreStopRelevance(segment: DailySegment, stops: TripStop[]): RecommendedStop[] {
    if (!segment?.endCity || stops.length === 0) {
      console.log('⭐ [ENHANCED-SCORING] Invalid input for scoring');
      return [];
    }

    console.log(`⭐ [ENHANCED-SCORING] Scoring ${stops.length} stops for ${segment.endCity}`);

    const scoredStops = stops.map(stop => {
      let score = 0;
      const reasons: string[] = [];

      // BASE SCORE: Featured content gets priority
      if (stop.featured) {
        score += 40;
        reasons.push('featured');
      }

      // MAJOR STOPS: Official destinations and major waypoints
      if (stop.is_major_stop || stop.is_official_destination) {
        score += 35;
        reasons.push('major-stop');
      }

      // CONTENT QUALITY: Rich descriptions and images
      if (stop.description && stop.description.length > 50) {
        score += 25;
        reasons.push('rich-description');
      }

      if (stop.image_url || stop.thumbnail_url) {
        score += 20;
        reasons.push('has-image');
      }

      // CATEGORY BONUSES: Route 66 specific categories
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

      // FALLBACK BONUSES: Ensure we always have some content
      if (stops.length < 5) {
        score += 15; // Boost all stops when we have few options
        reasons.push('scarcity-bonus');
      }

      if (stop.website) {
        score += 10;
        reasons.push('has-website');
      }

      // Ensure minimum score for valid stops
      score = Math.max(score, 10);

      console.log(`⭐ [ENHANCED-SCORING] ${stop.name}: ${score} points (${reasons.join(', ')})`);

      // Create the RecommendedStop with proper data mapping
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

      console.log(`✅ [ENHANCED-SCORING] Created RecommendedStop:`, {
        name: recommendedStop.name,
        city: recommendedStop.city,
        hasDescription: !!stop.description,
        hasImage: !!(stop.image_url || stop.thumbnail_url),
        hasWebsite: !!stop.website,
        category: recommendedStop.category,
        score: recommendedStop.relevanceScore
      });

      return recommendedStop;
    });

    // Sort by score descending
    const sortedStops = scoredStops.sort((a, b) => b.relevanceScore - a.relevanceScore);

    console.log(`⭐ [ENHANCED-SCORING] Scoring complete. Top 3:`, 
      sortedStops.slice(0, 3).map(s => ({ 
        name: s.name, 
        score: s.relevanceScore,
        hasDescription: !!s.originalStop.description,
        hasImage: !!(s.originalStop.image_url || s.originalStop.thumbnail_url),
        hasWebsite: !!s.originalStop.website
      }))
    );

    return sortedStops;
  }

  /**
   * Select diverse stops with balanced categories
   */
  static selectDiverseStops(scoredStops: RecommendedStop[], maxStops: number): RecommendedStop[] {
    if (scoredStops.length === 0) return [];

    console.log(`🎯 [ENHANCED-DIVERSITY] Selecting ${maxStops} diverse stops from ${scoredStops.length} candidates`);

    const selected: RecommendedStop[] = [];
    const usedCategories = new Set<string>();

    // First pass: Select highest scoring stops with unique categories
    for (const stop of scoredStops) {
      if (selected.length >= maxStops) break;

      if (!usedCategories.has(stop.category)) {
        selected.push(stop);
        usedCategories.add(stop.category);
        console.log(`🎯 [ENHANCED-DIVERSITY] Selected ${stop.name} (${stop.category}, score: ${stop.relevanceScore})`);
      }
    }

    // Second pass: Fill remaining slots with highest scoring stops
    for (const stop of scoredStops) {
      if (selected.length >= maxStops) break;

      if (!selected.find(s => s.id === stop.id)) {
        selected.push(stop);
        console.log(`🎯 [ENHANCED-DIVERSITY] Filled slot with ${stop.name} (score: ${stop.relevanceScore})`);
      }
    }

    console.log(`🎯 [ENHANCED-DIVERSITY] Final selection: ${selected.length} stops`);
    return selected;
  }

  /**
   * Get category-specific bonus points
   */
  private static getCategoryBonus(category: string): number {
    const bonuses: Record<string, number> = {
      'destination_city': 30,
      'route66_waypoint': 25,
      'attraction': 20,
      'hidden_gem': 15,
      'drive_in': 15,
      'diner': 10,
      'motel': 8
    };

    return bonuses[category] || 5;
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
        return 20;
      }
    }

    return 0;
  }

  /**
   * Determine stop type for display
   */
  private static getStopType(stop: TripStop): string {
    if (stop.is_official_destination) return 'destination';
    if (stop.is_major_stop) return 'major';
    if (stop.featured) return 'featured';
    return 'attraction';
  }
}
