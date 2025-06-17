
export class CityDisplayService {
  /**
   * Get display name for a city from TripStop data
   */
  static getCityDisplayName(stop: any): string {
    if (!stop) return '';
    
    // Prioritize city_name, then city, then name
    const cityName = stop.city_name || stop.city || stop.name || '';
    const state = stop.state || '';
    
    if (cityName && state) {
      return `${cityName}, ${state}`;
    }
    
    return cityName;
  }

  /**
   * Parse city and state from user input
   */
  static parseCityStateInput(input: string): { city: string; state: string } {
    if (!input) return { city: '', state: '' };
    
    // Handle "City, State" format
    if (input.includes(',')) {
      const parts = input.split(',').map(part => part.trim());
      return {
        city: parts[0] || '',
        state: parts[1] || ''
      };
    }
    
    return { city: input.trim(), state: '' };
  }

  /**
   * Enhanced city matching with flexible comparison
   */
  static findCityInStops(searchTerm: string, allStops: any[]): any | undefined {
    if (!searchTerm || !allStops?.length) return undefined;

    console.log(`🔍 Enhanced search for "${searchTerm}" among ${allStops.length} stops`);

    // Parse the search term
    const { city: searchCity, state: searchState } = this.parseCityStateInput(searchTerm);
    
    console.log(`🔍 Parsed search: city="${searchCity}", state="${searchState}"`);

    // Strategy 1: Exact match with display name
    for (const stop of allStops) {
      const displayName = this.getCityDisplayName(stop);
      if (displayName.toLowerCase() === searchTerm.toLowerCase()) {
        console.log(`✅ Exact display name match: ${displayName}`);
        return stop;
      }
    }

    // Strategy 2: Match city and state separately
    if (searchState) {
      for (const stop of allStops) {
        const stopCity = (stop.city_name || stop.city || stop.name || '').toLowerCase();
        const stopState = (stop.state || '').toLowerCase();
        
        // Clean up city names (remove state suffixes)
        const cleanStopCity = stopCity.replace(/,\s*[a-z]{2}$/, '').trim();
        const cleanSearchCity = searchCity.toLowerCase().trim();
        
        const cityMatch = cleanStopCity === cleanSearchCity;
        const stateMatch = stopState === searchState.toLowerCase();
        
        if (cityMatch && stateMatch) {
          console.log(`✅ Component match: ${cleanStopCity}, ${stopState}`);
          return stop;
        }
      }
    }

    // Strategy 3: Flexible city name matching (without state requirement)
    const cleanSearchCity = searchCity.toLowerCase().trim();
    for (const stop of allStops) {
      const stopCity = (stop.city_name || stop.city || stop.name || '').toLowerCase();
      const cleanStopCity = stopCity.replace(/,\s*[a-z]{2}$/, '').trim();
      
      // Try exact match
      if (cleanStopCity === cleanSearchCity) {
        console.log(`✅ Flexible city match: ${cleanStopCity} (${stop.state})`);
        return stop;
      }
      
      // Try partial match for common variations
      if (cleanStopCity.includes(cleanSearchCity) || cleanSearchCity.includes(cleanStopCity)) {
        console.log(`✅ Partial city match: ${cleanStopCity} (${stop.state})`);
        return stop;
      }
    }

    // Strategy 4: Log available cities for debugging
    console.log(`❌ No match found for: "${searchTerm}"`);
    console.log(`📋 Available cities:`, allStops.slice(0, 10).map(stop => ({
      name: stop.name,
      city_name: stop.city_name,
      city: stop.city,
      state: stop.state,
      display: this.getCityDisplayName(stop)
    })));

    return undefined;
  }
}
