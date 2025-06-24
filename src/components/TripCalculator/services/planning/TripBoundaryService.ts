
import { TripStop } from '../../types/TripStop';

export class TripBoundaryService {
  /**
   * Find start and end boundary stops with enhanced matching
   */
  static findBoundaryStops(
    allStops: TripStop[],
    startLocation: string,
    endLocation: string
  ): { startStop: TripStop; endStop: TripStop } {
    console.log(`🎯 Finding boundary stops: ${startLocation} → ${endLocation}`);
    
    const startStop = this.findLocationStop(allStops, startLocation);
    const endStop = this.findLocationStop(allStops, endLocation);
    
    if (!startStop) {
      console.error(`❌ CRITICAL: Start location "${startLocation}" not found`);
      console.log(`🔍 Available stop names:`, allStops.map(s => s.name));
      throw new Error(`Start location "${startLocation}" not found in available stops`);
    }
    
    if (!endStop) {
      console.error(`❌ CRITICAL: End location "${endLocation}" not found`);
      console.log(`🔍 Available stop names:`, allStops.map(s => s.name));
      throw new Error(`End location "${endLocation}" not found in available stops`);
    }
    
    console.log(`✅ Found boundary stops: ${startStop.name} → ${endStop.name}`);
    return { startStop, endStop };
  }

  /**
   * Enhanced location matching with flexible city name handling
   */
  private static findLocationStop(stops: TripStop[], locationName: string): TripStop | null {
    const normalizedLocation = locationName.toLowerCase().trim();
    
    console.log(`🔍 Searching for location: "${locationName}" (normalized: "${normalizedLocation}")`);
    
    // Method 1: Exact match
    let found = stops.find(stop => 
      stop.name.toLowerCase() === normalizedLocation
    );
    
    if (found) {
      console.log(`✅ Method 1 - Exact match: Found "${found.name}" for "${locationName}"`);
      return found;
    }
    
    // Method 2: Extract city name (remove state abbreviation)
    const cityOnly = this.extractCityName(locationName);
    if (cityOnly !== locationName) {
      found = stops.find(stop => 
        stop.name.toLowerCase() === cityOnly.toLowerCase() ||
        this.extractCityName(stop.name).toLowerCase() === cityOnly.toLowerCase()
      );
      
      if (found) {
        console.log(`✅ Method 2 - City name match: Found "${found.name}" for city "${cityOnly}"`);
        return found;
      }
    }
    
    // Method 3: Partial match (city contains search term or vice versa)
    found = stops.find(stop => {
      const stopNameLower = stop.name.toLowerCase();
      const stopCityOnly = this.extractCityName(stop.name).toLowerCase();
      
      return stopNameLower.includes(normalizedLocation) ||
             normalizedLocation.includes(stopNameLower) ||
             stopCityOnly.includes(cityOnly.toLowerCase()) ||
             cityOnly.toLowerCase().includes(stopCityOnly);
    });
    
    if (found) {
      console.log(`✅ Method 3 - Partial match: Found "${found.name}" for "${locationName}"`);
      return found;
    }
    
    // Method 4: Fuzzy match for common variations
    const variations = this.generateLocationVariations(locationName);
    for (const variation of variations) {
      found = stops.find(stop => 
        stop.name.toLowerCase().includes(variation.toLowerCase()) ||
        variation.toLowerCase().includes(stop.name.toLowerCase())
      );
      
      if (found) {
        console.log(`✅ Method 4 - Variation match: Found "${found.name}" for variation "${variation}"`);
        return found;
      }
    }
    
    console.warn(`⚠️ No match found for "${locationName}"`);
    console.log(`🔍 Available stop names:`, stops.map(s => s.name));
    return null;
  }

  /**
   * Extract city name from "City, State" format
   */
  private static extractCityName(locationName: string): string {
    // Handle formats like "Chicago, IL" -> "Chicago"
    const parts = locationName.split(',');
    return parts[0].trim();
  }

  /**
   * Generate common variations of a location name
   */
  private static generateLocationVariations(locationName: string): string[] {
    const variations: string[] = [];
    const cityName = this.extractCityName(locationName);
    
    // Add the city name without state
    if (cityName !== locationName) {
      variations.push(cityName);
    }
    
    // Add common abbreviations and variations
    const commonVariations: Record<string, string[]> = {
      'chicago': ['chi', 'windy city'],
      'santa monica': ['santa monica beach', 'sm'],
      'st. louis': ['saint louis', 'st louis'],
      'oklahoma city': ['okc', 'oklahoma'],
      'albuquerque': ['abq'],
      'los angeles': ['la', 'angeles'],
      'san antonio': ['sa'],
      'santa fe': ['sf']
    };
    
    const lowerCityName = cityName.toLowerCase();
    if (commonVariations[lowerCityName]) {
      variations.push(...commonVariations[lowerCityName]);
    }
    
    return variations;
  }

  /**
   * Validate that the stops are in correct sequence order
   */
  static validateBoundarySequence(startStop: TripStop, endStop: TripStop): boolean {
    // If stops have sequence_order, validate they're in correct order
    if (startStop.sequence_order !== undefined && endStop.sequence_order !== undefined) {
      const isValidSequence = startStop.sequence_order < endStop.sequence_order;
      
      if (!isValidSequence) {
        console.warn(`⚠️ Boundary sequence warning: ${startStop.name} (${startStop.sequence_order}) → ${endStop.name} (${endStop.sequence_order})`);
      }
      
      return isValidSequence;
    }
    
    // If no sequence order, assume valid
    return true;
  }
}
