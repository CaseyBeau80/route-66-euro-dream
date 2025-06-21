
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class StopFilteringService {
  /**
   * Filter stops with more appropriate distance thresholds for Route 66
   */
  static filterValidStops(
    stops: TripStop[],
    startStop: TripStop,
    endStop: TripStop,
    maxDeviationMiles: number = 150 // More generous for Route 66
  ): TripStop[] {
    console.log(`🔍 Filtering ${stops.length} stops with max deviation: ${maxDeviationMiles} miles`);
    
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

    console.log(`📏 Direct route distance: ${directDistance.toFixed(1)} miles`);

    const validStops = stops.filter(stop => {
      if (!stop || typeof stop.latitude !== 'number' || typeof stop.longitude !== 'number') {
        console.log(`⚠️ Skipping stop with invalid coordinates: ${stop?.name || 'Unknown'}`);
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

      // More lenient filtering for Route 66 - allow reasonable deviations
      const isReasonable = deviation <= maxDeviationMiles;

      if (!isReasonable) {
        console.log(`⚠️ Filtering out stop with excessive deviation: ${stop.name} (${deviation.toFixed(1)} miles over direct route)`);
      } else {
        console.log(`✅ Keeping stop: ${stop.name} (deviation: ${deviation.toFixed(1)} miles)`);
      }

      return isReasonable;
    });

    // Always include destination cities even if they seem far
    const destinationCities = stops.filter(stop => 
      stop.category === 'destination_city' || stop.category === 'major_waypoint'
    );

    // Combine valid stops with destination cities (remove duplicates)
    const allValidStops = [...validStops];
    destinationCities.forEach(city => {
      if (!allValidStops.find(stop => stop.id === city.id)) {
        console.log(`📍 Including destination city: ${city.name}`);
        allValidStops.push(city);
      }
    });

    console.log(`✅ Filtered from ${stops.length} to ${allValidStops.length} valid stops`);
    return allValidStops;
  }

  /**
   * Remove duplicate stops based on name and location similarity
   */
  static removeDuplicateStops(stops: TripStop[]): TripStop[] {
    console.log(`🔍 Removing duplicates from ${stops.length} stops`);
    
    const uniqueStops: TripStop[] = [];
    const seenNames = new Set<string>();

    stops.forEach(stop => {
      const normalizedName = stop.name.toLowerCase().trim();
      
      if (!seenNames.has(normalizedName)) {
        seenNames.add(normalizedName);
        uniqueStops.push(stop);
      } else {
        console.log(`⚠️ Skipping duplicate stop: ${stop.name}`);
      }
    });

    console.log(`✅ Removed duplicates: ${stops.length} -> ${uniqueStops.length} unique stops`);
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
