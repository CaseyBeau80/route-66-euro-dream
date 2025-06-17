
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationPriorityService } from './DestinationPriorityService';
import { DistanceBasedDestinationService } from './DistanceBasedDestinationService';
import { SequenceOrderService } from './SequenceOrderService';
import { PopulationScoringService } from './PopulationScoringService';
import { TripStyleLogic } from './TripStyleLogic';

export class DestinationOptimizationService {
  /**
   * Enhanced next day destination selection with population-aware sequence-order enforcement
   */
  static selectNextDayDestination(
    currentStop: TripStop, 
    finalDestination: TripStop, 
    availableStops: TripStop[], 
    remainingDays: number,
    driveTimeTarget?: DriveTimeTarget,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): TripStop {
    if (availableStops.length === 0 || remainingDays <= 1) {
      return finalDestination;
    }

    console.log(`🎯 Population-aware destination selection (${tripStyle} style, ${remainingDays} days remaining)`);

    // Get trip style configuration for population weighting
    const styleConfig = TripStyleLogic.getStyleConfig(tripStyle);

    // Determine trip direction and filter by sequence
    const direction = SequenceOrderService.getTripDirection(currentStop, finalDestination);
    const sequenceValidStops = SequenceOrderService.filterStopsInSequence(
      currentStop,
      availableStops,
      direction
    );

    console.log(`🧭 ${direction} travel: ${sequenceValidStops.length} sequence-valid stops from ${availableStops.length} total`);

    // Apply population filtering based on trip style
    const populationFilteredStops = PopulationScoringService.filterByPopulationThreshold(
      sequenceValidStops.length > 0 ? sequenceValidStops : availableStops,
      tripStyle,
      styleConfig.enforcementLevel === 'strict'
    );

    console.log(`📊 Population filter: ${sequenceValidStops.length} → ${populationFilteredStops.length} stops (${tripStyle} style)`);

    if (populationFilteredStops.length === 0) {
      console.warn(`⚠️ No population-valid stops found, using fallback selection`);
      return this.fallbackDestinationSelection(currentStop, finalDestination, availableStops, driveTimeTarget);
    }

    // Calculate target distance for even distribution
    const totalRemainingDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );
    const targetDailyDistance = totalRemainingDistance / remainingDays;

    // Use population-enhanced sequence-aware selection
    const selectedDestination = this.selectOptimalPopulationAwareDestination(
      currentStop,
      finalDestination,
      populationFilteredStops,
      targetDailyDistance,
      styleConfig,
      direction
    );

    if (selectedDestination) {
      const popScore = PopulationScoringService.calculatePopulationScore(selectedDestination);
      const selectedOrder = SequenceOrderService.getSequenceOrder(selectedDestination);
      const currentOrder = SequenceOrderService.getSequenceOrder(currentStop);
      
      console.log(`✅ Population-aware selection: ${selectedDestination.name} (${currentOrder} → ${selectedOrder}, pop: ${popScore.rawPopulation.toLocaleString()}, tier: ${popScore.tier})`);
      return selectedDestination;
    }

    // Fallback to priority-based selection within population-filtered stops
    if (driveTimeTarget) {
      const balancedDestination = DestinationPriorityService.selectDestinationWithPriority(
        currentStop,
        populationFilteredStops,
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
      populationFilteredStops, 
      targetDailyDistance
    );
  }

