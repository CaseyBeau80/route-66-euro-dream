
import { TripStop } from '../../types/TripStop';

export class StrictDestinationCityEnforcer {
  /**
   * STRICT: Only allow destination cities - no exceptions
   */
  static isDestinationCity(stop: TripStop): boolean {
    if (!stop || typeof stop !== 'object') {
      return false;
    }

    // ABSOLUTE REQUIREMENT: Must be categorized as destination_city
    if (stop.category !== 'destination_city') {
      console.log(`🚫 STRICT ENFORCER: ${stop.name} rejected - category is ${stop.category}, not destination_city`);
      return false;
    }

    // Must have valid coordinates
    if (!stop.latitude || !stop.longitude) {
      console.log(`🚫 STRICT ENFORCER: ${stop.name} rejected - missing coordinates`);
      return false;
    }

    // Must have a name
    if (!stop.name || stop.name.trim() === '') {
      console.log(`🚫 STRICT ENFORCER: Stop rejected - missing or empty name`);
      return false;
    }

    console.log(`✅ STRICT ENFORCER: ${stop.name} approved as destination city`);
    return true;
  }

  /**
   * Filter array to only include destination cities
   */
  static filterToDestinationCitiesOnly(stops: TripStop[]): TripStop[] {
    if (!stops || !Array.isArray(stops)) {
      console.log(`🚫 STRICT ENFORCER: Invalid stops array provided`);
      return [];
    }

    console.log(`🔒 STRICT ENFORCER: Filtering ${stops.length} stops to destination cities only`);
    
    const destinationCities = stops.filter(stop => this.isDestinationCity(stop));
    
    console.log(`🔒 STRICT ENFORCER: Result: ${destinationCities.length} destination cities from ${stops.length} total stops`);
    console.log(`✅ APPROVED CITIES:`, destinationCities.map(city => `${city.name}, ${city.state}`));
    
    return destinationCities;
  }

  /**
   * Validate that all stops in an array are destination cities
   */
  static validateAllAreDestinationCities(stops: TripStop[]): { isValid: boolean; violations: string[] } {
    if (!stops || !Array.isArray(stops)) {
      return { isValid: false, violations: ['Invalid stops array'] };
    }

    const violations: string[] = [];

    stops.forEach((stop, index) => {
      if (!this.isDestinationCity(stop)) {
        violations.push(`Stop ${index + 1}: ${stop?.name || 'Unknown'} is not a destination city (category: ${stop?.category})`);
      }
    });

    const isValid = violations.length === 0;
    
    if (isValid) {
      console.log(`✅ VALIDATION PASSED: All ${stops.length} stops are destination cities`);
    } else {
      console.log(`❌ VALIDATION FAILED: ${violations.length} violations found`);
      violations.forEach(violation => console.log(`   - ${violation}`));
    }

    return { isValid, violations };
  }

  /**
   * Get list of major Route 66 destination cities for reference
   */
  static getMajorDestinationCities(): string[] {
    return [
      'Chicago, IL',
      'St. Louis, MO', 
      'Springfield, MO',
      'Joplin, MO',
      'Oklahoma City, OK',
      'Amarillo, TX',
      'Santa Fe, NM',
      'Albuquerque, NM',
      'Gallup, NM',
      'Flagstaff, AZ',
      'Needles, CA',
      'Barstow, CA',
      'Los Angeles, CA',
      'Santa Monica, CA'
    ];
  }
}
