import { TripStop } from '../../types/TripStop';
import { DailySegment, DriveTimeCategory } from './TripPlanTypes';
import { Route66SequenceEnforcer } from './Route66SequenceEnforcer';
import { DriveTimeConstraintEnforcer, DriveTimeConstraint } from './DriveTimeConstraintEnforcer';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { TripSegmentBuilderV2 } from './TripSegmentBuilderV2';

export interface TripPlanningResult {
  segments: DailySegment[];
  isValid: boolean;
  validationResults: {
    sequenceValidation: any;
    driveTimeValidation: any;
    feasibilityCheck: any;
  };
  adjustedTripDays: number;
  warnings: string[];
  debugInfo: any;
}

export class EnhancedTripPlanningService {
  /**
   * Plan a Route 66 trip with absolute constraint enforcement
   */
  static planTripWithConstraints(
    startLocation: string,
    endLocation: string,
    requestedDays: number,
    tripStyle: string,
    allStops: TripStop[]
  ): TripPlanningResult {
    console.log(`🚀 ENHANCED TRIP PLANNING: ${startLocation} → ${endLocation}, ${requestedDays} days, ${tripStyle} style`);
    
    const constraints = DriveTimeConstraintEnforcer.createConstraintsForTripStyle(tripStyle);
    const warnings: string[] = [];
    const debugInfo: any = {
      originalRequest: { startLocation, endLocation, requestedDays, tripStyle },
      constraints,
      steps: []
    };
    
    // STEP 1: Find and validate start/end stops
    const { startStop, endStop } = this.findAndValidateEndpoints(startLocation, endLocation, allStops);
    debugInfo.steps.push({ step: 'endpoints', startStop: startStop.name, endStop: endStop.name });
    
    // STEP 2: Check trip feasibility
    const feasibilityCheck = DriveTimeConstraintEnforcer.calculateMinimumTripDays(startStop, endStop, constraints);
    debugInfo.steps.push({ step: 'feasibility', ...feasibilityCheck });
    
    let adjustedTripDays = requestedDays;
    if (requestedDays < feasibilityCheck.minimumDays) {
      adjustedTripDays = feasibilityCheck.minimumDays;
      warnings.push(`Trip extended from ${requestedDays} to ${adjustedTripDays} days to meet drive time constraints`);
      console.log(`⚠️ TRIP EXTENDED: ${requestedDays} → ${adjustedTripDays} days for feasibility`);
    }
    
    // STEP 3: Filter to destination cities only
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    debugInfo.steps.push({ step: 'destinationCities', count: destinationCities.length });
    
    // STEP 4: Enforce Route 66 sequence direction
    const sequenceResult = Route66SequenceEnforcer.enforceSequenceDirection(startStop, endStop, destinationCities);
    debugInfo.steps.push({ step: 'sequenceEnforcement', ...sequenceResult });
    
    // STEP 5: Enforce drive time constraints
    const driveTimeResult = DriveTimeConstraintEnforcer.filterDestinationsByDriveTime(
      startStop, sequenceResult.validStops, constraints
    );
    debugInfo.steps.push({ step: 'driveTimeConstraints', ...driveTimeResult });
    
    // STEP 6: Select optimal destinations
    const selectedDestinations = this.selectOptimalDestinations(
      startStop, endStop, driveTimeResult.validDestinations, adjustedTripDays - 1, constraints
    );
    debugInfo.steps.push({ step: 'destinationSelection', count: selectedDestinations.length });
    
    // STEP 7: Build segments with validated constraints
    const segments = this.buildValidatedSegments(
      startStop, endStop, selectedDestinations, adjustedTripDays, constraints
    );
    debugInfo.steps.push({ step: 'segmentBuilding', segmentCount: segments.length });
    
    // STEP 8: Final validation
    const finalValidation = this.performFinalValidation(segments, constraints);
    debugInfo.steps.push({ step: 'finalValidation', ...finalValidation });
    
    if (!finalValidation.isValid) {
      warnings.push(...finalValidation.violations);
    }
    
    console.log(`✅ ENHANCED PLANNING COMPLETE: ${segments.length} segments, ${warnings.length} warnings`);
    
    return {
      segments,
      isValid: finalValidation.isValid,
      validationResults: {
        sequenceValidation: Route66SequenceEnforcer.validateTripSequence(segments),
        driveTimeValidation: finalValidation,
        feasibilityCheck
      },
      adjustedTripDays,
      warnings,
      debugInfo
    };
  }
  
  /**
   * Find and validate start/end stops
   */
  private static findAndValidateEndpoints(
    startLocation: string,
    endLocation: string,
    allStops: TripStop[]
  ): { startStop: TripStop; endStop: TripStop } {
    const startStop = allStops.find(stop => 
      stop.city_name?.toLowerCase().includes(startLocation.toLowerCase()) ||
      stop.name.toLowerCase().includes(startLocation.toLowerCase())
    );
    
    const endStop = allStops.find(stop => 
      stop.city_name?.toLowerCase().includes(endLocation.toLowerCase()) ||
      stop.name.toLowerCase().includes(endLocation.toLowerCase())
    );
    
    if (!startStop) {
      throw new Error(`Start location "${startLocation}" not found in Route 66 stops`);
    }
    
    if (!endStop) {
      throw new Error(`End location "${endLocation}" not found in Route 66 stops`);
    }
    
    console.log(`🎯 ENDPOINTS: ${startStop.name} → ${endStop.name}`);
    return { startStop, endStop };
  }
  
