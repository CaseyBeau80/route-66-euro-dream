
import { TripStop } from '../../types/TripStop';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class AttractionFinder {
  /**
   * Find attractions along a segment route
   */
  static findStrictAttractionsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    maxAttractions: number
  ): TripStop[] {
    console.log(`🔍 STRICT: Finding attractions for ${startStop.name} → ${endStop.name}`);
    
    const directDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude, endStop.latitude, endStop.longitude
    );
    
    // Pre-filter to ensure valid coordinates and proper typing
    const validStops: TripStop[] = allStops.filter((stop: TripStop) => {
      return stop && 
             typeof stop.latitude === 'number' && 
             typeof stop.longitude === 'number' &&
             !isNaN(stop.latitude) && 
             !isNaN(stop.longitude);
    });
    
    // Now filter for attractions with explicit type assertion for distance calculations
    const attractions: TripStop[] = validStops.filter((stop: TripStop) => {
      // Skip start and end stops
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      // STRICT: Don't use destination cities as attractions in segments
      if (StrictDestinationCityEnforcer.isDestinationCity(stop)) {
        console.log(`🚫 STRICT: Excluding destination city from attractions: ${stop.name}`);
        return false;
      }
      
      // Calculate if stop is along the route with explicit type assertion
      const typedStop = stop as TripStop;
      const typedStartStop = startStop as TripStop;
      
      const distFromStart = DistanceCalculationService.calculateDistance(
        typedStartStop.latitude, typedStartStop.longitude, typedStop.latitude, typedStop.longitude
      );
      const distToEnd = DistanceCalculationService.calculateDistance(
        typedStop.latitude, typedStop.longitude, endStop.latitude, endStop.longitude
      );
      
      const routeDeviation = (distFromStart + distToEnd) - directDistance;
      const isOnRoute = routeDeviation < (directDistance * 0.2);
      const isBetween = distFromStart < directDistance && distToEnd < directDistance;
      
      return isOnRoute && isBetween;
    });
    
    // Sort by priority - attractions first, then historic sites
    const sortedAttractions: TripStop[] = attractions.sort((a: TripStop, b: TripStop) => {
      if (a.category === 'attraction' && b.category !== 'attraction') return -1;
      if (b.category === 'attraction' && a.category !== 'attraction') return 1;
      if (a.category === 'historic_site' && b.category !== 'historic_site') return -1;
      if (b.category === 'historic_site' && a.category !== 'historic_site') return 1;
      return 0;
    });
    
    const selectedAttractions = sortedAttractions.slice(0, maxAttractions);
    
    // If no attractions found along route, try to find nearby attractions in destination city
    if (selectedAttractions.length === 0) {
      console.log(`🔍 STRICT: No route attractions found, searching for nearby attractions in ${endStop.name}`);
      
      const nearbyAttractions = validStops.filter((stop: TripStop) => {
        // Skip start and end stops
        if (stop.id === startStop.id || stop.id === endStop.id) return false;
        
        // Don't use destination cities as attractions
        if (StrictDestinationCityEnforcer.isDestinationCity(stop)) return false;
        
        // Find attractions within reasonable distance of destination city (50 miles)
        const distToDestination = DistanceCalculationService.calculateDistance(
          stop.latitude, stop.longitude, endStop.latitude, endStop.longitude
        );
        
        return distToDestination <= 50 && (
          stop.category === 'attraction' || 
          stop.category === 'historic_site' ||
          stop.category === 'hidden_gems'
        );
      }).sort((a: TripStop, b: TripStop) => {
        // Sort by distance to destination
        const distA = DistanceCalculationService.calculateDistance(
          a.latitude, a.longitude, endStop.latitude, endStop.longitude
        );
        const distB = DistanceCalculationService.calculateDistance(
          b.latitude, b.longitude, endStop.latitude, endStop.longitude
        );
        return distA - distB;
      }).slice(0, maxAttractions);
      
      if (nearbyAttractions.length > 0) {
        console.log(`🎯 STRICT: Found ${nearbyAttractions.length} nearby attractions: ${nearbyAttractions.map(stop => stop.name).join(', ')}`);
        return nearbyAttractions;
      }
    }
    
    console.log(`🎯 STRICT: Selected ${selectedAttractions.length} attractions: ${selectedAttractions.map(stop => stop.name).join(', ')}`);
    
    return selectedAttractions;
  }
}
