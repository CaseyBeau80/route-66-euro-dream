
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
    
    return ObjectSafetyValidator.wrapCoordinateAccess(() => {
      try {
        // CRITICAL: Add comprehensive input validation with enhanced safety checks
        if (!startStop) {
          throw new Error('startStop is null/undefined');
        }

        if (!endStop) {
          throw new Error('endStop is null/undefined');
        }

        if (!allStops || !Array.isArray(allStops)) {
          throw new Error(`allStops is not a valid array: ${typeof allStops}`);
        }

        if (typeof totalDays !== 'number' || totalDays <= 0 || isNaN(totalDays)) {
          throw new Error(`Invalid totalDays: ${totalDays}`);
        }

        // ENHANCED: Validate coordinates with comprehensive safety checks
        const startValidation = ObjectSafetyValidator.validateObjectWithCoordinates(startStop, 'startStop-validation');
        if (!startValidation.isValid) {
          throw new Error(`Invalid startStop coordinates: ${startValidation.error}`);
        }

        const endValidation = ObjectSafetyValidator.validateObjectWithCoordinates(endStop, 'endStop-validation');
        if (!endValidation.isValid) {
          throw new Error(`Invalid endStop coordinates: ${endValidation.error}`);
        }
        
        // CRITICAL FIX: Calculate the correct number of intermediate destinations needed
        const neededIntermediateDestinations = Math.max(0, totalDays - 1);
        
        console.log(`🎯 NEED ${neededIntermediateDestinations} intermediate destinations for ${totalDays} day trip`);
        
        if (neededIntermediateDestinations === 0) {
          console.log('🎯 Single day trip - no intermediate destinations needed');
          return [];
        }
        
        // STEP 1: Filter to only valid stops with coordinates using safe validation
        const validStops = DestinationValidator.filterValidStops(allStops);
        console.log(`🛡️ SAFETY: Filtered ${allStops.length} stops to ${validStops.length} valid stops`);
        
        if (validStops.length === 0) {
          throw new Error('No valid stops available after coordinate validation');
        }
        
        // STEP 2: Get destination cities with additional validation
        let destinationCities: TripStop[];
        try {
          destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(validStops);
          console.log(`🏛️ Destination cities available: ${destinationCities.length}`);
        } catch (error) {
          console.error('❌ Error filtering destination cities:', error);
          throw new Error(`Failed to filter destination cities: ${error}`);
        }
        
        // STEP 3: Match available cities to canonical destinations
        let canonicalStops: TripStop[];
        try {
          canonicalStops = CanonicalRoute66Cities.matchStopsToCanonical(destinationCities);
          console.log(`🏛️ Canonical destinations available: ${canonicalStops.length}`);
        } catch (error) {
          console.error('❌ Error matching canonical destinations:', error);
          canonicalStops = destinationCities; // Fallback to all destination cities
        }
        
        // STEP 4: Remove start and end cities with safe coordinate checks
        const availableCities = DestinationValidator.filterAvailableCities(canonicalStops, startStop, endStop);
        console.log(`🏛️ Available canonical cities: ${availableCities.length}`);
        
        if (availableCities.length === 0) {
          console.warn('⚠️ No available canonical cities for intermediate stops');
          return [];
        }
        
        // STEP 5: Filter by Route 66 sequence to prevent backtracking - with enhanced safety
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
        
        // STEP 6: Validate all cities have safe coordinates before proceeding
        const safeSequenceValidCities = sequenceValidCities.filter(city => {
          const validation = ObjectSafetyValidator.validateObjectWithCoordinates(city, 'sequence-valid-city');
          if (!validation.isValid) {
            console.warn(`⚠️ Filtering out city with invalid coordinates:`, {
              city: city?.name || 'unknown',
              error: validation.error
            });
          }
          return validation.isValid;
        });

        console.log(`🛡️ Cities with safe coordinates: ${safeSequenceValidCities.length}/${sequenceValidCities.length}`);
        
        // STEP 7: If we don't have enough cities, expand selection beyond canonical
        let workingCities = safeSequenceValidCities;
        
        workingCities = DestinationExpander.expandBeyondCanonical(
          workingCities,
          destinationCities,
          canonicalStops,
          startStop,
          endStop,
          neededIntermediateDestinations
        );
        
        // STEP 8: Select optimal cities using canonical prioritization
        const selectedCities = DestinationPrioritizer.selectOptimalCanonicalCities(
          startStop, 
          endStop, 
          workingCities, 
          neededIntermediateDestinations
        );
        
        // STEP 9: Force inclusion of priority destinations if we have room
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
        
        // STEP 10: Final safety validation - ensure all selected cities have valid coordinates
        const finalSelection = enhancedSelection.filter(city => {
          const validation = ObjectSafetyValidator.validateObjectWithCoordinates(city, 'final-selection');
          if (!validation.isValid) {
            console.warn(`⚠️ FINAL FILTER: Removing city with invalid coordinates:`, {
              city: city?.name || 'unknown',
              error: validation.error
            });
          }
          return validation.isValid;
        });
        
        if (finalSelection.length !== enhancedSelection.length) {
          console.warn(`⚠️ SAFETY: Removed ${enhancedSelection.length - finalSelection.length} cities with invalid coordinates from final selection`);
        }
        
        // STEP 11: Ensure we have exactly the right number of destinations
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
        
        // STEP 12: Final coordinate validation on the adjusted selection
        const safeAdjustedSelection = adjustedSelection.filter(city => {
          const validation = ObjectSafetyValidator.validateObjectWithCoordinates(city, 'adjusted-selection');
          return validation.isValid;
        });
        
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
    }, 'enhanced-destination-selection', []);
  }
}
