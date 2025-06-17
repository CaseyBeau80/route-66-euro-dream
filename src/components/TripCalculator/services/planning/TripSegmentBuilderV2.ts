
import { DailySegment, RecommendedStop } from './TripPlanTypes';
import { TripStop } from '../data/SupabaseDataService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { TripPlanUtils } from './TripPlanUtils';
import { TripStyleConfig } from './TripStyleLogic';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';
import { DistanceValidationService } from './DistanceValidationService';

export class TripSegmentBuilderV2 {
  /**
   * Build segments with ABSOLUTE drive time enforcement from the start
   */
  static buildSegmentsWithDestinationCities(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    console.log(`🏗️ V2 SEGMENT BUILDER: ABSOLUTE drive time enforcement from start`);
    console.log(`🏗️ Config: max ${styleConfig.maxDailyDriveHours}h/day, ${styleConfig.style} style`);
    
    // STEP 1: Validate trip feasibility with current constraints
    const recommendedDays = DistanceValidationService.calculateRecommendedDays(
      startStop, endStop, styleConfig.maxDailyDriveHours
    );
    
    if (tripDays < recommendedDays) {
      console.warn(`⚠️ TRIP NOT FEASIBLE: Need ${recommendedDays} days, got ${tripDays}. Adjusting.`);
      tripDays = recommendedDays;
    }

    // STEP 2: Create segments with absolute validation
    const validatedSegments = this.createValidatedSegments(
      startStop, endStop, destinationCities, tripDays, styleConfig
    );

    // STEP 3: Final safety check
    const finalValidation = this.performFinalValidation(validatedSegments, styleConfig.maxDailyDriveHours);
    
    if (!finalValidation.isValid) {
      console.error(`❌ FINAL VALIDATION FAILED:`, finalValidation.violations);
      // Return emergency fallback segments
      return this.createEmergencyFallbackSegments(startStop, endStop, styleConfig);
    }

    console.log(`✅ V2 SEGMENTS CREATED: ${validatedSegments.length} segments, all within ${styleConfig.maxDailyDriveHours}h limit`);
    return validatedSegments;
  }

  /**
   * Create segments with validation at each step
   */
  private static createValidatedSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    const allTripStops = [startStop, ...destinationCities, endStop];
    
    console.log(`🗺️ CREATING SEGMENTS: ${allTripStops.length} stops for ${tripDays} days`);

    for (let i = 0; i < allTripStops.length - 1; i++) {
      const currentStop = allTripStops[i];
      const nextStop = allTripStops[i + 1];
      const day = i + 1;

      // ABSOLUTE VALIDATION: Check if this segment is acceptable
      const validation = DistanceValidationService.validateSegmentDistance(
        currentStop, nextStop, styleConfig.maxDailyDriveHours
      );

      if (!validation.isValid) {
        console.error(`❌ INVALID SEGMENT: Day ${day} - ${validation.recommendation}`);
        
        // Try to split this segment
        const splitSegments = this.attemptSegmentSplit(
          currentStop, nextStop, day, styleConfig, destinationCities
        );
        
        if (splitSegments.length > 0) {
          console.log(`✅ SPLIT SUCCESSFUL: Created ${splitSegments.length} segments for Day ${day}`);
          segments.push(...splitSegments);
          continue;
        } else {
          console.error(`❌ SPLIT FAILED: Cannot create valid segment for Day ${day}`);
          // Create a capped segment as last resort
          const cappedSegment = this.createCappedSegment(currentStop, nextStop, day, styleConfig);
          segments.push(cappedSegment);
          continue;
        }
      }

      // Create valid segment
      const segment = this.createValidatedSegment(currentStop, nextStop, day, styleConfig);
      if (segment) {
        segments.push(segment);
        console.log(`✅ VALID SEGMENT: Day ${day} - ${currentStop.name} → ${nextStop.name} (${validation.driveTime.toFixed(1)}h)`);
      }
    }

