
import { TripStop } from '../../data/SupabaseDataService';
import { DistanceValidationService } from '../DistanceValidationService';
import { CanonicalRoute66Cities } from '../CanonicalRoute66Cities';

export class FallbackSelectionService {
  /**
   * Create fallback selection when optimal selection fails
   */
  static createFallbackSelection(
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
