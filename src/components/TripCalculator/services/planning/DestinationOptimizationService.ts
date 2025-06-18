
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationPriorityService } from './DestinationPriorityService';
import { DistanceBasedDestinationService } from './DistanceBasedDestinationService';
import { SequenceOrderService } from './SequenceOrderService';
import { PopulationScoringService } from './PopulationScoringService';
import { TripStyleLogic } from './TripStyleLogic';
import { EnhancedDestinationPriorityService } from './EnhancedDestinationPriorityService';
import { EnhancedTripStyleLogic } from './EnhancedTripStyleLogic';
import { HeritageScoringService } from './HeritageScoringService';
import { HeritageFirstSelectionService } from './HeritageFirstSelectionService';

export class DestinationOptimizationService {
  /**
   * ENHANCED: Heritage-aware destination selection with sequence-order enforcement and smart fallbacks
   */
  static selectNextDayDestination(
    currentStop: TripStop, 
    finalDestination: TripStop, 
    availableStops: TripStop[], 
    remainingDays: number,
    driveTimeTarget?: DriveTimeTarget,
    tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'
  ): TripStop {
    if (availableStops.length === 0 || remainingDays <= 1) {
      return finalDestination;
    }

    console.log(`🏛️ HERITAGE-ENHANCED destination selection (${tripStyle} style, ${remainingDays} days remaining)`);

    // Get enhanced trip style configuration
    const enhancedConfig = EnhancedTripStyleLogic.getEnhancedStyleConfig(tripStyle);

    // Determine trip direction and filter by sequence
    const direction = SequenceOrderService.getTripDirection(currentStop, finalDestination);
    const sequenceValidStops = SequenceOrderService.filterStopsInSequence(
      currentStop,
      availableStops,
      direction
    );

    console.log(`🧭 ${direction} travel: ${sequenceValidStops.length} sequence-valid stops from ${availableStops.length} total`);

    // Create drive time target if not provided
    const totalRemainingDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );
    const targetDailyDistance = totalRemainingDistance / remainingDays;
    const targetDriveTime = targetDailyDistance / 50; // 50 mph average

    const effectiveDriveTimeTarget = driveTimeTarget || {
      targetHours: targetDriveTime,
      minHours: Math.max(2, targetDriveTime * 0.5),
      maxHours: Math.min(enhancedConfig.maxDailyDriveHours || 10, targetDriveTime * 1.5)
    };

    // Use heritage-first selection with smart fallbacks
    const candidateStops = sequenceValidStops.length > 0 ? sequenceValidStops : availableStops;
    
    const heritageResult = HeritageFirstSelectionService.selectDestinationWithHeritagePriority(
      currentStop,
      candidateStops,
      effectiveDriveTimeTarget,
      {
        maxDriveTimeHours: enhancedConfig.maxDailyDriveHours || 10,
        allowFlexibleDriveTime: enhancedConfig.prioritizeHeritageOverDistance,
        flexibilityBufferHours: tripStyle === 'destination-focused' ? 3 : 1,
        minimumHeritageScore: tripStyle === 'destination-focused' ? 70 : 50,
        preferredHeritageTiers: tripStyle === 'destination-focused' ? 
          ['iconic', 'major', 'significant'] : 
          ['iconic', 'major', 'significant', 'notable']
      }
    );

    if (heritageResult.selectedDestination) {
      // Log heritage selection success
      const reasonMap = {
        'heritage-priority': '🏛️ Heritage Priority',
        'population-fallback': '📊 Population Fallback', 
        'distance-fallback': '📏 Distance Fallback',
        'no-valid-options': '❌ No Options'
      };

      const reason = reasonMap[heritageResult.selectionReason];
      const compromise = heritageResult.isCompromise ? ' (compromise)' : '';
      
      console.log(`✅ ${reason}: ${heritageResult.selectedDestination.name}${compromise}`);
      
      if (heritageResult.warnings.length > 0) {
        console.warn(`⚠️ Selection warnings:`, heritageResult.warnings);
      }

      return heritageResult.selectedDestination;
    }

    // Fallback to enhanced priority-based selection
    if (driveTimeTarget) {
      const heritageDestination = EnhancedDestinationPriorityService.selectDestinationWithHeritagePriority(
        currentStop,
        candidateStops,
        driveTimeTarget,
        tripStyle
      );
      
      if (heritageDestination) {
        console.log(`✅ Heritage priority fallback: ${heritageDestination.name}`);
        return heritageDestination;
      }
    }

