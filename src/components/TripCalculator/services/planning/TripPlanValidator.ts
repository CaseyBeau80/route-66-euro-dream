
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
    
    // SPECIAL DEBUG: Check specifically for Chicago
    console.log(`🔍 Services Planning CHICAGO DEBUG: Searching for "${startCityName}"`);
    const chicagoMatches = allStops.filter(stop => {
      const name = (stop.name || '').toLowerCase();
      const cityName = (stop.city_name || stop.city || '').toLowerCase();
      const searchTerm = startCityName.toLowerCase();
      
      console.log(`  Checking stop: name="${stop.name}", city_name="${stop.city_name}", city="${stop.city}", state="${stop.state}"`);
      console.log(`  Name includes chicago: ${name.includes('chicago')}`);
      console.log(`  City_name includes chicago: ${cityName.includes('chicago')}`);
      console.log(`  Search term: ${searchTerm}`);
      
      return name.includes('chicago') || cityName.includes('chicago') || searchTerm.includes('chicago');
    });
    console.log(`🔍 Services Planning CHICAGO DEBUG: Found ${chicagoMatches.length} potential Chicago matches:`, chicagoMatches);
    
    // Enhanced start stop finding with state disambiguation
    if (!startStop) {
      console.log(`🔍 Services Planning Enhanced search for start location: "${startCityName}"`);
      
      startStop = this.findStopWithStateDisambiguation(startCityName, allStops);
      
      if (!startStop) {
        console.error(`❌ Services Planning Could not find start location: "${startCityName}"`);
        this.logAvailableStopsForDebugging(allStops);
        
        throw new Error(`Start location "${startCityName}" not found in Route 66 stops. Available cities include: ${this.getAvailableCityNames(allStops).slice(0, 5).join(', ')}`);
      }
    }

    // Enhanced end stop finding with state disambiguation  
    if (!endStop) {
      console.log(`🔍 Services Planning Enhanced search for end location: "${endCityName}"`);
      
      endStop = this.findStopWithStateDisambiguation(endCityName, allStops);
      
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
   * Enhanced stop finding with state disambiguation for cities like Springfield
   */
  private static findStopWithStateDisambiguation(cityName: string, allStops: TripStop[]): TripStop | undefined {
    if (!cityName || !allStops?.length) return undefined;

    console.log(`🔍 Services Planning State disambiguation matching for: "${cityName}" among ${allStops.length} stops`);

    // Parse the input to separate city and state
    const { city: searchCity, state: searchState } = this.parseCityState(cityName);
    
    console.log(`🔍 Services Planning Parsed input: city="${searchCity}", state="${searchState}"`);

    // SPECIAL DEBUG for Chicago
    if (searchCity.toLowerCase().includes('chicago')) {
      console.log(`🔍 Services Planning CHICAGO SPECIAL DEBUG: Processing Chicago search`);
      console.log(`🔍 Services Planning Search city: "${searchCity}", Search state: "${searchState}"`);
      
      // Log every stop to see the data structure
      allStops.forEach((stop, index) => {
        if (stop.name && stop.name.toLowerCase().includes('chicago')) {
          console.log(`🔍 Services Planning CHICAGO FOUND in stops[${index}]:`, {
            id: stop.id,
            name: stop.name,
            city_name: stop.city_name,
            city: stop.city,
            state: stop.state,
            category: stop.category
          });
        }
      });
    }

    // Strategy 1: Exact match with both city and state (highest priority)
    if (searchState) {
      console.log(`🔍 Services Planning Strategy 1: Looking for exact match with city="${searchCity}" and state="${searchState}"`);
      
      const exactMatches = allStops.filter(stop => {
        // Try multiple fields for city name
        const stopCityName = stop.name || stop.city_name || stop.city || '';
        const normalizedStopCity = CityNameNormalizationService.normalizeSearchTerm(stopCityName);
        const normalizedSearchCity = CityNameNormalizationService.normalizeSearchTerm(searchCity);
        const normalizedStopState = CityNameNormalizationService.normalizeSearchTerm(stop.state || '');
        const normalizedSearchState = CityNameNormalizationService.normalizeSearchTerm(searchState);
        
        console.log(`    Services Planning Checking stop: "${stopCityName}" (${stop.state}) vs search: "${searchCity}" (${searchState})`);
        console.log(`    Services Planning Normalized: "${normalizedStopCity}" (${normalizedStopState}) vs "${normalizedSearchCity}" (${normalizedSearchState})`);
        
        const cityMatch = normalizedStopCity === normalizedSearchCity;
        const stateMatch = normalizedStopState === normalizedSearchState;
        
        console.log(`    Services Planning City match: ${cityMatch}, State match: ${stateMatch}`);
        
        return cityMatch && stateMatch;
      });
      
      if (exactMatches.length === 1) {
        console.log(`✅ Services Planning Strategy 1 - Exact city+state match: ${exactMatches[0].name}, ${exactMatches[0].state}`);
        return exactMatches[0];
      } else if (exactMatches.length > 1) {
        console.log(`⚠️ Services Planning Multiple exact matches found for ${cityName}:`, exactMatches.map(m => `${m.name}, ${m.state}`));
        return exactMatches[0];
      }
      
      console.log(`🔍 Services Planning Strategy 1 failed: No exact city+state match found`);
    }

    // Strategy 2: City-only search with disambiguation warnings
    console.log(`🔍 Services Planning Strategy 2: Looking for city-only match with "${searchCity}"`);
    
    const cityOnlyMatches = allStops.filter(stop => {
      // Try multiple fields for city name
      const stopCityName = stop.name || stop.city_name || stop.city || '';
      const normalizedStopCity = CityNameNormalizationService.normalizeSearchTerm(stopCityName);
      const normalizedSearchCity = CityNameNormalizationService.normalizeSearchTerm(searchCity);
      
      console.log(`    Services Planning Checking city-only: "${stopCityName}" normalized to "${normalizedStopCity}" vs "${normalizedSearchCity}"`);
      
      const matches = normalizedStopCity === normalizedSearchCity;
      console.log(`    Services Planning City-only match: ${matches}`);
      
      return matches;
    });

    if (cityOnlyMatches.length === 1) {
      console.log(`✅ Services Planning Strategy 2 - Single city match: ${cityOnlyMatches[0].name}, ${cityOnlyMatches[0].state}`);
      return cityOnlyMatches[0];
    } else if (cityOnlyMatches.length > 1) {
      console.log(`⚠️ Services Planning AMBIGUOUS CITY: Found ${cityOnlyMatches.length} cities named "${searchCity}"`);
      cityOnlyMatches.forEach(match => {
        console.log(`   - ${match.name}, ${match.state}`);
      });

      // If no state specified, try Route 66 preference
      if (!searchState) {
        const route66Preference = this.getRoute66Preference(searchCity);
        if (route66Preference) {
          const preferredMatch = cityOnlyMatches.find(match => 
            match.state.toUpperCase() === route66Preference.state.toUpperCase()
          );
          if (preferredMatch) {
            console.log(`✅ Services Planning Strategy 2b - Route 66 preference: ${preferredMatch.name}, ${preferredMatch.state}`);
            return preferredMatch;
          }
        }
      }

      console.log(`⚠️ Services Planning Using first match for ambiguous city: ${cityOnlyMatches[0].name}, ${cityOnlyMatches[0].state}`);
      return cityOnlyMatches[0];
    }

    console.log(`🔍 Services Planning Strategy 2 failed: No city-only match found`);

    // Strategy 3: Fuzzy matching as last resort
    console.log(`🔍 Services Planning Strategy 3: Attempting fuzzy matching for "${cityName}"`);
    
    for (const stop of allStops) {
      const displayName = CityDisplayService.getCityDisplayName(stop);
      const normalizedDisplay = CityNameNormalizationService.normalizeSearchTerm(displayName);
      const normalizedSearch = CityNameNormalizationService.normalizeSearchTerm(cityName);
      
      console.log(`    Services Planning Fuzzy check: "${displayName}" normalized to "${normalizedDisplay}" vs "${normalizedSearch}"`);
      
      if (normalizedDisplay.includes(normalizedSearch) || normalizedSearch.includes(normalizedDisplay)) {
        console.log(`✅ Services Planning Strategy 3 - Fuzzy match: ${displayName}`);
        return stop;
      }
    }

    console.log(`❌ Services Planning No match found for: "${cityName}"`);
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
