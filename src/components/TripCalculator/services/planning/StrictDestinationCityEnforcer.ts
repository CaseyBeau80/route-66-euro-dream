
import { TripStop } from '../../types/TripStop';
import { DailySegment } from './TripPlanBuilder';

export class StrictDestinationCityEnforcer {
  /**
   * Filter stops to only include destination cities with null safety
   */
  static filterToDestinationCitiesOnly(allStops: TripStop[]): TripStop[] {
    if (!allStops || !Array.isArray(allStops)) {
      console.error('❌ StrictDestinationCityEnforcer: Invalid allStops parameter');
      return [];
    }

    const destinationCities: TripStop[] = allStops.filter((stop: TripStop): stop is TripStop => {
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
   * Check if a stop is a destination city (alias for isValidDestinationCity for backward compatibility)
   */
  static isDestinationCity(stop: any): stop is TripStop {
    return this.isValidDestinationCity(stop);
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

  /**
   * Validate that all stops in a trip plan are destination cities
   */
  static validateTripPlan(segments: DailySegment[]): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!segments || !Array.isArray(segments)) {
      violations.push('Invalid segments parameter');
      return { isValid: false, violations };
    }

    segments.forEach((segment, index) => {
      if (!segment) {
        violations.push(`Segment ${index + 1} is null/undefined`);
        return;
      }

      if (segment.recommendedStops && Array.isArray(segment.recommendedStops)) {
        segment.recommendedStops.forEach((stop, stopIndex) => {
          if (!this.isDestinationCity(stop)) {
            const stopName = (stop as any)?.name || 'unnamed';
            violations.push(`Day ${segment.day}, Stop ${stopIndex + 1}: ${stopName} is not a destination city`);
          }
        });
      }
    });

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Sanitize trip plan to remove non-destination cities
   */
  static sanitizeTripPlan(segments: DailySegment[]): DailySegment[] {
    if (!segments || !Array.isArray(segments)) {
      console.error('❌ StrictDestinationCityEnforcer: Invalid segments parameter for sanitization');
      return [];
    }

    return segments.map(segment => {
      if (!segment) return segment;

      const sanitizedSegment = { ...segment };

      if (segment.recommendedStops && Array.isArray(segment.recommendedStops)) {
        sanitizedSegment.recommendedStops = segment.recommendedStops.filter((stop): stop is typeof stop => {
          const isDestCity = this.isDestinationCity(stop);
          if (!isDestCity) {
            const stopName = (stop as any)?.name || 'unnamed';
            const stopCategory = (stop as any)?.category || 'unknown';
            console.log(`🧹 Sanitized out non-destination city: ${stopName} (${stopCategory})`);
          }
          return isDestCity;
        });
      }

      return sanitizedSegment;
    });
  }
}
