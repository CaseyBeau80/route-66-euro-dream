
import { TripStop, convertToTripStop } from '../../types/TripStop';
import { RouteDistanceService } from '../utils/RouteDistanceService';

export class TripBoundaryService {
  /**
   * Find start and end stops with enhanced null safety
   */
  static findBoundaryStops(
    startLocation: string,
    endLocation: string,
    allStops: TripStop[]
  ): { startStop: TripStop; endStop: TripStop; routeStops: TripStop[] } {
    console.log(`🎯 Finding boundary stops: ${startLocation} → ${endLocation}`);
    
    // Add comprehensive input validation
    if (!startLocation || !endLocation || !allStops || allStops.length === 0) {
      console.error('❌ CRITICAL: Invalid boundary service inputs', {
        hasStartLocation: !!startLocation,
        hasEndLocation: !!endLocation,
        hasAllStops: !!allStops,
        allStopsLength: allStops?.length || 0
      });
      throw new Error('Invalid input parameters for boundary stops');
    }

    // Filter to valid stops with coordinates and add detailed logging
    const validStops = allStops.filter((stop, index) => {
      const isValid = stop && 
        stop.id &&
        stop.name &&
        typeof stop.latitude === 'number' &&
        typeof stop.longitude === 'number' &&
        !isNaN(stop.latitude) &&
        !isNaN(stop.longitude) &&
        stop.latitude !== 0 &&
        stop.longitude !== 0;
      
      if (!isValid) {
        console.warn(`⚠️ BOUNDARY: Filtering out invalid stop at index ${index}:`, {
          hasStop: !!stop,
          id: stop?.id,
          name: stop?.name,
          latitude: stop?.latitude,
          longitude: stop?.longitude,
          latitudeType: typeof stop?.latitude,
          longitudeType: typeof stop?.longitude
        });
      }
      
      return isValid;
    });

    console.log(`🛡️ Filtered ${allStops.length} stops to ${validStops.length} valid stops`);

    if (validStops.length === 0) {
      console.error('❌ CRITICAL: No valid stops available');
      throw new Error('No valid stops available for boundary calculation');
    }
    
    // Find start stop with improved matching
    const startStop = this.findLocationStop(startLocation, validStops, 'start');
    if (!startStop) {
      console.error(`❌ CRITICAL: Start location "${startLocation}" not found`);
      console.log('🔍 Available stop names:', validStops.map(s => s.name));
      throw new Error(`Start location "${startLocation}" not found in available stops`);
    }
    
    // Find end stop with improved matching
    const endStop = this.findLocationStop(endLocation, validStops, 'end');
    if (!endStop) {
      console.error(`❌ CRITICAL: End location "${endLocation}" not found`);
      console.log('🔍 Available stop names:', validStops.map(s => s.name));
      throw new Error(`End location "${endLocation}" not found in available stops`);
    }

    // Validate that start and end stops have valid coordinates
    if (!this.hasValidCoordinates(startStop)) {
      console.error('❌ CRITICAL: Start stop has invalid coordinates', startStop);
      throw new Error('Start stop has invalid coordinates');
    }

    if (!this.hasValidCoordinates(endStop)) {
      console.error('❌ CRITICAL: End stop has invalid coordinates', endStop);
      throw new Error('End stop has invalid coordinates');
    }
    
    // Get all stops between start and end with error handling
    let routeStops;
    try {
      routeStops = this.getRouteStops(startStop, endStop, validStops);
    } catch (error) {
      console.error('❌ Error getting route stops:', error);
      routeStops = []; // Fallback to empty array
    }
    
    console.log(`✅ Boundary stops found: ${startStop.name} → ${endStop.name} with ${routeStops.length} route stops`);
    
    return { startStop, endStop, routeStops };
  }
  
  /**
   * Find a location stop by name with improved matching
   */
  private static findLocationStop(
    locationName: string, 
    stops: TripStop[], 
    type: 'start' | 'end'
  ): TripStop | null {
    if (!locationName || !stops || stops.length === 0) {
      console.error(`❌ Invalid parameters for ${type} stop search`);
      return null;
    }

    const searchName = locationName.toLowerCase().trim();
    
    // Try exact name match first
    let matchedStop = stops.find(stop => 
      stop && stop.name && stop.name.toLowerCase() === searchName
    );
    
    if (matchedStop) {
      console.log(`🎯 ${type} stop found (exact match): ${matchedStop.name}`);
      return matchedStop;
    }
    
    // Try city name match
    matchedStop = stops.find(stop => 
      stop && stop.city_name && stop.city_name.toLowerCase() === searchName
    );
    
    if (matchedStop) {
      console.log(`🎯 ${type} stop found (city match): ${matchedStop.name} in ${matchedStop.city_name}`);
      return matchedStop;
    }
    
    // Try partial name match
    matchedStop = stops.find(stop => 
      stop && stop.name && stop.name.toLowerCase().includes(searchName)
    );
    
    if (matchedStop) {
      console.log(`🎯 ${type} stop found (partial match): ${matchedStop.name}`);
      return matchedStop;
    }
    
    // Try partial city name match
    matchedStop = stops.find(stop => 
      stop && stop.city_name && stop.city_name.toLowerCase().includes(searchName)
    );
    
    if (matchedStop) {
      console.log(`🎯 ${type} stop found (partial city match): ${matchedStop.name} in ${matchedStop.city_name}`);
      return matchedStop;
    }
    
    console.warn(`⚠️ ${type} location "${locationName}" not found in ${stops.length} stops`);
    return null;
  }
  
  /**
   * Get stops along the route between start and end
   */
  private static getRouteStops(
    startStop: TripStop, 
    endStop: TripStop, 
    allStops: TripStop[]
  ): TripStop[] {
    console.log(`🛤️ Getting route stops between ${startStop.name} and ${endStop.name}`);
    
    if (!this.hasValidCoordinates(startStop) || !this.hasValidCoordinates(endStop)) {
      console.error('❌ Invalid start or end stop coordinates');
      return [];
    }

    // Filter out start and end stops and ensure valid coordinates
    const candidateStops = allStops.filter(stop => {
      const isCandidate = stop && 
        stop.id !== startStop.id && 
        stop.id !== endStop.id &&
        this.hasValidCoordinates(stop);
      
      if (!isCandidate && stop) {
        console.log(`🔍 Filtering out candidate:`, {
          id: stop.id,
          name: stop.name,
          reason: stop.id === startStop.id ? 'is start stop' :
                  stop.id === endStop.id ? 'is end stop' :
                  !this.hasValidCoordinates(stop) ? 'invalid coordinates' : 'unknown'
        });
      }
      
      return isCandidate;
    });
    
    console.log(`🔍 Found ${candidateStops.length} candidate stops for route calculation`);
    
    // Use RouteDistanceService to find stops along the route with error handling
    let routeStops;
    try {
      routeStops = RouteDistanceService.getStopsAlongRoute(
        startStop,
        endStop,
        candidateStops
      );
    } catch (error) {
      console.error('❌ Error in RouteDistanceService:', error);
      routeStops = []; // Fallback to empty array
    }
    
    console.log(`🛤️ Found ${routeStops.length} stops along route`);
    return routeStops;
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
}
