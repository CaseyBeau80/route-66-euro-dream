import { DailySegment, RecommendedStop } from './TripPlanTypes';
import { TripStop } from '../data/SupabaseDataService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';
import { TripPlanUtils } from './TripPlanUtils';
import { TripStyleConfig } from './TripStyleLogic';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';
import { SegmentBalancingService } from './SegmentBalancingService';
import { TripCompletionService } from './TripCompletionService';

export class TripSegmentBuilder {
  /**
   * ENHANCED: Build segments with destination cities and strict drive-time enforcement
   */
  static buildSegmentsWithDestinationCities(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    console.log(`🏗️ DRIVE TIME FIX: Building segments with ABSOLUTE drive time enforcement`);
    console.log(`🏗️ Style config: max ${styleConfig.maxDailyDriveHours}h/day, ${styleConfig.style} style`);
    
    // STEP 1: Create initial segments with proper validation
    const initialSegments = this.createInitialSegments(
      startStop,
      endStop,
      destinationCities,
      tripDays,
      styleConfig
    );
    
    console.log(`🏗️ Initial segments created: ${initialSegments.length}`);
    
    // STEP 2: CRITICAL FIX - Enforce drive times on ALL segments
    const enforcedSegments = this.enforceSegmentDriveTimes(
      initialSegments,
      destinationCities,
      styleConfig
    );
    
    console.log(`🚗 DRIVE TIME FIX: Final segments with enforced drive times: ${enforcedSegments.length}`);
    
    // Log all final drive times to verify enforcement
    enforcedSegments.forEach((segment, index) => {
      console.log(`🚗 FINAL DRIVE TIME: Day ${segment.day} - ${segment.startCity} → ${segment.endCity}: ${segment.driveTimeHours.toFixed(1)}h (distance: ${segment.distance.toFixed(1)}mi)`);
      
      if (segment.driveTimeHours > 10) {
        console.error(`❌ CRITICAL ERROR: Day ${segment.day} still exceeds 10h limit: ${segment.driveTimeHours.toFixed(1)}h`);
      }
    });
    
    // STEP 3: Analyze for completion and duplicates
    const completionAnalysis = TripCompletionService.analyzeTripCompletion(
      enforcedSegments,
      tripDays,
      destinationCities
    );
    
    // STEP 4: Clean up segments if needed
    let finalSegments = enforcedSegments;
    
    if (completionAnalysis.isCompleted || completionAnalysis.duplicateSegments.length > 0) {
      console.log(`🧹 CLEANING UP: Removing ${completionAnalysis.duplicateSegments.length} duplicate segments`);
      finalSegments = TripCompletionService.cleanupSegments(enforcedSegments);
    }
    
    return finalSegments;
  }

  /**
   * CRITICAL FIX: Enforce drive time limits with absolute validation
   */
  private static enforceSegmentDriveTimes(
    segments: DailySegment[],
    availableStops: TripStop[],
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    console.log(`🚗 CRITICAL FIX: Enforcing drive times on ${segments.length} segments with ABSOLUTE 10h cap`);
    
    const enforcedSegments: DailySegment[] = [];
    let currentDay = 1;
    
    for (const segment of segments) {
      console.log(`🚗 Processing segment: ${segment.startCity} → ${segment.endCity} (${segment.distance.toFixed(1)}mi)`);
      
      // CRITICAL: Always use the enforcement service for drive time calculation
      const absoluteMaxDriveTime = DriveTimeEnforcementService.calculateRealisticDriveTime(segment.distance);
      
      console.log(`🚗 ABSOLUTE CALCULATION: ${segment.startCity} → ${segment.endCity}`, {
        distance: segment.distance.toFixed(1),
        originalDriveTime: segment.driveTimeHours?.toFixed(1) || 'undefined',
        enforcedDriveTime: absoluteMaxDriveTime.toFixed(1),
        isWithinLimit: absoluteMaxDriveTime <= styleConfig.maxDailyDriveHours,
        absoluteMax: 10
      });
      
      // Create the segment with ENFORCED drive time
      const enforcedSegment: DailySegment = {
        ...segment,
        day: currentDay,
        driveTimeHours: absoluteMaxDriveTime // ALWAYS use the enforced time
      };
      
      // Add warning if drive time is at the absolute limit
      if (absoluteMaxDriveTime >= 10) {
        enforcedSegment.driveTimeWarning = `Maximum drive time reached (${absoluteMaxDriveTime.toFixed(1)}h) - consider extending trip duration`;
      } else if (absoluteMaxDriveTime > styleConfig.maxDailyDriveHours) {
        enforcedSegment.driveTimeWarning = `Drive time (${absoluteMaxDriveTime.toFixed(1)}h) exceeds recommended ${styleConfig.maxDailyDriveHours}h for ${styleConfig.style} style`;
      }
      
      enforcedSegments.push(enforcedSegment);
      currentDay++;
      
      console.log(`✅ ENFORCED SEGMENT: Day ${currentDay - 1} - ${enforcedSegment.startCity} → ${enforcedSegment.endCity} (${enforcedSegment.driveTimeHours.toFixed(1)}h)`);
    }
    
    return enforcedSegments;
  }

