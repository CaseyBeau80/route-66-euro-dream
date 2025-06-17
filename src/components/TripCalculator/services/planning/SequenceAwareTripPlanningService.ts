
import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './TripPlanTypes';
import { SequenceOrderService } from './SequenceOrderService';
import { DestinationOptimizationService } from './DestinationOptimizationService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { TripSegmentBuilder } from './TripSegmentBuilder';

export interface SequenceAwarePlanningResult {
  segments: DailySegment[];
  isValid: boolean;
  sequenceValidation: {
    isValid: boolean;
    violations: Array<{ from: string; to: string; reason: string }>;
  };
  selectedDestinations: TripStop[];
  tripDirection: 'eastbound' | 'westbound';
  totalDistance: number;
  averageDailyDistance: number;
  warnings: string[];
}

export class SequenceAwareTripPlanningService {
  /**
   * Plan a trip with strict sequence order enforcement
   */
  static planTripWithSequenceValidation(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): SequenceAwarePlanningResult {
    console.log(`🗺️ Planning sequence-aware trip: ${startStop.name} → ${endStop.name} (${requestedDays} days)`);
    
    const warnings: string[] = [];
    
    // Determine trip direction
    const tripDirection = SequenceOrderService.getTripDirection(startStop, endStop);
    console.log(`🧭 Trip direction: ${tripDirection}`);
    
    // Filter to destination cities only
    const destinationCities = allStops.filter(stop => 
      stop.category === 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );
    
    // Filter and sort by sequence order
    const sequenceValidStops = SequenceOrderService.filterStopsInSequence(
      startStop,
      destinationCities,
      tripDirection
    );
    
    const sortedStops = SequenceOrderService.sortBySequence(sequenceValidStops, tripDirection);
    
    console.log(`📍 ${sortedStops.length} sequence-valid destination cities available`);
    
    if (sortedStops.length === 0) {
      warnings.push('No destination cities found in the correct sequence direction');
    }
    
    // Calculate total distance and daily targets
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const averageDailyDistance = totalDistance / requestedDays;
    
    // Select intermediate destinations (need requestedDays - 1 destinations)
    const neededDestinations = Math.max(0, requestedDays - 1);
    const selectedDestinations = this.selectSequenceValidDestinations(
      startStop,
      endStop,
      sortedStops,
      neededDestinations,
      averageDailyDistance,
      tripDirection
    );
    
    console.log(`🎯 Selected ${selectedDestinations.length}/${neededDestinations} intermediate destinations`);
    
    if (selectedDestinations.length < neededDestinations) {
      warnings.push(`Only found ${selectedDestinations.length} suitable destinations out of ${neededDestinations} needed`);
    }
    
    // Build segments with the selected destinations
    const segments = TripSegmentBuilder.buildSegmentsWithDestinationCities(
      startStop,
      endStop,
      selectedDestinations,
      requestedDays,
      { maxDailyDriveHours: 8 } // Basic style config
    );
    
    // Validate final sequence
    const allTripStops = [startStop, ...selectedDestinations, endStop];
    const sequenceValidation = SequenceOrderService.validateSequenceProgression(allTripStops);
    
    if (!sequenceValidation.isValid) {
      warnings.push('Final trip sequence contains violations');
      console.warn(`⚠️ Sequence violations:`, sequenceValidation.violations);
    } else {
      console.log(`✅ Trip sequence validation passed`);
    }
    
    // Calculate success metrics
    const isValid = segments.length > 0 && sequenceValidation.isValid;
    
    return {
      segments,
      isValid,
      sequenceValidation,
      selectedDestinations,
      tripDirection,
      totalDistance,
      averageDailyDistance,
      warnings
    };
  }

  /**
   * Select destinations that maintain sequence order and even distribution
   */
  private static selectSequenceValidDestinations(
    startStop: TripStop,
    endStop: TripStop,
    sortedStops: TripStop[],
    neededCount: number,
    targetDailyDistance: number,
    direction: 'eastbound' | 'westbound'
  ): TripStop[] {
    const selectedDestinations: TripStop[] = [];
    const usedIds = new Set<string>();
    let currentStop = startStop;
    
    if (neededCount <= 0 || sortedStops.length === 0) {
      return selectedDestinations;
    }
    
    for (let i = 0; i < neededCount; i++) {
      const availableStops = sortedStops.filter(stop => !usedIds.has(stop.id));
      
      if (availableStops.length === 0) {
        console.warn(`⚠️ No more available stops for destination ${i + 1}`);
        break;
      }
      
      // Use sequence-aware selection
      const nextDestination = SequenceOrderService.selectNextInSequence(
        currentStop,
        availableStops,
        direction,
        targetDailyDistance
      );
      
      if (nextDestination) {
        selectedDestinations.push(nextDestination);
        usedIds.add(nextDestination.id);
        currentStop = nextDestination;
        
        const distanceFromStart = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          nextDestination.latitude, nextDestination.longitude
        );
        
        console.log(`✅ Selected destination ${i + 1}: ${nextDestination.name} (${distanceFromStart.toFixed(0)} miles from start)`);
      } else {
        console.warn(`⚠️ Could not find suitable destination ${i + 1} in sequence`);
        break;
      }
    }
    
    return selectedDestinations;
  }

  /**
   * Get summary of sequence-aware planning
   */
  static getPlanningResultSummary(result: SequenceAwarePlanningResult): string {
    const parts = [
      `${result.segments.length} day trip`,
      `${result.tripDirection} direction`,
      `${result.selectedDestinations.length} intermediate destinations`,
      `${Math.round(result.totalDistance)} total miles`,
      `${Math.round(result.averageDailyDistance)} miles/day average`
    ];
    
    if (result.warnings.length > 0) {
      parts.push(`${result.warnings.length} warnings`);
    }
    
    if (result.sequenceValidation.isValid) {
      parts.push('sequence validated');
    } else {
      parts.push('sequence violations');
    }
    
    return parts.join(', ');
  }
}
