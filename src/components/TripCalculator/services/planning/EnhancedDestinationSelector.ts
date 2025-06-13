
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';

export class EnhancedDestinationSelector {
  /**
   * Select destination cities only for trip segments
   */
  static selectDestinationCitiesForTrip(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    console.log(`🎯 ENHANCED DESTINATION SELECTION: ${totalDays} days from ${startStop.name} to ${endStop.name}`);
    
    // STEP 1: Filter to only destination cities
    const destinationCities = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    
    // STEP 2: Remove start and end cities
    const availableCities = destinationCities.filter(city => 
      city.id !== startStop.id && city.id !== endStop.id
    );
    
    console.log(`🏛️ Available destination cities: ${availableCities.length}`);
    
    // STEP 3: Filter geographically relevant cities
    const routeCities = this.filterCitiesAlongRoute(startStop, endStop, availableCities);
    
    console.log(`🛤️ Cities along route: ${routeCities.length}`);
    
    // STEP 4: Select optimal cities for the number of days
    const selectedCities = this.selectOptimalCities(startStop, endStop, routeCities, totalDays);
    
    console.log(`✅ Selected ${selectedCities.length} destination cities:`, selectedCities.map(c => c.name));
    
    return selectedCities;
  }

  private static filterCitiesAlongRoute(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[]
  ): TripStop[] {
    const routeDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    return destinationCities.filter(city => {
      const startToCity = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        city.latitude, city.longitude
      );
      
      const cityToEnd = DistanceCalculationService.calculateDistance(
        city.latitude, city.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // City is roughly along the route if total distance via city isn't much longer
      const detourFactor = (startToCity + cityToEnd) / routeDistance;
      
      // Allow generous detour for destination cities (up to 50% longer route)
      return detourFactor <= 1.5;
    });
  }

  private static selectOptimalCities(
    startStop: TripStop,
    endStop: TripStop,
    routeCities: TripStop[],
    totalDays: number
  ): TripStop[] {
    if (totalDays <= 1 || routeCities.length === 0) {
      return [];
    }

    const neededCities = totalDays - 1; // One less than total days
    
    if (routeCities.length <= neededCities) {
      return routeCities; // Use all available cities
    }

    // Sort cities by distance from start to ensure geographic progression
    const sortedCities = routeCities.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        b.latitude, b.longitude
      );
      return distA - distB;
    });

    // Select evenly spaced cities
    const selectedCities: TripStop[] = [];
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    for (let day = 1; day < totalDays; day++) {
      const targetDistance = (totalDistance * day) / totalDays;
      
      // Find the city closest to the target distance
      let bestCity = sortedCities[0];
      let bestDiff = Number.MAX_VALUE;
      
      for (const city of sortedCities) {
        if (selectedCities.includes(city)) continue;
        
        const cityDistance = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          city.latitude, city.longitude
        );
        
        const diff = Math.abs(cityDistance - targetDistance);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestCity = city;
        }
      }
      
      if (bestCity && !selectedCities.includes(bestCity)) {
        selectedCities.push(bestCity);
      }
    }

    return selectedCities;
  }
}
