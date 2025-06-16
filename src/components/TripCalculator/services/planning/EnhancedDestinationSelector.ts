
import { TripStop } from '../data/SupabaseDataService';
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
    console.log(`🎯 ENHANCED CANONICAL SELECTION: ${totalDays} days from ${startStop.name} to ${endStop.name}`);
    
    // STEP 1: Filter to only destination cities
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    
    // STEP 2: Match available cities to canonical destinations
    const canonicalStops = CanonicalRoute66Cities.matchStopsToCanonical(destinationCities);
    console.log(`🏛️ Canonical destinations available: ${canonicalStops.length}`);
    
    // STEP 3: Remove start and end cities
    const availableCities = canonicalStops.filter(city => 
      city.id !== startStop.id && city.id !== endStop.id
    );
    
    console.log(`🏛️ Available canonical cities: ${availableCities.length}`);
    
    // STEP 4: Filter by Route 66 sequence to prevent backtracking
    const { validStops: sequenceValidCities } = Route66SequenceValidator.filterValidSequenceStops(
      startStop,
      availableCities,
      endStop
    );
    
    console.log(`🛤️ Sequence-valid canonical cities: ${sequenceValidCities.length}`);
    
    // STEP 5: Select optimal cities using canonical prioritization
    const selectedCities = this.selectOptimalCanonicalCities(
      startStop, 
      endStop, 
      sequenceValidCities, 
      totalDays
    );
    
    // STEP 6: Force inclusion of priority destinations
    const enhancedSelection = CanonicalRoute66Cities.enforceDestinationInclusion(
      selectedCities,
      availableCities,
      totalDays
    );
    
    // STEP 7: Validate final sequence
    const finalSequence = [startStop, ...enhancedSelection, endStop];
    const sequenceValidation = Route66SequenceValidator.validateTripSequence(finalSequence);
    
    if (!sequenceValidation.isValid) {
      console.warn(`⚠️ CANONICAL SEQUENCE VIOLATIONS:`, sequenceValidation.violations);
    } else {
      console.log(`✅ CANONICAL SEQUENCE VALIDATION PASSED`);
    }
    
    // STEP 8: Log canonical destination coverage
    const coverage = CanonicalRoute66Cities.getDestinationCoverage(enhancedSelection);
    console.log(`📊 CANONICAL COVERAGE: ${coverage.includedCanonical}/${coverage.totalCanonical} destinations (${coverage.coverage}%), ${coverage.majorIncluded} major, ${coverage.forcedIncluded} forced`);
    
    console.log(`✅ Selected ${enhancedSelection.length} canonical destination cities:`, enhancedSelection.map(c => c.name));
    
    return enhancedSelection;
  }

  /**
   * Select optimal cities with canonical prioritization
   */
  private static selectOptimalCanonicalCities(
    startStop: TripStop,
    endStop: TripStop,
    canonicalCities: TripStop[],
    totalDays: number
  ): TripStop[] {
    if (totalDays <= 1 || canonicalCities.length === 0) {
      return [];
    }

    const neededCities = totalDays - 1; // One less than total days
    
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

  private static filterCitiesAlongRoute(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[]
  ): TripStop[] {
    const routeDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    return destinationCities.filter(city => {
      const startToCity = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        city.latitude, city.longitude
      );
      
      const cityToEnd = DistanceCalculationService.calculateDistance(
        city.latitude, city.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // City is roughly along the route if total distance via city isn't much longer
      const detourFactor = (startToCity + cityToEnd) / routeDistance;
      
      // Allow generous detour for canonical destination cities
      return detourFactor <= 1.5;
    });
  }
}
