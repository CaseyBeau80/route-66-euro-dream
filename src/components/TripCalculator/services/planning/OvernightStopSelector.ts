
import { TripStop } from '../../types/TripStop';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class OvernightStopSelector {
  /**
   * Select destination city overnight stops based on ideal spacing
   */
  static selectDestinationCityOvernightStops(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    totalDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🎯 STRICT: Selecting overnight stops from ${destinationCities.length} destination cities`);
    
    // Filter out start and end stops with proper null checking
    const availableStops: TripStop[] = destinationCities.filter((stop: TripStop) => {
      return this.isValidTripStop(stop) && 
             stop.id !== startStop.id && 
             stop.id !== endStop.id &&
             StrictDestinationCityEnforcer.isDestinationCity(stop);
    });
    
    console.log(`🏛️ STRICT: ${availableStops.length} available destination cities for overnight stops`);
    
    // Sort by distance from start to ensure geographic progression
    const sortedStops: TripStop[] = availableStops.sort((a: TripStop, b: TripStop) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, b.latitude, b.longitude
      );
      return distA - distB;
    });
    
    const overnightStops: TripStop[] = [];
    const neededStops = totalDays - 1; // Don't count the final day
    
    console.log(`🏛️ STRICT: Need ${neededStops} overnight destination cities from ${sortedStops.length} available`);
    
    // Select stops based on ideal spacing
    for (let i = 1; i <= neededStops; i++) {
      const idealDistance = (totalDistance * i) / totalDays;
      
      // Find the destination city closest to the ideal distance
      let bestStop: TripStop | null = null;
      let bestStopDiff = Number.MAX_VALUE;
      
      for (const stop of sortedStops) {
        // Skip already selected stops
        if (overnightStops.some((s: TripStop) => s.id === stop.id)) continue;
        
        const stopDistance = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude, stop.latitude, stop.longitude
        );
        
        const diff = Math.abs(stopDistance - idealDistance);
        
        if (diff < bestStopDiff) {
          bestStop = stop;
          bestStopDiff = diff;
        }
      }
      
      if (bestStop && StrictDestinationCityEnforcer.isDestinationCity(bestStop)) {
        console.log(`🏛️ STRICT: Selected overnight destination: ${bestStop.name} (${bestStop.category})`);
        overnightStops.push(bestStop);
      } else if (bestStop) {
        console.warn(`⚠️ STRICT: Rejected non-destination city: ${bestStop.name} (${bestStop.category})`);
      } else {
        console.warn(`⚠️ STRICT: Could not find suitable destination city for day ${i + 1}`);
      }
    }
    
    // Sort overnight stops by distance from start for proper sequence
    const finalStops: TripStop[] = overnightStops.sort((a: TripStop, b: TripStop) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude, b.latitude, b.longitude
      );
      return distA - distB;
    });
    
    console.log(`🏛️ STRICT: Final overnight destinations: ${finalStops.map(stop => stop.name).join(' → ')}`);
    return finalStops;
  }

  private static isValidTripStop(stop: any): stop is TripStop {
    return stop && 
           typeof stop === 'object' && 
           typeof stop.name === 'string' &&
           typeof stop.id === 'string';
  }
}
