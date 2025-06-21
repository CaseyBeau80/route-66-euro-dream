
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';

export class StopFilteringService {
  /**
   * ENHANCED: Filter stops with STRICT destination city enforcement
   */
  static filterValidStops(
    stops: TripStop[],
    startStop: TripStop,
    endStop: TripStop,
    maxDeviationMiles: number = 200
  ): TripStop[] {
    console.log(`🔍 ENHANCED: Filtering ${stops.length} stops with STRICT destination city enforcement`);
    
    if (!startStop || !endStop) {
      console.log('❌ Missing start or end stop for filtering');
      return [];
    }

    // STEP 1: STRICT ENFORCEMENT - Only destination cities allowed
    const destinationCitiesOnly = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(stops);
    
    if (destinationCitiesOnly.length === 0) {
      console.log('❌ No destination cities found after strict filtering');
      return [];
    }

    // STEP 2: Remove duplicates by name and location
    const uniqueStops = this.removeDuplicateStops(destinationCitiesOnly);

    // STEP 3: Geographic filtering for reasonable route progression
    const geographicallyValid = this.filterByGeographicProgression(
      uniqueStops,
      startStop,
      endStop,
      maxDeviationMiles
    );

    console.log(`✅ ENHANCED FILTERING COMPLETE: ${stops.length} → ${destinationCitiesOnly.length} (cities only) → ${geographicallyValid.length} (final)`);
    
    // STEP 4: Final validation
    const validation = StrictDestinationCityEnforcer.validateAllAreDestinationCities(geographicallyValid);
    if (!validation.isValid) {
      console.error(`❌ FINAL VALIDATION FAILED:`, validation.violations);
    }

    return geographicallyValid;
  }

  /**
   * Filter stops by geographic progression along the route
   */
  private static filterByGeographicProgression(
    stops: TripStop[],
    startStop: TripStop,
    endStop: TripStop,
    maxDeviationMiles: number
  ): TripStop[] {
    // Calculate the direct distance between start and end
    const directDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    console.log(`📏 Direct route distance: ${directDistance.toFixed(1)} miles`);

    const validStops = stops.filter(stop => {
      // Skip if it's the same as start or end
      if (stop.id === startStop.id || stop.id === endStop.id) {
        return false;
      }

      // Calculate distance from start to stop to end
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        stop.latitude,
        stop.longitude
      );

      const distanceFromStopToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude,
        stop.longitude,
        endStop.latitude,
        endStop.longitude
      );

      const totalDistanceViaStop = distanceFromStart + distanceFromStopToEnd;
      const deviation = totalDistanceViaStop - directDistance;

      // Check if stop is actually between start and end (progressing)
      const isProgressing = distanceFromStart < directDistance && distanceFromStopToEnd < directDistance;
      const isReasonableDeviation = deviation <= maxDeviationMiles;

      if (!isProgressing) {
        console.log(`⚠️ Filtering out non-progressing destination city: ${stop.name}`);
        return false;
      }

      if (!isReasonableDeviation) {
        console.log(`⚠️ Filtering out destination city with excessive deviation: ${stop.name} (${deviation.toFixed(1)} miles over direct route)`);
      } else {
        console.log(`✅ Keeping progressing destination city: ${stop.name} (deviation: ${deviation.toFixed(1)} miles)`);
      }

      return isReasonableDeviation;
    });

    return validStops;
  }

  /**
   * Remove duplicate destination cities
   */
  static removeDuplicateStops(stops: TripStop[]): TripStop[] {
    console.log(`🔍 Removing duplicates from ${stops.length} destination cities`);
    
    const uniqueStops: TripStop[] = [];
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();

    stops.forEach(stop => {
      // Skip if we've seen this ID
      if (seenIds.has(stop.id)) {
        console.log(`⚠️ Skipping duplicate ID: ${stop.name} (${stop.id})`);
        return;
      }

      // Create a normalized name for comparison
      const normalizedName = `${stop.name.toLowerCase().trim()}_${stop.state}`;
      
      if (!seenNames.has(normalizedName)) {
        seenIds.add(stop.id);
        seenNames.add(normalizedName);
        uniqueStops.push(stop);
      } else {
        console.log(`⚠️ Skipping duplicate destination city: ${stop.name}, ${stop.state}`);
      }
    });

    console.log(`✅ Removed duplicates: ${stops.length} → ${uniqueStops.length} unique destination cities`);
    return uniqueStops;
  }

  /**
   * Validate circular references in stops
   */
  static validateCircularReferences(stops: TripStop[]): TripStop[] {
    console.log(`🔍 Validating ${stops.length} destination cities for circular references`);
    
    // Remove exact duplicates by ID
    const validStops = stops.filter((stop, index, array) => {
      const firstIndex = array.findIndex(s => s.id === stop.id);
      if (firstIndex !== index) {
        console.log(`⚠️ Removing circular reference: ${stop.name}`);
        return false;
      }
      return true;
    });

    console.log(`✅ Circular reference validation complete: ${stops.length} → ${validStops.length}`);
    return validStops;
  }
}
