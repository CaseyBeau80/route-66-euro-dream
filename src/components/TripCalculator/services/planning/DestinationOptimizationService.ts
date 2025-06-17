
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationPriorityService } from './DestinationPriorityService';
import { DistanceBasedDestinationService } from './DistanceBasedDestinationService';
import { SequenceOrderService } from './SequenceOrderService';

export class DestinationOptimizationService {
  /**
   * Enhanced next day destination selection with sequence-order enforcement
   */
  static selectNextDayDestination(
    currentStop: TripStop, 
    finalDestination: TripStop, 
    availableStops: TripStop[], 
    remainingDays: number,
    driveTimeTarget?: DriveTimeTarget
  ): TripStop {
    if (availableStops.length === 0 || remainingDays <= 1) {
      return finalDestination;
    }

    // Determine trip direction and filter by sequence
    const direction = SequenceOrderService.getTripDirection(currentStop, finalDestination);
    const sequenceValidStops = SequenceOrderService.filterStopsInSequence(
      currentStop,
      availableStops,
      direction
    );

    console.log(`🧭 ${direction} travel: ${sequenceValidStops.length} sequence-valid stops from ${availableStops.length} total`);

    if (sequenceValidStops.length === 0) {
      console.warn(`⚠️ No sequence-valid stops found, using fallback selection`);
      return this.fallbackDestinationSelection(currentStop, finalDestination, availableStops, driveTimeTarget);
    }

    // Calculate target distance for even distribution
    const totalRemainingDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );
    const targetDailyDistance = totalRemainingDistance / remainingDays;

    // Use sequence-aware selection
    const selectedDestination = SequenceOrderService.selectNextInSequence(
      currentStop,
      sequenceValidStops,
      direction,
      targetDailyDistance
    );

    if (selectedDestination) {
      const selectedOrder = SequenceOrderService.getSequenceOrder(selectedDestination);
      const currentOrder = SequenceOrderService.getSequenceOrder(currentStop);
      console.log(`✅ Sequence-aware selection: ${selectedDestination.name} (${currentOrder} → ${selectedOrder})`);
      return selectedDestination;
    }

    // Fallback to priority-based selection within sequence-valid stops
    if (driveTimeTarget) {
      const balancedDestination = DestinationPriorityService.selectDestinationWithPriority(
        currentStop,
        sequenceValidStops,
        driveTimeTarget
      );
      
      if (balancedDestination) {
        console.log(`✅ Priority-based fallback: ${balancedDestination.name}`);
        return balancedDestination;
      }
    }

    // Final fallback to distance-based selection
    return DistanceBasedDestinationService.selectDestinationByDistance(
      currentStop, 
      finalDestination, 
      sequenceValidStops, 
      targetDailyDistance
    );
  }

  /**
   * Fallback destination selection when sequence validation fails
   */
  private static fallbackDestinationSelection(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    driveTimeTarget?: DriveTimeTarget
  ): TripStop {
    console.warn(`🚨 Using fallback destination selection (no sequence validation)`);

    // Try to find destination cities first
    const destinationCities = availableStops.filter(stop => 
      stop.category === 'destination_city'
    );

    if (destinationCities.length > 0) {
      // Use distance-based selection among destination cities
      const totalRemainingDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        finalDestination.latitude, finalDestination.longitude
      );

      return DistanceBasedDestinationService.selectDestinationByDistance(
        currentStop,
        finalDestination,
        destinationCities,
        totalRemainingDistance / 2 // Rough estimate for remaining journey
      );
    }

    // Last resort - return final destination
    console.warn(`🚨 Last resort: returning final destination`);
    return finalDestination;
  }

  /**
   * Select optimal destination for a day with sequence validation
   */
  static selectOptimalDayDestination(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    targetDistance: number,
    driveTimeTarget?: DriveTimeTarget
  ): TripStop {
    if (availableStops.length === 0) return finalDestination;

    // First filter by sequence order
    const direction = SequenceOrderService.getTripDirection(currentStop, finalDestination);
    const sequenceValidStops = SequenceOrderService.filterStopsInSequence(
      currentStop,
      availableStops,
      direction
    );

    const candidateStops = sequenceValidStops.length > 0 ? sequenceValidStops : availableStops;

    // Try sequence-aware selection first
    if (sequenceValidStops.length > 0) {
      const sequenceSelection = SequenceOrderService.selectNextInSequence(
        currentStop,
        sequenceValidStops,
        direction,
        targetDistance
      );

      if (sequenceSelection) {
        console.log(`🎯 Optimal sequence selection: ${sequenceSelection.name}`);
        return sequenceSelection;
      }
    }

    // Fallback to drive time balanced selection
    if (driveTimeTarget) {
      const balancedDestination = DestinationPriorityService.selectDestinationWithPriority(
        currentStop,
        candidateStops,
        driveTimeTarget
      );
      
      if (balancedDestination) {
        return balancedDestination;
      }
    }

    // Final fallback to distance-based selection
    return DistanceBasedDestinationService.selectDestinationByDistance(
      currentStop, 
      finalDestination, 
      candidateStops, 
      targetDistance
    );
  }
}
