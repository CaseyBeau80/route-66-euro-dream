
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
    
    // Enhanced city matching function with improved fuzzy matching
    const findCityStop = (cityName: string): TripStop | undefined => {
      // Parse city and state from input (e.g., "Springfield, IL" or "Chicago, IL")
      const parts = cityName.split(',').map(part => part.trim());
      const cityOnly = parts[0].toLowerCase();
      const stateOnly = parts.length > 1 ? parts[1].toLowerCase() : null;
      
      console.log(`🔍 Searching for city: "${cityOnly}", state: "${stateOnly}" from input: "${cityName}"`);
      
      // Tier 1: Exact city + state matching (most precise)
      if (stateOnly) {
        const exactMatch = allStops.find(stop => {
          const stopCity = stop.city_name.toLowerCase();
          const stopState = stop.state.toLowerCase();
          const stopName = stop.name.toLowerCase();
          
          // Check for exact matches with city and state
          const exactCityStateMatch = stopCity === cityOnly && stopState === stateOnly;
          const nameExactStateMatch = stopName === cityOnly && stopState === stateOnly;
          
          return exactCityStateMatch || nameExactStateMatch;
        });
        
        if (exactMatch) {
          console.log(`✅ Found exact city+state match: ${exactMatch.name} in ${CityDisplayService.getCityDisplayName(exactMatch)}`);
          return exactMatch;
        }

        // Try partial matches with correct state
        const partialMatch = allStops.find(stop => {
          const stopCity = stop.city_name.toLowerCase();
          const stopState = stop.state.toLowerCase();
          const stopName = stop.name.toLowerCase();
          
          if (stopState !== stateOnly) return false;
          
          const cityContains = stopCity.includes(cityOnly) || cityOnly.includes(stopCity);
          const nameContains = stopName.includes(cityOnly) || cityOnly.includes(stopName);
          
          return cityContains || nameContains;
        });
        
        if (partialMatch) {
          console.log(`✅ Found partial city+state match: ${partialMatch.name} in ${CityDisplayService.getCityDisplayName(partialMatch)}`);
          return partialMatch;
        }
      }
      
      // Tier 2: City-only matching (fallback) - prioritize destination cities
      const cityOnlyMatches = allStops.filter(stop => {
        const stopCity = stop.city_name.toLowerCase();
        const stopName = stop.name.toLowerCase();
        
        // Exact matches first
        if (stopCity === cityOnly || stopName === cityOnly) {
          return true;
        }
        
        // Then partial matches
        return stopCity.includes(cityOnly) || stopName.includes(cityOnly) || 
               cityOnly.includes(stopCity) || cityOnly.includes(stopName);
      });

      if (cityOnlyMatches.length > 0) {
        // Prioritize destination cities, then major stops
        const destinationCity = cityOnlyMatches.find(stop => stop.category === 'destination_city');
        if (destinationCity) {
          console.log(`✅ Found destination city match: ${destinationCity.name} in ${CityDisplayService.getCityDisplayName(destinationCity)}`);
          if (stateOnly && destinationCity.state.toLowerCase() !== stateOnly) {
            console.log(`⚠️ Warning: State mismatch! Expected ${stateOnly}, found ${destinationCity.state}`);
          }
          return destinationCity;
        }

        const majorStop = cityOnlyMatches.find(stop => stop.is_major_stop);
        if (majorStop) {
          console.log(`✅ Found major stop match: ${majorStop.name} in ${CityDisplayService.getCityDisplayName(majorStop)}`);
          if (stateOnly && majorStop.state.toLowerCase() !== stateOnly) {
            console.log(`⚠️ Warning: State mismatch! Expected ${stateOnly}, found ${majorStop.state}`);
          }
          return majorStop;
        }

        // Return first match
        const firstMatch = cityOnlyMatches[0];
        console.log(`⚠️ Found city-only match: ${firstMatch.name} in ${CityDisplayService.getCityDisplayName(firstMatch)}`);
        if (stateOnly && firstMatch.state.toLowerCase() !== stateOnly) {
          console.log(`⚠️ Warning: State mismatch! Expected ${stateOnly}, found ${firstMatch.state}`);
        }
        return firstMatch;
      }
      
      console.log(`❌ No match found for "${cityName}"`);
      return undefined;
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
