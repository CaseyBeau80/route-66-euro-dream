
import { TripStop } from '../../types/TripStop';

export class StrictDestinationCityEnforcer {
  /**
   * Filter stops to only include destination cities with null safety
   */
  static filterToDestinationCitiesOnly(allStops: TripStop[]): TripStop[] {
    if (!allStops || !Array.isArray(allStops)) {
      console.error('❌ StrictDestinationCityEnforcer: Invalid allStops parameter');
      return [];
    }

    const destinationCities = allStops.filter(stop => {
      // Comprehensive null safety check
      if (!stop || typeof stop !== 'object') {
        console.warn('⚠️ Filtering out null/undefined stop');
        return false;
      }

      if (!stop.category) {
        console.warn('⚠️ Filtering out stop without category:', stop.name || 'unnamed');
        return false;
      }

      if (typeof stop.latitude !== 'number' || typeof stop.longitude !== 'number') {
        console.warn('⚠️ Filtering out stop with invalid coordinates:', stop.name || 'unnamed');
        return false;
      }

      if (isNaN(stop.latitude) || isNaN(stop.longitude)) {
        console.warn('⚠️ Filtering out stop with NaN coordinates:', stop.name || 'unnamed');
        return false;
      }

      return stop.category === 'destination_city';
    });

    console.log(`🏛️ StrictDestinationCityEnforcer: Filtered ${allStops.length} stops to ${destinationCities.length} destination cities`);
    
    return destinationCities;
  }

  /**
   * Validate that a stop is a proper destination city
   */
  static isValidDestinationCity(stop: any): stop is TripStop {
    return stop && 
           typeof stop === 'object' &&
           typeof stop.id === 'string' &&
           typeof stop.name === 'string' &&
           typeof stop.latitude === 'number' &&
           typeof stop.longitude === 'number' &&
           !isNaN(stop.latitude) &&
           !isNaN(stop.longitude) &&
           stop.category === 'destination_city';
  }
}
