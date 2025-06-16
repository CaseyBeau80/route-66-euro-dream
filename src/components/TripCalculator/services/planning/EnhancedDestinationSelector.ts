
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { Route66SequenceValidator } from './utils/Route66SequenceValidator';
import { Route66SequenceUtils } from './utils/Route66SequenceUtils';

export class EnhancedDestinationSelector {
  /**
   * Select destination cities with Route 66 sequence enforcement
   */
  static selectDestinationCitiesForTrip(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    console.log(`🎯 ENHANCED DESTINATION SELECTION WITH SEQUENCE: ${totalDays} days from ${startStop.name} to ${endStop.name}`);
    
    // STEP 1: Filter to only destination cities
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    
    // STEP 2: Remove start and end cities
    const availableCities = destinationCities.filter(city => 
      city.id !== startStop.id && city.id !== endStop.id
    );
    
    console.log(`🏛️ Available destination cities: ${availableCities.length}`);
    
    // STEP 3: Filter by Route 66 sequence to prevent backtracking
    const { validStops: sequenceValidCities } = Route66SequenceValidator.filterValidSequenceStops(
      startStop,
      availableCities,
      endStop
    );
    
    console.log(`🛤️ Sequence-valid cities: ${sequenceValidCities.length}`);
    
    // STEP 4: Filter geographically relevant cities (backup validation)
    const routeCities = this.filterCitiesAlongRoute(startStop, endStop, sequenceValidCities);
    
    console.log(`🗺️ Route-aligned cities: ${routeCities.length}`);
    
    // STEP 5: Select optimal cities using sequence-aware logic
    const selectedCities = this.selectOptimalCitiesWithSequence(startStop, endStop, routeCities, totalDays);
    
    console.log(`✅ Selected ${selectedCities.length} destination cities:`, selectedCities.map(c => c.name));
    
    // STEP 6: Validate final sequence
    const finalSequence = [startStop, ...selectedCities, endStop];
    const sequenceValidation = Route66SequenceValidator.validateTripSequence(finalSequence);
    
    if (!sequenceValidation.isValid) {
      console.warn(`⚠️ SEQUENCE VIOLATIONS DETECTED:`, sequenceValidation.violations);
      // Could implement auto-correction here if needed
    } else {
      console.log(`✅ SEQUENCE VALIDATION PASSED: No backtracking detected`);
    }
    
    return selectedCities;
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
      
      // Allow generous detour for destination cities (up to 50% longer route)
      return detourFactor <= 1.5;
    });
  }

  private static selectOptimalCitiesWithSequence(
    startStop: TripStop,
    endStop: TripStop,
    routeCities: TripStop[],
    totalDays: number
  ): TripStop[] {
    if (totalDays <= 1 || routeCities.length === 0) {
      return [];
    }

    const neededCities = totalDays - 1; // One less than total days
    
    if (routeCities.length <= neededCities) {
      // Use all available cities, but ensure proper sequence
      return Route66SequenceUtils.sortBySequence(routeCities, this.getTripDirection(startStop, endStop));
    }

    // Use sequence-aware selection
    const selectedCities: TripStop[] = [];
    let currentStop = startStop;

    // Calculate optimal sequence spacing
    const targetSequences = Route66SequenceUtils.calculateOptimalSpacing(startStop, endStop, neededCities);
    
    for (let i = 0; i < neededCities && i < targetSequences.length; i++) {
      // Find the best city for this sequence position
      const targetSequence = targetSequences[i];
      
      let bestCity: TripStop | null = null;
      let bestSequenceDistance = Number.MAX_VALUE;
      
      for (const city of routeCities) {
        if (selectedCities.includes(city)) continue;
        
        // Validate sequence progression
        const validation = Route66SequenceValidator.validateSequence(currentStop, city, endStop);
        if (!validation.isValid) continue;
        
        const citySequenceInfo = Route66SequenceUtils.getSequenceInfo(city);
        if (citySequenceInfo.order === null) continue;
        
        const sequenceDistance = Math.abs(citySequenceInfo.order - targetSequence);
        
        if (sequenceDistance < bestSequenceDistance) {
          bestSequenceDistance = sequenceDistance;
          bestCity = city;
        }
      }
      
      if (bestCity) {
        selectedCities.push(bestCity);
        currentStop = bestCity;
        console.log(`🎯 Selected sequence-aware stop ${i + 1}: ${bestCity.name} (sequence gap: ${bestSequenceDistance})`);
      }
    }

    // If we didn't get enough cities through sequence selection, fall back to distance-based
    if (selectedCities.length < neededCities) {
      console.log(`⚠️ Sequence selection only found ${selectedCities.length}/${neededCities} cities, using fallback`);
      
      const remainingCities = routeCities.filter(city => !selectedCities.includes(city));
      const additionalCities = this.selectByDistanceFallback(currentStop, endStop, remainingCities, neededCities - selectedCities.length);
      
      selectedCities.push(...additionalCities);
    }

    return selectedCities;
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

  private static selectByDistanceFallback(
    currentStop: TripStop,
    endStop: TripStop,
    availableCities: TripStop[],
    needed: number
  ): TripStop[] {
    const totalDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Sort cities by distance from current stop
    const sortedCities = availableCities.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        b.latitude, b.longitude
      );
      return distA - distB;
    });

    return sortedCities.slice(0, needed);
  }
}
