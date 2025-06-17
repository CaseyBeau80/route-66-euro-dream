import { TripStop } from '../data/SupabaseDataService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { CityNameNormalizationService } from '../CityNameNormalizationService';

export class TripPlanValidator {
  /**
   * Enhanced validation with proper city-state disambiguation
   */
  static validateStops(
    startStop: TripStop | undefined,
    endStop: TripStop | undefined,
    startCityName: string,
    endCityName: string,
    allStops: TripStop[]
  ): { startStop: TripStop; endStop: TripStop } {
    
    console.log(`🔍 Services Planning Enhanced validation with state disambiguation for: "${startCityName}" → "${endCityName}"`);
    console.log(`📊 Services Planning Available stops: ${allStops.length}`);
    
    // DEBUG: Log all available stops with their exact names
    console.log('🗂️ Services Planning DEBUG: All available stops:');
    allStops.forEach((stop, index) => {
      console.log(`  ${index + 1}. ID: "${stop.id}", Name: "${stop.name}", City: "${stop.city_name || stop.city}", State: "${stop.state}"`);
    });
    
    // Enhanced start stop finding
    if (!startStop) {
      console.log(`🔍 Services Planning Enhanced search for start location: "${startCityName}"`);
      
      startStop = this.findStopWithSimplifiedMatching(startCityName, allStops);
      
      if (!startStop) {
        console.error(`❌ Services Planning Could not find start location: "${startCityName}"`);
        this.logAvailableStopsForDebugging(allStops);
        
        throw new Error(`Start location "${startCityName}" not found in Route 66 stops. Available cities include: ${this.getAvailableCityNames(allStops).slice(0, 5).join(', ')}`);
      }
    }

    // Enhanced end stop finding
    if (!endStop) {
      console.log(`🔍 Services Planning Enhanced search for end location: "${endCityName}"`);
      
      endStop = this.findStopWithSimplifiedMatching(endCityName, allStops);
      
      if (!endStop) {
        console.error(`❌ Services Planning Could not find end location: "${endCityName}"`);
        this.logAvailableStopsForDebugging(allStops);
        
        throw new Error(`End location "${endCityName}" not found in Route 66 stops. Available cities include: ${this.getAvailableCityNames(allStops).slice(0, 5).join(', ')}`);
      }
    }

    if (startStop.id === endStop.id) {
      throw new Error('Start and end locations cannot be the same. Please select different cities for your Route 66 journey.');
    }

    console.log(`✅ Services Planning Validated stops: ${startStop.name} → ${endStop.name}`);
    return { startStop, endStop };
  }

