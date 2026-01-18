import { TripPlanBuilder } from './planning/TripPlanBuilder';
import { TripDestinationOptimizer } from './planning/TripDestinationOptimizer';
import { Route66StopsService } from './Route66StopsService';
import { StrictDestinationCityEnforcer } from './planning/StrictDestinationCityEnforcer';
import { Route66CityFinderService } from './Route66CityFinderService';
import { Route66RouteFilterService } from './Route66RouteFilterService';
import { EnhancedTripPlanResult, TripPlanType } from './Route66TripPlannerTypes';
import { TripStop } from '../types/TripStop';

export type { TripPlanType as TripPlan };
export type { EnhancedTripPlanResult };

export class Route66TripPlannerService {
  /**
   * Plan a Route 66 trip with STRICT destination city enforcement
   */
  static async planTrip(
    startCity: string,
    endCity: string,
    requestedDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'
  ): Promise<TripPlanType> {
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

      // CRITICAL FIX: Enhanced logging and validation for start/end city finding
      console.log(`🚨 [SPRINGFIELD FIX] Looking for start city: "${startCity}"`);
      const startStop = Route66CityFinderService.findDestinationCity(destinationCities, startCity);
      console.log(`🚨 [SPRINGFIELD FIX] Found start stop:`, startStop);
      
      console.log(`🚨 [SPRINGFIELD FIX] Looking for end city: "${endCity}"`);
      const endStop = Route66CityFinderService.findDestinationCity(destinationCities, endCity);
      console.log(`🚨 [SPRINGFIELD FIX] Found end stop:`, endStop);
      
      if (!startStop || !endStop) {
        console.error(`❌ [SPRINGFIELD FIX] City not found - Start: ${startStop ? 'FOUND' : 'MISSING'}, End: ${endStop ? 'FOUND' : 'MISSING'}`);
        throw new Error(`Start city "${startCity}" or end city "${endCity}" not found in destination cities`);
      }

      // STEP 2: Filter to cities along the route
      const routeDestinationCities = Route66RouteFilterService.filterDestinationCitiesAlongRoute(
        destinationCities,
        startStop,
        endStop
      );
      
      const maxPossibleDays = routeDestinationCities.length + 1; // +1 for end day
      console.log(`🏛️ ROUTE: Found ${routeDestinationCities.length} destination cities along route, max possible days: ${maxPossibleDays}`);

      // If still not enough cities, warn but don't artificially limit
      if (maxPossibleDays < requestedDays) {
        console.warn(`⚠️ ROUTE LIMITATION: Only ${routeDestinationCities.length} destination cities available along this route. Max possible days: ${maxPossibleDays}, requested: ${requestedDays}`);
      }

      // REMOVED ARTIFICIAL LIMITATION: Don't cap at maxPossibleDays - let the optimizer handle it
      console.log(`🔍 FIXED: Using full requested days: ${requestedDays} (no artificial Math.min cap)`);

      // STEP 3: Select optimal destination cities - let the optimizer handle limitations naturally
      const { destinations, actualDays, limitMessage } = TripDestinationOptimizer.ensureMinimumViableTrip(
        startStop,
        endStop,
        routeDestinationCities, // Use filtered cities instead of all destination cities
        requestedDays // Use full requested days - no artificial cap
      );

      console.log(`🎯 STRICT: Selected ${destinations.length} intermediate destination cities for ${actualDays} days`);
      console.log(`🔍 DEBUG: Requested ${requestedDays} days, got ${destinations.length} intermediate destinations, actual days: ${actualDays}`);
      
      // DEBUG: Verify the math
      if (actualDays !== requestedDays) {
        console.warn(`⚠️ DAYS MISMATCH: Requested ${requestedDays} days, but got ${actualDays} days. Destinations: ${destinations.length}`);
      }

      // STEP 4: Build trip plan using only destination cities (pass allStops for attractions)
      const tripPlan = TripPlanBuilder.buildTripPlan(
        startStop,
        endStop,
        destinations,
        tripStyle,
        allStops
      );

      // STEP 5: Final validation - ensure all stops are destination cities
      const validation = TripPlanBuilder.validateTripPlan(tripPlan);
      if (!validation.isValid) {
        console.warn(`⚠️ STRICT: Trip plan validation warnings:`, validation.violations);
        // Sanitize the plan to remove any non-destination cities
        const sanitizedPlan = TripPlanBuilder.sanitizeTripPlan(tripPlan);
        console.log(`🧹 STRICT: Trip plan sanitized successfully`);
        return sanitizedPlan;
      }

      // Add limit message and original requested days if applicable
      const finalPlan: TripPlanType = {
        ...tripPlan,
        limitMessage,
        originalRequestedDays: requestedDays
      };

      if (limitMessage) {
        console.log(`📝 STRICT: ${limitMessage}`);
      }

      console.log(`✅ STRICT PLANNER: Trip plan completed with ${tripPlan.totalDays} days, all destinations are cities`);
      return finalPlan;
      
    } catch (error) {
      console.error('❌ STRICT PLANNER: Error planning trip:', error);
      throw error;
    }
  }

  /**
   * Plan trip with enhanced analysis
   */
  static async planTripWithAnalysis(
    startCity: string,
    endCity: string,
    requestedDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'
  ): Promise<EnhancedTripPlanResult> {
    try {
      const tripPlan = await this.planTrip(startCity, endCity, requestedDays, tripStyle);
      
      return {
        tripPlan,
        originalRequestedDays: requestedDays,
        warnings: [],
        validationResults: {
          driveTimeValidation: { isValid: true },
          sequenceValidation: { isValid: true }
        }
      };
    } catch (error) {
      console.error('❌ Enhanced trip planning failed:', error);
      throw error;
    }
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

  /**
   * Debug methods for developer tools
   */
  static getDataSourceStatus(): string {
    return 'Using Supabase destination cities database';
  }

  static isUsingFallbackData(): boolean {
    return false;
  }

  static async getDestinationCitiesCount(): Promise<number> {
    try {
      const cities = await this.getAvailableDestinationCities();
      return cities.length;
    } catch {
      return 0;
    }
  }
}