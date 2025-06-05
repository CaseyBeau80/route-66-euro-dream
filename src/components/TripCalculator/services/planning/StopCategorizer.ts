
import { TripStop } from '../data/SupabaseDataService';

export interface CategorizedStops {
  attractions: TripStop[];
  waypoints: TripStop[];
  hiddenGems: TripStop[];
  destinationCities: TripStop[];
}

export class StopCategorizer {
  /**
   * Categorize stops by their type and priority
   */
  static categorizeStops(stops: TripStop[]): CategorizedStops {
    const attractions: TripStop[] = [];
    const waypoints: TripStop[] = [];
    const hiddenGems: TripStop[] = [];
    const destinationCities: TripStop[] = [];

    stops.forEach(stop => {
      switch (stop.category) {
        case 'attraction':
          attractions.push(stop);
          break;
        case 'route66_waypoint':
          waypoints.push(stop);
          break;
        case 'hidden_gem':
          hiddenGems.push(stop);
          break;
        case 'destination_city':
          destinationCities.push(stop);
          break;
        default:
          // Default to waypoints for unknown categories
          waypoints.push(stop);
      }
    });

    return { attractions, waypoints, hiddenGems, destinationCities };
  }
}