  /**
   * Create initial segments with enhanced duplicate prevention
   */
  private static createInitialSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number,
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    // Create the sequence of valid unique destinations
    const validDestinations = this.selectValidUniqueDestinations(
      startStop,
      endStop,
      destinationCities,
      tripDays
    );
    
    console.log(`🎯 VALID DESTINATIONS: ${validDestinations.length}`, validDestinations.map(d => d.name));
    
    // Create all trip stops: start + intermediates + end
    const allTripStops = [startStop, ...validDestinations, endStop];
    console.log(`🗺️ COMPLETE ROUTE: ${allTripStops.length} stops`, allTripStops.map(s => s.name));
    
    // Create segments between consecutive stops
    const segments: DailySegment[] = [];
    
    for (let i = 0; i < allTripStops.length - 1; i++) {
      const currentStop = allTripStops[i];
      const nextStop = allTripStops[i + 1];
      const day = i + 1;
      
      // CRITICAL: Validate this is not a duplicate segment
      if (this.isDuplicateSegment(currentStop, nextStop)) {
        console.warn(`⚠️ SKIPPING DUPLICATE: Day ${day} - ${currentStop.name} → ${nextStop.name}`);
        continue;
      }
      
      const segment = this.createValidatedSegment(
        currentStop,
        nextStop,
        day,
        styleConfig
      );
      
      if (segment) {
        segments.push(segment);
        console.log(`✅ CREATED: Day ${day} - ${currentStop.name} → ${nextStop.name} (${segment.distance.toFixed(1)}mi)`);
      }
    }
    
