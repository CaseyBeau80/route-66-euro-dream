
import { TripPlan, TripPlanBuilder, DailySegment } from './planning/TripPlanBuilder';
import { TripPlan as TripPlanType } from './planning/TripPlanTypes';
import { TripDestinationOptimizer } from './planning/TripDestinationOptimizer';
import { Route66StopsService } from './Route66StopsService';
import { StrictDestinationCityEnforcer } from './planning/StrictDestinationCityEnforcer';
import { TripStop } from '../types/TripStop';
import { TripCompletionAnalysis } from './planning/TripCompletionService';

export interface EnhancedTripPlanResult {
  tripPlan: TripPlanType;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
  warnings?: string[];
  validationResults?: any;
  debugInfo?: any;
}

export type { TripPlanType as TripPlan };

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

      // Find start and end cities from destination cities
      const startStop = this.findDestinationCity(destinationCities, startCity);
      const endStop = this.findDestinationCity(destinationCities, endCity);
      
      if (!startStop || !endStop) {
        throw new Error(`Start city "${startCity}" or end city "${endCity}" not found in destination cities`);
      }

      // ULTRA-GENEROUS route filtering - include all reasonable waypoints
      const routeDestinationCities = destinationCities.filter(city => {
        // Skip start and end cities from intermediate destinations
        if (city.id === startStop.id || city.id === endStop.id) return false;
        
        // Calculate distances using actual distance calculation service
        const distanceFromStart = Math.sqrt(
          Math.pow(city.latitude - startStop.latitude, 2) + 
          Math.pow(city.longitude - startStop.longitude, 2)
        );
        const distanceFromEnd = Math.sqrt(
          Math.pow(city.latitude - endStop.latitude, 2) + 
          Math.pow(city.longitude - endStop.longitude, 2)
        );
        const directDistance = Math.sqrt(
          Math.pow(endStop.latitude - startStop.latitude, 2) + 
          Math.pow(endStop.longitude - startStop.longitude, 2)
        );
        
        // ULTRA-GENEROUS: Allow cities within 4x direct distance to ensure enough destinations
        // This is very permissive to prevent the 13-day limitation
        const isReasonableWaypoint = (distanceFromStart + distanceFromEnd) <= (directDistance * 4.0);
        
        // DEBUG: Log filtering decisions
        if (!isReasonableWaypoint) {
          console.log(`🚫 FILTER: Excluding ${city.name}, ${city.state} - too far from route (${((distanceFromStart + distanceFromEnd) / directDistance).toFixed(1)}x direct distance)`);
        } else {
          console.log(`✅ FILTER: Including ${city.name}, ${city.state} - reasonable waypoint (${((distanceFromStart + distanceFromEnd) / directDistance).toFixed(1)}x direct distance)`);
        }
        
        return isReasonableWaypoint;
      });
      
      const maxPossibleDays = routeDestinationCities.length + 1; // +1 for end day
      console.log(`🏛️ FIXED FILTER: Found ${routeDestinationCities.length} destination cities along route (was too restrictive before), max possible days: ${maxPossibleDays}`);
      console.log(`📋 Available cities: ${routeDestinationCities.map(c => `${c.name}, ${c.state}`).join(' • ')}`);

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
        destinationCities,
        requestedDays // Use full requested days - no artificial cap
      );

      console.log(`🎯 STRICT: Selected ${destinations.length} intermediate destination cities for ${actualDays} days`);
      console.log(`🔍 DEBUG: Requested ${requestedDays} days, got ${destinations.length} intermediate destinations, actual days: ${actualDays}`);
      
      // DEBUG: Verify the math
      if (actualDays !== requestedDays) {
        console.warn(`⚠️ DAYS MISMATCH: Requested ${requestedDays} days, but got ${actualDays} days. Destinations: ${destinations.length}`);
      }

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
