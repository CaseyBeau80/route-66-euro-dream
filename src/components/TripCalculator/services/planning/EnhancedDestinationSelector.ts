
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { Route66SequenceValidator } from './utils/Route66SequenceValidator';
import { Route66SequenceUtils } from './utils/Route66SequenceUtils';
import { CanonicalRoute66Cities } from './CanonicalRoute66Cities';

export class EnhancedDestinationSelector {
  /**
   * Select destination cities with Route 66 sequence enforcement and canonical city prioritization
   */
  static selectDestinationCitiesForTrip(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    console.log(`🎯 ENHANCED CANONICAL SELECTION: ${totalDays} days from ${startStop?.name || 'undefined'} to ${endStop?.name || 'undefined'}`);
    
    // CRITICAL: Add comprehensive null safety checks
    if (!startStop || !endStop || !allStops || totalDays <= 0) {
      console.error('❌ CRITICAL: Invalid input parameters', { 
        hasStartStop: !!startStop, 
        hasEndStop: !!endStop, 
        hasAllStops: !!allStops,
        allStopsLength: allStops?.length || 0,
        totalDays 
      });
      return [];
    }

    // CRITICAL: Validate coordinates exist and are valid numbers
    if (!this.hasValidCoordinates(startStop)) {
      console.error('❌ CRITICAL: Invalid startStop coordinates', startStop);
      return [];
    }

    if (!this.hasValidCoordinates(endStop)) {
      console.error('❌ CRITICAL: Invalid endStop coordinates', endStop);
      return [];
    }
    
    // CRITICAL FIX: Calculate the correct number of intermediate destinations needed
    const neededIntermediateDestinations = Math.max(0, totalDays - 1);
    
    console.log(`🎯 NEED ${neededIntermediateDestinations} intermediate destinations for ${totalDays} day trip`);
    
    if (neededIntermediateDestinations === 0) {
      console.log('🎯 Single day trip - no intermediate destinations needed');
      return [];
    }
    
    // STEP 1: Filter to only valid stops with coordinates - ENHANCED SAFETY
    const validStops = allStops.filter(stop => {
      const isValid = this.hasValidCoordinates(stop);
      if (!isValid) {
        console.warn(`⚠️ SKIPPING invalid stop:`, { 
          id: stop?.id, 
          name: stop?.name, 
          hasLatitude: typeof stop?.latitude === 'number',
          hasLongitude: typeof stop?.longitude === 'number',
          latitude: stop?.latitude,
          longitude: stop?.longitude
        });
      }
      return isValid;
    });
    
    console.log(`🛡️ SAFETY: Filtered ${allStops.length} stops to ${validStops.length} valid stops`);
    
    if (validStops.length === 0) {
      console.error('❌ CRITICAL: No valid stops available after coordinate validation');
      return [];
    }
    
    // STEP 2: Get destination cities with additional validation
    let destinationCities;
    try {
      destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(validStops);
      console.log(`🏛️ Destination cities available: ${destinationCities.length}`);
    } catch (error) {
      console.error('❌ Error filtering destination cities:', error);
      return [];
    }
    
    // STEP 3: Match available cities to canonical destinations
    let canonicalStops;
    try {
      canonicalStops = CanonicalRoute66Cities.matchStopsToCanonical(destinationCities);
      console.log(`🏛️ Canonical destinations available: ${canonicalStops.length}`);
    } catch (error) {
      console.error('❌ Error matching canonical destinations:', error);
      canonicalStops = destinationCities; // Fallback to all destination cities
    }
    
    // STEP 4: Remove start and end cities with safe filtering
    const availableCities = canonicalStops.filter(city => {
      const isValid = city && 
                     city.id && 
                     city.id !== startStop.id && 
                     city.id !== endStop.id &&
                     this.hasValidCoordinates(city);
      
      if (!isValid && city) {
        console.warn(`⚠️ FILTERING OUT city:`, {
          id: city.id,
          name: city.name,
          reason: !city.id ? 'no id' : 
                  city.id === startStop.id ? 'is start stop' :
                  city.id === endStop.id ? 'is end stop' :
                  !this.hasValidCoordinates(city) ? 'invalid coordinates' : 'unknown'
        });
      }
      
      return isValid;
    });
    
    console.log(`🏛️ Available canonical cities: ${availableCities.length}`);
    
    if (availableCities.length === 0) {
      console.warn('⚠️ No available canonical cities for intermediate stops');
      return [];
    }
    
    // STEP 5: Filter by Route 66 sequence to prevent backtracking - WITH ERROR HANDLING
    let sequenceValidCities;
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
    let workingCities = sequenceValidCities.filter(city => this.hasValidCoordinates(city));
    
    if (workingCities.length < neededIntermediateDestinations) {
      console.log(`📈 Need more cities: expanding beyond canonical destinations`);
      
      // Add non-canonical destination cities that are in sequence
      const nonCanonicalDestinations = destinationCities.filter(city => 
        city && 
        city.id &&
        city.id !== startStop.id && 
        city.id !== endStop.id &&
        this.hasValidCoordinates(city) &&
        !canonicalStops.some(canonical => canonical && canonical.id === city.id)
      );
      
      try {
        const additionalSequenceResult = Route66SequenceValidator.filterValidSequenceStops(
          startStop,
          nonCanonicalDestinations,
          endStop
        );
        const additionalValidCities = additionalSequenceResult.validStops || [];
        console.log(`🏙️ Additional valid destination cities: ${additionalValidCities.length}`);
        
        // Combine canonical and additional cities
        workingCities = [...workingCities, ...additionalValidCities.filter(city => this.hasValidCoordinates(city))];
      } catch (error) {
        console.error('❌ Error in additional sequence validation:', error);
        // Continue with current working cities
      }
    }
    
    // STEP 7: Select optimal cities using canonical prioritization
    const selectedCities = this.selectOptimalCanonicalCities(
      startStop, 
      endStop, 
      workingCities, 
      neededIntermediateDestinations
    );
    
    // STEP 8: Force inclusion of priority destinations if we have room - WITH ERROR HANDLING
    let enhancedSelection;
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
    let finalSelection = enhancedSelection.filter(city => this.hasValidCoordinates(city));
    
    if (finalSelection.length > neededIntermediateDestinations) {
      // Too many - trim to the highest priority ones
      finalSelection = this.trimToTopPriority(finalSelection, neededIntermediateDestinations);
    } else if (finalSelection.length < neededIntermediateDestinations) {
      // Too few - add more if available
      finalSelection = this.expandSelection(
        finalSelection, 
        workingCities, 
        neededIntermediateDestinations,
        startStop,
        endStop
      );
    }
    
    // STEP 10: Final safety check - ensure all selected cities have valid coordinates
    const safeFinalSelection = finalSelection.filter(city => {
      const isValid = this.hasValidCoordinates(city);
      if (!isValid) {
        console.warn(`⚠️ FINAL SAFETY: Removing city with invalid coordinates:`, {
          id: city?.id,
          name: city?.name,
          latitude: city?.latitude,
          longitude: city?.longitude
        });
      }
      return isValid;
    });
    
    if (safeFinalSelection.length !== finalSelection.length) {
      console.warn(`⚠️ SAFETY: Removed ${finalSelection.length - safeFinalSelection.length} cities with invalid coordinates`);
    }
    
    // STEP 11: Validate final sequence if we have cities - WITH ERROR HANDLING
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

  /**
   * Check if a stop has valid coordinates
   */
  private static hasValidCoordinates(stop: any): stop is TripStop {
    return stop && 
           typeof stop === 'object' &&
           stop.id &&
           stop.name &&
           typeof stop.latitude === 'number' &&
           typeof stop.longitude === 'number' &&
           !isNaN(stop.latitude) &&
           !isNaN(stop.longitude) &&
           stop.latitude !== 0 &&
           stop.longitude !== 0;
  }

  /**
   * Filter to valid stops with coordinates
   */
  private static filterToValidStops(stops: any[]): TripStop[] {
    return stops.filter(stop => this.hasValidCoordinates(stop));
  }

  /**
   * Trim selection to top priority destinations
   */
  private static trimToTopPriority(
    destinations: TripStop[], 
    needed: number
  ): TripStop[] {
    if (destinations.length <= needed) return destinations;
    
    // Sort by canonical priority and take top N
    const prioritized = destinations
      .filter(city => this.hasValidCoordinates(city))
      .map(city => {
        const canonicalInfo = CanonicalRoute66Cities.getDestinationInfo(
          city.city_name || city.name,
          city.state
        );
        return {
          city,
          priority: canonicalInfo ? canonicalInfo.priority : 0
        };
      });
    
    prioritized.sort((a, b) => b.priority - a.priority);
    
    const trimmed = prioritized.slice(0, needed).map(item => item.city);
    console.log(`✂️ Trimmed to top ${needed} priority destinations`);
    
    return trimmed;
  }

  /**
   * Expand selection to fill needed destinations
   */
  private static expandSelection(
    currentSelection: TripStop[],
    availableCities: TripStop[],
    needed: number,
    startStop: TripStop,
    endStop: TripStop
  ): TripStop[] {
    const expanded = [...currentSelection];
    const usedIds = new Set(currentSelection.map(city => city.id));
    
    // Add more cities from available pool
    for (const city of availableCities) {
      if (expanded.length >= needed) break;
      
      if (this.hasValidCoordinates(city) &&
          !usedIds.has(city.id) && 
          city.id !== startStop.id && 
          city.id !== endStop.id) {
        expanded.push(city);
        usedIds.add(city.id);
      }
    }
    
    console.log(`📈 Expanded selection from ${currentSelection.length} to ${expanded.length} destinations`);
    
    return expanded;
  }

  /**
   * Select optimal cities with canonical prioritization
   */
  private static selectOptimalCanonicalCities(
    startStop: TripStop,
    endStop: TripStop,
    canonicalCities: TripStop[],
    neededCities: number
  ): TripStop[] {
    if (neededCities <= 0 || canonicalCities.length === 0) {
      return [];
    }

    // Filter to only cities with valid coordinates
    const validCities = canonicalCities.filter(city => this.hasValidCoordinates(city));

    if (validCities.length <= neededCities) {
      // Use all available canonical cities, sorted by sequence
      return Route66SequenceUtils.sortBySequence(validCities, this.getTripDirection(startStop, endStop));
    }

    // Prioritize canonical cities by their priority score and sequence position
    const prioritizedCities = validCities.map(city => {
      const canonicalInfo = CanonicalRoute66Cities.getDestinationInfo(
        city.city_name || city.name,
        city.state
      );
      
      const priorityScore = canonicalInfo ? canonicalInfo.priority : 0;
      const isForcedInclusion = canonicalInfo ? canonicalInfo.forcedInclusion : false;
      const isMajor = canonicalInfo ? canonicalInfo.tier === 'major' : false;
      
      // Calculate sequence position score
      const sequenceInfo = Route66SequenceUtils.getSequenceInfo(city);
      const sequenceScore = sequenceInfo.order !== null ? sequenceInfo.order : 0;
      
      // Combined score: priority + forced inclusion bonus + major tier bonus
      let totalScore = priorityScore;
      if (isForcedInclusion) totalScore += 50;
      if (isMajor) totalScore += 25;
      
      return {
        city,
        priorityScore,
        totalScore,
        isForcedInclusion,
        isMajor,
        sequenceScore
      };
    });

    // Sort by total score (highest first), then by sequence for ties
    prioritizedCities.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return a.sequenceScore - b.sequenceScore;
    });

    // Select top cities
    const selectedCities = prioritizedCities
      .slice(0, neededCities)
      .map(item => item.city);

    console.log(`🎯 CANONICAL PRIORITIZATION: Selected top ${selectedCities.length} cities by priority`);
    prioritizedCities.slice(0, neededCities).forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.city.name} (priority: ${item.priorityScore}, total: ${item.totalScore})`);
    });

    // Sort final selection by sequence order
    return Route66SequenceUtils.sortBySequence(selectedCities, this.getTripDirection(startStop, endStop));
  }

  private static getTripDirection(startStop: TripStop, endStop: TripStop): 'east-to-west' | 'west-to-east' {
    if (!this.hasValidCoordinates(startStop) || !this.hasValidCoordinates(endStop)) {
      return 'east-to-west'; // Default direction
    }

    const startInfo = Route66SequenceUtils.getSequenceInfo(startStop);
    const endInfo = Route66SequenceUtils.getSequenceInfo(endStop);
    
    if (startInfo.order !== null && endInfo.order !== null) {
      return endInfo.order < startInfo.order ? 'east-to-west' : 'west-to-east';
    }
    
    // Fallback to longitude
    return endStop.longitude < startStop.longitude ? 'east-to-west' : 'west-to-east';
  }
}
