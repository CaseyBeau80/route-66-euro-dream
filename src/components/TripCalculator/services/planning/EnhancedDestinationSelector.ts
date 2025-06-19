
import { TripStop } from '../../types/TripStop';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { Route66SequenceValidator } from './utils/Route66SequenceValidator';
import { CanonicalRoute66Cities } from './CanonicalRoute66Cities';
import { DestinationValidator } from './utils/DestinationValidator';
import { DestinationPrioritizer } from './utils/DestinationPrioritizer';
import { DestinationExpander } from './utils/DestinationExpander';

export class EnhancedDestinationSelector {
  /**
   * Select destination cities with Route 66 sequence enforcement and canonical city prioritization
   */
  static selectDestinationCitiesForTrip(
    startStop: TripStop,
    endStop: TripStop,
    allStops: any[], // Changed from TripStop[] to any[] to handle invalid objects
    totalDays: number
  ): TripStop[] {
    console.log(`🎯 ENHANCED CANONICAL SELECTION: ${totalDays} days from ${startStop?.name || 'undefined'} to ${endStop?.name || 'undefined'}`);
    
    // CRITICAL: Add comprehensive input validation
    if (!startStop) {
      console.error('❌ CRITICAL: startStop is null/undefined');
      return [];
    }

    if (!endStop) {
      console.error('❌ CRITICAL: endStop is null/undefined');
      return [];
    }

    if (!allStops || !Array.isArray(allStops)) {
      console.error('❌ CRITICAL: allStops is not a valid array:', { 
        hasAllStops: !!allStops,
        isArray: Array.isArray(allStops),
        type: typeof allStops,
        length: allStops?.length || 'N/A'
      });
      return [];
    }

    if (typeof totalDays !== 'number' || totalDays <= 0 || isNaN(totalDays)) {
      console.error('❌ CRITICAL: Invalid totalDays:', { 
        totalDays, 
        type: typeof totalDays,
        isNaN: isNaN(totalDays)
      });
      return [];
    }

    // CRITICAL: Validate coordinates exist and are valid numbers - ENHANCED CHECKS
    if (!DestinationValidator.isValidTripStop(startStop)) {
      console.error('❌ CRITICAL: Invalid startStop - failed validation:', {
        id: (startStop as any)?.id || 'missing',
        name: (startStop as any)?.name || 'missing',
        latitude: (startStop as any)?.latitude,
        longitude: (startStop as any)?.longitude,
        latitudeType: typeof (startStop as any)?.latitude,
        longitudeType: typeof (startStop as any)?.longitude
      });
      return [];
    }

    if (!DestinationValidator.isValidTripStop(endStop)) {
      console.error('❌ CRITICAL: Invalid endStop - failed validation:', {
        id: (endStop as any)?.id || 'missing',
        name: (endStop as any)?.name || 'missing',
        latitude: (endStop as any)?.latitude,
        longitude: (endStop as any)?.longitude,
        latitudeType: typeof (endStop as any)?.latitude,
        longitudeType: typeof (endStop as any)?.longitude
      });
      return [];
    }
    
    // CRITICAL FIX: Calculate the correct number of intermediate destinations needed
    const neededIntermediateDestinations = Math.max(0, totalDays - 1);
    
    console.log(`🎯 NEED ${neededIntermediateDestinations} intermediate destinations for ${totalDays} day trip`);
    
    if (neededIntermediateDestinations === 0) {
      console.log('🎯 Single day trip - no intermediate destinations needed');
      return [];
    }
    
    // STEP 1: Filter to only valid stops with coordinates
    const validStops = DestinationValidator.filterValidStops(allStops);
    console.log(`🛡️ SAFETY: Filtered ${allStops.length} stops to ${validStops.length} valid stops`);
    
    if (validStops.length === 0) {
      console.error('❌ CRITICAL: No valid stops available after coordinate validation');
      return [];
    }
    
    // STEP 2: Get destination cities with additional validation
    let destinationCities: TripStop[];
    try {
      destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(validStops);
      console.log(`🏛️ Destination cities available: ${destinationCities.length}`);
    } catch (error) {
      console.error('❌ Error filtering destination cities:', error);
      return [];
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
    
    // STEP 4: Remove start and end cities
    const availableCities = DestinationValidator.filterAvailableCities(canonicalStops, startStop, endStop);
    console.log(`🏛️ Available canonical cities: ${availableCities.length}`);
    
    if (availableCities.length === 0) {
      console.warn('⚠️ No available canonical cities for intermediate stops');
      return [];
    }
    
    // STEP 5: Filter by Route 66 sequence to prevent backtracking
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
    
    // STEP 6: If we don't have enough cities, expand selection beyond canonical
    let workingCities = sequenceValidCities.filter(city => DestinationValidator.isValidTripStop(city));
    
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
    
    // STEP 9: Ensure we have exactly the right number of destinations
    let finalSelection = enhancedSelection.filter(city => DestinationValidator.isValidTripStop(city));
    
    if (finalSelection.length > neededIntermediateDestinations) {
      // Too many - trim to the highest priority ones
      finalSelection = DestinationPrioritizer.trimToTopPriority(finalSelection, neededIntermediateDestinations);
    } else if (finalSelection.length < neededIntermediateDestinations) {
      // Too few - add more if available
      finalSelection = DestinationExpander.expandSelection(
        finalSelection, 
        workingCities, 
        neededIntermediateDestinations,
        startStop,
        endStop
      );
    }
    
    // STEP 10: Final safety check - ensure all selected cities have valid coordinates
    const safeFinalSelection = finalSelection.filter(city => DestinationValidator.isValidTripStop(city));
    
    if (safeFinalSelection.length !== finalSelection.length) {
      console.warn(`⚠️ SAFETY: Removed ${finalSelection.length - safeFinalSelection.length} cities with invalid coordinates`);
    }
    
    // STEP 11: Validate final sequence if we have cities
    if (safeFinalSelection.length > 0) {
      try {
        const finalSequence = [startStop, ...safeFinalSelection, endStop];
        const sequenceValidation = Route66SequenceValidator.validateTripSequence(finalSequence);
        
        if (!sequenceValidation.isValid) {
          console.warn(`⚠️ CANONICAL SEQUENCE VIOLATIONS:`, sequenceValidation.violations);
        } else {
          console.log(`✅ CANONICAL SEQUENCE VALIDATION PASSED`);
        }
      } catch (error) {
        console.error('❌ Error in final sequence validation:', error);
      }
    }
    
    // STEP 12: Log final result
    console.log(`🎯 FINAL SELECTION: ${safeFinalSelection.length}/${neededIntermediateDestinations} destinations for ${totalDays} days`);
    console.log(`✅ Selected destinations:`, safeFinalSelection.map(c => c?.name || 'unnamed'));
    
    return safeFinalSelection;
  }
}