  /**
   * Select optimal destinations with constraint validation
   */
  private static selectOptimalDestinations(
    startStop: TripStop,
    endStop: TripStop,
    validDestinations: TripStop[],
    neededDestinations: number,
    constraints: DriveTimeConstraint
  ): TripStop[] {
    console.log(`🎯 SELECTING: ${neededDestinations} destinations from ${validDestinations.length} valid options`);
    
    if (validDestinations.length === 0) {
      console.warn(`⚠️ NO VALID DESTINATIONS - returning empty array`);
      return [];
    }
    
    // Sort by distance from start to get good progression
    const sortedDestinations = validDestinations.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, b.latitude, b.longitude
      );
      return distA - distB;
    });
    
    // Select destinations with progressive distance validation
    const selectedDestinations: TripStop[] = [];
    let currentStop = startStop;
    
    for (let i = 0; i < neededDestinations && sortedDestinations.length > 0; i++) {
      // Find the best next destination that maintains constraints
      const nextDestination = sortedDestinations.find(dest => {
        const validation = DriveTimeConstraintEnforcer.enforceAbsoluteMaxDriveTime(
          currentStop, dest, constraints
        );
        return validation.isValid && !selectedDestinations.some(selected => selected.id === dest.id);
      });
      
      if (nextDestination) {
        selectedDestinations.push(nextDestination);
        currentStop = nextDestination;
        console.log(`✅ SELECTED: ${nextDestination.name} for day ${i + 2}`);
      } else {
        console.warn(`⚠️ No valid destination found for day ${i + 2}`);
        break;
      }
    }
    
    return selectedDestinations;
  }
  
  /**
   * Build segments with validation
   */
  private static buildValidatedSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    tripDays: number,
    constraints: DriveTimeConstraint
  ): DailySegment[] {
    console.log(`🏗️ BUILDING SEGMENTS: ${destinations.length + 1} segments for ${tripDays} days`);
    
    const segments: DailySegment[] = [];
    const allStops = [startStop, ...destinations, endStop];
    
    for (let i = 0; i < allStops.length - 1; i++) {
      const currentStop = allStops[i];
      const nextStop = allStops[i + 1];
      const day = i + 1;
      
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );
      
      const driveTime = Math.min(
        distance / 60, // Conservative speed estimate
        constraints.maxDailyHours
      );

      // Create proper DriveTimeCategory object instead of string
      const driveTimeCategory: DriveTimeCategory = {
        category: driveTime <= 6 ? 'comfortable' : driveTime <= 8 ? 'moderate' : 'extended',
        message: driveTime <= 6 ? 'Comfortable drive' : driveTime <= 8 ? 'Moderate drive' : 'Extended drive',
        color: driveTime <= 6 ? 'green' : driveTime <= 8 ? 'yellow' : 'red'
      };
      
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.name} to ${nextStop.name}`,
        startCity: currentStop.city_name || currentStop.name,
        endCity: nextStop.city_name || nextStop.name,
        distance,
        approximateMiles: Math.round(distance),
        driveTimeHours: driveTime,
        destination: {
          city: nextStop.city_name || nextStop.name,
          state: nextStop.state
        },
        recommendedStops: [{
          stopId: nextStop.id,
          id: nextStop.id,
          name: nextStop.name,
          description: nextStop.description,
          latitude: nextStop.latitude,
          longitude: nextStop.longitude,
          category: nextStop.category,
          city_name: nextStop.city_name,
          state: nextStop.state,
          city: nextStop.city || nextStop.city_name || 'Unknown'
        }],
        attractions: [],
        driveTimeCategory,
        routeSection: `Section ${Math.ceil(day / 3)}`
      };
      
      segments.push(segment);
    }
    
    return segments;
  }
  
  /**
   * Perform final validation of the complete trip
   */
  private static performFinalValidation(
    segments: DailySegment[],
    constraints: DriveTimeConstraint
  ): {
    isValid: boolean;
    violations: string[];
    totalDriveTime: number;
    maxDailyDriveTime: number;
  } {
    const violations: string[] = [];
    let totalDriveTime = 0;
    let maxDailyDriveTime = 0;
    
    for (const segment of segments) {
      totalDriveTime += segment.driveTimeHours;
      maxDailyDriveTime = Math.max(maxDailyDriveTime, segment.driveTimeHours);
      
      if (segment.driveTimeHours > constraints.maxDailyHours) {
        violations.push(`Day ${segment.day}: ${segment.driveTimeHours.toFixed(1)}h exceeds ${constraints.maxDailyHours}h limit`);
      }
    }
    
    const isValid = violations.length === 0;
    
    console.log(`🔍 FINAL VALIDATION: ${isValid ? 'PASSED' : 'FAILED'} - ${violations.length} violations`);
    
    return {
      isValid,
      violations,
      totalDriveTime,
      maxDailyDriveTime
    };
  }
}
