
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { Route66SequenceValidator } from './utils/Route66SequenceValidator';
import { CanonicalRoute66Cities } from './CanonicalRoute66Cities';
import { DistanceValidationService } from './DistanceValidationService';

export class EnhancedDestinationSelectorV2 {
  /**
   * Select destination cities with ABSOLUTE distance validation to prevent long segments
   */
  static selectDestinationCitiesForTrip(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number,
    maxDailyDriveHours: number = 8
  ): TripStop[] {
    console.log(`🎯 V2 DESTINATION SELECTION: ${totalDays} days with ABSOLUTE ${maxDailyDriveHours}h limit`);
    
    // STEP 1: Validate if the trip is even possible with the given constraints
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const recommendedDays = DistanceValidationService.calculateRecommendedDays(
      startStop, endStop, maxDailyDriveHours
    );
    
    if (totalDays < recommendedDays) {
      console.warn(`⚠️ INSUFFICIENT DAYS: Need at least ${recommendedDays} days for ${totalDistance.toFixed(0)}mi with ${maxDailyDriveHours}h limit`);
      console.log(`🔧 ADJUSTING: Using ${recommendedDays} days instead of requested ${totalDays}`);
      totalDays = recommendedDays;
    }

    // STEP 2: Calculate needed intermediate destinations
    const neededIntermediateDestinations = totalDays - 1;
    console.log(`🎯 NEED: ${neededIntermediateDestinations} intermediate destinations for ${totalDays} day trip`);

    // STEP 3: Filter to destination cities only
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    
    // STEP 4: Remove start and end cities
    const availableCities = destinationCities.filter(city => 
      city.id !== startStop.id && city.id !== endStop.id
    );

    // STEP 5: Apply sequence validation
    const { validStops: sequenceValidCities } = Route66SequenceValidator.filterValidSequenceStops(
      startStop, availableCities, endStop
    );

    console.log(`🛤️ SEQUENCE VALID: ${sequenceValidCities.length} cities in correct sequence`);

    // STEP 6: CRITICAL - Apply distance validation to prevent long segments
    const distanceValidCities = DistanceValidationService.filterValidDistanceDestinations(
      startStop, sequenceValidCities, maxDailyDriveHours
    );

    console.log(`🚦 DISTANCE VALID: ${distanceValidCities.length} cities within ${maxDailyDriveHours}h drive limit`);

    // STEP 7: Select optimal destinations using progressive selection
    const selectedCities = this.selectOptimalDestinationsProgressive(
      startStop,
      endStop,
      distanceValidCities,
      neededIntermediateDestinations,
      maxDailyDriveHours
    );

    // STEP 8: Final validation - ensure no segment exceeds limits
    const finalValidation = this.validateFinalSelection(
      startStop, endStop, selectedCities, maxDailyDriveHours
    );

    if (!finalValidation.isValid) {
      console.error(`❌ FINAL VALIDATION FAILED:`, finalValidation.violations);
      return this.createFallbackSelection(startStop, endStop, distanceValidCities, neededIntermediateDestinations, maxDailyDriveHours);
    }

    console.log(`✅ FINAL SELECTION: ${selectedCities.length} destinations validated for ${maxDailyDriveHours}h max drive`);
    return selectedCities;
  }

  /**
   * Progressive selection that validates each step to prevent long segments
   */
  private static selectOptimalDestinationsProgressive(
    startStop: TripStop,
    endStop: TripStop,
    availableCities: TripStop[],
    neededDestinations: number,
    maxDailyDriveHours: number
  ): TripStop[] {
    const selectedDestinations: TripStop[] = [];
    let currentStop = startStop;

    // Calculate target distance per segment
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    const targetDistancePerSegment = totalDistance / (neededDestinations + 1);

    console.log(`🎯 PROGRESSIVE SELECTION: Target ${targetDistancePerSegment.toFixed(0)}mi per segment`);

    for (let segmentIndex = 0; segmentIndex < neededDestinations; segmentIndex++) {
      const targetDistance = targetDistancePerSegment * (segmentIndex + 1);
      
      // Find cities that are within distance limits from current stop
      const validFromCurrent = DistanceValidationService.filterValidDistanceDestinations(
        currentStop, availableCities, maxDailyDriveHours
      ).filter(city => !selectedDestinations.some(selected => selected.id === city.id));

      if (validFromCurrent.length === 0) {
        console.warn(`⚠️ NO VALID DESTINATIONS from ${currentStop.name} within ${maxDailyDriveHours}h limit`);
        break;
      }

      // Select the best destination for this segment
      const bestDestination = this.selectBestDestinationForSegment(
        currentStop, endStop, validFromCurrent, targetDistance
      );

      if (bestDestination) {
        selectedDestinations.push(bestDestination);
        currentStop = bestDestination;
        
        const segmentDistance = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          bestDestination.latitude, bestDestination.longitude
        );
        
        console.log(`✅ SEGMENT ${segmentIndex + 1}: ${bestDestination.name} at ${segmentDistance.toFixed(0)}mi`);
      } else {
        console.warn(`⚠️ Could not find valid destination for segment ${segmentIndex + 1}`);
        break;
      }
    }

