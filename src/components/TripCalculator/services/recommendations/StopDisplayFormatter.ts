
import { RecommendedStop } from './RecommendedStopTypes';
import { StopFormattingResult } from './RecommendedStopTypes';

export class StopDisplayFormatter {
  /**
   * Format stop for display with proper icons and descriptions
   */
  static formatStopForDisplay(stop: RecommendedStop): StopFormattingResult {
    const icon = this.getCategoryIcon(stop.category);
    const category = this.getCategoryDisplayName(stop.category);
    const location = `${stop.city}, ${stop.state}`;
    
    // Ensure we display the actual stop name, not city name
    const name = stop.name && stop.name !== stop.city ? stop.name : `${stop.category} in ${stop.city}`;
    
    console.log(`🎨 [FIXED] Formatting stop for display:`, {
      originalName: stop.name,
      originalCity: stop.city,
      formattedName: name,
      category: stop.category,
      displayCategory: category,
      icon,
      location
    });
    
    return {
      name,
      location,
      category,
      icon
    };
  }

  /**
   * Get icon for category
   */
  private static getCategoryIcon(category: string): string {
    switch (category) {
      case 'attraction':
        return '🎯';
      case 'hidden_gem':
        return '💎';
      case 'drive_in':
        return '🎬';
      case 'waypoint':
      case 'route66_waypoint':
        return '📍';
      case 'museum':
        return '🏛️';
      case 'diner':
      case 'restaurant':
        return '🍽️';
      case 'gas_station':
        return '⛽';
      case 'motel':
      case 'hotel':
        return '🏨';
      default:
        return '📍';
    }
  }

  /**
   * Get display name for category
   */
  private static getCategoryDisplayName(category: string): string {
    switch (category) {
      case 'attraction':
        return 'Attraction';
      case 'hidden_gem':
        return 'Hidden Gem';
      case 'drive_in':
        return 'Drive-In Theater';
      case 'waypoint':
      case 'route66_waypoint':
        return 'Route 66 Waypoint';
      case 'museum':
        return 'Museum';
      case 'diner':
        return 'Classic Diner';
      case 'restaurant':
        return 'Restaurant';
      case 'gas_station':
        return 'Gas Station';
      case 'motel':
        return 'Motel';
      case 'hotel':
        return 'Hotel';
      default:
        return 'Point of Interest';
    }
  }
}
