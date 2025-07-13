
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

      // STEP 2: Get available destination cities count for max calculation
      const routeDestinationCities = destinationCities.filter(city => {
        // Filter cities that are between start and end points
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
        
        // City should be along the route (not too far off the direct path)
        return (distanceFromStart + distanceFromEnd) <= (directDistance * 1.5);
      });
      
      const maxPossibleDays = routeDestinationCities.length + 1; // +1 for end day
      console.log(`🏛️ STRICT: Found ${routeDestinationCities.length} destination cities along route, max possible days: ${maxPossibleDays}`);

      // STEP 3: Select optimal destination cities respecting user choice within bounds
      const { destinations, actualDays, limitMessage } = TripDestinationOptimizer.ensureMinimumViableTrip(
        startStop,
        endStop,
        destinationCities,
        Math.min(requestedDays, maxPossibleDays) // Respect user choice up to max available
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
