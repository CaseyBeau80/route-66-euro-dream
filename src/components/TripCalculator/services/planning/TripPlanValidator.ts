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
      
      startStop = this.findStopWithEnhancedMatching(startCityName, allStops);
      
      if (!startStop) {
        console.error(`❌ Services Planning Could not find start location: "${startCityName}"`);
        this.logAvailableStopsForDebugging(allStops);
        
        throw new Error(`Start location "${startCityName}" not found in Route 66 stops. Available cities include: ${this.getAvailableCityNames(allStops).slice(0, 5).join(', ')}`);
      }
    }

    // Enhanced end stop finding
    if (!endStop) {
      console.log(`🔍 Services Planning Enhanced search for end location: "${endCityName}"`);
      
      endStop = this.findStopWithEnhancedMatching(endCityName, allStops);
      
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
   * Enhanced stop finding with multiple matching strategies
   */
  private static findStopWithEnhancedMatching(searchTerm: string, allStops: TripStop[]): TripStop | undefined {
    if (!searchTerm || !allStops?.length) return undefined;

    console.log(`🔍 Services Planning Enhanced matching for: "${searchTerm}" among ${allStops.length} stops`);

    // Strategy 1: Exact name match (highest priority)
    console.log(`🔍 Services Planning Strategy 1: Looking for exact name match with "${searchTerm}"`);
    
    const exactNameMatches = allStops.filter(stop => {
      const stopName = stop.name || '';
      const normalizedStopName = CityNameNormalizationService.normalizeSearchTerm(stopName);
      const normalizedSearch = CityNameNormalizationService.normalizeSearchTerm(searchTerm);
      
      console.log(`    Services Planning Checking exact: "${stopName}" normalized to "${normalizedStopName}" vs "${normalizedSearch}"`);
      
      const matches = normalizedStopName === normalizedSearch;
      console.log(`    Services Planning Exact match: ${matches}`);
      
      return matches;
    });

    if (exactNameMatches.length > 0) {
      console.log(`✅ Services Planning Strategy 1 - Exact name match: ${exactNameMatches[0].name}`);
      return exactNameMatches[0];
    }

    // Strategy 2: Parse city and state, then match
    const { city: searchCity, state: searchState } = this.parseCityState(searchTerm);
    console.log(`🔍 Services Planning Strategy 2: Parsed "${searchTerm}" to city="${searchCity}", state="${searchState}"`);

    if (searchState) {
      console.log(`🔍 Services Planning Strategy 2a: Looking for city+state match`);
      
      const cityStateMatches = allStops.filter(stop => {
        const stopCityName = stop.city_name || stop.city || '';
        const normalizedStopCity = CityNameNormalizationService.normalizeSearchTerm(stopCityName);
        const normalizedSearchCity = CityNameNormalizationService.normalizeSearchTerm(searchCity);
        const normalizedStopState = CityNameNormalizationService.normalizeSearchTerm(stop.state || '');
        const normalizedSearchState = CityNameNormalizationService.normalizeSearchTerm(searchState);
        
        console.log(`    Services Planning Checking city+state: "${stopCityName}" (${stop.state}) vs "${searchCity}" (${searchState})`);
        
        const cityMatch = normalizedStopCity === normalizedSearchCity;
        const stateMatch = normalizedStopState === normalizedSearchState;
        
        console.log(`    Services Planning City match: ${cityMatch}, State match: ${stateMatch}`);
        
        return cityMatch && stateMatch;
      });
      
      if (cityStateMatches.length > 0) {
        console.log(`✅ Services Planning Strategy 2a - City+state match: ${cityStateMatches[0].name}`);
        return cityStateMatches[0];
      }
    }

    // Strategy 3: City-only search
    console.log(`🔍 Services Planning Strategy 3: Looking for city-only match with "${searchCity}"`);
    
    const cityOnlyMatches = allStops.filter(stop => {
      const stopCityName = stop.city_name || stop.city || '';
      const normalizedStopCity = CityNameNormalizationService.normalizeSearchTerm(stopCityName);
      const normalizedSearchCity = CityNameNormalizationService.normalizeSearchTerm(searchCity);
      
      console.log(`    Services Planning Checking city-only: "${stopCityName}" normalized to "${normalizedStopCity}" vs "${normalizedSearchCity}"`);
      
      const matches = normalizedStopCity === normalizedSearchCity;
      console.log(`    Services Planning City-only match: ${matches}`);
      
      return matches;
    });

    if (cityOnlyMatches.length > 0) {
      console.log(`✅ Services Planning Strategy 3 - City-only match: ${cityOnlyMatches[0].name}`);
      return cityOnlyMatches[0];
    }

    // Strategy 4: Fuzzy matching as last resort
    console.log(`🔍 Services Planning Strategy 4: Attempting fuzzy matching for "${searchTerm}"`);
    
    for (const stop of allStops) {
      const displayName = CityDisplayService.getCityDisplayName(stop);
      const normalizedDisplay = CityNameNormalizationService.normalizeSearchTerm(displayName);
      const normalizedSearch = CityNameNormalizationService.normalizeSearchTerm(searchTerm);
      
      console.log(`    Services Planning Fuzzy check: "${displayName}" normalized to "${normalizedDisplay}" vs "${normalizedSearch}"`);
      
      if (normalizedDisplay.includes(normalizedSearch) || normalizedSearch.includes(normalizedDisplay)) {
        console.log(`✅ Services Planning Strategy 4 - Fuzzy match: ${displayName}`);
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
