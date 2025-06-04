
import { SupabaseDataService, TripStop } from './data/SupabaseDataService';
import { TripPlanBuilder, TripPlan, DailySegment } from './planning/TripPlanBuilder';

// Re-export types for backward compatibility
export type { TripStop, DailySegment, TripPlan };

export class Route66TripPlannerService {
  static async planTrip(startCityName: string, endCityName: string, tripDays: number): Promise<TripPlan> {
    console.log(`🗺️ Planning ${tripDays}-day trip from ${startCityName} to ${endCityName}`);

    const allStops = await SupabaseDataService.fetchAllStops();
    console.log(`📊 Total stops available for planning: ${allStops.length}`);
    
    // Find start and end stops
    const startStop = allStops.find(stop => 
      stop.name.toLowerCase().includes(startCityName.toLowerCase()) ||
      stop.city_name.toLowerCase().includes(startCityName.toLowerCase())
    );
    
    const endStop = allStops.find(stop => 
      stop.name.toLowerCase().includes(endCityName.toLowerCase()) ||
      stop.city_name.toLowerCase().includes(endCityName.toLowerCase())
    );

    console.log('🔍 Start stop found:', startStop);
    console.log('🔍 End stop found:', endStop);

    if (!startStop || !endStop) {
      throw new Error(`Could not find stops for ${startCityName} or ${endCityName}`);
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
