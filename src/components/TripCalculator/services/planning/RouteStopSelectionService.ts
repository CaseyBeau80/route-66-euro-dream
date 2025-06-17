
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class RouteStopSelectionService {
  /**
   * Get stops along route with destination city priority
   */
  static getStopsAlongRoute(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[]
  ): TripStop[] {
    console.log('🛤️ Selecting stops along route with destination city priority');
    
    const routeStops = allStops.filter(stop => 
      stop.id !== startStop.id && stop.id !== endStop.id
    );

    // Separate destination cities for prioritization
    const destinationCities = routeStops.filter(stop => stop.category === 'destination_city');
    const otherStops = routeStops.filter(stop => stop.category !== 'destination_city');

    console.log(`🏙️ Found ${destinationCities.length} destination cities and ${otherStops.length} other stops`);

    // Calculate distances and filter for route alignment
    const routeDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const alignedStops = [...destinationCities, ...otherStops].filter(stop => {
      const startToStop = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      const stopToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // Stop is roughly on route if total distance isn't much longer
      const detourFactor = (startToStop + stopToEnd) / routeDistance;
      return detourFactor <= 1.3; // Allow 30% detour maximum
    });

    console.log(`📍 Selected ${alignedStops.length} aligned stops (${destinationCities.filter(dc => alignedStops.includes(dc)).length} destination cities)`);
    return alignedStops;
  }

  /**
   * Select stops for a specific segment with drive time consideration
   */
  static selectStopsForSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    maxStops: number,
    driveTimeHours?: number
  ): TripStop[] {
    const segmentStops: TripStop[] = [];
    
    // Calculate distance between start and end
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    // Filter stops that are roughly along this segment
    const segmentCandidates = availableStops.filter(stop => {
      if (stop.id === startStop.id || stop.id === endStop.id) return false;
      
      const startToStop = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      const stopToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // Check if stop is roughly on the segment path
      const totalViaStop = startToStop + stopToEnd;
      const detourFactor = totalViaStop / totalDistance;
      
      return detourFactor <= 1.2 && startToStop < totalDistance * 0.8;
    });

    // Sort by distance from start and take the best ones
    segmentCandidates.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        b.latitude, b.longitude
      );
      
      // Prioritize destination cities
      if (a.category === 'destination_city' && b.category !== 'destination_city') return -1;
      if (b.category === 'destination_city' && a.category !== 'destination_city') return 1;
      
      return distA - distB;
    });

    // Select up to maxStops
    for (let i = 0; i < Math.min(maxStops, segmentCandidates.length); i++) {
      segmentStops.push(segmentCandidates[i]);
    }

    console.log(`📍 Selected ${segmentStops.length} stops for segment: ${startStop.name} → ${endStop.name}`);
    return segmentStops;
  }
}
