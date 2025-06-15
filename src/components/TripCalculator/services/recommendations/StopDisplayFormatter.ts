
import { RecommendedStop, StopFormattingResult } from './RecommendedStopTypes';

export class StopDisplayFormatter {
  /**
   * Format stop for display
   */
  static formatStopForDisplay(stop: RecommendedStop): StopFormattingResult {
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
