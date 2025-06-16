import { TripStop } from '../data/SupabaseDataService';
import { TripPlanBuilder, TripPlan } from './TripPlanBuilder';
import { EnhancedSupabaseDataService } from '../data/EnhancedSupabaseDataService';
import { TripStyleLogic, TripStyleConfig } from './TripStyleLogic';
import { TravelDayValidator } from '../validation/TravelDayValidator';
import { SegmentDensityController } from './SegmentDensityController';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { CityStateDisambiguationService } from '../utils/CityStateDisambiguationService';
import { TripPrePlanningValidator } from './TripPrePlanningValidator';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';

export interface TripPlanningResult {
  success: boolean;
  tripPlan?: TripPlan;
  error?: string;
  warnings?: string[];
  styleConfig?: TripStyleConfig;
  validationInfo?: any;
  tripStyle: 'balanced' | 'destination-focused';
  driveTimeValidation?: any;
}

export class UnifiedTripPlanningService {
  /**
   * Enhanced trip planning with drive-time enforcement and validation
   */
  static async planTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): Promise<TripPlanningResult> {
    console.log(`🚀 UNIFIED PLANNING with DRIVE-TIME ENFORCEMENT: ${travelDays}-day ${tripStyle} trip from ${startLocation} to ${endLocation}`);
    
    try {
      // Step 1: Get style configuration
      const styleConfig = TripStyleLogic.getStyleConfig(tripStyle);
      console.log(`🎨 Style config: ${styleConfig.style}, max ${styleConfig.maxDailyDriveHours}h/day`);
      
      // Step 2: Get and filter data
      const allStops = await EnhancedSupabaseDataService.fetchAllStops();
      const destinationCitiesOnly = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
      
      // Step 3: Find start and end stops with enhanced disambiguation
      const startStop = this.findCityStopWithDisambiguation(startLocation, destinationCitiesOnly);
      const endStop = this.findCityStopWithDisambiguation(endLocation, destinationCitiesOnly);
      
      if (!startStop || !endStop) {
        return {
          success: false,
          error: `Could not find ${!startStop ? startLocation : endLocation} in destination cities`,
          styleConfig,
          tripStyle
        };
      }
      
      console.log(`🎯 UNIFIED: Selected start: ${startStop.name}, ${startStop.state}`);
      console.log(`🎯 UNIFIED: Selected end: ${endStop.name}, ${endStop.state}`);
      
      // Step 4: Pre-planning validation
      const prePlanningValidation = TripPrePlanningValidator.validateTripFeasibility(
        startStop,
        endStop,
        travelDays,
        styleConfig
      );
      
      if (!prePlanningValidation.isValid) {
        const errorMessages = [
          ...prePlanningValidation.issues,
          ...prePlanningValidation.recommendations
        ];
        
        return {
          success: false,
          error: `Trip planning issues: ${errorMessages.join('. ')}`,
          styleConfig,
          validationInfo: prePlanningValidation,
          tripStyle
        };
      }
      
      // Step 5: Validate travel days with enhanced checks
      const validation = TravelDayValidator.validateTravelDays(
        startLocation,
        endLocation,
        travelDays,
        styleConfig
      );
      
      // Step 6: Apply style-based filtering
      const stopsFilteredByStyle = TripStyleLogic.filterStopsByStyle(
        destinationCitiesOnly,
        styleConfig
      );
      
      // Step 7: Apply density control
      const densityLimits = SegmentDensityController.getDensityLimits(styleConfig);
      console.log(`🎛️ Density limits: max ${densityLimits.maxStopsPerDay} stops/day, ${densityLimits.minMilesBetweenStops}mi apart`);
      
      // Step 8: Apply final density control
      const finalStops = SegmentDensityController.controlStopDensity(
        stopsFilteredByStyle,
        startStop,
        endStop,
        densityLimits
      );
      
      // Step 9: Create the trip plan with drive-time enforcement
      const tripPlan = TripPlanBuilder.createTripPlan(
        startStop,
        endStop,
        finalStops,
        travelDays,
        startLocation,
        endLocation,
        tripStyle
      );
      
      // Step 10: Post-planning drive-time validation
      const driveTimeValidation = this.validateTripPlanDriveTimes(tripPlan, styleConfig);
      
      // Step 11: Collect warnings
      const warnings: string[] = [];
      
      // Add pre-planning warnings
      warnings.push(...prePlanningValidation.warnings);
      
      // Add drive-time warnings
      if (driveTimeValidation.warnings.length > 0) {
        warnings.push(...driveTimeValidation.warnings);
      }
      
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
      
      console.log(`✅ UNIFIED PLANNING complete: ${tripPlan.segments.length} segments, ${warnings.length} warnings, drive-time enforced: ${driveTimeValidation.enforced}`);
      
      return {
        success: true,
        tripPlan,
        warnings,
        styleConfig,
        validationInfo: { ...validation, prePlanning: prePlanningValidation },
        tripStyle,
        driveTimeValidation
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
   * Validate drive times for completed trip plan
   */
  private static validateTripPlanDriveTimes(
    tripPlan: TripPlan,
    styleConfig: TripStyleConfig
  ): {
    enforced: boolean;
    violations: number;
    warnings: string[];
    averageDriveTime: number;
    maxDriveTime: number;
  } {
    const warnings: string[] = [];
    let violations = 0;
    let totalDriveTime = 0;
    let maxDriveTime = 0;
    
    for (const segment of tripPlan.segments) {
      if (segment.driveTimeHours > styleConfig.maxDailyDriveHours) {
        violations++;
        warnings.push(`Day ${segment.day}: ${segment.driveTimeHours.toFixed(1)}h drive exceeds ${styleConfig.maxDailyDriveHours}h limit`);
      }
      
      totalDriveTime += segment.driveTimeHours;
      maxDriveTime = Math.max(maxDriveTime, segment.driveTimeHours);
    }
    
    const averageDriveTime = tripPlan.segments.length > 0 ? totalDriveTime / tripPlan.segments.length : 0;
    const enforced = violations === 0;
    
    if (!enforced) {
      warnings.push(`${violations} days exceed the ${styleConfig.maxDailyDriveHours}h daily drive limit for ${styleConfig.style} trips`);
    }
    
    console.log(`🚗 Drive-time validation: ${violations} violations, avg ${averageDriveTime.toFixed(1)}h, max ${maxDriveTime.toFixed(1)}h`);
    
    return {
      enforced,
      violations,
      warnings,
      averageDriveTime,
      maxDriveTime
    };
  }

  /**
   * Enhanced city finding with state disambiguation
   */
  private static findCityStopWithDisambiguation(cityName: string, stops: TripStop[]): TripStop | undefined {
    console.log(`🔍 UNIFIED DISAMBIGUATION: Searching for "${cityName}"`);
    
    // Use disambiguation service to find best matches
    const matches = CityStateDisambiguationService.findBestMatch(cityName, stops);
    
    if (matches.length === 0) {
      console.log(`❌ UNIFIED DISAMBIGUATION: No matches found for "${cityName}"`);
      return undefined;
    }

    if (matches.length === 1) {
      console.log(`✅ UNIFIED DISAMBIGUATION: Single match found: ${matches[0].name}, ${matches[0].state}`);
      return matches[0] as TripStop;
    }

    // Multiple matches - apply disambiguation logic
    const { city: searchCity, state: searchState } = CityStateDisambiguationService.parseCityState(cityName);
    
    if (searchState) {
      const exactMatch = matches.find(match => match.state.toUpperCase() === searchState.toUpperCase());
      if (exactMatch) {
        console.log(`✅ UNIFIED DISAMBIGUATION: Exact state match: ${exactMatch.name}, ${exactMatch.state}`);
        return exactMatch as TripStop;
      }
    }

    // Use Route 66 preferences for ambiguous cities
    if (CityStateDisambiguationService.isAmbiguousCity(searchCity)) {
      const preference = CityStateDisambiguationService.getRoute66Preference(searchCity);
      if (preference) {
        const preferredMatch = matches.find(match => 
          match.state.toUpperCase() === preference.state.toUpperCase()
        );
        if (preferredMatch) {
          console.log(`🎯 UNIFIED DISAMBIGUATION: Route 66 preference: ${preferredMatch.name}, ${preferredMatch.state}`);
          return preferredMatch as TripStop;
        }
      }
    }

    console.log(`⚠️ UNIFIED DISAMBIGUATION: Using first match: ${matches[0].name}, ${matches[0].state}`);
    return matches[0] as TripStop;
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
