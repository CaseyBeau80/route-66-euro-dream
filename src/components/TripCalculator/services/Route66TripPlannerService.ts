
import { SupabaseDataService, TripStop } from './data/SupabaseDataService';
import { TripPlanBuilder, TripPlan, DailySegment } from './planning/TripPlanBuilder';

// Re-export types for backward compatibility
export type { TripStop, DailySegment, TripPlan };

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
      
      // Log some sample stops to understand the data structure
      console.log('📋 Sample stops:', allStops.slice(0, 5).map(s => ({ 
        name: s.name, 
        city_name: s.city_name, 
        state: s.state 
      })));
      
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
          console.log(`✅ Found exact city+state match: ${matchedStop.name} in ${matchedStop.city_name}, ${matchedStop.state}`);
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
        console.log(`⚠️ Found city-only match: ${matchedStop.name} in ${matchedStop.city_name}, ${matchedStop.state}`);
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
      city_name: startStop.city_name, 
      state: startStop.state,
      category: startStop.category 
    } : 'NOT FOUND');
    
    console.log('🔍 End stop found:', endStop ? { 
      name: endStop.name, 
      city_name: endStop.city_name, 
      state: endStop.state,
      category: endStop.category 
    } : 'NOT FOUND');

    if (!startStop || !endStop) {
      // Enhanced error reporting with better suggestions
      const availableCities = [...new Set(allStops.map(stop => `${stop.city_name}, ${stop.state}`))].sort();
      const majorCities = availableCities.filter(city => 
        city.includes('Chicago') || 
        city.includes('St. Louis') || 
        city.includes('Springfield') || 
        city.includes('Tulsa') || 
        city.includes('Oklahoma City') || 
        city.includes('Amarillo') || 
        city.includes('Albuquerque') || 
        city.includes('Flagstaff') || 
        city.includes('Santa Monica')
      );
      
      console.log('📍 Major Route 66 cities available:', majorCities);
      console.log('📍 Total cities available:', availableCities.length);
      
      const missingCities = [];
      if (!startStop) missingCities.push(startCityName);
      if (!endStop) missingCities.push(endCityName);
      
      throw new Error(`Could not find stops for: ${missingCities.join(' and ')}. 

Available major Route 66 cities include: ${majorCities.slice(0, 8).join(', ')}.

Please use the exact format: "City Name, STATE" (e.g., "Springfield, IL" not "Springfield, MO" for Illinois).

Total cities available: ${availableCities.length}`);
    }

    const tripPlan = TripPlanBuilder.buildTripPlan(
      startStop,
      endStop,
      allStops,
      tripDays,
      startCityName,
      endCityName
    );

    console.log('🎯 Final trip plan:', tripPlan);
    return tripPlan;
  }
}
