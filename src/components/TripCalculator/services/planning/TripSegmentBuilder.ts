
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
    console.log(`🏗️ ENHANCED SEGMENT BUILDING WITH DRIVE TIME ENFORCEMENT: ${tripDays} days, ${styleConfig.style} style, max ${styleConfig.maxDailyDriveHours}h/day`);
    console.log(`🏗️ Available destination cities: ${destinationCities.length}`, destinationCities.map(c => c.name));
    
    // STEP 1: Create initial segments with proper validation
    const initialSegments = this.createInitialSegments(
      startStop,
      endStop,
      destinationCities,
      tripDays,
      styleConfig
    );
    
    console.log(`🏗️ Initial segments created: ${initialSegments.length}`);
    
    // STEP 2: ENHANCED - Apply drive time enforcement to all segments
    const enforcedSegments = this.enforceSegmentDriveTimes(
      initialSegments,
      destinationCities,
      styleConfig
    );
    
    console.log(`🚗 Drive time enforcement applied: ${enforcedSegments.length} final segments`);
    
    // STEP 3: Analyze for completion and duplicates
    const completionAnalysis = TripCompletionService.analyzeTripCompletion(
      enforcedSegments,
      tripDays,
      destinationCities
    );
    
    console.log(`🔍 COMPLETION ANALYSIS:`, {
      isCompleted: completionAnalysis.isCompleted,
      completedOnDay: completionAnalysis.completedOnDay,
      unusedDays: completionAnalysis.unusedDays,
      duplicateSegments: completionAnalysis.duplicateSegments.length
    });
    
    // STEP 4: Clean up segments if needed
    let finalSegments = enforcedSegments;
    
    if (completionAnalysis.isCompleted || completionAnalysis.duplicateSegments.length > 0) {
      console.log(`🧹 CLEANING UP: Removing ${completionAnalysis.duplicateSegments.length} duplicate segments`);
      finalSegments = TripCompletionService.cleanupSegments(enforcedSegments);
    }
    
    // STEP 5: Final validation
    console.log(`🏗️ FINAL SEGMENTS: ${finalSegments.length} segments created`);
    finalSegments.forEach((segment, index) => {
      console.log(`   Day ${segment.day}: ${segment.startCity} → ${segment.endCity} (${segment.distance.toFixed(1)}mi, ${segment.driveTimeHours.toFixed(1)}h)`);
    });
    
    return finalSegments;
  }

  /**
   * ENHANCED: Enforce drive time limits on all segments
   */
  private static enforceSegmentDriveTimes(
    segments: DailySegment[],
    availableStops: TripStop[],
    styleConfig: TripStyleConfig
  ): DailySegment[] {
    console.log(`🚗 ENFORCING DRIVE TIMES ON ${segments.length} SEGMENTS`);
    
    const enforcedSegments: DailySegment[] = [];
    let currentDay = 1;
    
    for (const segment of segments) {
      const validation = DriveTimeEnforcementService.validateSegmentDriveTime(
        this.segmentToTripStop(segment, 'start'),
        this.segmentToTripStop(segment, 'end'),
        styleConfig
      );
      
      if (validation.isValid) {
        // Segment is fine, just update day number and add to results
        // FIXED: Use the validated drive time from the enforcement service
        const validatedDriveTime = DriveTimeEnforcementService.calculateRealisticDriveTime(segment.distance);
        enforcedSegments.push({
          ...segment,
          day: currentDay,
          driveTimeHours: validatedDriveTime // Use validated drive time
        });
        currentDay++;
        console.log(`✅ SEGMENT OK: Day ${currentDay - 1} - ${segment.startCity} → ${segment.endCity} (${validatedDriveTime.toFixed(1)}h)`);
      } else {
        // Segment violates drive time, need to split
        console.log(`❌ DRIVE TIME VIOLATION: ${segment.startCity} → ${segment.endCity} (${validation.actualDriveTime.toFixed(1)}h exceeds ${styleConfig.maxDailyDriveHours}h)`);
        
        const startStop = this.segmentToTripStop(segment, 'start');
        const endStop = this.segmentToTripStop(segment, 'end');
        
        const enforcementResult = DriveTimeEnforcementService.enforceMaxDriveTimePerSegment(
          startStop,
          endStop,
          availableStops,
          styleConfig
        );
        
        if (enforcementResult.isValid && enforcementResult.segments.length > 1) {
          // Successfully split segment, create new daily segments
          console.log(`🔧 SPLIT SUCCESS: Created ${enforcementResult.segments.length} segments from 1`);
          
          for (let i = 0; i < enforcementResult.segments.length; i++) {
            const splitSegment = enforcementResult.segments[i];
            const newSegment = this.createValidatedSegment(
              splitSegment.startStop,
              splitSegment.endStop,
              currentDay,
              styleConfig
            );
            
            if (newSegment) {
              enforcedSegments.push(newSegment);
              currentDay++;
              console.log(`✅ SPLIT SEGMENT: Day ${currentDay - 1} - ${newSegment.startCity} → ${newSegment.endCity} (${newSegment.driveTimeHours.toFixed(1)}h)`);
            }
          }
        } else {
          // Could not split, keep original but add warning
          console.warn(`⚠️ COULD NOT SPLIT: Keeping original segment with warning`);
          const validatedDriveTime = DriveTimeEnforcementService.calculateRealisticDriveTime(segment.distance);
          enforcedSegments.push({
            ...segment,
            day: currentDay,
            driveTimeHours: validatedDriveTime, // Use validated drive time
            driveTimeWarning: validation.recommendation || `${validation.actualDriveTime.toFixed(1)}h drive exceeds safe ${styleConfig.maxDailyDriveHours}h limit`
          });
          currentDay++;
        }
      }
    }
    
    console.log(`🚗 DRIVE TIME ENFORCEMENT COMPLETE: ${segments.length} → ${enforcedSegments.length} segments`);
    return enforcedSegments;
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
        latitude: 0, // Will be populated from recommended stops if available
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
        latitude: 0, // Will be populated from recommended stops if available
        longitude: 0,
        category: 'destination_city',
        description: `End point for day ${segment.day}`
      };
    }
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
   * Create a validated segment with proper distance checking
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
    
    // FIXED: Use DriveTimeEnforcementService for validated drive time calculation
    const driveTimeHours = DriveTimeEnforcementService.calculateRealisticDriveTime(segmentDistance);
    
    // Validate drive time against style limits
    const validation = DriveTimeEnforcementService.validateSegmentDriveTime(
      startStop,
      endStop,
      styleConfig
    );
    
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
      driveTimeHours: parseFloat(driveTimeHours.toFixed(1)), // FIXED: Use validated drive time
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
      driveTimeCategory: TripPlanUtils.getDriveTimeCategory(driveTimeHours),
      routeSection: TripPlanUtils.getRouteSection(day, 14)
    };
    
    // Add drive-time validation warning if needed
    if (!validation.isValid && validation.recommendation) {
      segment.driveTimeWarning = validation.recommendation;
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
