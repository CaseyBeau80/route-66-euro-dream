
import { route66Towns } from '@/types/route66';
import { DistanceCalculationService } from './DistanceCalculationService';

export class DistanceEstimationService {
  // Average daily driving distance for Route 66 trips (in miles)
  private static readonly AVERAGE_DAILY_DISTANCE = 300;

  /**
   * Find a Route 66 town by name (fuzzy matching)
   */
  private static findTownByName(cityName: string) {
    const normalizedName = cityName.toLowerCase().trim();
    
    return route66Towns.find(town => {
      const townName = town.name.toLowerCase();
      
      // Exact match
      if (townName === normalizedName) return true;
      
      // Match city part (e.g., "Chicago" matches "Chicago, IL")
      const cityPart = townName.split(',')[0].trim();
      if (cityPart === normalizedName) return true;
      
      // Partial match
      return townName.includes(normalizedName) || normalizedName.includes(cityPart);
    });
  }

  /**
   * Calculate estimated number of days needed for a trip between two cities
   */
  static estimateTripDays(startCityName: string, endCityName: string): number | null {
    const startTown = this.findTownByName(startCityName);
    const endTown = this.findTownByName(endCityName);

    if (!startTown || !endTown) {
      console.log('🔍 Could not find towns for distance estimation:', { startCityName, endCityName });
      return null;
    }

    // Calculate distance using the existing service
    const distance = DistanceCalculationService.calculateDistance(
      startTown.latLng[0], // latitude
      startTown.latLng[1], // longitude
      endTown.latLng[0],
      endTown.latLng[1]
    );

    // Estimate days based on average daily driving distance
    const estimatedDays = Math.ceil(distance / this.AVERAGE_DAILY_DISTANCE);

    console.log('📏 Distance estimation:', {
      startCity: startTown.name,
      endCity: endTown.name,
      distance: Math.round(distance),
      estimatedDays
    });

    return estimatedDays;
  }
}
