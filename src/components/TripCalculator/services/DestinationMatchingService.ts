import { TripStop } from '../types/TripStop';

export interface MatchResult {
  stop: TripStop;
  confidence: number;
  matchType: 'exact' | 'city' | 'partial' | 'fuzzy' | 'alias';
}

export class DestinationMatchingService {
  // Enhanced location aliases with comprehensive Route 66 coverage
  private static locationAliases: Record<string, string[]> = {
    'joliet': ['joliet il', 'joliet illinois', 'chicago area', 'chicago suburbs'],
    'chicago': ['chi-town', 'windy city', 'joliet il', 'joliet illinois', 'chicago il'],
    'kingman': ['kingman az', 'kingman arizona', 'historic kingman'],
    'los angeles': ['la', 'los angeles ca', 'los angeles california', 'la ca'],
    'oklahoma city': ['okc', 'oklahoma city ok', 'okc ok'],
    'st louis': ['saint louis', 'st. louis', 'st louis mo', 'saint louis mo'],
    'albuquerque': ['albuquerque nm', 'albuquerque new mexico', 'abq'],
    'flagstaff': ['flagstaff az', 'flagstaff arizona', 'flag az'],
    'amarillo': ['amarillo tx', 'amarillo texas'],
    'tulsa': ['tulsa ok', 'tulsa oklahoma'],
    'springfield': ['springfield il', 'springfield mo', 'springfield illinois', 'springfield missouri'],
    // CRITICAL: Enhanced Needles matching with multiple variations
    'needles': ['needles ca', 'needles california', 'needles ca usa', 'historic needles'],
    'barstow': ['barstow ca', 'barstow california'],
    'winslow': ['winslow az', 'winslow arizona'],
    'holbrook': ['holbrook az', 'holbrook arizona'],
    'gallup': ['gallup nm', 'gallup new mexico'],
    'tucumcari': ['tucumcari nm', 'tucumcari new mexico'],
    'santa monica': ['santa monica ca', 'santa monica california'],
    'joplin': ['joplin mo', 'joplin missouri'],
    'elk city': ['elk city ok', 'elk city oklahoma'],
    'clinton': ['clinton ok', 'clinton oklahoma'],
    'weatherford': ['weatherford ok', 'weatherford oklahoma'],
    'el reno': ['el reno ok', 'el reno oklahoma'],
    'yukon': ['yukon ok', 'yukon oklahoma']
  };

  /**
   * Enhanced destination matching with comprehensive fallback strategies
   */
  static findBestMatch(searchLocation: string, stops: TripStop[]): MatchResult | null {
    if (!searchLocation || !stops.length) {
      console.log('❌ MATCH: Invalid input - no search location or stops');
      return null;
    }

    const searchTerm = this.normalizeSearchTerm(searchLocation);
    const matches: MatchResult[] = [];

    console.log(`🎯 ENHANCED MATCHING: Searching for "${searchLocation}" (normalized: "${searchTerm}") in ${stops.length} stops`);

    // CRITICAL DEBUG: Special logging for specific locations
    if (searchTerm.includes('joliet') || searchTerm.includes('needles')) {
      console.log(`🔍 SPECIAL DEBUG for ${searchTerm}: Full stops analysis`);
      const relatedStops = stops.filter(s => 
        (s.name && s.name.toLowerCase().includes(searchTerm)) || 
        (s.city && s.city.toLowerCase().includes(searchTerm)) ||
        (s.city_name && s.city_name.toLowerCase().includes(searchTerm))
      );
      console.log(`🔍 ${searchTerm.toUpperCase()}: Found related stops:`, relatedStops.map(s => ({
        id: s.id,
        name: s.name,
        city: s.city,
        city_name: s.city_name,
        state: s.state
      })));
    }

    // 1. Enhanced exact matching with multiple field checks
    for (const stop of stops) {
      // Check name field
      if (stop.name && this.normalizeSearchTerm(stop.name) === searchTerm) {
        matches.push({
          stop,
          confidence: 0.98,
          matchType: 'exact'
        });
        console.log(`✅ EXACT NAME MATCH: ${stop.name}`);
      }
      
      // Check city field
      if (stop.city && this.normalizeSearchTerm(stop.city) === searchTerm) {
        matches.push({
          stop,
          confidence: 0.95,
          matchType: 'city'
        });
        console.log(`✅ EXACT CITY MATCH: ${stop.city}, ${stop.state} (${stop.name})`);
      }

      // Check city_name field
      if (stop.city_name && this.normalizeSearchTerm(stop.city_name) === searchTerm) {
        matches.push({
          stop,
          confidence: 0.95,
          matchType: 'city'
        });
        console.log(`✅ EXACT CITY_NAME MATCH: ${stop.city_name}, ${stop.state} (${stop.name})`);
      }
    }

    // 2. Enhanced alias matching
    for (const [canonical, aliases] of Object.entries(this.locationAliases)) {
      const canonicalNormalized = this.normalizeSearchTerm(canonical);
      
      if (canonicalNormalized === searchTerm || 
          aliases.some(alias => this.normalizeSearchTerm(alias) === searchTerm)) {
        
        console.log(`🎯 ALIAS MATCH ATTEMPT: Looking for canonical "${canonical}" in stops`);
        
        // Try multiple matching strategies for the canonical city
        const potentialStops = stops.filter(stop => {
          const nameMatch = stop.name && (
            this.normalizeSearchTerm(stop.name).includes(canonicalNormalized) ||
            canonicalNormalized.includes(this.normalizeSearchTerm(stop.name))
          );
          
          const cityMatch = (stop.city || stop.city_name) && (
            this.normalizeSearchTerm(stop.city || stop.city_name || '').includes(canonicalNormalized) ||
            canonicalNormalized.includes(this.normalizeSearchTerm(stop.city || stop.city_name || ''))
          );
          
          return nameMatch || cityMatch;
        });
        
        console.log(`🎯 ALIAS SEARCH: Found ${potentialStops.length} potential stops for "${canonical}"`);
        
        if (potentialStops.length > 0) {
          const selectedStop = potentialStops[0];
          matches.push({
            stop: selectedStop,
            confidence: 0.9,
            matchType: 'alias'
          });
          console.log(`✅ ALIAS MATCH: ${searchLocation} → ${selectedStop.name} (${selectedStop.city || selectedStop.city_name}, ${selectedStop.state})`);
        }
      }
    }

    // 3. Enhanced partial matching with better logic
    if (matches.length === 0) {
      console.log('🔍 ENHANCED PARTIAL MATCHING: No exact matches found');
      
      for (const stop of stops) {
        const normalizedName = this.normalizeSearchTerm(stop.name);
        const normalizedCity = this.normalizeSearchTerm(stop.city || stop.city_name || '');
        
        if (searchTerm.length >= 3) {
          // More flexible partial matching
          const namePartialMatch = normalizedName.includes(searchTerm) || 
                                  searchTerm.includes(normalizedName) ||
                                  this.calculateSimilarity(normalizedName, searchTerm) > 0.7;
          
          const cityPartialMatch = normalizedCity.includes(searchTerm) || 
                                  searchTerm.includes(normalizedCity) ||
                                  this.calculateSimilarity(normalizedCity, searchTerm) > 0.7;
          
          if (namePartialMatch || cityPartialMatch) {
            const confidence = Math.max(
              this.calculateSimilarity(normalizedName, searchTerm),
              this.calculateSimilarity(normalizedCity, searchTerm)
            ) * 0.8;
            
            matches.push({
              stop,
              confidence: confidence,
              matchType: 'partial'
            });
            console.log(`✅ ENHANCED PARTIAL MATCH: ${stop.name} (${stop.city || stop.city_name}) - confidence: ${confidence.toFixed(2)}`);
          }
        }
      }
    }

    // Remove duplicates and sort by confidence
    const uniqueMatches = this.removeDuplicateMatches(matches);
    uniqueMatches.sort((a, b) => b.confidence - a.confidence);

    const bestMatch = uniqueMatches[0];
    
    if (bestMatch) {
      console.log(`🎯 BEST MATCH for "${searchLocation}":`, {
        found: bestMatch.stop.name,
        city: bestMatch.stop.city || bestMatch.stop.city_name,
        state: bestMatch.stop.state,
        confidence: bestMatch.confidence,
        matchType: bestMatch.matchType
      });
    } else {
      console.warn(`❌ NO MATCH found for "${searchLocation}" in ${stops.length} stops`);
      console.log('🔍 Available stop samples:', stops.slice(0, 10).map(s => ({
        name: s.name,
        city: s.city || s.city_name,
        state: s.state,
        id: s.id
      })));
    }

    return bestMatch || null;
  }

