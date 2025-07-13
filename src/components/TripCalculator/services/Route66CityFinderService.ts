import { TripStop } from '../types/TripStop';

export class Route66CityFinderService {
  /**
   * Find destination city by name (case-insensitive)
   */
  static findDestinationCity(destinationCities: TripStop[], cityName: string): TripStop | null {
    const normalizedName = cityName.toLowerCase().trim();
    
    // Try exact match first
    let found = destinationCities.find(city => 
      city.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(city.name.toLowerCase())
    );
    
    if (!found) {
      // Try partial match
      found = destinationCities.find(city => {
        const cityNameLower = city.name.toLowerCase();
        return cityNameLower.includes(normalizedName) || normalizedName.includes(cityNameLower);
      });
    }
    
    if (found) {
      console.log(`✅ STRICT: Found destination city: ${found.name} for "${cityName}"`);
    } else {
      console.warn(`⚠️ STRICT: No destination city found for "${cityName}"`);
    }
    
    return found || null;
  }
}