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
    
    // Add comprehensive null safety checks
    if (!startStop || !endStop || !allStops) {
      console.error('❌ CRITICAL: Null input parameters', { startStop: !!startStop, endStop: !!endStop, allStops: !!allStops });
      return [];
    }

    if (!startStop.latitude || !startStop.longitude || !endStop.latitude || !endStop.longitude) {
      console.error('❌ CRITICAL: Missing coordinates', { 
        startStop: { lat: startStop.latitude, lng: startStop.longitude },
        endStop: { lat: endStop.latitude, lng: endStop.longitude }
      });
      return [];
    }
    
    // CRITICAL FIX: Calculate the correct number of intermediate destinations needed
    const neededIntermediateDestinations = totalDays - 1; // For N days, we need N-1 intermediate destinations
    
    console.log(`🎯 NEED ${neededIntermediateDestinations} intermediate destinations for ${totalDays} day trip`);
    
    // STEP 1: Filter to only destination cities with null safety
    const safeAllStops = allStops.filter(stop => 
      stop && 
      typeof stop === 'object' && 
      stop.id && 
      stop.name &&
      typeof stop.latitude === 'number' &&
      typeof stop.longitude === 'number'
    );
    
    console.log(`🛡️ SAFETY: Filtered ${allStops.length} stops to ${safeAllStops.length} safe stops`);
    
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(safeAllStops);
    
    // STEP 2: Match available cities to canonical destinations
    const canonicalStops = CanonicalRoute66Cities.matchStopsToCanonical(destinationCities);
    console.log(`🏛️ Canonical destinations available: ${canonicalStops.length}`);
    
    // STEP 3: Remove start and end cities with safe filtering
    const availableCities = canonicalStops.filter(city => 
      city && city.id !== startStop.id && city.id !== endStop.id
    );
    
    console.log(`🏛️ Available canonical cities: ${availableCities.length}`);
    
    // STEP 4: Filter by Route 66 sequence to prevent backtracking
    const { validStops: sequenceValidCities } = Route66SequenceValidator.filterValidSequenceStops(
      startStop,
      availableCities,
      endStop
    );
    
    console.log(`🛤️ Sequence-valid canonical cities: ${sequenceValidCities.length}`);
    
    // STEP 5: If we don't have enough cities, expand selection beyond canonical
    let workingCities = sequenceValidCities;
    
    if (workingCities.length < neededIntermediateDestinations) {
      console.log(`📈 Need more cities: expanding beyond canonical destinations`);
      
      // Add non-canonical destination cities that are in sequence
      const nonCanonicalDestinations = destinationCities.filter(city => 
        city && 
        city.id !== startStop.id && 
        city.id !== endStop.id &&
        !canonicalStops.some(canonical => canonical && canonical.id === city.id)
      );
      
      const { validStops: additionalValidCities } = Route66SequenceValidator.filterValidSequenceStops(
        startStop,
        nonCanonicalDestinations,
        endStop
      );
      
      console.log(`🏙️ Additional valid destination cities: ${additionalValidCities.length}`);
      
      // Combine canonical and additional cities
      workingCities = [...sequenceValidCities, ...additionalValidCities];
    }
    
    // STEP 6: Select optimal cities using canonical prioritization
    const selectedCities = this.selectOptimalCanonicalCities(
      startStop, 
      endStop, 
      workingCities, 
      neededIntermediateDestinations
    );
    
    // STEP 7: Force inclusion of priority destinations if we have room
    const enhancedSelection = CanonicalRoute66Cities.enforceDestinationInclusion(
      selectedCities,
      workingCities,
      neededIntermediateDestinations
    );
    
    // STEP 8: Ensure we have exactly the right number of destinations
    let finalSelection = enhancedSelection;
    
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
    
    // STEP 9: Final safety check - ensure all selected cities have coordinates
    const safeFinalSelection = finalSelection.filter(city => 
      city && 
      typeof city.latitude === 'number' && 
      typeof city.longitude === 'number' &&
      !isNaN(city.latitude) &&
      !isNaN(city.longitude)
    );
    
    if (safeFinalSelection.length !== finalSelection.length) {
      console.warn(`⚠️ SAFETY: Removed ${finalSelection.length - safeFinalSelection.length} cities with invalid coordinates`);
    }
    
    // STEP 10: Validate final sequence
    const finalSequence = [startStop, ...safeFinalSelection, endStop];
    const sequenceValidation = Route66SequenceValidator.validateTripSequence(finalSequence);
    
    if (!sequenceValidation.isValid) {
      console.warn(`⚠️ CANONICAL SEQUENCE VIOLATIONS:`, sequenceValidation.violations);
    } else {
      console.log(`✅ CANONICAL SEQUENCE VALIDATION PASSED`);
    }
    
    // STEP 11: Log final result
    console.log(`🎯 FINAL SELECTION: ${safeFinalSelection.length}/${neededIntermediateDestinations} destinations for ${totalDays} days`);
    console.log(`✅ Selected destinations:`, safeFinalSelection.map(c => c?.name || 'unnamed'));
    
    return safeFinalSelection;
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
    const prioritized = destinations.map(city => {
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
      
      if (!usedIds.has(city.id) && 
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

    if (canonicalCities.length <= neededCities) {
      // Use all available canonical cities, sorted by sequence
      return Route66SequenceUtils.sortBySequence(canonicalCities, this.getTripDirection(startStop, endStop));
    }

    // Prioritize canonical cities by their priority score and sequence position
    const prioritizedCities = canonicalCities.map(city => {
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
    const startInfo = Route66SequenceUtils.getSequenceInfo(startStop);
    const endInfo = Route66SequenceUtils.getSequenceInfo(endStop);
    
    if (startInfo.order !== null && endInfo.order !== null) {
      return endInfo.order < startInfo.order ? 'east-to-west' : 'west-to-east';
    }
    
    // Fallback to longitude
    return endStop.longitude < startStop.longitude ? 'east-to-west' : 'west-to-east';
  }
}
