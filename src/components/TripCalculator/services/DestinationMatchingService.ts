import { TripStop } from '../types/TripStop';

export interface MatchResult {
  stop: TripStop;
  confidence: number;
  matchType: 'exact' | 'city' | 'partial' | 'fuzzy' | 'alias';
}

export class DestinationMatchingService {
  // Common location aliases and variations
  private static locationAliases: Record<string, string[]> = {
    'joliet': ['joliet il', 'joliet illinois', 'chicago area'],
    'chicago': ['chi-town', 'windy city', 'joliet il', 'joliet illinois'],
    'kingman': ['kingman az', 'kingman arizona'],
    'los angeles': ['la', 'los angeles ca', 'los angeles california'],
    'oklahoma city': ['okc', 'oklahoma city ok'],
    'st louis': ['saint louis', 'st. louis', 'st louis mo'],
    'albuquerque': ['albuquerque nm', 'albuquerque new mexico'],
    'flagstaff': ['flagstaff az', 'flagstaff arizona']
  };

  /**
   * Find the best matching destination from available stops
   */
  static findBestMatch(searchLocation: string, stops: TripStop[]): MatchResult | null {
    if (!searchLocation || !stops.length) return null;

    const searchTerm = this.normalizeSearchTerm(searchLocation);
    const matches: MatchResult[] = [];

    console.log(`🎯 DESTINATION MATCHING: Searching for "${searchLocation}" (normalized: "${searchTerm}") in ${stops.length} stops`);

    // 1. Check aliases first (highest priority)
    for (const [canonical, aliases] of Object.entries(this.locationAliases)) {
      if (aliases.some(alias => this.normalizeSearchTerm(alias) === searchTerm) || 
          this.normalizeSearchTerm(canonical) === searchTerm) {
        
        // Find the canonical city in stops
        const canonicalStop = stops.find(stop =>
          this.normalizeSearchTerm(stop.name) === this.normalizeSearchTerm(canonical) ||
          this.normalizeSearchTerm(stop.city || '') === this.normalizeSearchTerm(canonical)
        );
        
        if (canonicalStop) {
          matches.push({
            stop: canonicalStop,
            confidence: 1.0,
            matchType: 'alias'
          });
          console.log(`✅ ALIAS MATCH: ${searchLocation} → ${canonicalStop.name}`);
        }
      }
    }

    // 2. Exact name match
    for (const stop of stops) {
      if (this.normalizeSearchTerm(stop.name) === searchTerm) {
        matches.push({
          stop,
          confidence: 1.0,
          matchType: 'exact'
        });
        console.log(`✅ EXACT NAME MATCH: ${stop.name}`);
      }
    }

    // 3. Exact city match
    for (const stop of stops) {
      if (stop.city && this.normalizeSearchTerm(stop.city) === searchTerm) {
        matches.push({
          stop,
          confidence: 0.95,
          matchType: 'city'
        });
        console.log(`✅ EXACT CITY MATCH: ${stop.city} (${stop.name})`);
      }
    }

    // 4. Enhanced city + state matching
    if (searchTerm.includes(',') || searchTerm.includes(' ')) {
      const parts = searchTerm.split(/[,\s]+/).filter(p => p.length > 0);
      const cityPart = parts[0];
      const statePart = parts[1];

      for (const stop of stops) {
        if (stop.city && stop.state) {
          const normalizedCity = this.normalizeSearchTerm(stop.city);
          const normalizedState = this.normalizeSearchTerm(stop.state);
          
          if (normalizedCity === cityPart && 
              (normalizedState === statePart || 
               normalizedState.startsWith(statePart) || 
               statePart.startsWith(normalizedState))) {
            matches.push({
              stop,
              confidence: 0.98,
              matchType: 'city'
            });
            console.log(`✅ CITY+STATE MATCH: ${stop.city}, ${stop.state} (${stop.name})`);
          }
        }
      }
    }

    // 5. Partial name match (but avoid overly broad matches)
    for (const stop of stops) {
      const normalizedName = this.normalizeSearchTerm(stop.name);
      if (normalizedName.includes(searchTerm) || searchTerm.includes(normalizedName)) {
        // Only add if not already matched and search term is specific enough
        if (!matches.some(m => m.stop.id === stop.id) && searchTerm.length >= 3) {
          matches.push({
            stop,
            confidence: 0.8,
            matchType: 'partial'
          });
          console.log(`✅ PARTIAL NAME MATCH: ${stop.name}`);
        }
      }
    }

    // 6. Partial city match (with length check to avoid overly broad matches)
    for (const stop of stops) {
      if (stop.city && searchTerm.length >= 3) {
        const normalizedCity = this.normalizeSearchTerm(stop.city);
        if (normalizedCity.includes(searchTerm) || searchTerm.includes(normalizedCity)) {
          // Only add if not already matched
          if (!matches.some(m => m.stop.id === stop.id)) {
            matches.push({
              stop,
              confidence: 0.7,
              matchType: 'partial'
            });
            console.log(`✅ PARTIAL CITY MATCH: ${stop.city} (${stop.name})`);
          }
        }
      }
    }

    // 7. Fuzzy matching for typos and variations (more conservative)
    for (const stop of stops) {
      // Only do fuzzy matching if no exact or partial matches found
      if (matches.length === 0) {
        const nameScore = this.calculateSimilarity(searchTerm, this.normalizeSearchTerm(stop.name));
        if (nameScore > 0.7) { // Higher threshold for name matching
          matches.push({
            stop,
            confidence: nameScore * 0.6,
            matchType: 'fuzzy'
          });
          console.log(`✅ FUZZY NAME MATCH: ${stop.name} (score: ${nameScore})`);
        }

        if (stop.city) {
          const cityScore = this.calculateSimilarity(searchTerm, this.normalizeSearchTerm(stop.city));
          if (cityScore > 0.7) { // Higher threshold for city matching
            matches.push({
              stop,
              confidence: cityScore * 0.5,
              matchType: 'fuzzy'
            });
            console.log(`✅ FUZZY CITY MATCH: ${stop.city} (${stop.name}) (score: ${cityScore})`);
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
        city: bestMatch.stop.city,
        state: bestMatch.stop.state,
        confidence: bestMatch.confidence,
        matchType: bestMatch.matchType
      });
    } else {
      console.warn(`❌ NO MATCH found for "${searchLocation}" in ${stops.length} stops`);
      console.log('🔍 Available stops for reference:', stops.slice(0, 10).map(s => `${s.name} (${s.city}, ${s.state})`));
    }

    return bestMatch || null;
  }

  /**
   * Get enhanced suggestions for failed matches
   */
  static getSuggestions(searchLocation: string, stops: TripStop[], limit = 5): string[] {
    const searchTerm = this.normalizeSearchTerm(searchLocation);
    const suggestions: Array<{ name: string; score: number }> = [];

    // Check if it might be a common alias
    for (const [canonical, aliases] of Object.entries(this.locationAliases)) {
      if (aliases.some(alias => this.normalizeSearchTerm(alias).includes(searchTerm) || 
                              searchTerm.includes(this.normalizeSearchTerm(alias)))) {
        
        const canonicalStop = stops.find(stop =>
          this.normalizeSearchTerm(stop.name) === this.normalizeSearchTerm(canonical) ||
          this.normalizeSearchTerm(stop.city || '') === this.normalizeSearchTerm(canonical)
        );
        
        if (canonicalStop) {
          suggestions.push({
            name: `${canonicalStop.name}, ${canonicalStop.state}`,
            score: 0.9
          });
        }
      }
    }

    for (const stop of stops) {
      const nameScore = this.calculateSimilarity(searchTerm, this.normalizeSearchTerm(stop.name));
      const cityScore = stop.city ? this.calculateSimilarity(searchTerm, this.normalizeSearchTerm(stop.city)) : 0;
      const maxScore = Math.max(nameScore, cityScore);

      if (maxScore > 0.3) {
        const displayName = stop.city && stop.state ? 
          `${stop.name}, ${stop.city}, ${stop.state}` : 
          stop.city ? `${stop.name}, ${stop.city}` : stop.name;
        suggestions.push({ name: displayName, score: maxScore });
      }
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.name);
  }

  /**
   * Normalize search term for better matching
   */
  private static normalizeSearchTerm(term: string): string {
    return term
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    // Initialize matrix
    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen;
  }

  /**
   * Remove duplicate matches (same stop with different match types)
   */
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