    return selectedDestinations;
  }

  /**
   * Select the best destination for a specific segment
   */
  private static selectBestDestinationForSegment(
    currentStop: TripStop,
    endStop: TripStop,
    candidates: TripStop[],
    targetDistanceFromStart: number
  ): TripStop | null {
    let bestDestination: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;

    for (const candidate of candidates) {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        candidate.latitude, candidate.longitude
      );

      const distanceToEnd = DistanceCalculationService.calculateDistance(
        candidate.latitude, candidate.longitude,
        endStop.latitude, endStop.longitude
      );

      // Ensure geographic progression
      const currentToEndDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        endStop.latitude, endStop.longitude
      );

      if (distanceToEnd >= currentToEndDistance) {
        continue; // Not making progress toward end
      }

      // Score based on proximity to target and destination priority
      const distanceScore = Math.abs(distanceFromStart - targetDistanceFromStart);
      const canonicalInfo = CanonicalRoute66Cities.getDestinationInfo(
        candidate.city_name || candidate.name, candidate.state
      );
      const priorityBonus = canonicalInfo ? (canonicalInfo.priority * -10) : 0;

      const totalScore = distanceScore + priorityBonus;

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestDestination = candidate;
      }
    }

    return bestDestination;
  }

  /**
   * Validate the final selection to ensure no segments exceed limits
   */
  private static validateFinalSelection(
    startStop: TripStop,
    endStop: TripStop,
    selectedDestinations: TripStop[],
    maxDailyDriveHours: number
  ): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];
    const allStops = [startStop, ...selectedDestinations, endStop];

    for (let i = 0; i < allStops.length - 1; i++) {
      const currentStop = allStops[i];
      const nextStop = allStops[i + 1];
      
      const validation = DistanceValidationService.validateSegmentDistance(
        currentStop, nextStop, maxDailyDriveHours
      );

      if (!validation.isValid) {
        violations.push(`Day ${i + 1}: ${currentStop.name} → ${nextStop.name} - ${validation.recommendation}`);
      }
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Create fallback selection when optimal selection fails
   */
  private static createFallbackSelection(
    startStop: TripStop,
    endStop: TripStop,
    availableCities: TripStop[],
    neededDestinations: number,
    maxDailyDriveHours: number
  ): TripStop[] {
    console.log(`🔄 CREATING FALLBACK SELECTION with stricter constraints`);
    
    // Use even stricter distance limits for fallback
    const stricterMaxHours = Math.max(maxDailyDriveHours * 0.8, 6);
    
    const validCities = DistanceValidationService.filterValidDistanceDestinations(
      startStop, availableCities, stricterMaxHours
    );

    // Take up to the needed number, prioritizing canonical destinations
    const sortedCities = validCities.sort((a, b) => {
      const aInfo = CanonicalRoute66Cities.getDestinationInfo(a.city_name || a.name, a.state);
      const bInfo = CanonicalRoute66Cities.getDestinationInfo(b.city_name || b.name, b.state);
      const aPriority = aInfo ? aInfo.priority : 0;
      const bPriority = bInfo ? bInfo.priority : 0;
      return bPriority - aPriority;
    });

    const fallbackSelection = sortedCities.slice(0, Math.min(neededDestinations, validCities.length));
    
    console.log(`🔄 FALLBACK: Selected ${fallbackSelection.length} destinations with ${stricterMaxHours}h limit`);
    return fallbackSelection;
  }
}
