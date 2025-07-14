import { TripStop } from '../types/TripStop';

export class Route66CityFinderService {
  /**
   * Find destination city by name with EXACT city+state matching for "City, State" format
   */
  static findDestinationCity(destinationCities: TripStop[], cityName: string): TripStop | null {
    console.log(`🔍 [SPRINGFIELD FIX] Finding destination city for: "${cityName}"`);
    console.log(`🔍 [SPRINGFIELD FIX] Available destination cities:`, destinationCities.map(c => `${c.name}, ${c.state}`));
    
    const normalizedName = cityName.toLowerCase().trim();
    
    // CRITICAL FIX: Handle "City, State" format with EXACT matching
    if (normalizedName.includes(',')) {
      const [cityPart, statePart] = normalizedName.split(',').map(s => s.trim());
      console.log(`🔍 [SPRINGFIELD FIX] Exact matching for: "${cityPart}, ${statePart}"`);
      
      // Find EXACT match with city and state
      const exactMatch = destinationCities.find(city => {
        const cityNameLower = city.name.toLowerCase().trim();
        const cityStateLower = (city.state || '').toLowerCase().trim();
        
        const cityMatches = cityNameLower === cityPart;
        const stateMatches = cityStateLower === statePart;
        
        console.log(`🔍 [SPRINGFIELD FIX] Checking ${city.name}, ${city.state}: cityMatches=${cityMatches}, stateMatches=${stateMatches}`);
        
        return cityMatches && stateMatches;
      });
      
      if (exactMatch) {
        console.log(`✅ [SPRINGFIELD FIX] EXACT MATCH FOUND: ${exactMatch.name}, ${exactMatch.state}`);
        return exactMatch;
      } else {
        console.error(`❌ [SPRINGFIELD FIX] NO EXACT MATCH for "${cityPart}, ${statePart}"`);
        // Log all matches for debugging
        const cityOnlyMatches = destinationCities.filter(city => 
          city.name.toLowerCase().trim() === cityPart
        );
        console.log(`🔍 [SPRINGFIELD FIX] City-only matches found:`, cityOnlyMatches.map(c => `${c.name}, ${c.state}`));
        return null;
      }
    }
    
    // For non-comma input, try exact name match only
    const exactNameMatch = destinationCities.find(city => 
      city.name.toLowerCase().trim() === normalizedName
    );
    
    if (exactNameMatch) {
      console.log(`✅ [SPRINGFIELD FIX] Found exact name match: ${exactNameMatch.name}, ${exactNameMatch.state}`);
      return exactNameMatch;
    }
    
    // If no exact match, try partial match (fallback)
    const partialMatch = destinationCities.find(city => 
      city.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(city.name.toLowerCase())
    );
    
    if (partialMatch) {
      console.log(`⚠️ [SPRINGFIELD FIX] Found partial match: ${partialMatch.name}, ${partialMatch.state} for "${cityName}"`);
      return partialMatch;
    }
    
    console.error(`❌ [SPRINGFIELD FIX] No destination city found for "${cityName}"`);
    return null;
  }
}