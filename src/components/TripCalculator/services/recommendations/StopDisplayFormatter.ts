
import { RecommendedStop } from './RecommendedStopTypes';

export class StopDisplayFormatter {
  /**
   * Format a recommended stop for display with consistent UI elements
   */
  static formatStopForDisplay(stop: RecommendedStop): {
    name: string;
    location: string;
    category: string;
    icon: string;
  } {
    const icon = this.getStopIcon(stop.category);
    const location = this.formatLocation(stop.city, stop.state);
    const category = this.formatCategory(stop.category);

    return {
      name: stop.name,
      location,
      category,
      icon
    };
  }

  /**
   * Get appropriate icon for stop category
   */
  private static getStopIcon(category: string): string {
    const iconMap: Record<string, string> = {
      'destination_city': '🏛️',
      'attraction': '🎯',
      'hidden_gem': '💎',
      'diner': '🍽️',
      'motel': '🏨',
      'route66_waypoint': '🛣️',
      'drive_in': '🎬'
    };

    return iconMap[category] || '📍';
  }

  /**
   * Format location string
   */
  private static formatLocation(city: string, state: string): string {
    if (!city && !state) return 'Unknown Location';
    if (!state) return city;
    if (!city) return state;
    
    return `${city}, ${state}`;
  }

  /**
   * Format category for display
   */
  private static formatCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'destination_city': 'Major Destination',
      'attraction': 'Tourist Attraction',
      'hidden_gem': 'Hidden Gem',
      'diner': 'Classic Diner',
      'motel': 'Historic Motel',
      'route66_waypoint': 'Route 66 Landmark',
      'drive_in': 'Drive-In Theater'
    };

    return categoryMap[category] || 'Point of Interest';
  }
}
