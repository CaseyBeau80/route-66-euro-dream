
import { TripStop } from '../../types/TripStop';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { Route66SequenceValidator } from './utils/Route66SequenceValidator';
import { CanonicalRoute66Cities } from './CanonicalRoute66Cities';
import { DestinationValidator } from './utils/DestinationValidator';
import { CoordinateValidator } from './utils/CoordinateValidator';
import { ObjectSafetyValidator } from './utils/ObjectSafetyValidator';
import { SafeDistanceCalculationService } from '../utils/SafeDistanceCalculationService';
import { DestinationPrioritizer } from './utils/DestinationPrioritizer';
import { DestinationExpander } from './utils/DestinationExpander';
import { CentralizedStopValidator } from './utils/CentralizedStopValidator';

export class EnhancedDestinationSelector {
  /**
   * Select destination cities with Route 66 sequence enforcement and canonical city prioritization
   */
  static selectDestinationCitiesForTrip(
    startStop: TripStop,
    endStop: TripStop,
    allStops: any[],
    totalDays: number
  ): TripStop[] {
    console.log(`🎯 ENHANCED CANONICAL SELECTION: ${totalDays} days from ${startStop?.name || 'undefined'} to ${endStop?.name || 'undefined'}`);
    
    try {
      // BULLETPROOF: Validate all inputs with comprehensive error reporting
      console.log(`🛡️ BULLETPROOF VALIDATION: Starting comprehensive input validation`);

      if (!startStop) {
        const error = 'startStop is null/undefined';
        console.error(`❌ CRITICAL INPUT ERROR: ${error}`, {
          startStop,
          stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
        });
        throw new Error(error);
      }

      if (!endStop) {
        const error = 'endStop is null/undefined';
        console.error(`❌ CRITICAL INPUT ERROR: ${error}`, {
          endStop,
          stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
        });
        throw new Error(error);
      }

      if (!allStops || !Array.isArray(allStops)) {
        const error = `allStops is not a valid array: ${typeof allStops}`;
        console.error(`❌ CRITICAL INPUT ERROR: ${error}`, {
          allStops,
          type: typeof allStops,
          stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
        });
        throw new Error(error);
      }

      if (typeof totalDays !== 'number' || totalDays <= 0 || isNaN(totalDays)) {
        const error = `Invalid totalDays: ${totalDays}`;
        console.error(`❌ CRITICAL INPUT ERROR: ${error}`, {
          totalDays,
          type: typeof totalDays,
          stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
        });
        throw new Error(error);
      }

      // BULLETPROOF: Validate startStop with comprehensive error reporting
      console.log(`🛡️ BULLETPROOF: Validating startStop`);
      const startValidation = CentralizedStopValidator.validateTripStop(startStop, 'enhanced-selector-startStop');
      if (!startValidation.isValid) {
        const error = `Invalid startStop: ${startValidation.errors.join(', ')}`;
        console.error(`❌ CRITICAL VALIDATION ERROR: ${error}`, {
          startStop,
          errors: startValidation.errors,
          warnings: startValidation.warnings
        });
        throw new Error(error);
      }

      // BULLETPROOF: Validate endStop with comprehensive error reporting
      console.log(`🛡️ BULLETPROOF: Validating endStop`);
      const endValidation = CentralizedStopValidator.validateTripStop(endStop, 'enhanced-selector-endStop');
      if (!endValidation.isValid) {
        const error = `Invalid endStop: ${endValidation.errors.join(', ')}`;
        console.error(`❌ CRITICAL VALIDATION ERROR: ${error}`, {
          endStop,
          errors: endValidation.errors,
          warnings: endValidation.warnings
        });
        throw new Error(error);
      }

      // BULLETPROOF: Validate all stops in the array
      console.log(`🛡️ BULLETPROOF: Validating all ${allStops.length} stops`);
      const batchValidation = CentralizedStopValidator.batchValidate(allStops, 'enhanced-selector-allStops');
      
      if (batchValidation.summary.valid === 0) {
        const error = 'No valid stops available after comprehensive validation';
        console.error(`❌ CRITICAL VALIDATION ERROR: ${error}`, {
          summary: batchValidation.summary,
          invalidStops: batchValidation.invalidStops.map(item => ({
            name: item.stop?.name || 'unknown',
            errors: item.errors
          }))
        });
        throw new Error(error);
      }

      console.log(`✅ BULLETPROOF VALIDATION COMPLETE: ${batchValidation.summary.valid} valid stops from ${allStops.length} total`);
      
      // Use only validated stops from here on
      const validStops = batchValidation.validStops;
      
      // CRITICAL FIX: Calculate the correct number of intermediate destinations needed
      const neededIntermediateDestinations = Math.max(0, totalDays - 1);
      
      console.log(`🎯 NEED ${neededIntermediateDestinations} intermediate destinations for ${totalDays} day trip`);
      
      if (neededIntermediateDestinations === 0) {
        console.log('🎯 Single day trip - no intermediate destinations needed');
        return [];
      }
      
      // STEP 1: Get destination cities with additional validation
      let destinationCities: TripStop[];
      try {
        destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(validStops);
        console.log(`🏛️ Destination cities available: ${destinationCities.length}`);
      } catch (error) {
        console.error('❌ Error filtering destination cities:', error);
        throw new Error(`Failed to filter destination cities: ${error}`);
      }
      
      // STEP 2: Match available cities to canonical destinations
      let canonicalStops: TripStop[];
      try {
        canonicalStops = CanonicalRoute66Cities.matchStopsToCanonical(destinationCities);
        console.log(`🏛️ Canonical destinations available: ${canonicalStops.length}`);
      } catch (error) {
        console.error('❌ Error matching canonical destinations:', error);
        canonicalStops = destinationCities; // Fallback to all destination cities
      }
      
      // STEP 3: Remove start and end cities with safe coordinate checks - using bulletproof validation
      const availableCities = canonicalStops.filter(city => {
        // Double-check each city is still valid
        const cityValidation = CentralizedStopValidator.validateTripStop(city, 'available-city-filter');
        if (!cityValidation.isValid) {
          console.warn(`⚠️ Filtering out invalid city during availability check:`, {
            city: city?.name || 'unknown',
            errors: cityValidation.errors
          });
          return false;
        }
        
        const isNotStartStop = city.id !== startStop.id;
        const isNotEndStop = city.id !== endStop.id;
        
        return isNotStartStop && isNotEndStop;
      });
      
      console.log(`🏛️ Available canonical cities: ${availableCities.length}`);
      
      if (availableCities.length === 0) {
        console.warn('⚠️ No available canonical cities for intermediate stops');
        return [];
      }
      
      // STEP 4: Filter by Route 66 sequence to prevent backtracking - with enhanced safety
      let sequenceValidCities: TripStop[];
      try {
        const sequenceResult = Route66SequenceValidator.filterValidSequenceStops(
          startStop,
          availableCities,
          endStop
        );
        sequenceValidCities = sequenceResult.validStops || [];
        console.log(`🛤️ Sequence-valid canonical cities: ${sequenceValidCities.length}`);
      } catch (error) {
        console.error('❌ Error in sequence validation:', error);
        sequenceValidCities = availableCities; // Fallback to all available cities
      }
      
      // STEP 5: Final validation of all sequence-valid cities
      const safeSequenceValidCities = CentralizedStopValidator.filterValidStops(
        sequenceValidCities, 
        'sequence-valid-cities-final-check'
      );

      console.log(`🛡️ Cities with bulletproof validation: ${safeSequenceValidCities.length}/${sequenceValidCities.length}`);
      
      // STEP 6: If we don't have enough cities, expand selection beyond canonical
      let workingCities = safeSequenceValidCities;
      
      workingCities = DestinationExpander.expandBeyondCanonical(
        workingCities,
        destinationCities,
        canonicalStops,
        startStop,
        endStop,
        neededIntermediateDestinations
      );
      
      // STEP 7: Select optimal cities using canonical prioritization
      const selectedCities = DestinationPrioritizer.selectOptimalCanonicalCities(
        startStop, 
        endStop, 
        workingCities, 
        neededIntermediateDestinations
      );
      
      // STEP 8: Force inclusion of priority destinations if we have room
      let enhancedSelection: TripStop[];
      try {
        enhancedSelection = CanonicalRoute66Cities.enforceDestinationInclusion(
          selectedCities,
          workingCities,
          neededIntermediateDestinations
        );
      } catch (error) {
        console.error('❌ Error in destination inclusion enforcement:', error);
        enhancedSelection = selectedCities; // Use original selection
      }
      
      // STEP 9: Final bulletproof validation - ensure all selected cities are still valid
      const finalSelection = CentralizedStopValidator.filterValidStops(
        enhancedSelection,
        'final-selection-validation'
      );
      
      if (finalSelection.length !== enhancedSelection.length) {
        console.warn(`⚠️ SAFETY: Removed ${enhancedSelection.length - finalSelection.length} cities with invalid coordinates from final selection`);
      }
      
      // STEP 10: Ensure we have exactly the right number of destinations
      let adjustedSelection = finalSelection;
      
      if (adjustedSelection.length > neededIntermediateDestinations) {
        // Too many - trim to the highest priority ones
        adjustedSelection = DestinationPrioritizer.trimToTopPriority(adjustedSelection, neededIntermediateDestinations);
      } else if (adjustedSelection.length < neededIntermediateDestinations) {
        // Too few - add more if available
        adjustedSelection = DestinationExpander.expandSelection(
          adjustedSelection, 
          workingCities, 
          neededIntermediateDestinations,
          startStop,
          endStop
        );
      }
      
      // STEP 11: FINAL bulletproof validation on the adjusted selection
      const safeAdjustedSelection = CentralizedStopValidator.filterValidStops(
        adjustedSelection,
        'adjusted-selection-final-validation'
      );
      
      console.log(`🎯 FINAL SELECTION: ${safeAdjustedSelection.length}/${neededIntermediateDestinations} destinations for ${totalDays} days`);
      console.log(`✅ Selected destinations:`, safeAdjustedSelection.map(c => c?.name || 'unnamed'));
      
      return safeAdjustedSelection;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ CRITICAL ERROR in EnhancedDestinationSelector:', {
        error: errorMessage,
        startStopName: startStop?.name || 'undefined',
        endStopName: endStop?.name || 'undefined',
        totalDays,
        allStopsLength: allStops?.length || 0,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw new Error(`Enhanced destination selection failed: ${errorMessage}`);
    }
  }
}
