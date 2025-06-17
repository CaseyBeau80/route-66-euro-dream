import { toast } from '@/hooks/use-toast';
import { EnhancedSupabaseDataService } from '../services/data/EnhancedSupabaseDataService';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { CityDisplayService } from '../services/utils/CityDisplayService';
import { CityNameNormalizationService } from '../services/CityNameNormalizationService';
import { TripStop } from '../types/TripStop';

interface ValidationResult {
  startStop: TripStop;
  endStop: TripStop;
}

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
  ): ValidationResult {
    
    console.log(`🔍 Enhanced validation with state disambiguation for: "${startCityName}" → "${endCityName}"`);
    console.log(`📊 Available stops: ${allStops.length}`);
    
    // DEBUG: Log all available stops with their exact names
    console.log('🗂️ DEBUG: All available stops:');
    allStops.forEach((stop, index) => {
      console.log(`  ${index + 1}. ID: "${stop.id}", Name: "${stop.name}", City: "${stop.city_name || stop.city}", State: "${stop.state}"`);
    });
    
    // Enhanced start stop finding with state disambiguation
    if (!startStop) {
      console.log(`🔍 Enhanced search for start location: "${startCityName}"`);
      
      startStop = this.findStopWithStateDisambiguation(startCityName, allStops);
      
      if (!startStop) {
        console.error(`❌ Could not find start location: "${startCityName}"`);
        this.logAvailableStopsForDebugging(allStops);
        
        // Try a more aggressive search to see what might match
        console.log('🔍 DEBUG: Attempting aggressive search for Chicago...');
        const chicagoMatches = allStops.filter(stop => {
          const name = (stop.name || '').toLowerCase();
          const cityName = (stop.city_name || stop.city || '').toLowerCase();
          return name.includes('chicago') || cityName.includes('chicago');
        });
        console.log('🔍 DEBUG: Chicago matches found:', chicagoMatches);
        
        throw new Error(`Start location "${startCityName}" not found in Route 66 stops. Available cities include: ${this.getAvailableCityNames(allStops).slice(0, 5).join(', ')}`);
      }
    }

    // Enhanced end stop finding with state disambiguation  
    if (!endStop) {
      console.log(`🔍 Enhanced search for end location: "${endCityName}"`);
      
      endStop = this.findStopWithStateDisambiguation(endCityName, allStops);
      
      if (!endStop) {
        console.error(`❌ Could not find end location: "${endCityName}"`);
        this.logAvailableStopsForDebugging(allStops);
        
        throw new Error(`End location "${endCityName}" not found in Route 66 stops. Available cities include: ${this.getAvailableCityNames(allStops).slice(0, 5).join(', ')}`);
      }
    }

    if (startStop.id === endStop.id) {
      throw new Error('Start and end locations cannot be the same. Please select different cities for your Route 66 journey.');
    }

    // Warn about data source if using fallback
    if (EnhancedSupabaseDataService.isUsingFallback()) {
      const dataSourceInfo = EnhancedSupabaseDataService.getDataSourceInfo();
      console.warn(`⚠️ Validation: Using fallback data (${dataSourceInfo?.citiesAvailable} cities). Reason: ${dataSourceInfo?.fallbackReason}`);
      
      // Show toast notification about data limitations
      toast({
        title: "Limited Data Source",
        description: `Currently using offline data (${dataSourceInfo?.citiesAvailable} cities available). Some destinations may not be available.`,
        variant: "default"
      });
    }

    console.log(`✅ Validated stops: ${startStop.name} → ${endStop.name}`);
    return { startStop, endStop };
  }

  /**
   * Enhanced stop finding with state disambiguation for cities like Springfield
   */
  private static findStopWithStateDisambiguation(cityName: string, allStops: TripStop[]): TripStop | undefined {
    if (!cityName || !allStops?.length) return undefined;

    console.log(`🔍 State disambiguation matching for: "${cityName}" among ${allStops.length} stops`);

    // Parse the input to separate city and state
    const { city: searchCity, state: searchState } = this.parseCityState(cityName);
    
    console.log(`🔍 Parsed input: city="${searchCity}", state="${searchState}"`);

    // Strategy 1: Exact match with both city and state (highest priority)
    if (searchState) {
      console.log(`🔍 Strategy 1: Looking for exact match with city="${searchCity}" and state="${searchState}"`);
      
      const exactMatches = allStops.filter(stop => {
        const normalizedStopCity = CityNameNormalizationService.normalizeSearchTerm(stop.name || stop.city_name || '');
        const normalizedSearchCity = CityNameNormalizationService.normalizeSearchTerm(searchCity);
        const normalizedStopState = CityNameNormalizationService.normalizeSearchTerm(stop.state || '');
        const normalizedSearchState = CityNameNormalizationService.normalizeSearchTerm(searchState);
        
        console.log(`    Checking stop: "${stop.name}" (${stop.state}) vs search: "${searchCity}" (${searchState})`);
        console.log(`    Normalized: "${normalizedStopCity}" (${normalizedStopState}) vs "${normalizedSearchCity}" (${normalizedSearchState})`);
        
        const cityMatch = normalizedStopCity === normalizedSearchCity;
        const stateMatch = normalizedStopState === normalizedSearchState;
        
        console.log(`    City match: ${cityMatch}, State match: ${stateMatch}`);
        
        return cityMatch && stateMatch;
      });
      
      if (exactMatches.length === 1) {
        console.log(`✅ Strategy 1 - Exact city+state match: ${exactMatches[0].name}, ${exactMatches[0].state}`);
        return exactMatches[0];
      } else if (exactMatches.length > 1) {
        console.log(`⚠️ Multiple exact matches found for ${cityName}:`, exactMatches.map(m => `${m.name}, ${m.state}`));
        // Return first match but log the ambiguity
        return exactMatches[0];
      }
      
      console.log(`🔍 Strategy 1 failed: No exact city+state match found`);
    }

    // Strategy 2: City-only search with disambiguation warnings
    console.log(`🔍 Strategy 2: Looking for city-only match with "${searchCity}"`);
    
    const cityOnlyMatches = allStops.filter(stop => {
      const normalizedStopCity = CityNameNormalizationService.normalizeSearchTerm(stop.name || stop.city_name || '');
      const normalizedSearchCity = CityNameNormalizationService.normalizeSearchTerm(searchCity);
      
      console.log(`    Checking city-only: "${stop.name}" normalized to "${normalizedStopCity}" vs "${normalizedSearchCity}"`);
      
      const matches = normalizedStopCity === normalizedSearchCity;
      console.log(`    City-only match: ${matches}`);
      
      return matches;
    });

    if (cityOnlyMatches.length === 1) {
      console.log(`✅ Strategy 2 - Single city match: ${cityOnlyMatches[0].name}, ${cityOnlyMatches[0].state}`);
      return cityOnlyMatches[0];
    } else if (cityOnlyMatches.length > 1) {
      console.log(`⚠️ AMBIGUOUS CITY: Found ${cityOnlyMatches.length} cities named "${searchCity}"`);
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
            console.log(`✅ Strategy 2b - Route 66 preference: ${preferredMatch.name}, ${preferredMatch.state}`);
            return preferredMatch;
          }
        }
      }

      // Return first match but warn about ambiguity
      console.log(`⚠️ Using first match for ambiguous city: ${cityOnlyMatches[0].name}, ${cityOnlyMatches[0].state}`);
      return cityOnlyMatches[0];
    }

    console.log(`🔍 Strategy 2 failed: No city-only match found`);

    // Strategy 3: Fuzzy matching as last resort
    console.log(`🔍 Strategy 3: Attempting fuzzy matching for "${cityName}"`);
    
    for (const stop of allStops) {
      const displayName = CityDisplayService.getCityDisplayName(stop);
      const normalizedDisplay = CityNameNormalizationService.normalizeSearchTerm(displayName);
      const normalizedSearch = CityNameNormalizationService.normalizeSearchTerm(cityName);
      
      console.log(`    Fuzzy check: "${displayName}" normalized to "${normalizedDisplay}" vs "${normalizedSearch}"`);
      
      if (normalizedDisplay.includes(normalizedSearch) || normalizedSearch.includes(normalizedDisplay)) {
        console.log(`✅ Strategy 3 - Fuzzy match: ${displayName}`);
        return stop;
      }
    }

    console.log(`❌ No match found for: "${cityName}"`);
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
    console.log('🏙️ Available stops with state disambiguation:');
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

    console.log('🏛️ Cities with multiple state instances:');
    cityGroups.forEach((stops, cityName) => {
      if (stops.length > 1) {
        console.log(`   ${cityName}: ${stops.map(s => s.state).join(', ')}`);
      }
    });
  }

  /**
   * Validate a complete trip plan
   */
  static validateTripPlan(tripPlan: TripPlan) {
    const driveTimeValidation = this.validateDriveTimes(tripPlan);
    const routeValidation = this.validateRoute(tripPlan);
    
    return {
      isValid: driveTimeValidation.isValid && routeValidation.isValid,
      driveTimeValidation,
      routeValidation,
      warnings: [
        ...driveTimeValidation.warnings,
        ...routeValidation.warnings
      ]
    };
  }

  /**
   * Validate drive times across segments
   */
  private static validateDriveTimes(tripPlan: TripPlan) {
    const warnings: string[] = [];
    const driveTimes = tripPlan.segments.map(seg => seg.driveTimeHours);
    
    const maxTime = Math.max(...driveTimes);
    const avgTime = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    
    let isValid = true;
    
    if (maxTime > 10) {
      warnings.push(`Long drive day detected: ${maxTime.toFixed(1)} hours`);
      isValid = false;
    }
    
    if (maxTime > avgTime * 1.8) {
      warnings.push('Significant drive time imbalance detected');
    }
    
    return {
      isValid,
      warnings,
      maxDriveTime: maxTime,
      avgDriveTime: avgTime
    };
  }

  /**
   * Validate route sequence and logic
   */
  private static validateRoute(tripPlan: TripPlan) {
    const warnings: string[] = [];
    let isValid = true;
    
    if (tripPlan.segments.length === 0) {
      warnings.push('No segments found in trip plan');
      isValid = false;
    }
    
    if (tripPlan.totalDistance <= 0) {
      warnings.push('Invalid total distance');
      isValid = false;
    }
    
    return {
      isValid,
      warnings
    };
  }

  private static findSimilarCities(searchTerm: string, allStops: TripStop[]): string[] {
    const searchLower = searchTerm.toLowerCase();
    const destinationCities = allStops.filter(stop => stop.category === 'destination_city');
    
    return destinationCities
      .filter(stop => {
        const cityName = (stop.city_name || stop.name || '').toLowerCase();
        const stateName = stop.state.toLowerCase();
        
        // Look for partial matches
        return cityName.includes(searchLower) || 
               searchLower.includes(cityName) ||
               `${cityName}, ${stateName}`.includes(searchLower);
      })
      .map(stop => `${stop.city_name || stop.name}, ${stop.state}`)
      .slice(0, 5); // Limit suggestions
  }

  /**
   * Validate trip parameters
   */
  static validateTripParameters(
    startCityName: string,
    endCityName: string,
    tripDays: number,
    tripStartDate?: Date
  ): void {
    if (!startCityName || !endCityName) {
      throw new Error('Both start and end cities must be specified.');
    }

    if (tripDays <= 0 || tripDays > 14) { // Updated from 30 to 14 days
      throw new Error('Trip duration must be between 1 and 14 days.');
    }

    if (!tripStartDate) {
      throw new Error('Trip start date is required for weather forecasts and planning.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (tripStartDate < today) {
      throw new Error('Trip start date cannot be in the past.');
    }

    // Check if trip start date is too far in the future (weather forecasts have limits)
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
    
    if (tripStartDate > maxFutureDate) {
      throw new Error('Trip start date cannot be more than 1 year in the future.');
    }
  }
}
