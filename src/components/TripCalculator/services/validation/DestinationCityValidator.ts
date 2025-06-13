
import { TripStop } from '../../types/TripStop';

export class DestinationCityValidator {
  /**
   * Validate that a stop is a destination city
   */
  static validateDestinationCity(stop: TripStop, context: string = 'unknown'): boolean {
    console.log(`🛡️ DestinationCityValidator: Validating ${stop.name} for ${context}`);
    
    // Check if it's marked as a destination city
    const isDestinationCity = stop.category === 'destination_city';
    
    // Additional check for major stops that should be treated as destination cities
    const isMajorDestination = stop.is_major_stop && (
      stop.is_official_destination || 
      stop.name.toLowerCase().includes('chicago') ||
      stop.name.toLowerCase().includes('santa monica') ||
      stop.name.toLowerCase().includes('los angeles')
    );
    
    const isValid = isDestinationCity || isMajorDestination;
    
    if (!isValid) {
      console.warn(`⚠️ DestinationCityValidator: REJECTED ${stop.name} for ${context}`, {
        category: stop.category,
        isMajorStop: stop.is_major_stop,
        isOfficialDestination: stop.is_official_destination,
        reason: 'Not a destination city'
      });
    } else {
      console.log(`✅ DestinationCityValidator: APPROVED ${stop.name} for ${context}`, {
        category: stop.category,
        isMajorStop: stop.is_major_stop,
        isOfficialDestination: stop.is_official_destination
      });
    }
    
    return isValid;
  }
  
  /**
   * Filter stops to only include destination cities
   */
  static filterDestinationCities(stops: TripStop[], context: string = 'filtering'): TripStop[] {
    console.log(`🛡️ DestinationCityValidator: Filtering ${stops.length} stops for ${context}`);
    
    const destinationCities = stops.filter(stop => this.validateDestinationCity(stop, context));
    
    console.log(`🛡️ DestinationCityValidator: ${context} result: ${destinationCities.length}/${stops.length} stops approved`, {
      approved: destinationCities.map(s => s.name),
      rejected: stops.filter(s => !destinationCities.includes(s)).map(s => s.name)
    });
    
    return destinationCities;
  }
  
  /**
   * Warn about non-destination cities in overnight stop selection
   */
  static validateOvernightStops(selectedStops: TripStop[]): string[] {
    const warnings: string[] = [];
    
    selectedStops.forEach(stop => {
      if (!this.validateDestinationCity(stop, 'overnight_stop')) {
        warnings.push(`${stop.name} is not a destination city and may not have adequate lodging facilities`);
      }
    });
    
    return warnings;
  }
}
