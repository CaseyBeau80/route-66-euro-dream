
import { TripStop } from '../data/SupabaseDataService';

export interface CategorizedStops {
  attractions: TripStop[];
  waypoints: TripStop[];
  destinationCities: TripStop[];
  hiddenGems: TripStop[];
}

export class StopCategorizer {
  /**
   * Categorize stops by their type
   */
  static categorizeStops(stops: TripStop[]): CategorizedStops {
    const categorized: CategorizedStops = {
      attractions: [],
      waypoints: [],
      destinationCities: [],
      hiddenGems: []
    };
    
    stops.forEach(stop => {
      switch (stop.category) {
        case 'attraction':
          categorized.attractions.push(stop);
          break;
        case 'route66_waypoint':
          categorized.waypoints.push(stop);
          break;
        case 'destination_city':
          categorized.destinationCities.push(stop);
          break;
        case 'hidden_gem':
          categorized.hiddenGems.push(stop);
          break;
        default:
          // Default to waypoint for unknown categories
          categorized.waypoints.push(stop);
      }
    });
    
    return categorized;
  }
}
