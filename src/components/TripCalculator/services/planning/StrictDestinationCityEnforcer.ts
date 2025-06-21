

import { TripStop } from '../../types/TripStop';
import { DailySegment } from './TripPlanBuilder';

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
   * Validate that all stops in a trip plan (daily segments) are destination cities
   */
  static validateTripPlan(segments: DailySegment[]): { isValid: boolean; violations: string[] } {
    if (!segments || !Array.isArray(segments)) {
      return { isValid: false, violations: ['Invalid segments array'] };
    }

    console.log(`🛡️ STRICT ENFORCER: Validating trip plan with ${segments.length} segments for destination city compliance`);

    const violations: string[] = [];

    segments.forEach((segment, segmentIndex) => {
      if (segment.recommendedStops && Array.isArray(segment.recommendedStops)) {
        segment.recommendedStops.forEach((stop, stopIndex) => {
          // Convert stop to TripStop format for validation
          const tripStop: TripStop = {
            id: stop.id || `segment-${segmentIndex}-stop-${stopIndex}`,
            name: stop.name || 'Unknown',
            category: stop.category || 'unknown',
            latitude: stop.latitude || 0,
            longitude: stop.longitude || 0,
            state: stop.state || 'Unknown',
            city: stop.city || stop.city_name || 'Unknown',
            city_name: stop.city_name || stop.city || 'Unknown',
            description: stop.description || ''
          };

          if (!this.isDestinationCity(tripStop)) {
            violations.push(`Day ${segment.day}, Stop ${stopIndex + 1}: ${stop.name || 'Unknown'} is not a destination city (category: ${stop.category})`);
          }
        });
      }
    });

    const isValid = violations.length === 0;
    
    if (isValid) {
      console.log(`✅ TRIP PLAN VALIDATION PASSED: All stops are destination cities`);
    } else {
      console.log(`❌ TRIP PLAN VALIDATION FAILED: ${violations.length} violations found`);
      violations.forEach(violation => console.log(`   - ${violation}`));
    }

    return { isValid, violations };
  }

  /**
   * Sanitize trip plan to remove non-destination cities
   */
  static sanitizeTripPlan(segments: DailySegment[]): DailySegment[] {
    if (!segments || !Array.isArray(segments)) {
      console.log(`🚫 STRICT ENFORCER: Invalid segments array for sanitization`);
      return [];
    }

    console.log(`🧹 STRICT ENFORCER: Sanitizing trip plan to only include destination cities`);

    const sanitizedSegments = segments.map(segment => {
      if (!segment.recommendedStops || !Array.isArray(segment.recommendedStops)) {
        return segment;
      }

      const sanitizedStops = segment.recommendedStops.filter(stop => {
        // Convert stop to TripStop format for validation
        const tripStop: TripStop = {
          id: stop.id || `sanitize-${Date.now()}`,
          name: stop.name || 'Unknown',
          category: stop.category || 'unknown',
          latitude: stop.latitude || 0,
          longitude: stop.longitude || 0,
          state: stop.state || 'Unknown',
          city: stop.city || stop.city_name || 'Unknown',
          city_name: stop.city_name || stop.city || 'Unknown',
          description: stop.description || ''
        };

        const isDestinationCity = this.isDestinationCity(tripStop);
        if (!isDestinationCity) {
          console.log(`🗑️ STRICT ENFORCER: Removing non-destination city: ${stop.name} (${stop.category})`);
        }
        return isDestinationCity;
      });

      return {
        ...segment,
        recommendedStops: sanitizedStops
      };
    });

    console.log(`✅ STRICT ENFORCER: Trip plan sanitization complete`);
    return sanitizedSegments;
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

