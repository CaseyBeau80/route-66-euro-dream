import { TripStop } from '../types/TripStop';

export class Route66RouteFilterService {
  /**
   * Filter destination cities to those along the route with ultra-generous criteria
   */
  static filterDestinationCitiesAlongRoute(
    destinationCities: TripStop[],
    startStop: TripStop,
    endStop: TripStop
  ): TripStop[] {
    // ULTRA-GENEROUS route filtering - include all reasonable waypoints
    const routeDestinationCities = destinationCities.filter(city => {
      // Skip start and end cities from intermediate destinations
      if (city.id === startStop.id || city.id === endStop.id) return false;
      
      // Calculate distances using actual distance calculation service
      const distanceFromStart = Math.sqrt(
        Math.pow(city.latitude - startStop.latitude, 2) + 
        Math.pow(city.longitude - startStop.longitude, 2)
      );
      const distanceFromEnd = Math.sqrt(
        Math.pow(city.latitude - endStop.latitude, 2) + 
        Math.pow(city.longitude - endStop.longitude, 2)
      );
      const directDistance = Math.sqrt(
        Math.pow(endStop.latitude - startStop.latitude, 2) + 
        Math.pow(endStop.longitude - startStop.longitude, 2)
      );
      
      // ULTRA-GENEROUS: Allow cities within 4x direct distance to ensure enough destinations
      // This is very permissive to prevent the 13-day limitation
      const isReasonableWaypoint = (distanceFromStart + distanceFromEnd) <= (directDistance * 4.0);
      
      // DEBUG: Log filtering decisions
      if (!isReasonableWaypoint) {
        console.log(`🚫 FILTER: Excluding ${city.name}, ${city.state} - too far from route (${((distanceFromStart + distanceFromEnd) / directDistance).toFixed(1)}x direct distance)`);
      } else {
        console.log(`✅ FILTER: Including ${city.name}, ${city.state} - reasonable waypoint (${((distanceFromStart + distanceFromEnd) / directDistance).toFixed(1)}x direct distance)`);
      }
      
      return isReasonableWaypoint;
    });

    console.log(`🏛️ ROUTE FILTER: Found ${routeDestinationCities.length} destination cities along route`);
    console.log(`📋 Available cities: ${routeDestinationCities.map(c => `${c.name}, ${c.state}`).join(' • ')}`);

    return routeDestinationCities;
  }
}