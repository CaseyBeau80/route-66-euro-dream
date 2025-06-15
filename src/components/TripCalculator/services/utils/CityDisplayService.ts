import { TripStop } from '../../types/TripStop';

export class CityDisplayService {
  /**
   * Get standardized city display string from a trip stop
   */
  static getCityDisplayName(stop: TripStop): string {
    // Use the actual city_name and state from the matched stop
    return `${stop.city_name}, ${stop.state}`;
  }

  /**
   * Get just the city name without state
   */
  static getCityNameOnly(stop: TripStop): string {
    return stop.city_name;
  }

  /**
   * Get just the state abbreviation
   */
  static getStateOnly(stop: TripStop): string {
    return stop.state;
  }

  /**
   * Create a trip title using actual stop information
   */
  static createTripTitle(startStop: TripStop, endStop: TripStop): string {
    const startCity = this.getCityDisplayName(startStop);
    const endCity = this.getCityDisplayName(endStop);
    return `Route 66 Trip: ${startCity} to ${endCity}`;
  }
}
