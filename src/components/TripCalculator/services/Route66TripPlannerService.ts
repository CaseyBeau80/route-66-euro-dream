
import { SupabaseDataService, TripStop } from './data/SupabaseDataService';
import { TripPlanBuilder, TripPlan, DailySegment } from './planning/TripPlanBuilder';

// Re-export types for backward compatibility
export type { TripStop, DailySegment, TripPlan };

export class Route66TripPlannerService {
  static async planTrip(startCityName: string, endCityName: string, tripDays: number): Promise<TripPlan> {
    console.log(`🗺️ Planning ${tripDays}-day trip from ${startCityName} to ${endCityName}`);

    const allStops = await SupabaseDataService.fetchAllStops();
    console.log(`📊 Total stops available for planning: ${allStops.length}`);
    
    // Enhanced city matching function
    const findCityStop = (cityName: string): TripStop | undefined => {
      // Extract just the city name (remove state abbreviation)
      const cityOnly = cityName.split(',')[0].trim().toLowerCase();
      
      console.log(`🔍 Searching for city: "${cityOnly}" from input: "${cityName}"`);
      
      // Log some sample stops to see the data structure
      console.log('📋 Sample stops:', allStops.slice(0, 5).map(s => ({ name: s.name, city_name: s.city_name, state: s.state })));
      
      return allStops.find(stop => {
        const stopNameMatch = stop.name.toLowerCase().includes(cityOnly);
        const cityNameMatch = stop.city_name.toLowerCase().includes(cityOnly);
        const exactNameMatch = stop.name.toLowerCase() === cityOnly;
        const exactCityMatch = stop.city_name.toLowerCase() === cityOnly;
        
        return stopNameMatch || cityNameMatch || exactNameMatch || exactCityMatch;
      });
    };
    
    // Find start and end stops with enhanced matching
    const startStop = findCityStop(startCityName);
    const endStop = findCityStop(endCityName);

    console.log('🔍 Start stop found:', startStop ? { name: startStop.name, city_name: startStop.city_name, category: startStop.category } : 'NOT FOUND');
    console.log('🔍 End stop found:', endStop ? { name: endStop.name, city_name: endStop.city_name, category: endStop.category } : 'NOT FOUND');

    if (!startStop || !endStop) {
      // Provide more helpful error information
      const availableCities = [...new Set(allStops.map(stop => stop.city_name))].sort();
      console.log('📍 Available cities:', availableCities.slice(0, 20)); // Log first 20 cities
      
      throw new Error(`Could not find stops for ${startCityName} or ${endCityName}. Available cities include: ${availableCities.slice(0, 10).join(', ')}...`);
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
