
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { GeographicProgression } from './GeographicProgression';

export class IntermediateDestinationFinder {
  /**
   * Find intermediate destinations to balance drive times
   */
  static findIntermediateDestinations(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    console.log(`🎯 Finding intermediate destinations for ${totalDays} days`);
    
    const destinations: TripStop[] = [];
    
    // Calculate target distance per day
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const targetDistancePerDay = totalDistance / totalDays;
    
    for (let day = 1; day < totalDays; day++) {
      const targetDistance = targetDistancePerDay * day;
      
      // Find destination cities closest to target distance
      const destinationCities = availableStops.filter(stop => 
        stop.category === 'destination_city' && 
        !destinations.some(dest => dest.id === stop.id)
      );
      
      let bestDest: TripStop | null = null;
      let bestScore = Number.MAX_VALUE;
      
      for (const city of destinationCities) {
        const distanceFromStart = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          city.latitude, city.longitude
        );
        
        // Check geographic progression
        if (!GeographicProgression.validateGeographicProgression(startStop, city, endStop)) {
          continue;
        }
        
        const score = Math.abs(distanceFromStart - targetDistance);
        
        if (score < bestScore) {
          bestScore = score;
          bestDest = city;
        }
      }
      
      if (bestDest) {
        destinations.push(bestDest);
        console.log(`📍 Day ${day + 1} destination: ${bestDest.name}`);
      }
    }
    
    return destinations;
  }
}
