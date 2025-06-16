
export class CityStateDisambiguationService {
  /**
   * Handle disambiguation for cities that exist in multiple states
   */
  static readonly AMBIGUOUS_CITIES = new Map([
    ['springfield', ['IL', 'MO']],
    ['kansas city', ['KS', 'MO']],
    ['st. joseph', ['MO', 'MI']],
    ['columbia', ['MO', 'SC']],
    ['lebanon', ['MO', 'TN', 'KS']],
    ['carthage', ['MO', 'TX']],
    ['clinton', ['MO', 'OK']],
    ['miami', ['OK', 'FL']],
    ['commerce', ['OK', 'TX']],
    ['atlanta', ['IL', 'GA']],
    ['lincoln', ['IL', 'NE']]
  ]);

  /**
   * Check if a city name is ambiguous (exists in multiple states)
   */
  static isAmbiguousCity(cityName: string): boolean {
    const normalized = this.normalizeCityName(cityName);
    return this.AMBIGUOUS_CITIES.has(normalized);
  }

  /**
   * Get all states where an ambiguous city exists
   */
  static getStatesForCity(cityName: string): string[] {
    const normalized = this.normalizeCityName(cityName);
    return this.AMBIGUOUS_CITIES.get(normalized) || [];
  }

  /**
   * Normalize city name for consistent matching
   */
  static normalizeCityName(cityName: string): string {
    return cityName.toLowerCase()
      .replace(/\bsaint\b/g, 'st.')
      .replace(/\bst\b/g, 'st.')
      .trim();
  }

  /**
   * Parse city and state from input string
   */
  static parseCityState(input: string): { city: string; state: string | null } {
    if (!input || typeof input !== 'string') {
      return { city: '', state: null };
    }

    const parts = input.split(',').map(part => part.trim());
    
    if (parts.length >= 2) {
      return {
        city: parts[0],
        state: parts[1].toUpperCase()
      };
    }

    return {
      city: parts[0],
      state: null
    };
  }

  /**
   * Validate city-state combination for Route 66
   */
  static validateRoute66CityState(cityName: string, stateName: string): boolean {
    const route66States = ['IL', 'MO', 'KS', 'OK', 'TX', 'NM', 'AZ', 'CA'];
    
    if (!route66States.includes(stateName.toUpperCase())) {
      return false;
    }

    const normalized = this.normalizeCityName(cityName);
    
    // Special validation for known ambiguous cities
    if (this.isAmbiguousCity(normalized)) {
      const validStates = this.getStatesForCity(normalized);
      return validStates.includes(stateName.toUpperCase());
    }

    return true;
  }

  /**
   * Get preferred disambiguation for Route 66 context
   */
  static getRoute66Preference(cityName: string): { city: string; state: string } | null {
    const normalized = this.normalizeCityName(cityName);
    
    // Route 66 specific preferences for ambiguous cities
    const route66Preferences = new Map([
      ['springfield', 'IL'], // Route 66 starts in Springfield, IL, but also goes through Springfield, MO
      ['kansas city', 'MO'], // Primary Route 66 Kansas City
      ['commerce', 'OK'], // Route 66 Commerce
      ['miami', 'OK'], // Route 66 Miami
      ['atlanta', 'IL'], // Route 66 Atlanta
      ['lincoln', 'IL'] // Route 66 Lincoln
    ]);

    const preferredState = route66Preferences.get(normalized);
    if (preferredState) {
      return { city: cityName, state: preferredState };
    }

    return null;
  }

  /**
   * Enhanced city matching with state disambiguation
   */
  static findBestMatch(searchTerm: string, availableCities: Array<{ name: string; city_name: string; state: string }>): Array<{ name: string; city_name: string; state: string }> {
    const { city: searchCity, state: searchState } = this.parseCityState(searchTerm);
    const normalizedSearchCity = this.normalizeCityName(searchCity);

    console.log(`🔍 DISAMBIGUATION: Searching for "${searchCity}" in state "${searchState || 'ANY'}"`);

    // If state is specified, prioritize exact state matches
    if (searchState) {
      const stateMatches = availableCities.filter(cityData => {
        const cityMatch = this.normalizeCityName(cityData.city_name) === normalizedSearchCity ||
                         this.normalizeCityName(cityData.name) === normalizedSearchCity;
        const stateMatch = cityData.state.toUpperCase() === searchState.toUpperCase();
        return cityMatch && stateMatch;
      });

      if (stateMatches.length > 0) {
        console.log(`✅ DISAMBIGUATION: Found ${stateMatches.length} exact state matches for ${searchCity}, ${searchState}`);
        return stateMatches;
      }
    }

    // If no state specified or no exact matches, find all city matches
    const cityMatches = availableCities.filter(cityData => {
      return this.normalizeCityName(cityData.city_name) === normalizedSearchCity ||
             this.normalizeCityName(cityData.name) === normalizedSearchCity;
    });

    if (cityMatches.length > 1 && this.isAmbiguousCity(normalizedSearchCity)) {
      console.log(`⚠️ DISAMBIGUATION: Found ${cityMatches.length} matches for ambiguous city "${searchCity}"`);
      console.log(`📍 DISAMBIGUATION: Available states: ${cityMatches.map(c => c.state).join(', ')}`);
      
      // Return all matches but log the ambiguity
      return cityMatches;
    }

    return cityMatches;
  }
}
