import { TripPlan } from './planning/TripPlanTypes';
import { EvenPacingPlanningService } from './planning/EvenPacingPlanningService';
import { HeritageCitiesPlanningService } from './planning/HeritageCitiesPlanningService';
import { SupabaseDataService } from './data/SupabaseDataService';
import { DistanceCalculationService } from './utils/DistanceCalculationService';
import { TripStyleLogic } from './planning/TripStyleLogic';
import { TripSegmentBuilderV2 } from './planning/TripSegmentBuilderV2';
import { TripDestinationOptimizer } from './planning/TripDestinationOptimizer';

// Export TripPlan type for external use - fix for isolatedModules
export type { TripPlan } from './planning/TripPlanTypes';

export interface EnhancedTripPlanResult {
  tripPlan: TripPlan | null;
  debugInfo: any;
  validationResults: any;
  warnings: string[];
  completionAnalysis?: any;
  originalRequestedDays?: number;
}

export class Route66TripPlannerService {
  /**
   * Plan a Route 66 trip using the appropriate algorithm based on trip style
   */
  static async planTripWithAnalysis(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: string
  ): Promise<EnhancedTripPlanResult> {
    console.log(`🚗 PLANNING TRIP: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle} style`);
    
    const warnings: string[] = [];
    const debugInfo = {
      startLocation,
      endLocation,
      travelDays,
      tripStyle,
      timestamp: new Date().toISOString()
    };

    try {
      // Load all stops from Supabase
      const allStops = await SupabaseDataService.fetchAllStops();
      
      if (!allStops || allStops.length === 0) {
        throw new Error('No Route 66 stops available in database');
      }

      console.log(`📍 Loaded ${allStops.length} Route 66 stops from Supabase`);

      let tripPlan: TripPlan;

      // Use the appropriate planning service based on trip style
      if (tripStyle === 'balanced') {
        console.log(`⚖️ Using Even Pacing planning algorithm`);
        tripPlan = await EvenPacingPlanningService.planEvenPacingTrip(
          startLocation,
          endLocation,
          travelDays,
          allStops
        );
      } else if (tripStyle === 'destination-focused') {
        console.log(`🏛️ Using Heritage Cities planning algorithm`);
        tripPlan = await HeritageCitiesPlanningService.planHeritageCitiesTrip(
          startLocation,
          endLocation,
          travelDays,
          allStops
        );
      } else {
        // Default to Heritage Cities for destination-focused experience
        console.log(`🏛️ Unknown trip style '${tripStyle}', defaulting to Heritage Cities`);
        warnings.push(`Unknown trip style '${tripStyle}', using Heritage Cities instead`);
        tripPlan = await HeritageCitiesPlanningService.planHeritageCitiesTrip(
          startLocation,
          endLocation,
          travelDays,
          allStops
        );
      }

      return {
        tripPlan,
        debugInfo,
        validationResults: { driveTimeValidation: { isValid: true }, sequenceValidation: { isValid: true } },
        warnings,
        completionAnalysis: undefined,
        originalRequestedDays: travelDays
      };

    } catch (error) {
      console.error('❌ Trip planning failed:', error);
      throw error;
    }
  }

  /**
   * Simple trip planning method for compatibility
   */
  static async planTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<TripPlan> {
    const result = await this.planTripWithAnalysis(startLocation, endLocation, travelDays, tripStyle);
    if (!result.tripPlan) {
      throw new Error('Failed to plan trip');
    }
    return result.tripPlan;
  }

  /**
   * Get data source status for debugging
   */
  static getDataSourceStatus(): string {
    return 'supabase_live';
  }

  /**
   * Check if using fallback data
   */
  static isUsingFallbackData(): boolean {
    return false;
  }

  /**
   * Get destination cities count from live database
   */
  static async getDestinationCitiesCount(): Promise<number> {
    try {
      const cities = await SupabaseDataService.getDestinationCities();
      return cities?.length || 0;
    } catch (error) {
      console.error('Failed to get destination cities count:', error);
      return 0;
    }
  }