  /**
   * Select optimal destination with population-aware scoring
   */
  private static selectOptimalPopulationAwareDestination(
    currentStop: TripStop,
    finalDestination: TripStop,
    candidateStops: TripStop[],
    targetDistance: number,
    styleConfig: any,
    direction: 'eastbound' | 'westbound'
  ): TripStop | null {
    if (candidateStops.length === 0) return null;

    let bestDestination: TripStop | null = null;
    let bestScore = -1;

    console.log(`🎯 Evaluating ${candidateStops.length} candidates with population weighting (${styleConfig.populationWeight})`);

    for (const candidate of candidateStops) {
      // Calculate distance score (how close to target)
      const distanceFromCurrent = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        candidate.latitude, candidate.longitude
      );

      const distanceScore = 100 - Math.abs(distanceFromCurrent - targetDistance) / targetDistance * 100;
      const clampedDistanceScore = Math.max(0, Math.min(100, distanceScore));

      // Calculate population-enhanced score
      const populationEnhancedScore = TripStyleLogic.calculateDestinationScore(
        candidate,
        styleConfig,
        clampedDistanceScore
      );

      // Bonus for sequence order compliance
      const sequenceBonus = this.calculateSequenceBonus(currentStop, candidate, finalDestination, direction);

      // Bonus for destination city category
      const categoryBonus = candidate.category === 'destination_city' ? 10 : 0;

      // Final combined score
      const totalScore = populationEnhancedScore + sequenceBonus + categoryBonus;

      const popScore = PopulationScoringService.calculatePopulationScore(candidate);
      console.log(`   📊 ${candidate.name}: distance=${clampedDistanceScore.toFixed(1)}, population-enhanced=${populationEnhancedScore.toFixed(1)}, sequence=${sequenceBonus}, total=${totalScore.toFixed(1)} (pop: ${popScore.rawPopulation.toLocaleString()}, tier: ${popScore.tier})`);

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestDestination = candidate;
      }
    }

    return bestDestination;
  }

  /**
   * Calculate bonus for sequence order compliance
   */
  private static calculateSequenceBonus(
    currentStop: TripStop,
    candidate: TripStop,
    finalDestination: TripStop,
    direction: 'eastbound' | 'westbound'
  ): number {
    const currentOrder = SequenceOrderService.getSequenceOrder(currentStop);
    const candidateOrder = SequenceOrderService.getSequenceOrder(candidate);
    const finalOrder = SequenceOrderService.getSequenceOrder(finalDestination);

    if (currentOrder === null || candidateOrder === null || finalOrder === null) {
      return 0; // No sequence data
    }

    // Check if candidate maintains proper sequence direction
    const properDirection = direction === 'eastbound' 
      ? candidateOrder < currentOrder && candidateOrder > finalOrder
      : candidateOrder > currentOrder && candidateOrder < finalOrder;

    return properDirection ? 15 : -5; // Bonus for correct direction, penalty for wrong direction
  }

  /**
   * Fallback destination selection when population/sequence validation fails
   */
  private static fallbackDestinationSelection(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    driveTimeTarget?: DriveTimeTarget
  ): TripStop {
    console.warn(`🚨 Using fallback destination selection (no population/sequence validation)`);

    // Try to find destination cities first, regardless of population
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
        totalRemainingDistance / 2
      );
    }

    // Last resort - return final destination
    console.warn(`🚨 Last resort: returning final destination`);
    return finalDestination;
  }

  /**
   * Select optimal destination for a day with population-aware sequence validation
   */
  static selectOptimalDayDestination(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    targetDistance: number,
    driveTimeTarget?: DriveTimeTarget,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): TripStop {
    if (availableStops.length === 0) return finalDestination;

    const styleConfig = TripStyleLogic.getStyleConfig(tripStyle);

    // Apply population and sequence filtering
    const direction = SequenceOrderService.getTripDirection(currentStop, finalDestination);
    const sequenceValidStops = SequenceOrderService.filterStopsInSequence(
      currentStop,
      availableStops,
      direction
    );

    const populationValidStops = PopulationScoringService.filterByPopulationThreshold(
      sequenceValidStops.length > 0 ? sequenceValidStops : availableStops,
      tripStyle,
      styleConfig.enforcementLevel === 'strict'
    );

    const candidateStops = populationValidStops.length > 0 ? populationValidStops : availableStops;

    // Try population-enhanced sequence-aware selection first
    if (candidateStops.length > 0) {
      const optimalSelection = this.selectOptimalPopulationAwareDestination(
        currentStop,
        finalDestination,
        candidateStops,
        targetDistance,
        styleConfig,
        direction
      );

      if (optimalSelection) {
        console.log(`🎯 Optimal population-aware selection: ${optimalSelection.name}`);
        return optimalSelection;
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
