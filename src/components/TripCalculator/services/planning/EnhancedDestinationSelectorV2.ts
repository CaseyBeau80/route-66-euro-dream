
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { Route66SequenceValidator } from './utils/Route66SequenceValidator';
import { DistanceValidationService } from './DistanceValidationService';
import { DestinationSelectionStrategy } from './selection/DestinationSelectionStrategy';
import { FallbackSelectionService } from './selection/FallbackSelectionService';
import { SelectionValidationService } from './selection/SelectionValidationService';

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
    const selectedCities = DestinationSelectionStrategy.selectOptimalDestinationsProgressive(
      startStop,
      endStop,
      distanceValidCities,
      neededIntermediateDestinations,
      maxDailyDriveHours
    );

    // STEP 8: Final validation - ensure no segment exceeds limits
    const finalValidation = SelectionValidationService.validateFinalSelection(
      startStop, endStop, selectedCities, maxDailyDriveHours
    );

    if (!finalValidation.isValid) {
      console.error(`❌ FINAL VALIDATION FAILED:`, finalValidation.violations);
      return FallbackSelectionService.createFallbackSelection(
        startStop, endStop, distanceValidCities, neededIntermediateDestinations, maxDailyDriveHours
      );
    }

    console.log(`✅ FINAL SELECTION: ${selectedCities.length} destinations validated for ${maxDailyDriveHours}h max drive`);
    return selectedCities;
  }
}
