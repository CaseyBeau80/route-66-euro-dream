
import { RecommendedStop } from './RecommendedStopTypes';

export class StopDisplayFormatter {
  /**
   * Format a stop for consistent display across all views
   */
  static formatStopForDisplay(stop: RecommendedStop) {
    return {
      name: stop.name,
      location: `${stop.city}, ${stop.state}`,
      category: this.formatCategory(stop.category),
      icon: this.getCategoryIcon(stop.category, stop.type),
      type: stop.type
    };
  }

  /**
   * Format category name for display
   */
  private static formatCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'destination_city': 'Destination City',
      'route66_waypoint': 'Route 66 Waypoint',
      'attraction': 'Attraction',
      'hidden_gem': 'Hidden Gem',
      'drive_in': 'Drive-In Theater',
      'diner': 'Historic Diner',
      'motel': 'Vintage Motel',
      'museum': 'Museum',
      'landmark': 'Historic Landmark',
      'park': 'Park',
      'entertainment': 'Entertainment'
    };

    return categoryMap[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Get icon for category and type
   */
  private static getCategoryIcon(category: string, type: string): string {
    // Type-based icons first
    if (type === 'destination') return '🏛️';
    if (type === 'major') return '⭐';
    if (type === 'featured') return '✨';

    // Category-based icons
    const iconMap: Record<string, string> = {
      'destination_city': '🏛️',
      'route66_waypoint': '🛣️',
      'attraction': '🎯',
      'hidden_gem': '💎',
      'drive_in': '🎬',
      'diner': '🍔',
      'motel': '🏨',
      'museum': '🏛️',
      'landmark': '📍',
      'park': '🌳',
      'entertainment': '🎪'
    };

    return iconMap[category] || '📍';
  }
}
