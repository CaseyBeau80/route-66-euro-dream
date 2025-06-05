
import { SupabaseDataService, TripStop } from './data/SupabaseDataService';
import { TripPlanBuilder, TripPlan, DailySegment, SubStopTiming } from './planning/TripPlanBuilder';
import { TripPlanValidator } from './planning/TripPlanValidator';
import { CityDisplayService } from './utils/CityDisplayService';

// Re-export types for backward compatibility
export type { TripStop, DailySegment, TripPlan, SubStopTiming };

export class Route66TripPlannerService {
  static async planTrip(startCityName: string, endCityName: string, tripDays: number): Promise<TripPlan> {
    console.log(`🗺️ Planning ${tripDays}-day trip from ${startCityName} to ${endCityName}`);

    const allStops = await SupabaseDataService.fetchAllStops();
    console.log(`📊 Total stops available for planning: ${allStops.length}`);
    
    // Enhanced city matching function with proper city/state parsing
    const findCityStop = (cityName: string): TripStop | undefined => {
      // Parse city and state from input (e.g., "Springfield, IL" or "Chicago, IL")
      const parts = cityName.split(',').map(part => part.trim());
      const cityOnly = parts[0].toLowerCase();
      const stateOnly = parts.length > 1 ? parts[1].toLowerCase() : null;
      
      console.log(`🔍 Searching for city: "${cityOnly}", state: "${stateOnly}" from input: "${cityName}"`);
      
      // Two-tier matching strategy
      let matchedStop: TripStop | undefined;
      
      // Tier 1: Exact city + state matching (most precise)
      if (stateOnly) {
        matchedStop = allStops.find(stop => {
          const stopCity = stop.city_name.toLowerCase();
          const stopState = stop.state.toLowerCase();
          
          // Check for exact matches with city and state
          const exactCityStateMatch = stopCity === cityOnly && stopState === stateOnly;
          const cityContainsAndStateExact = stopCity.includes(cityOnly) && stopState === stateOnly;
          const nameContainsAndStateExact = stop.name.toLowerCase().includes(cityOnly) && stopState === stateOnly;
          
          return exactCityStateMatch || cityContainsAndStateExact || nameContainsAndStateExact;
        });
        
        if (matchedStop) {
          console.log(`✅ Found exact city+state match: ${matchedStop.name} in ${CityDisplayService.getCityDisplayName(matchedStop)}`);
          return matchedStop;
        }
      }
      
      // Tier 2: City-only matching (fallback)
      matchedStop = allStops.find(stop => {
        const stopCity = stop.city_name.toLowerCase();
        const stopName = stop.name.toLowerCase();
        
        // Prioritize exact matches
        if (stopCity === cityOnly || stopName === cityOnly) {
          return true;
        }
        
        // Then partial matches
        return stopCity.includes(cityOnly) || stopName.includes(cityOnly);
      });
      
      if (matchedStop) {
        console.log(`⚠️ Found city-only match: ${matchedStop.name} in ${CityDisplayService.getCityDisplayName(matchedStop)}`);
        if (stateOnly && matchedStop.state.toLowerCase() !== stateOnly) {
          console.log(`⚠️ Warning: State mismatch! Expected ${stateOnly}, found ${matchedStop.state}`);
        }
      }
      
      return matchedStop;
    };
    
    // Find start and end stops with enhanced matching
    const startStop = findCityStop(startCityName);
    const endStop = findCityStop(endCityName);

    console.log('🔍 Start stop found:', startStop ? { 
      name: startStop.name, 
      city_display: CityDisplayService.getCityDisplayName(startStop),
      category: startStop.category 
    } : 'NOT FOUND');
    
    console.log('🔍 End stop found:', endStop ? { 
      name: endStop.name, 
      city_display: CityDisplayService.getCityDisplayName(endStop),
      category: endStop.category 
    } : 'NOT FOUND');

    // Validate stops using the new validator
    const { startStop: validatedStartStop, endStop: validatedEndStop } = TripPlanValidator.validateStops(
      startStop,
      endStop,
      startCityName,
      endCityName,
      allStops
    );

    const tripPlan = TripPlanBuilder.buildTripPlan(
      validatedStartStop,
      validatedEndStop,
      allStops,
      tripDays,
      startCityName,
      endCityName
    );

    console.log('🎯 Final trip plan created with actual stop cities:', {
      title: tripPlan.title,
      actualStartCity: CityDisplayService.getCityDisplayName(validatedStartStop),
      actualEndCity: CityDisplayService.getCityDisplayName(validatedEndStop),
      inputStartCity: startCityName,
      inputEndCity: endCityName
    });
    
    return tripPlan;
  }
}
