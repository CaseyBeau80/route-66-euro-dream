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

    // CRITICAL DEBUG: Special logging for Needles
    if (searchTerm.includes('needles')) {
      console.log('🔍 NEEDLES SPECIAL DEBUG: Full stops analysis');
      const needlesRelated = stops.filter(s => 
        (s.name && s.name.toLowerCase().includes('needles')) || 
        (s.city && s.city.toLowerCase().includes('needles')) ||
        (s.city_name && s.city_name.toLowerCase().includes('needles'))
      );
      console.log('🔍 NEEDLES: Found related stops:', needlesRelated.map(s => ({
        id: s.id,
        name: s.name,
        city: s.city,
        city_name: s.city_name,
        state: s.state
      })));
    }

    // 1. Try exact matching first
    for (const stop of stops) {
      // Exact name match
      if (stop.name && this.normalizeSearchTerm(stop.name) === searchTerm) {
        matches.push({
          stop,
          confidence: 0.98,
          matchType: 'exact'
        });
        console.log(`✅ EXACT NAME MATCH: ${stop.name}`);
      }
      
      // Exact city match (try both city and city_name fields)
      const cityToCheck = stop.city || stop.city_name;
      if (cityToCheck && this.normalizeSearchTerm(cityToCheck) === searchTerm) {
        matches.push({
          stop,
          confidence: 0.95,
          matchType: 'city'
        });
        console.log(`✅ EXACT CITY MATCH: ${cityToCheck}, ${stop.state} (${stop.name})`);
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
            this.normalizeSearchTerm(stop.name) === canonicalNormalized ||
            this.normalizeSearchTerm(stop.name).includes(canonicalNormalized) ||
            canonicalNormalized.includes(this.normalizeSearchTerm(stop.name))
          );
          
          const cityMatch = (stop.city || stop.city_name) && (
            this.normalizeSearchTerm(stop.city || stop.city_name || '') === canonicalNormalized ||
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

    // 3. Enhanced city + state parsing
    if (searchTerm.includes(',') || searchTerm.includes(' ')) {
      const parts = searchTerm.split(/[,\s]+/).filter(p => p.length > 0);
      if (parts.length >= 2) {
        const cityPart = parts[0];
        const statePart = parts[1];

        console.log(`🔍 PARSING: City="${cityPart}", State="${statePart}"`);

        for (const stop of stops) {
          if ((stop.city || stop.city_name) && stop.state) {
            const normalizedCity = this.normalizeSearchTerm(stop.city || stop.city_name || '');
            const normalizedState = this.normalizeSearchTerm(stop.state);
            const stateAbbr = this.getStateAbbreviation(stop.state);
            const normalizedStopName = this.normalizeSearchTerm(stop.name);
            
            const cityMatches = normalizedCity === cityPart || 
                               normalizedStopName === cityPart ||
                               normalizedCity.includes(cityPart) ||
                               cityPart.includes(normalizedCity);
                               
            const stateMatches = normalizedState === statePart || 
                                normalizedState.startsWith(statePart) || 
                                statePart.startsWith(normalizedState) ||
                                stateAbbr === statePart.toUpperCase();
            
            if (cityMatches && stateMatches) {
              matches.push({
                stop,
                confidence: 0.97,
                matchType: 'city'
              });
              console.log(`✅ ENHANCED CITY+STATE MATCH: ${stop.city || stop.city_name}, ${stop.state}`);
            }
          }
        }
      }
    }

    // 4. Aggressive partial matching if no matches found
    if (matches.length === 0) {
      console.log('🔍 AGGRESSIVE FALLBACK: No exact matches found, trying partial matching');
      
      for (const stop of stops) {
        const normalizedName = this.normalizeSearchTerm(stop.name);
        const normalizedCity = this.normalizeSearchTerm(stop.city || stop.city_name || '');
        
        if (searchTerm.length >= 3) {
          const nameIncludes = normalizedName.includes(searchTerm) || searchTerm.includes(normalizedName);
          const cityIncludes = normalizedCity.includes(searchTerm) || searchTerm.includes(normalizedCity);
          
          if (nameIncludes || cityIncludes) {
            matches.push({
              stop,
              confidence: 0.7,
              matchType: 'partial'
            });
            console.log(`✅ AGGRESSIVE PARTIAL MATCH: ${stop.name} (${stop.city || stop.city_name})`);
          }
        }
      }
    }

    // 5. Last resort: fuzzy matching
    if (matches.length === 0) {
      console.log('🔍 LAST RESORT: Trying fuzzy matching');
      
      for (const stop of stops) {
        const nameSimilarity = this.calculateSimilarity(searchTerm, this.normalizeSearchTerm(stop.name));
        const citySimilarity = (stop.city || stop.city_name) ? 
          this.calculateSimilarity(searchTerm, this.normalizeSearchTerm(stop.city || stop.city_name || '')) : 0;
        const maxSimilarity = Math.max(nameSimilarity, citySimilarity);
        
        if (maxSimilarity > 0.6) {
          matches.push({
            stop,
            confidence: maxSimilarity * 0.8,
            matchType: 'fuzzy'
          });
          console.log(`✅ FUZZY MATCH: ${stop.name} (similarity: ${maxSimilarity.toFixed(2)})`);
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
      
      // Special debug for Needles
      if (searchTerm.includes('needles')) {
        console.log('🚨 NEEDLES SPECIFIC DEBUG: No match found despite comprehensive search');
        console.log('🚨 This suggests Needles may not exist in the Route 66 stops data or has different naming');
        
        // Try to find any California stops for debugging
        const caStops = stops.filter(s => s.state && s.state.toLowerCase().includes('ca'));
        console.log('🔍 California stops available:', caStops.slice(0, 5).map(s => ({
          name: s.name,
          city: s.city || s.city_name,
          state: s.state
        })));
      }
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
