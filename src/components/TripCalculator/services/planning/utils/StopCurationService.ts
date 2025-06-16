
import { TripStop } from '../../data/SupabaseDataService';
import { RecommendedStop } from '../TripPlanTypes';
import { DistanceCalculationService } from '../../utils/DistanceCalculationService';

export class StopCurationService {
  /**
   * Curate stops for a segment based on route alignment and category priority
   */
  static curateStopsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    maxStops: number
  ): RecommendedStop[] {
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Score stops based on multiple factors
    const scoredStops = availableStops.map(stop => {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      const distanceToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );

      // Route alignment score (triangle inequality check)
      const routeDeviation = (distanceFromStart + distanceToEnd) - segmentDistance;
      const alignmentScore = Math.max(0, 50 - routeDeviation);

      // Position score - prefer stops in middle third of segment
      const positionRatio = distanceFromStart / segmentDistance;
      const positionScore = positionRatio >= 0.2 && positionRatio <= 0.8 ? 20 : 0;

      // Category priority score
      const categoryScore = this.getCategoryPriorityScore(stop.category);

      // State relevance bonus
      const stateBonus = (stop.state === startStop.state || stop.state === endStop.state) ? 10 : 0;

      const totalScore = alignmentScore + positionScore + categoryScore + stateBonus;

      return { stop, score: totalScore };
    });

    // Filter out poorly aligned stops and sort by score
    const wellAlignedStops = scoredStops
      .filter(item => item.score > 20) // Minimum quality threshold
      .sort((a, b) => b.score - a.score);

    // Ensure category diversity in selection
    const selectedStops: TripStop[] = [];
    const categoryCount: Record<string, number> = {};

    for (const item of wellAlignedStops) {
      if (selectedStops.length >= maxStops) break;

      const category = item.stop.category;
      const currentCount = categoryCount[category] || 0;
      const maxPerCategory = Math.ceil(maxStops / 3); // Limit per category

      if (currentCount < maxPerCategory) {
        selectedStops.push(item.stop);
        categoryCount[category] = currentCount + 1;
      }
    }

    // Convert TripStops to RecommendedStops with stopId
    return selectedStops.map(stop => ({
      stopId: stop.id,
      id: stop.id,
      name: stop.name,
      description: stop.description,
      latitude: stop.latitude,
      longitude: stop.longitude,
      category: stop.category,
      city_name: stop.city_name,
      state: stop.state,
      city: stop.city || stop.city_name || 'Unknown'
    }));
  }

  /**
   * Get category priority score for balanced curation
   */
  private static getCategoryPriorityScore(category: string): number {
    switch (category) {
      case 'route66_waypoint':
        return 30;
      case 'attraction':
        return 25;
      case 'historic_site':
        return 20;
      case 'hidden_gem':
        return 15;
      default:
        return 10;
    }
  }
}
