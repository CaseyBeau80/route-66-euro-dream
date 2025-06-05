
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopCurationConfig } from './StopCurationConfig';

export class StopScorer {
  /**
   * Select top-scored stops from a category
   */
  static selectTopScoredStops(
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
}