    // Final fallback to distance-based selection
    console.warn(`⚠️ All heritage selection methods failed, using distance-based fallback`);
    return DistanceBasedDestinationService.selectDestinationByDistance(
      currentStop, 
      finalDestination, 
      candidateStops, 
      targetDailyDistance
    );
  }

  /**
   * ENHANCED: Select optimal destination with heritage-aware scoring
   */
  private static selectOptimalHeritageAwareDestination(
    currentStop: TripStop,
    finalDestination: TripStop,
    candidateStops: TripStop[],
    targetDistance: number,
    enhancedConfig: any,
    direction: 'eastbound' | 'westbound'
  ): TripStop | null {
    if (candidateStops.length === 0) return null;

    let bestDestination: TripStop | null = null;
    let bestScore = -1;

    console.log(`🏛️ Evaluating ${candidateStops.length} candidates with heritage prioritization (heritage weight: ${enhancedConfig.heritageWeight})`);

    for (const candidate of candidateStops) {
      // Calculate distance score (how close to target)
      const distanceFromCurrent = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        candidate.latitude, candidate.longitude
      );

      const distanceScore = 100 - Math.abs(distanceFromCurrent - targetDistance) / targetDistance * 100;
      const clampedDistanceScore = Math.max(0, Math.min(100, distanceScore));

      // Calculate heritage score
      const heritageScore = HeritageScoringService.calculateHeritageScore(candidate);
      
      // Calculate heritage-enhanced score
      const heritageEnhancedScore = HeritageScoringService.calculateHeritageEnhancedScore(
        candidate,
        clampedDistanceScore,
        enhancedConfig.style
      );

      // Bonus for sequence order compliance
      const sequenceBonus = this.calculateSequenceBonus(currentStop, candidate, finalDestination, direction);

      // Bonus for destination city category
      const categoryBonus = candidate.category === 'destination_city' ? 15 : 0;

      // Heritage tier bonus for destination-focused trips
      const heritageTierBonus = enhancedConfig.style === 'destination-focused' ? 
        this.getHeritageTierBonus(heritageScore.heritageTier) : 0;

      // Final combined score
      const totalScore = heritageEnhancedScore + sequenceBonus + categoryBonus + heritageTierBonus;

      console.log(`   🏛️ ${candidate.name}: distance=${clampedDistanceScore.toFixed(1)}, heritage=${heritageScore.heritageScore}(${heritageScore.heritageTier}), heritage-enhanced=${heritageEnhancedScore.toFixed(1)}, sequence=${sequenceBonus}, total=${totalScore.toFixed(1)}`);

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestDestination = candidate;
      }
    }

    return bestDestination;
  }

  /**
   * Get heritage tier bonus for destination-focused trips
   */
  private static getHeritageTierBonus(tier: string): number {
    const bonuses = {
      'iconic': 30,
      'major': 20,
      'significant': 15,
      'notable': 8,
      'standard': 0
    };
    return bonuses[tier as keyof typeof bonuses] || 0;
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
   * ENHANCED: Select optimal destination for a day with heritage-aware sequence validation
   */
  static selectOptimalDayDestination(
    currentStop: TripStop,
    finalDestination: TripStop,
    availableStops: TripStop[],
    targetDistance: number,
    driveTimeTarget?: DriveTimeTarget,
    tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'
  ): TripStop {
    if (availableStops.length === 0) return finalDestination;

    const enhancedConfig = EnhancedTripStyleLogic.getEnhancedStyleConfig(tripStyle);

    // Apply heritage and sequence filtering
    const direction = SequenceOrderService.getTripDirection(currentStop, finalDestination);
    const sequenceValidStops = SequenceOrderService.filterStopsInSequence(
      currentStop,
      availableStops,
      direction
    );

    const heritageValidStops = EnhancedTripStyleLogic.filterStopsWithHeritageAndPopulation(
      sequenceValidStops.length > 0 ? sequenceValidStops : availableStops,
      enhancedConfig
    );

    const candidateStops = heritageValidStops.length > 0 ? heritageValidStops : availableStops;

    // Try heritage-enhanced sequence-aware selection first
    if (candidateStops.length > 0) {
      const optimalSelection = this.selectOptimalHeritageAwareDestination(
        currentStop,
        finalDestination,
        candidateStops,
        targetDistance,
        enhancedConfig,
        direction
      );

      if (optimalSelection) {
        console.log(`🏛️ Optimal heritage-aware selection: ${optimalSelection.name}`);
        return optimalSelection;
      }
    }

    // Fallback to enhanced heritage priority selection
    if (driveTimeTarget) {
      const heritageDestination = EnhancedDestinationPriorityService.selectDestinationWithHeritagePriority(
        currentStop,
        candidateStops,
        driveTimeTarget,
        tripStyle
      );
      
      if (heritageDestination) {
        return heritageDestination;
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