  /**
   * Simplified stop finding with direct matching first
   */
  private static findStopWithSimplifiedMatching(searchTerm: string, allStops: TripStop[]): TripStop | undefined {
    if (!searchTerm || !allStops?.length) return undefined;

    console.log(`🔍 Services Planning Simplified matching for: "${searchTerm}" among ${allStops.length} stops`);

    // Strategy 1: Direct exact match (case-insensitive)
    console.log(`🔍 Services Planning Strategy 1: Direct exact match for "${searchTerm}"`);
    
    for (const stop of allStops) {
      const stopName = stop.name || '';
      console.log(`    Services Planning Checking direct match: "${stopName}" vs "${searchTerm}"`);
      
      if (stopName.toLowerCase().trim() === searchTerm.toLowerCase().trim()) {
        console.log(`✅ Services Planning Strategy 1 - Direct exact match: ${stopName}`);
        return stop;
      }
    }

    // Strategy 2: Check city_name field as well
    console.log(`🔍 Services Planning Strategy 2: City name field match for "${searchTerm}"`);
    
    for (const stop of allStops) {
      const cityName = stop.city_name || stop.city || '';
      const fullName = cityName && stop.state ? `${cityName}, ${stop.state}` : cityName;
      
      console.log(`    Services Planning Checking city field: "${fullName}" vs "${searchTerm}"`);
      
      if (fullName.toLowerCase().trim() === searchTerm.toLowerCase().trim()) {
        console.log(`✅ Services Planning Strategy 2 - City field match: ${fullName}`);
        return stop;
      }
    }

    // Strategy 3: Parse and match components
    const { city: searchCity, state: searchState } = this.parseCityState(searchTerm);
    console.log(`🔍 Services Planning Strategy 3: Component matching - city="${searchCity}", state="${searchState}"`);

    if (searchState) {
      for (const stop of allStops) {
        const stopCityName = stop.city_name || stop.city || stop.name || '';
        const stopState = stop.state || '';
        
        // Remove state from stop name if present
        const cleanStopCity = stopCityName.replace(/,\s*[A-Z]{2}$/, '').trim();
        
        console.log(`    Services Planning Component check: "${cleanStopCity}" (${stopState}) vs "${searchCity}" (${searchState})`);
        
        const cityMatch = cleanStopCity.toLowerCase() === searchCity.toLowerCase();
        const stateMatch = stopState.toLowerCase() === searchState.toLowerCase();
        
        if (cityMatch && stateMatch) {
          console.log(`✅ Services Planning Strategy 3 - Component match: ${cleanStopCity}, ${stopState}`);
          return stop;
        }
      }
    }

    // Strategy 4: Fuzzy matching as last resort
    console.log(`🔍 Services Planning Strategy 4: Fuzzy matching for "${searchTerm}"`);
    
    const searchLower = searchTerm.toLowerCase().trim();
    for (const stop of allStops) {
      const stopName = (stop.name || '').toLowerCase().trim();
      const cityName = (stop.city_name || stop.city || '').toLowerCase().trim();
      
      if (stopName.includes(searchLower) || searchLower.includes(stopName) ||
          cityName.includes(searchLower) || searchLower.includes(cityName)) {
        console.log(`✅ Services Planning Strategy 4 - Fuzzy match: ${stop.name}`);
        return stop;
      }
    }

    console.log(`❌ Services Planning No match found for: "${searchTerm}"`);
    return undefined;
  }

  /**
   * Parse city and state from input string
   */
  private static parseCityState(input: string): { city: string; state: string } {
    if (!input) return { city: '', state: '' };
    
    const parts = input.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      return {
        city: parts[0],
        state: parts[1]
      };
    }
    
    return {
      city: input.trim(),
      state: ''
    };
  }

  /**
   * Get Route 66 preference for ambiguous cities
   */
  private static getRoute66Preference(cityName: string): { state: string } | null {
    const preferences: Record<string, string> = {
      'springfield': 'IL', // Route 66 historically starts in Springfield, IL
      'oklahoma city': 'OK',
      'amarillo': 'TX',
      'albuquerque': 'NM',
      'flagstaff': 'AZ'
    };
    
    const normalizedCity = cityName.toLowerCase().trim();
    const preferredState = preferences[normalizedCity];
    
    return preferredState ? { state: preferredState } : null;
  }

  /**
   * Get available city names for error messages (with state disambiguation)
   */
  private static getAvailableCityNames(allStops: TripStop[]): string[] {
    return [...new Set(allStops.map(stop => CityDisplayService.getCityDisplayName(stop)))].sort();
  }

  /**
   * Log available stops for debugging with state information
   */
  private static logAvailableStopsForDebugging(allStops: TripStop[]): void {
    console.log('🏙️ Services Planning Available stops with state disambiguation:');
    allStops.forEach((stop, index) => {
      console.log(`  ${index + 1}. ${stop.name}, ${stop.state} (city_name: "${stop.city_name || stop.city}")`);
    });
    
    // Group cities by name to show ambiguous cities
    const cityGroups = new Map<string, TripStop[]>();
    allStops.forEach(stop => {
      const cityName = stop.name || stop.city_name || stop.city || 'Unknown';
      const normalizedName = CityNameNormalizationService.normalizeSearchTerm(cityName);
      if (!cityGroups.has(normalizedName)) {
        cityGroups.set(normalizedName, []);
      }
      cityGroups.get(normalizedName)!.push(stop);
    });

    console.log('🏛️ Services Planning Cities with multiple state instances:');
    cityGroups.forEach((stops, cityName) => {
      if (stops.length > 1) {
        console.log(`   ${cityName}: ${stops.map(s => s.state).join(', ')}`);
      }
    });
  }
}