  /**
   * Enhanced suggestions with better scoring
   */
  static getSuggestions(searchLocation: string, stops: TripStop[], limit = 5): string[] {
    const searchTerm = this.normalizeSearchTerm(searchLocation);
    const suggestions: Array<{ name: string; score: number }> = [];

    // Check aliases first
    for (const [canonical, aliases] of Object.entries(this.locationAliases)) {
      if (aliases.some(alias => this.normalizeSearchTerm(alias).includes(searchTerm) || 
                              searchTerm.includes(this.normalizeSearchTerm(alias)))) {
        
        const canonicalStop = stops.find(stop =>
          this.normalizeSearchTerm(stop.name) === this.normalizeSearchTerm(canonical) ||
          this.normalizeSearchTerm(stop.city || stop.city_name || '') === this.normalizeSearchTerm(canonical)
        );
        
        if (canonicalStop) {
          suggestions.push({
            name: `${canonicalStop.name}, ${canonicalStop.state}`,
            score: 0.95
          });
        }
      }
    }

    // Add similarity-based suggestions
    for (const stop of stops) {
      const nameScore = this.calculateSimilarity(searchTerm, this.normalizeSearchTerm(stop.name));
      const cityScore = (stop.city || stop.city_name) ? 
        this.calculateSimilarity(searchTerm, this.normalizeSearchTerm(stop.city || stop.city_name || '')) : 0;
      const maxScore = Math.max(nameScore, cityScore);

      if (maxScore > 0.4) {
        const cityName = stop.city || stop.city_name;
        const displayName = cityName && stop.state ? 
          `${stop.name}, ${cityName}, ${stop.state}` : 
          cityName ? `${stop.name}, ${cityName}` : stop.name;
        suggestions.push({ name: displayName, score: maxScore });
      }
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.name);
  }

  private static getStateAbbreviation(stateName: string): string {
    const stateMap: Record<string, string> = {
      'illinois': 'IL',
      'missouri': 'MO', 
      'kansas': 'KS',
      'oklahoma': 'OK',
      'texas': 'TX',
      'new mexico': 'NM',
      'arizona': 'AZ',
      'california': 'CA'
    };
    return stateMap[stateName.toLowerCase()] || '';
  }

  private static normalizeSearchTerm(term: string): string {
    return term
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ');
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen;
  }

  private static removeDuplicateMatches(matches: MatchResult[]): MatchResult[] {
    const seen = new Set<string>();
    const unique: MatchResult[] = [];

    for (const match of matches) {
      const key = match.stop.id;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(match);
      }
    }

    return unique;
  }
}