  /**
   * Enhanced trip planning with better destination selection
   */
  static async planTripWithAnalysis(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'
  ): Promise<EnhancedTripPlanResult> {
    console.log(`🚗 ENHANCED TRIP PLANNING: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle} style`);

    try {
      // Fetch all Route 66 data
      const allStops = await SupabaseDataService.fetchAllStops();
      console.log(`📊 Loaded ${allStops.length} Route 66 stops from database`);

      // Find start and end stops
      const startStop = SupabaseDataService.findBestMatchingStop(startLocation, allStops);
      const endStop = SupabaseDataService.findBestMatchingStop(endLocation, allStops);

      if (!startStop) {
        throw new Error(`Start location "${startLocation}" not found on Route 66. Try cities like Chicago IL, St. Louis MO, or Springfield MO.`);
      }

      if (!endStop) {
        throw new Error(`End location "${endLocation}" not found on Route 66. Try destinations like Amarillo TX, Flagstaff AZ, or Los Angeles CA.`);
      }

      console.log(`📍 Route: ${startStop.name} (${startStop.state}) → ${endStop.name} (${endStop.state})`);

      // Calculate total route distance
      const totalDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        endStop.latitude,
        endStop.longitude
      );

      console.log(`📏 Total route distance: ${totalDistance.toFixed(0)} miles`);

      // Use the new optimizer to select destinations
      const { destinations, actualDays, limitMessage } = TripDestinationOptimizer.ensureMinimumViableTrip(
        startStop,
        endStop,
        allStops,
        travelDays
      );

      console.log(`🎯 Trip optimization result:`, {
        requestedDays: travelDays,
        actualDays,
        destinationCount: destinations.length,
        hasLimitMessage: !!limitMessage
      });

      // Get trip style configuration
      const styleConfig = TripStyleLogic.getStyleConfig(tripStyle);

      // Build segments using the enhanced segment builder
      const segments = await TripSegmentBuilderV2.buildSegmentsWithDestinationCities(
        startStop,
        endStop,
        destinations,
        actualDays,
        styleConfig
      );

      console.log(`🏗️ Built ${segments.length} daily segments`);

      if (segments.length === 0) {
        throw new Error(`No valid trip segments could be created. Please try different locations or adjust the number of days.`);
      }

      // Create the final trip plan
      const tripPlan: TripPlan = {
        id: `trip-${Date.now()}`,
        title: `${startStop.name} to ${endStop.name} Route 66 Adventure`,
        startCity: startStop.name,
        endCity: endStop.name,
        startLocation: `${startStop.name}, ${startStop.state}`,
        endLocation: `${endStop.name}, ${endStop.state}`,
        totalDays: segments.length,
        totalDistance: totalDistance,
        totalMiles: Math.round(totalDistance),
        totalDrivingTime: segments.reduce((total, seg) => total + (seg.drivingTime || 0), 0),
        segments: segments,
        dailySegments: segments,
        stops: destinations,
        tripStyle: tripStyle,
        startDate: new Date(),
        lastUpdated: new Date(),
        originalRequestedDays: travelDays !== actualDays ? travelDays : undefined,
        limitMessage: limitMessage
      };

      console.log(`✅ ENHANCED TRIP PLAN CREATED:`, {
        segments: tripPlan.segments.length,
        totalMiles: tripPlan.totalMiles,
        totalDrivingTime: tripPlan.totalDrivingTime?.toFixed(1),
        wasLimited: !!limitMessage
      });

      return {
        tripPlan,
        validationResults: {
          isValid: true,
          issues: [],
          recommendations: limitMessage ? [limitMessage] : []
        },
        warnings: limitMessage ? [limitMessage] : []
      };

    } catch (error) {
      console.error('❌ Enhanced trip planning failed:', error);
      
      return {
        tripPlan: null,
        validationResults: {
          isValid: false,
          issues: [error instanceof Error ? error.message : 'Unknown planning error'],
          recommendations: ['Please check your start and end locations and try again.']
        },
        warnings: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