    return segments;
  }

  /**
   * Attempt to split a long segment into multiple valid segments
   */
  private static attemptSegmentSplit(
    startStop: TripStop,
    endStop: TripStop,
    startingDay: number,
    styleConfig: TripStyleConfig,
    availableDestinations: TripStop[]
  ): DailySegment[] {
    console.log(`🔧 ATTEMPTING SPLIT: ${startStop.name} → ${endStop.name}`);
    
    // Find intermediate destinations between start and end
    const intermediateStops = availableDestinations.filter(dest => {
      const distFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        dest.latitude, dest.longitude
      );
      const distToEnd = DistanceCalculationService.calculateDistance(
        dest.latitude, dest.longitude,
        endStop.latitude, endStop.longitude
      );
      const totalDist = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // Check if this destination is roughly between start and end
      const deviation = (distFromStart + distToEnd) - totalDist;
      return deviation < 50 && distFromStart > 50 && distToEnd > 50; // Reasonable intermediate point
    });

    if (intermediateStops.length === 0) {
      console.log(`🚫 NO INTERMEDIATE STOPS found for split`);
      return [];
    }

    // Try the closest intermediate stop that creates valid segments
    for (const intermediate of intermediateStops) {
      const firstSegmentValidation = DistanceValidationService.validateSegmentDistance(
        startStop, intermediate, styleConfig.maxDailyDriveHours
      );
      const secondSegmentValidation = DistanceValidationService.validateSegmentDistance(
        intermediate, endStop, styleConfig.maxDailyDriveHours
      );

      if (firstSegmentValidation.isValid && secondSegmentValidation.isValid) {
        console.log(`✅ SPLIT POSSIBLE: Using ${intermediate.name} as intermediate`);
        
        const firstSegment = this.createValidatedSegment(startStop, intermediate, startingDay, styleConfig);
        const secondSegment = this.createValidatedSegment(intermediate, endStop, startingDay + 1, styleConfig);
        
        if (firstSegment && secondSegment) {
          return [firstSegment, secondSegment];
        }
      }
    }

    console.log(`🚫 SPLIT FAILED: No valid intermediate destinations found`);
    return [];
  }

  /**
   * Create a capped segment as last resort
   */
  private static createCappedSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): DailySegment {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Force cap the drive time
    const cappedDriveTime = Math.min(
      DriveTimeEnforcementService.calculateRealisticDriveTime(distance),
      styleConfig.maxDailyDriveHours
    );

    console.log(`🚨 CAPPED SEGMENT: Day ${day} - Forcing ${cappedDriveTime}h (was ${DriveTimeEnforcementService.calculateRealisticDriveTime(distance).toFixed(1)}h)`);

    const segment: DailySegment = {
      day,
      title: `Day ${day}: ${startStop.city_name || startStop.name} to ${endStop.city_name || endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance,
      approximateMiles: Math.round(distance),
      driveTimeHours: cappedDriveTime,
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops: [{
        stopId: endStop.id,
        id: endStop.id,
        name: endStop.name,
        description: endStop.description,
        latitude: endStop.latitude,
        longitude: endStop.longitude,
        category: endStop.category,
        city_name: endStop.city_name,
        state: endStop.state,
        city: endStop.city || endStop.city_name || 'Unknown'
      }],
      attractions: [{
        name: endStop.name,
        title: endStop.name,
        description: endStop.description,
        city: endStop.city || endStop.city_name || 'Unknown'
      }],
      driveTimeCategory: TripPlanUtils.getDriveTimeCategory(cappedDriveTime),
      routeSection: TripPlanUtils.getRouteSection(day, 14),
      driveTimeWarning: `Drive time capped at ${cappedDriveTime}h due to excessive distance (${distance.toFixed(0)}mi). Consider extending trip duration.`
    };

    return segment;
  }

  /**
   * Create a validated segment that meets all constraints
   */
  private static createValidatedSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): DailySegment | null {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Use the enforced drive time calculation
    const driveTime = DriveTimeEnforcementService.calculateRealisticDriveTime(distance);

    // Final safety check - this should never fail with our new logic
    if (driveTime > styleConfig.maxDailyDriveHours) {
      console.error(`❌ CRITICAL: Validated segment still exceeds limit: ${driveTime.toFixed(1)}h`);
      return null;
    }

    const recommendedStops: RecommendedStop[] = [{
      stopId: endStop.id,
      id: endStop.id,
      name: endStop.name,
      description: endStop.description,
      latitude: endStop.latitude,
      longitude: endStop.longitude,
      category: endStop.category,
      city_name: endStop.city_name,
      state: endStop.state,
      city: endStop.city || endStop.city_name || 'Unknown'
    }];

    const segment: DailySegment = {
      day,
      title: `Day ${day}: ${startStop.city_name || startStop.name} to ${endStop.city_name || endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance,
      approximateMiles: Math.round(distance),
      driveTimeHours: driveTime,
      destination: {
        city: endStop.city_name || endStop.name,
        state: endStop.state
      },
      recommendedStops,
      attractions: recommendedStops.map(stop => ({
        name: stop.name,
        title: stop.name,
        description: stop.description,
        city: stop.city
      })),
      driveTimeCategory: TripPlanUtils.getDriveTimeCategory(driveTime),
      routeSection: TripPlanUtils.getRouteSection(day, 14)
    };

    return segment;
  }

  /**
   * Perform final validation on all segments
   */
  private static performFinalValidation(
    segments: DailySegment[],
    maxDailyDriveHours: number
  ): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    segments.forEach(segment => {
      if (segment.driveTimeHours > maxDailyDriveHours) {
        violations.push(`Day ${segment.day}: ${segment.driveTimeHours.toFixed(1)}h exceeds ${maxDailyDriveHours}h limit`);
      }
    });

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Create emergency fallback segments when all else fails
   */
  private static createEmergencyFallbackSegments(
    startStop: TripStop,
    endStop: TripStop,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    console.log(`🚨 EMERGENCY FALLBACK: Creating minimal viable segments`);
    
    // Calculate minimum viable days
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const maxDailyDistance = DistanceValidationService.getMaxSafeDistance(styleConfig.maxDailyDriveHours);
    const minDays = Math.ceil(totalDistance / maxDailyDistance);
    
    // Create segments with artificial waypoints if needed
    const segments: DailySegment[] = [];
    
    for (let day = 1; day <= minDays; day++) {
      const progress = day / minDays;
      const segmentEndLat = startStop.latitude + (endStop.latitude - startStop.latitude) * progress;
      const segmentEndLng = startStop.longitude + (endStop.longitude - startStop.longitude) * progress;
      
      const segmentStart = day === 1 ? startStop : {
        ...startStop,
        id: `waypoint-${day-1}`,
        name: `Waypoint ${day-1}`,
        latitude: startStop.latitude + (endStop.latitude - startStop.latitude) * ((day-1) / minDays),
        longitude: startStop.longitude + (endStop.longitude - startStop.longitude) * ((day-1) / minDays)
      };
      
      const segmentEnd = day === minDays ? endStop : {
        ...endStop,
        id: `waypoint-${day}`,
        name: `Waypoint ${day}`,
        latitude: segmentEndLat,
        longitude: segmentEndLng
      };
      
      const segment = this.createValidatedSegment(segmentStart, segmentEnd, day, styleConfig);
      if (segment) {
        segments.push(segment);
      }
    }
    
    console.log(`🚨 EMERGENCY: Created ${segments.length} fallback segments for ${minDays} days`);
    return segments;
  }
}
