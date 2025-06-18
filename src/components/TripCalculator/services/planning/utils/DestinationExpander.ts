
import { TripStop } from '../../../types/TripStop';
import { Route66SequenceValidator } from '../utils/Route66SequenceValidator';
import { DestinationValidator } from './DestinationValidator';

export class DestinationExpander {
  /**
   * Expand selection to fill needed destinations
   */
  static expandSelection(
    currentSelection: TripStop[],
    availableCities: TripStop[],
    needed: number,
    startStop: TripStop,
    endStop: TripStop
  ): TripStop[] {
    const expanded = [...currentSelection];
    const usedIds = new Set(currentSelection.map(city => city.id));
    
    for (const city of availableCities) {
      if (expanded.length >= needed) break;
      
      if (!DestinationValidator.isValidTripStop(city)) {
        continue;
      }
      
      const isNotUsed = !usedIds.has(city.id);
      const isNotStartStop = city.id !== startStop.id;
      const isNotEndStop = city.id !== endStop.id;
      
      if (isNotUsed && isNotStartStop && isNotEndStop) {
        expanded.push(city);
        usedIds.add(city.id);
      }
    }
    
    console.log(`📈 Expanded selection from ${currentSelection.length} to ${expanded.length} destinations`);
    
    return expanded;
  }

  /**
   * Expand beyond canonical destinations when needed
   */
  static expandBeyondCanonical(
    workingCities: TripStop[],
    destinationCities: TripStop[],
    canonicalStops: TripStop[],
    startStop: TripStop,
    endStop: TripStop,
    neededIntermediateDestinations: number
  ): TripStop[] {
    if (workingCities.length >= neededIntermediateDestinations) {
      return workingCities;
    }

    console.log(`📈 Need more cities: expanding beyond canonical destinations`);
    
    // Add non-canonical destination cities that are in sequence
    const nonCanonicalDestinations: TripStop[] = [];
    
    for (const city of destinationCities) {
      if (!DestinationValidator.isValidTripStop(city)) {
        continue;
      }
      
      const isNotStartStop = city.id !== startStop.id;
      const isNotEndStop = city.id !== endStop.id;
      const isNotAlreadyCanonical = !canonicalStops.some(canonical => canonical && canonical.id === city.id);
      
      if (isNotStartStop && isNotEndStop && isNotAlreadyCanonical) {
        nonCanonicalDestinations.push(city);
      }
    }
    
    try {
      const additionalSequenceResult = Route66SequenceValidator.filterValidSequenceStops(
        startStop,
        nonCanonicalDestinations,
        endStop
      );
      const additionalValidCities = (additionalSequenceResult.validStops || [])
        .filter(city => DestinationValidator.isValidTripStop(city));
      
      console.log(`🏙️ Additional valid destination cities: ${additionalValidCities.length}`);
      
      // Combine canonical and additional cities
      return [...workingCities, ...additionalValidCities];
    } catch (error) {
      console.error('❌ Error in additional sequence validation:', error);
      return workingCities; // Continue with current working cities
    }
  }
}
