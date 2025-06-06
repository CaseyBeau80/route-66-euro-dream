
import { SupabaseDataService, TripStop } from './data/SupabaseDataService';
import { TripPlanBuilder, TripPlan, DailySegment, SegmentTiming } from './planning/TripPlanBuilder';
import { TripPlanValidator } from './planning/TripPlanValidator';
import { CityDisplayService } from './utils/CityDisplayService';

// Re-export types for backward compatibility
export type { TripStop, DailySegment, TripPlan, SegmentTiming };

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

    // Build the trip plan using the updated method and ensuring segments is an array
    const segments: DailySegment[] = []; // Initialize an empty array for segments
    const tripPlan = TripPlanBuilder.buildTripPlan(
      CityDisplayService.getCityDisplayName(validatedStartStop),
      CityDisplayService.getCityDisplayName(validatedEndStop),
      new Date(),
      tripDays,
      segments,
      Route66TripPlannerService.calculateDistance(validatedStartStop, validatedEndStop)
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

  // Helper function to calculate distance between stops
  private static calculateDistance(startStop: TripStop, endStop: TripStop): number {
    // Simple distance calculation using latitude/longitude
    const R = 3958.8; // Earth radius in miles
    const lat1 = startStop.latitude;
    const lon1 = startStop.longitude;
    const lat2 = endStop.latitude;
    const lon2 = endStop.longitude;
    
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
