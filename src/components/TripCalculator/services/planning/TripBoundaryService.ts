
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class TripBoundaryService {
  /**
   * Find boundary stops (start and end) and initial route stops
   */
  static findBoundaryStops(
    startLocation: string,
    endLocation: string,
    allStops: TripStop[]
  ): {
    startStop: TripStop;
    endStop: TripStop;
    routeStops: TripStop[];
  } {
    console.log('🎯 TripBoundaryService: Finding boundary stops', {
      startLocation,
      endLocation,
      availableStops: allStops.length
    });

    // Find start stop
    const startStop = this.findStopByLocation(startLocation, allStops);
    if (!startStop) {
      throw new Error(`Start location "${startLocation}" not found in Route 66 stops`);
    }

    // Find end stop
    const endStop = this.findStopByLocation(endLocation, allStops);
    if (!endStop) {
      throw new Error(`End location "${endLocation}" not found in Route 66 stops`);
    }

    // Get all stops that could be on the route between start and end
    const routeStops = this.getRouteStops(startStop, endStop, allStops);

    console.log('✅ TripBoundaryService: Boundary stops found', {
      startStop: startStop.name,
      endStop: endStop.name,
      routeStopsCount: routeStops.length
    });

    return {
      startStop,
      endStop,
      routeStops
    };
  }

  /**
   * Find a stop by location name (city name matching)
   */
  private static findStopByLocation(locationName: string, allStops: TripStop[]): TripStop | null {
    const normalizedLocation = locationName.toLowerCase().trim();
    
    // Try exact city match first
    let match = allStops.find(stop => 
      stop.city?.toLowerCase() === normalizedLocation ||
      stop.city_name?.toLowerCase() === normalizedLocation ||
      stop.name?.toLowerCase() === normalizedLocation
    );

    // Try partial match if exact match fails
    if (!match) {
      match = allStops.find(stop => 
        stop.city?.toLowerCase().includes(normalizedLocation) ||
        stop.city_name?.toLowerCase().includes(normalizedLocation) ||
        stop.name?.toLowerCase().includes(normalizedLocation)
      );
    }

    return match || null;
  }

  /**
   * Get stops that are roughly on the route between start and end
   */
  private static getRouteStops(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[]
  ): TripStop[] {
    // Calculate direct distance between start and end
    const directDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    // Filter stops that are roughly on the route
    const routeStops = allStops.filter(stop => {
      // Skip start and end stops
      if (stop.id === startStop.id || stop.id === endStop.id) {
        return false;
      }

      // Calculate distance from start to this stop, and from this stop to end
      const startToStop = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        stop.latitude,
        stop.longitude
      );

      const stopToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude,
        stop.longitude,
        endStop.latitude,
        endStop.longitude
      );

      // If going through this stop doesn't add too much distance, it's on the route
      const totalThroughStop = startToStop + stopToEnd;
      const detourFactor = totalThroughStop / directDistance;

      // Allow up to 30% detour to include stops that are roughly on the route
      return detourFactor <= 1.3;
    });

    // Sort by distance from start to maintain rough route order
    routeStops.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        a.latitude,
        a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        b.latitude,
        b.longitude
      );
      return distA - distB;
    });

    // Include start and end stops in the final array
    return [startStop, ...routeStops, endStop];
  }
}
