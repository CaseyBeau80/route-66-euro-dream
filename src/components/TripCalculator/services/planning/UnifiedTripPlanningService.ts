
import { TripStop } from '../data/SupabaseDataService';
import { TripPlanBuilder, TripPlan } from './TripPlanBuilder';
import { EnhancedSupabaseDataService } from '../data/EnhancedSupabaseDataService';
import { TripStyleLogic, TripStyleConfig } from './TripStyleLogic';
import { TravelDayValidator } from '../validation/TravelDayValidator';
import { SegmentDensityController } from './SegmentDensityController';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';

export interface TripPlanningResult {
  success: boolean;
  tripPlan?: TripPlan;
  error?: string;
  warnings?: string[];
  styleConfig?: TripStyleConfig;
  validationInfo?: any;
  tripStyle: 'balanced' | 'destination-focused';
}

export class UnifiedTripPlanningService {
  /**
   * Enhanced trip planning with style logic and validation
   */
  static async planTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): Promise<TripPlanningResult> {
    console.log(`🚀 UNIFIED PLANNING: ${travelDays}-day ${tripStyle} trip from ${startLocation} to ${endLocation}`);
    
    try {
      // Step 1: Get style configuration
      const styleConfig = TripStyleLogic.getStyleConfig(tripStyle);
      console.log(`🎨 Style config: ${styleConfig.style}, max ${styleConfig.maxDailyDriveHours}h/day`);
      
      // Step 2: Validate travel days
      const validation = TravelDayValidator.validateTravelDays(
        startLocation,
        endLocation,
        travelDays,
        styleConfig
      );
      
      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid travel days: ${validation.issues.join(', ')}`,
          styleConfig,
          validationInfo: validation,
          tripStyle
        };
      }
      
      // Step 3: Get and filter data
      const allStops = await EnhancedSupabaseDataService.fetchAllStops();
      const destinationCitiesOnly = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
      
      // Step 4: Apply style-based filtering
      const stopsFilteredByStyle = TripStyleLogic.filterStopsByStyle(
        destinationCitiesOnly,
        styleConfig
      );
      
      // Step 5: Apply density control
      const densityLimits = SegmentDensityController.getDensityLimits(styleConfig);
      console.log(`🎛️ Density limits: max ${densityLimits.maxStopsPerDay} stops/day, ${densityLimits.minMilesBetweenStops}mi apart`);
      
      // Step 6: Find start and end stops
      const startStop = this.findCityStop(startLocation, stopsFilteredByStyle);
      const endStop = this.findCityStop(endLocation, stopsFilteredByStyle);
      
      if (!startStop || !endStop) {
        return {
          success: false,
          error: `Could not find ${!startStop ? startLocation : endLocation} in destination cities`,
          styleConfig,
          validationInfo: validation,
          tripStyle
        };
      }
      
      // Step 7: Apply final density control
      const finalStops = SegmentDensityController.controlStopDensity(
        stopsFilteredByStyle,
        startStop,
        endStop,
        densityLimits
      );
      
      // Step 8: Create the trip plan with enhanced logic
      const tripPlan = TripPlanBuilder.createTripPlan(
        startStop,
        endStop,
        finalStops,
        travelDays,
        startLocation,
        endLocation,
        tripStyle
      );
      
      // Step 9: Validate final result
      const warnings: string[] = [];
      
      // Check if we have enough variety
      if (tripPlan.segments.length < travelDays) {
        warnings.push(`Generated ${tripPlan.segments.length} segments for ${travelDays} days`);
      }
      
      // Check style-specific metrics
      const totalDistance = tripPlan.segments.reduce((sum, seg) => sum + seg.distance, 0);
      const styleMetrics = TripStyleLogic.calculateStyleMetrics(
        totalDistance,
        travelDays,
        styleConfig
      );
      
      if (!styleMetrics.isWithinLimits && styleMetrics.recommendation) {
        warnings.push(styleMetrics.recommendation);
      }
      
      console.log(`✅ UNIFIED PLANNING complete: ${tripPlan.segments.length} segments, ${warnings.length} warnings`);
      
      return {
        success: true,
        tripPlan,
        warnings,
        styleConfig,
        validationInfo: validation,
        tripStyle
      };
      
    } catch (error) {
      console.error('❌ UNIFIED PLANNING failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown planning error',
        tripStyle
      };
    }
  }

  /**
   * Create trip plan - static method for backward compatibility
   */
  static createTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    travelDays: number,
    startLocation: string,
    endLocation: string,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): TripPlanningResult {
    console.log(`🏗️ Creating trip plan: ${travelDays} days, ${tripStyle} style`);
    
    try {
      const tripPlan = TripPlanBuilder.createTripPlan(
        startStop,
        endStop,
        allStops,
        travelDays,
        startLocation,
        endLocation,
        tripStyle
      );

      return {
        success: true,
        tripPlan,
        tripStyle
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Trip plan creation failed',
        tripStyle
      };
    }
  }
  
  /**
   * Enhanced city finding with fuzzy matching
   */
  private static findCityStop(cityName: string, stops: TripStop[]): TripStop | undefined {
    const normalizedName = cityName.toLowerCase().trim();
    
    // Try exact matches first
    let match = stops.find(stop => 
      stop.name.toLowerCase() === normalizedName ||
      stop.city_name.toLowerCase() === normalizedName
    );
    
    if (match) return match;
    
    // Try partial matches
    match = stops.find(stop => 
      stop.name.toLowerCase().includes(normalizedName) ||
      stop.city_name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(stop.name.toLowerCase()) ||
      normalizedName.includes(stop.city_name.toLowerCase())
    );
    
    return match;
  }
}
