
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class StopFilteringService {
  /**
   * FIXED: Filter stops with improved logic to prevent ping ponging
   */
  static filterValidStops(
    stops: TripStop[],
    startStop: TripStop,
    endStop: TripStop,
    maxDeviationMiles: number = 200 // More generous for Route 66
  ): TripStop[] {
    console.log(`🔍 FIXED: Filtering ${stops.length} stops with max deviation: ${maxDeviationMiles} miles`);
    
    if (!startStop || !endStop) {
      console.log('❌ Missing start or end stop for filtering');
      return stops;
    }

    // Calculate the direct distance between start and end
    const directDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    console.log(`📏 FIXED: Direct route distance: ${directDistance.toFixed(1)} miles`);

    // Remove duplicates by name and location first
    const uniqueStops = this.removeDuplicateStops(stops);

    const validStops = uniqueStops.filter(stop => {
      if (!stop || typeof stop.latitude !== 'number' || typeof stop.longitude !== 'number') {
        console.log(`⚠️ FIXED: Skipping stop with invalid coordinates: ${stop?.name || 'Unknown'}`);
        return false;
      }

      // Skip if it's the same as start or end
      if (stop.id === startStop.id || stop.id === endStop.id) {
        console.log(`⚠️ FIXED: Skipping start/end stop: ${stop.name}`);
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

      // FIXED: More intelligent filtering - check if stop is actually between start and end
      const isProgressing = distanceFromStart < directDistance && distanceFromStopToEnd < directDistance;
      const isReasonableDeviation = deviation <= maxDeviationMiles;

      if (!isProgressing) {
        console.log(`⚠️ FIXED: Filtering out non-progressing stop: ${stop.name}`);
        return false;
      }

      if (!isReasonableDeviation) {
        console.log(`⚠️ FIXED: Filtering out stop with excessive deviation: ${stop.name} (${deviation.toFixed(1)} miles over direct route)`);
      } else {
        console.log(`✅ FIXED: Keeping progressing stop: ${stop.name} (deviation: ${deviation.toFixed(1)} miles)`);
      }

      return isReasonableDeviation;
    });

    // Always include destination cities that are progressing along the route
    const destinationCities = uniqueStops.filter(stop => {
      if (stop.category !== 'destination_city' && stop.category !== 'major_waypoint') {
        return false;
      }

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

      // Only include if it's actually between start and end
      return distanceFromStart < directDistance && distanceFromStopToEnd < directDistance;
    });

    // Combine valid stops with progressing destination cities (remove duplicates)
    const allValidStops = [...validStops];
    destinationCities.forEach(city => {
      if (!allValidStops.find(stop => stop.id === city.id)) {
        console.log(`📍 FIXED: Including progressing destination city: ${city.name}`);
        allValidStops.push(city);
      }
    });

    console.log(`✅ FIXED: Filtered from ${stops.length} to ${allValidStops.length} valid progressing stops`);
    return allValidStops;
  }

  /**
   * FIXED: Remove duplicate stops with better logic
   */
  static removeDuplicateStops(stops: TripStop[]): TripStop[] {
    console.log(`🔍 FIXED: Removing duplicates from ${stops.length} stops`);
    
    const uniqueStops: TripStop[] = [];
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();

    stops.forEach(stop => {
      // Skip if we've seen this ID
      if (seenIds.has(stop.id)) {
        console.log(`⚠️ FIXED: Skipping duplicate ID: ${stop.name} (${stop.id})`);
        return;
      }

      // Create a normalized name for comparison
      const normalizedName = `${stop.name.toLowerCase().trim()}_${stop.state}`;
      
      if (!seenNames.has(normalizedName)) {
        seenIds.add(stop.id);
        seenNames.add(normalizedName);
        uniqueStops.push(stop);
      } else {
        console.log(`⚠️ FIXED: Skipping duplicate name+state: ${stop.name}, ${stop.state}`);
      }
    });

    console.log(`✅ FIXED: Removed duplicates: ${stops.length} -> ${uniqueStops.length} unique stops`);
    return uniqueStops;
  }

  /**
   * Validate circular references in stops
   */
  static validateCircularReferences(stops: TripStop[]): TripStop[] {
    console.log(`🔍 Validating ${stops.length} stops for circular references`);
    
    // For now, just remove exact duplicates by ID
    const validStops = stops.filter((stop, index, array) => {
      const firstIndex = array.findIndex(s => s.id === stop.id);
      if (firstIndex !== index) {
        console.log(`⚠️ Removing circular reference: ${stop.name}`);
        return false;
      }
      return true;
    });

    console.log(`✅ Circular reference validation complete: ${stops.length} -> ${validStops.length}`);
    return validStops;
  }
}
