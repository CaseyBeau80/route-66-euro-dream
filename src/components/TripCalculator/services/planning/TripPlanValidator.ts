
import { TripStop } from '../data/SupabaseDataService';
import { CityDisplayService } from '../utils/CityDisplayService';

export class TripPlanValidator {
  /**
   * Validate start and end stops exist, provide helpful error messages
   */
  static validateStops(
    startStop: TripStop | undefined,
    endStop: TripStop | undefined,
    startCityName: string,
    endCityName: string,
    allStops: TripStop[]
  ): { startStop: TripStop; endStop: TripStop } {
    if (!startStop || !endStop) {
      // Enhanced error reporting with better suggestions
      const availableCities = [...new Set(allStops.map(stop => CityDisplayService.getCityDisplayName(stop)))].sort();
      const majorCities = availableCities.filter(city => 
        city.includes('Chicago') || 
        city.includes('St. Louis') || 
        city.includes('Springfield') || 
        city.includes('Tulsa') || 
        city.includes('Oklahoma City') || 
        city.includes('Amarillo') || 
        city.includes('Albuquerque') || 
        city.includes('Flagstaff') || 
        city.includes('Santa Monica')
      );
      
      console.log('📍 Major Route 66 cities available:', majorCities);
      console.log('📍 Total cities available:', availableCities.length);
      
      const missingCities = [];
      if (!startStop) missingCities.push(startCityName);
      if (!endStop) missingCities.push(endCityName);
      
      throw new Error(`Could not find stops for: ${missingCities.join(' and ')}. 

Available major Route 66 cities include: ${majorCities.slice(0, 8).join(', ')}.

Please use the exact format: "City Name, STATE" (e.g., "Springfield, IL" not "Springfield, MO" for Illinois).

Total cities available: ${availableCities.length}`);
    }

    return { startStop, endStop };
  }
}
