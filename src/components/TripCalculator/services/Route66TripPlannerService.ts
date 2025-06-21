
import { TripPlan, TripPlanBuilder, DailySegment } from './planning/TripPlanBuilder';
import { TripDestinationOptimizer } from './planning/TripDestinationOptimizer';
import { Route66StopsService } from './Route66StopsService';
import { StrictDestinationCityEnforcer } from './planning/StrictDestinationCityEnforcer';
import { TripStop } from '../types/TripStop';

export class Route66TripPlannerService {
  /**
   * Plan a Route 66 trip with STRICT destination city enforcement
   */
  static async planTrip(
    startCity: string,
    endCity: string,
    requestedDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'
  ): Promise<TripPlan> {
    console.log(`🚗 STRICT PLANNER: Planning ${requestedDays}-day trip from ${startCity} to ${endCity}`);
    
    try {
      // Get all available stops from database
      const allStops = await Route66StopsService.getAllStops();
      console.log(`📊 STRICT: Found ${allStops.length} total stops in database`);
      
      // STEP 1: Filter to destination cities ONLY
      const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
      console.log(`🏛️ STRICT: Filtered to ${destinationCities.length} destination cities`);
      
      if (destinationCities.length === 0) {
        throw new Error('No destination cities found in database');
      }

      // Find start and end cities from destination cities
      const startStop = this.findDestinationCity(destinationCities, startCity);
      const endStop = this.findDestinationCity(destinationCities, endCity);
      
      if (!startStop || !endStop) {
        throw new Error(`Start city "${startCity}" or end city "${endCity}" not found in destination cities`);
      }

      // STEP 2: Select optimal destination cities for the trip
      const { destinations, actualDays, limitMessage } = TripDestinationOptimizer.ensureMinimumViableTrip(
        startStop,
        endStop,
        destinationCities,
        requestedDays
      );

      console.log(`🎯 STRICT: Selected ${destinations.length} intermediate destination cities for ${actualDays} days`);

      // STEP 3: Build trip plan using only destination cities
      const tripPlan = TripPlanBuilder.buildTripPlan(
        startStop,
        endStop,
        destinations,
        tripStyle
      );

      // STEP 4: Final validation - ensure all stops are destination cities
      const validation = TripPlanBuilder.validateTripPlan(tripPlan);
      if (!validation.isValid) {
        console.warn(`⚠️ STRICT: Trip plan validation warnings:`, validation.violations);
        // Sanitize the plan to remove any non-destination cities
        const sanitizedPlan = TripPlanBuilder.sanitizeTripPlan(tripPlan);
        console.log(`🧹 STRICT: Trip plan sanitized successfully`);
        return sanitizedPlan;
      }

      // Add limit message if applicable
      if (limitMessage) {
        console.log(`📝 STRICT: ${limitMessage}`);
      }

      console.log(`✅ STRICT PLANNER: Trip plan completed with ${tripPlan.totalDays} days, all destinations are cities`);
      return tripPlan;
      
    } catch (error) {
      console.error('❌ STRICT PLANNER: Error planning trip:', error);
      throw error;
    }
  }

  /**
   * Find destination city by name (case-insensitive)
   */
  private static findDestinationCity(destinationCities: TripStop[], cityName: string): TripStop | null {
    const normalizedName = cityName.toLowerCase().trim();
    
    // Try exact match first
    let found = destinationCities.find(city => 
      city.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(city.name.toLowerCase())
    );
    
    if (!found) {
      // Try partial match
      found = destinationCities.find(city => {
        const cityNameLower = city.name.toLowerCase();
        return cityNameLower.includes(normalizedName) || normalizedName.includes(cityNameLower);
      });
    }
    
    if (found) {
      console.log(`✅ STRICT: Found destination city: ${found.name} for "${cityName}"`);
    } else {
      console.warn(`⚠️ STRICT: No destination city found for "${cityName}"`);
    }
    
    return found || null;
  }

  /**
   * Get available destination cities for trip planning
   */
  static async getAvailableDestinationCities(): Promise<TripStop[]> {
    try {
      const allStops = await Route66StopsService.getAllStops();
      const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
      
      console.log(`🏛️ STRICT: Available destination cities: ${destinationCities.length}`);
      return destinationCities;
    } catch (error) {
      console.error('❌ Error getting destination cities:', error);
      return [];
    }
  }
}
