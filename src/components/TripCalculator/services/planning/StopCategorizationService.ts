
import { TripStop } from '../data/SupabaseDataService';

export interface StopCategoryInfo {
  category: string;
  priority: number;
  displayName: string;
  icon: string;
  description: string;
}

export class StopCategorizationService {
  private static readonly CATEGORY_INFO: Record<string, StopCategoryInfo> = {
    destination_city: {
      category: 'destination_city',
      priority: 10,
      displayName: 'Destination City',
      icon: '🏙️',
      description: 'Major cities along Route 66'
    },
    attraction: {
      category: 'attraction',
      priority: 8,
      displayName: 'Attraction',
      icon: '🎯',
      description: 'Tourist attractions and landmarks'
    },
    hidden_gem: {
      category: 'hidden_gem',
      priority: 7,
      displayName: 'Hidden Gem',
      icon: '💎',
      description: 'Unique local discoveries'
    },
    route66_waypoint: {
      category: 'route66_waypoint',
      priority: 6,
      displayName: 'Route 66 Waypoint',
      icon: '🛣️',
      description: 'Historic Route 66 markers'
    },
    diner: {
      category: 'diner',
      priority: 5,
      displayName: 'Classic Diner',
      icon: '🍔',
      description: 'Authentic Route 66 diners'
    },
    motel: {
      category: 'motel',
      priority: 4,
      displayName: 'Historic Motel',
      icon: '🏨',
      description: 'Vintage roadside motels'
    }
  };

  /**
   * Get category information for a stop
   */
  static getCategoryInfo(category: string): StopCategoryInfo {
    return this.CATEGORY_INFO[category] || {
      category,
      priority: 3,
      displayName: category.replace('_', ' '),
      icon: '📍',
      description: 'Route 66 point of interest'
    };
  }

  /**
   * Categorize stops into attraction types for balanced selection
   */
  static categorizeStopsByType(stops: TripStop[]): {
    cultural: TripStop[];
    dining: TripStop[];
    lodging: TripStop[];
    roadside: TripStop[];
    historic: TripStop[];
  } {
    const cultural: TripStop[] = [];
    const dining: TripStop[] = [];
    const lodging: TripStop[] = [];
    const roadside: TripStop[] = [];
    const historic: TripStop[] = [];

    stops.forEach(stop => {
      // Categorize by name keywords and category
      const name = stop.name.toLowerCase();
      const description = (stop.description || '').toLowerCase();
      const combined = `${name} ${description}`;

      if (this.isDining(combined, stop.category)) {
        dining.push(stop);
      } else if (this.isLodging(combined, stop.category)) {
        lodging.push(stop);
      } else if (this.isHistoric(combined, stop.category)) {
        historic.push(stop);
      } else if (this.isCultural(combined, stop.category)) {
        cultural.push(stop);
      } else {
        roadside.push(stop); // Default category
      }
    });

    return { cultural, dining, lodging, roadside, historic };
  }

  /**
   * Check if stop is dining-related
   */
  private static isDining(text: string, category: string): boolean {
    const diningKeywords = ['diner', 'restaurant', 'cafe', 'drive-in', 'barbecue', 'bbq', 'steakhouse', 'burger'];
    return category === 'diner' || diningKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Check if stop is lodging-related
   */
  private static isLodging(text: string, category: string): boolean {
    const lodgingKeywords = ['motel', 'hotel', 'inn', 'lodge', 'motor court'];
    return category === 'motel' || lodgingKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Check if stop is historic
   */
  private static isHistoric(text: string, category: string): boolean {
    const historicKeywords = ['historic', 'museum', 'monument', 'memorial', 'heritage', 'vintage', 'classic', 'old'];
    return category === 'route66_waypoint' || historicKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Check if stop is cultural
   */
  private static isCultural(text: string, category: string): boolean {
    const culturalKeywords = ['art', 'gallery', 'theater', 'cultural', 'native', 'trading post', 'pueblo'];
    return culturalKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Get balanced selection from categorized stops
   */
  static getBalancedSelection(
    categorizedStops: any,
    maxStops: number
  ): TripStop[] {
    const selection: TripStop[] = [];
    const categories = Object.keys(categorizedStops);
    
    // Try to get at least one from each category if possible
    let remainingSlots = maxStops;
    
    // First pass: one from each category
    categories.forEach(category => {
      if (remainingSlots > 0 && categorizedStops[category].length > 0) {
        selection.push(categorizedStops[category][0]);
        remainingSlots--;
      }
    });
    
    // Second pass: fill remaining slots with highest priority stops
    const remainingStops = categories
      .flatMap(category => categorizedStops[category].slice(selection.includes(categorizedStops[category][0]) ? 1 : 0))
      .sort((a, b) => {
        const priorityA = this.getCategoryInfo(a.category).priority;
        const priorityB = this.getCategoryInfo(b.category).priority;
        return priorityB - priorityA;
      });
    
    for (let i = 0; i < Math.min(remainingSlots, remainingStops.length); i++) {
      selection.push(remainingStops[i]);
    }
    
    return selection;
  }
}
