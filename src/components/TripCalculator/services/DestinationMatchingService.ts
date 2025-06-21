import { TripStop } from '../types/TripStop';

export interface MatchResult {
  stop: TripStop;
  confidence: number;
  matchType: 'exact' | 'city' | 'partial' | 'fuzzy' | 'alias';
}

export class DestinationMatchingService {
  // FIXED: Enhanced location aliases with comprehensive Route 66 coverage
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
    // CRITICAL FIX: Add missing Route 66 cities
    'needles': ['needles ca', 'needles california'],
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
    'yukon': ['yukon ok', 'yukon oklahoma'],
    'bethany': ['bethany ok', 'bethany oklahoma'],
    'edmond': ['edmond ok', 'edmond oklahoma'],
    'arcadia': ['arcadia ok', 'arcadia oklahoma'],
    'chandler': ['chandler ok', 'chandler oklahoma'],
    'stroud': ['stroud ok', 'stroud oklahoma'],
    'sapulpa': ['sapulpa ok', 'sapulpa oklahoma'],
    'calumet': ['calumet ok', 'calumet oklahoma'],
    'geary': ['geary ok', 'geary oklahoma'],
    'hydro': ['hydro ok', 'hydro oklahoma'],
    'canute': ['canute ok', 'canute oklahoma'],
    'sayre': ['sayre ok', 'sayre oklahoma'],
    'erick': ['erick ok', 'erick oklahoma'],
    'shamrock': ['shamrock tx', 'shamrock texas'],
    'mclean': ['mclean tx', 'mclean texas'],
    'groom': ['groom tx', 'groom texas'],
    'conway': ['conway tx', 'conway texas'],
    'vega': ['vega tx', 'vega texas'],
    'adrian': ['adrian tx', 'adrian texas'],
    'santa rosa': ['santa rosa nm', 'santa rosa new mexico'],
    'moriarty': ['moriarty nm', 'moriarty new mexico'],
    'tijeras': ['tijeras nm', 'tijeras new mexico'],
    'grants': ['grants nm', 'grants new mexico'],
    'thoreau': ['thoreau nm', 'thoreau new mexico'],
    'williams': ['williams az', 'williams arizona'],
    'ash fork': ['ash fork az', 'ash fork arizona'],
    'seligman': ['seligman az', 'seligman arizona'],
    'peach springs': ['peach springs az', 'peach springs arizona'],
    'hackberry': ['hackberry az', 'hackberry arizona'],
    'oatman': ['oatman az', 'oatman arizona'],
    'topock': ['topock az', 'topock arizona'],
    'amboy': ['amboy ca', 'amboy california'],
    'bagdad': ['bagdad ca', 'bagdad california'],
    'newberry springs': ['newberry springs ca', 'newberry springs california'],
    'daggett': ['daggett ca', 'daggett california'],
    'victorville': ['victorville ca', 'victorville california'],
    'san bernardino': ['san bernardino ca', 'san bernardino california'],
    'rialto': ['rialto ca', 'rialto california'],
    'fontana': ['fontana ca', 'fontana california'],
    'rancho cucamonga': ['rancho cucamonga ca', 'rancho cucamonga california'],
    'upland': ['upland ca', 'upland california'],
    'claremont': ['claremont ca', 'claremont california'],
    'la verne': ['la verne ca', 'la verne california'],
    'san dimas': ['san dimas ca', 'san dimas california'],
    'glendora': ['glendora ca', 'glendora california'],
    'azusa': ['azusa ca', 'azusa california'],
    'duarte': ['duarte ca', 'duarte california'],
    'monrovia': ['monrovia ca', 'monrovia california'],
    'pasadena': ['pasadena ca', 'pasadena california']
  };

  /**
   * FIXED: Enhanced destination matching with better confidence scoring
   */
  static findBestMatch(searchLocation: string, stops: TripStop[]): MatchResult | null {
    if (!searchLocation || !stops.length) return null;

    const searchTerm = this.normalizeSearchTerm(searchLocation);
    const matches: MatchResult[] = [];

    console.log(`🎯 ENHANCED MATCHING: Searching for "${searchLocation}" (normalized: "${searchTerm}") in ${stops.length} stops`);

    // 1. CRITICAL FIX: Enhanced alias matching with comprehensive coverage
    for (const [canonical, aliases] of Object.entries(this.locationAliases)) {
      const canonicalNormalized = this.normalizeSearchTerm(canonical);
      
      if (canonicalNormalized === searchTerm || 
          aliases.some(alias => this.normalizeSearchTerm(alias) === searchTerm)) {
        
        // Find the canonical city in stops with better matching
        const canonicalStop = stops.find(stop =>
          this.normalizeSearchTerm(stop.name) === canonicalNormalized ||
          this.normalizeSearchTerm(stop.city || '') === canonicalNormalized ||
          this.normalizeSearchTerm(stop.name).includes(canonicalNormalized) ||
          this.normalizeSearchTerm(stop.city || '').includes(canonicalNormalized) ||
          aliases.some(alias => {
            const aliasNorm = this.normalizeSearchTerm(alias);
            return this.normalizeSearchTerm(stop.name).includes(aliasNorm) ||
                   this.normalizeSearchTerm(stop.city || '').includes(aliasNorm);
          })
        );
        
        if (canonicalStop) {
          matches.push({
            stop: canonicalStop,
            confidence: 1.0,
            matchType: 'alias'
          });
          console.log(`✅ COMPREHENSIVE ALIAS MATCH: ${searchLocation} → ${canonicalStop.name} (${canonicalStop.city})`);
        }
      }
    }

    // 2. Exact name match (high confidence)
    for (const stop of stops) {
      if (this.normalizeSearchTerm(stop.name) === searchTerm) {
        matches.push({
          stop,
          confidence: 0.98,
          matchType: 'exact'
        });
        console.log(`✅ EXACT NAME MATCH: ${stop.name}`);
      }
    }

    // 3. FIXED: Enhanced city matching with state awareness
    for (const stop of stops) {
      if (stop.city && this.normalizeSearchTerm(stop.city) === searchTerm) {
        matches.push({
          stop,
          confidence: 0.95,
          matchType: 'city'
        });
        console.log(`✅ EXACT CITY MATCH: ${stop.city}, ${stop.state} (${stop.name})`);
      }
    }

    // 4. CRITICAL FIX: Enhanced city + state parsing with better normalization
    if (searchTerm.includes(',') || searchTerm.includes(' ')) {
      const parts = searchTerm.split(/[,\s]+/).filter(p => p.length > 0);
      if (parts.length >= 2) {
        const cityPart = parts[0];
        const statePart = parts[1];

        for (const stop of stops) {
          if (stop.city && stop.state) {
            const normalizedCity = this.normalizeSearchTerm(stop.city);
            const normalizedState = this.normalizeSearchTerm(stop.state);
            const stateAbbr = this.getStateAbbreviation(stop.state);
            
            // CRITICAL: Also check stop.name for city matches
            const normalizedStopName = this.normalizeSearchTerm(stop.name);
            
            if ((normalizedCity === cityPart || normalizedStopName === cityPart) && 
                (normalizedState === statePart || 
                 normalizedState.startsWith(statePart) || 
                 statePart.startsWith(normalizedState) ||
                 stateAbbr === statePart.toUpperCase())) {
              matches.push({
                stop,
                confidence: 0.97,
                matchType: 'city'
              });
              console.log(`✅ ENHANCED CITY+STATE MATCH: ${stop.city || stop.name}, ${stop.state}`);
            }
          }
        }
      }
    }

    // 5. FIXED: More conservative partial matching with name inclusion
    for (const stop of stops) {
      const normalizedName = this.normalizeSearchTerm(stop.name);
      const normalizedCity = this.normalizeSearchTerm(stop.city || '');
      
      if (searchTerm.length >= 4 && // Longer minimum length
          (normalizedName.includes(searchTerm) || searchTerm.includes(normalizedName) ||
           normalizedCity.includes(searchTerm) || searchTerm.includes(normalizedCity))) {
        if (!matches.some(m => m.stop.id === stop.id)) {
          matches.push({
            stop,
            confidence: 0.75,
            matchType: 'partial'
          });
          console.log(`✅ CONSERVATIVE PARTIAL MATCH: ${stop.name} (${stop.city})`);
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
      console.log('🔍 Top available stops:', stops.slice(0, 10).map(s => `${s.name} (${s.city}, ${s.state})`));
    }

    return bestMatch || null;
  }

  /**
   * Enhanced suggestions with better scoring
   */
  static getSuggestions(searchLocation: string, stops: TripStop[], limit = 5): string[] {
    const searchTerm = this.normalizeSearchTerm(searchLocation);
    const suggestions: Array<{ name: string; score: number }> = [];

    // Check aliases first (highest priority)
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
            score: 0.95
          });
        }
      }
    }

    // Add similarity-based suggestions
    for (const stop of stops) {
      const nameScore = this.calculateSimilarity(searchTerm, this.normalizeSearchTerm(stop.name));
      const cityScore = stop.city ? this.calculateSimilarity(searchTerm, this.normalizeSearchTerm(stop.city)) : 0;
      const maxScore = Math.max(nameScore, cityScore);

      if (maxScore > 0.4) { // Higher threshold for better suggestions
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
   * Better state abbreviation handling
   */
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

  /**
   * Normalize search term for better matching
   */
  private static normalizeSearchTerm(term: string): string {
    return term
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ');
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
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