    return segments;
  }

  /**
   * Convert segment to TripStop for drive time calculations
   */
  private static segmentToTripStop(segment: DailySegment, type: 'start' | 'end'): TripStop {
    if (type === 'start') {
      return {
        id: `segment-start-${segment.day}`,
        name: segment.startCity,
        city_name: segment.startCity,
        city: segment.startCity,
        state: segment.destination?.state || 'Unknown',
        latitude: 0,
        longitude: 0,
        category: 'destination_city',
        description: `Start point for day ${segment.day}`
      };
    } else {
      return {
        id: `segment-end-${segment.day}`,
        name: segment.endCity,
        city_name: segment.endCity,
        city: segment.endCity,
        state: segment.destination?.state || 'Unknown',
        latitude: 0,
        longitude: 0,
        category: 'destination_city',
        description: `End point for day ${segment.day}`
      };
    }
  }

  /**
   * Select valid unique destinations that ensure progression
   */
  private static selectValidUniqueDestinations(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number
  ): TripStop[] {
    const neededIntermediateStops = Math.max(0, tripDays - 1);
    console.log(`🎯 Need ${neededIntermediateStops} intermediate stops for ${tripDays} days`);
    
    if (neededIntermediateStops === 0) {
      return [];
    }
    
    // Filter out start and end cities from available destinations
    const availableDestinations = destinationCities.filter(city => 
      city.id !== startStop.id && 
      city.id !== endStop.id &&
      city.name !== startStop.name &&
      city.name !== endStop.name
    );
    
    console.log(`🗺️ Available intermediate destinations: ${availableDestinations.length}`, availableDestinations.map(d => d.name));
    
    if (availableDestinations.length === 0) {
      console.warn(`⚠️ NO INTERMEDIATE DESTINATIONS AVAILABLE - trip will be direct`);
      return [];
    }
    
    // Take up to the needed number of destinations, but don't exceed what's available
    const maxIntermediateStops = Math.min(neededIntermediateStops, availableDestinations.length);
    const selectedDestinations = availableDestinations.slice(0, maxIntermediateStops);
    
    console.log(`✅ SELECTED ${selectedDestinations.length} intermediate destinations:`, selectedDestinations.map(d => d.name));
    
    return selectedDestinations;
  }

  /**
   * Check if this would be a duplicate segment (same start/end city)
   */
  private static isDuplicateSegment(startStop: TripStop, endStop: TripStop): boolean {
    const sameCity = startStop.name === endStop.name || startStop.city_name === endStop.city_name;
    const sameId = startStop.id === endStop.id;
    const isDuplicate = sameCity || sameId;
    
    if (isDuplicate) {
      console.log(`🚫 DUPLICATE DETECTED: ${startStop.name} → ${endStop.name}`);
    }
    
    return isDuplicate;
  }

  /**
   * CRITICAL FIX: Create validated segment with ABSOLUTE drive time enforcement
   */
  private static createValidatedSegment(
    startStop: TripStop,
    endStop: TripStop,
    day: number,
    styleConfig: TripStyleConfig
  ): DailySegment | null {
    const segmentDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    // Reject segments with insufficient distance (less than 5 miles indicates likely duplicate)
    if (segmentDistance < 5) {
      console.warn(`❌ REJECTING: Day ${day} segment too short (${segmentDistance.toFixed(1)}mi) - likely duplicate`);
      return null;
    }
    
    // CRITICAL FIX: Always use DriveTimeEnforcementService for ALL drive time calculations
    const enforcedDriveTime = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);
    
    console.log(`🚗 SEGMENT CREATION: Day ${day} ${startStop.name} → ${endStop.name}`, {
      distance: segmentDistance.toFixed(1),
      enforcedDriveTime: enforcedDriveTime.toFixed(1),
      styleLimit: styleConfig.maxDailyDriveHours,
      absoluteLimit: 10,
      isCompliant: enforcedDriveTime <= 10
    });
    
    // Create recommended stops (only destination cities)
    const segmentStops = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly([endStop]);
    const recommendedStops: RecommendedStop[] = segmentStops.map(stop => ({
      stopId: stop.id,
      id: stop.id,
      name: stop.name,
      description: stop.description,
      latitude: stop.latitude,
      longitude: stop.longitude,
      category: stop.category,
      city_name: stop.city_name,
      state: stop.state,
      city: stop.city || stop.city_name || 'Unknown'
    }));
    
    const segment: DailySegment = {
      day,
      title: `Day ${day}: ${startStop.city_name || startStop.name} to ${endStop.city_name || endStop.name}`,
      startCity: CityDisplayService.getCityDisplayName(startStop),
      endCity: CityDisplayService.getCityDisplayName(endStop),
      distance: segmentDistance,
      approximateMiles: Math.round(segmentDistance),
      driveTimeHours: parseFloat(enforcedDriveTime.toFixed(1)), // CRITICAL: Use enforced drive time
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
      driveTimeCategory: TripPlanUtils.getDriveTimeCategory(enforcedDriveTime),
      routeSection: TripPlanUtils.getRouteSection(day, 14)
    };
    
    // Add drive-time validation warning if needed
    if (enforcedDriveTime > styleConfig.maxDailyDriveHours) {
      segment.driveTimeWarning = `Drive time of ${enforcedDriveTime.toFixed(1)}h exceeds recommended ${styleConfig.maxDailyDriveHours}h for ${styleConfig.style} style`;
    }
    
    if (enforcedDriveTime >= 10) {
      segment.driveTimeWarning = `Maximum drive time reached (${enforcedDriveTime.toFixed(1)}h) - consider extending trip duration`;
    }
    
    return segment;
  }

  /**
   * Legacy method for backward compatibility
   */
  static buildSegmentsWithDestinationCitiesLegacy(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number
  ): DailySegment[] {
    // Use balanced style as default for legacy calls
    const defaultStyleConfig = {
      style: 'balanced' as const,
      maxDailyDriveHours: 6,
      preferDestinationCities: false,
      allowFlexibleStops: true,
      balancePriority: 'distance' as const,
      enforcementLevel: 'strict' as const
    };
    
    return this.buildSegmentsWithDestinationCities(
      startStop,
      endStop,
      destinationCities,
      tripDays,
      defaultStyleConfig
    );
  }
}
