
import { route66Towns } from '@/types/route66';
import { DistanceCalculationService } from './DistanceCalculationService';

export class DistanceEstimationService {
  // FIXED: More conservative daily driving distance for Route 66 trips (was 300)
  private static readonly AVERAGE_DAILY_DISTANCE = 250;

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
   * Estimate distance between two cities in miles
   */
  static estimateDistance(startCityName: string, endCityName: string): number | null {
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

    console.log('📏 Distance estimation (FIXED with realistic Route 66 assumptions):', {
      startCity: startTown.name,
      endCity: endTown.name,
      distance: Math.round(distance),
      conservativeApproach: 'Using 45mph avg speed and 15% safety buffer'
    });

    return distance;
  }

  /**
   * Calculate estimated number of days needed for a trip between two cities
   */
  static estimateTripDays(startCityName: string, endCityName: string): number | null {
    const distance = this.estimateDistance(startCityName, endCityName);
    
    if (!distance) return null;

    // FIXED: More conservative estimate based on Route 66 conditions
    const estimatedDays = Math.ceil(distance / this.AVERAGE_DAILY_DISTANCE);

    console.log('📏 Trip days estimation (FIXED):', {
      distance: Math.round(distance),
      estimatedDays,
      avgDailyDistance: this.AVERAGE_DAILY_DISTANCE,
      note: 'Conservative estimate for Route 66 conditions'
    });

    return estimatedDays;
  }
}
