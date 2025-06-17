
import { TripStop } from '../data/SupabaseDataService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { CityNameNormalizationService } from '../CityNameNormalizationService';

export class TripPlanValidator {
  /**
   * Enhanced validation with better city matching
   */
  static validateStops(
    startStop: TripStop | undefined,
    endStop: TripStop | undefined,
    startCityName: string,
    endCityName: string,
    allStops: TripStop[]
  ): { startStop: TripStop; endStop: TripStop } {
    
    // Enhanced start stop finding with multiple matching strategies
    if (!startStop) {
      console.log(`🔍 Enhanced search for start location: "${startCityName}"`);
      
      // Try different matching strategies
      startStop = this.findStopWithEnhancedMatching(startCityName, allStops);
      
      if (!startStop) {
        console.error(`❌ Could not find start location: "${startCityName}"`);
        this.logAvailableStopsForDebugging(allStops);
        
        throw new Error(`Start location "${startCityName}" not found in Route 66 stops. Available cities include: ${this.getAvailableCityNames(allStops).slice(0, 5).join(', ')}`);
      }
    }

    // Enhanced end stop finding with multiple matching strategies  
    if (!endStop) {
      console.log(`🔍 Enhanced search for end location: "${endCityName}"`);
      
      endStop = this.findStopWithEnhancedMatching(endCityName, allStops);
      
      if (!endStop) {
        console.error(`❌ Could not find end location: "${endCityName}"`);
        this.logAvailableStopsForDebugging(allStops);
        
        throw new Error(`End location "${endCityName}" not found in Route 66 stops. Available cities include: ${this.getAvailableCityNames(allStops).slice(0, 5).join(', ')}`);
      }
    }

    console.log(`✅ Validated stops: ${startStop.name} → ${endStop.name}`);
    return { startStop, endStop };
  }

  /**
   * Enhanced stop finding with multiple matching strategies
   */
  private static findStopWithEnhancedMatching(cityName: string, allStops: TripStop[]): TripStop | undefined {
    if (!cityName || !allStops?.length) return undefined;

    console.log(`🔍 Enhanced matching for: "${cityName}" among ${allStops.length} stops`);

    // Strategy 1: Exact match with display name
    for (const stop of allStops) {
      const displayName = CityDisplayService.getCityDisplayName(stop);
      if (displayName === cityName) {
        console.log(`✅ Strategy 1 - Exact display name match: ${displayName}`);
        return stop;
      }
    }

    // Strategy 2: Normalized matching
    const normalizedSearch = CityNameNormalizationService.normalizeSearchTerm(cityName);
    for (const stop of allStops) {
      const normalizedStop = CityNameNormalizationService.normalizeSearchTerm(CityDisplayService.getCityDisplayName(stop));
      if (normalizedStop === normalizedSearch) {
        console.log(`✅ Strategy 2 - Normalized match: ${normalizedStop}`);
        return stop;
      }
    }

    // Strategy 3: City name only match (ignoring state)
    const searchCityOnly = cityName.split(',')[0].trim().toLowerCase();
    for (const stop of allStops) {
      const stopCityOnly = (stop.name || stop.city || '').toLowerCase().trim();
      if (stopCityOnly === searchCityOnly) {
        console.log(`✅ Strategy 3 - City-only match: ${stopCityOnly}`);
        return stop;
      }
    }

    // Strategy 4: Partial city name match
    for (const stop of allStops) {
      const stopCity = (stop.name || stop.city || '').toLowerCase();
      if (stopCity.includes(searchCityOnly) || searchCityOnly.includes(stopCity)) {
        console.log(`✅ Strategy 4 - Partial match: ${stopCity}`);
        return stop;
      }
    }

    console.log(`❌ No match found for: "${cityName}"`);
    return undefined;
  }

  /**
   * Get available city names for error messages
   */
  private static getAvailableCityNames(allStops: TripStop[]): string[] {
    return [...new Set(allStops.map(stop => CityDisplayService.getCityDisplayName(stop)))].sort();
  }

  /**
   * Log available stops for debugging
   */
  private static logAvailableStopsForDebugging(allStops: TripStop[]): void {
    console.log('🏙️ Available stops for debugging:');
    allStops.forEach((stop, index) => {
      console.log(`  ${index + 1}. ${CityDisplayService.getCityDisplayName(stop)} (name: "${stop.name}", city: "${stop.city}", state: "${stop.state}")`);
    });
    
    const majorCities = allStops.filter(stop => 
      stop.name?.toLowerCase().includes('chicago') ||
      stop.name?.toLowerCase().includes('st. louis') ||
      stop.name?.toLowerCase().includes('oklahoma city') ||
      stop.name?.toLowerCase().includes('amarillo') ||
      stop.name?.toLowerCase().includes('albuquerque') ||
      stop.name?.toLowerCase().includes('flagstaff') ||
      stop.name?.toLowerCase().includes('santa monica')
    );
    
    console.log('🏛️ Major cities found:', majorCities.map(city => CityDisplayService.getCityDisplayName(city)));
  }
}
