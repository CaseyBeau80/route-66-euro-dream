import { TripStop } from '../../types/TripStop';

export class StrictDestinationCityEnforcer {
  /**
   * Strictly validate that a stop is a destination city
   */
  static isDestinationCity(stop: TripStop): boolean {
    if (!stop || !stop.category) {
      console.log(`🚫 STRICT: Rejecting stop without category: ${stop?.name || 'unknown'}`);
      return false;
    }

    const isDestCity = stop.category === 'destination_city';
    
    if (!isDestCity) {
      console.log(`🚫 STRICT: Rejecting non-destination city: ${stop.name} (category: ${stop.category})`);
    } else {
      console.log(`✅ STRICT: Approved destination city: ${stop.name} (${stop.category})`);
    }
    
    return isDestCity;
  }

  /**
   * Filter array to only include destination cities
   */
  static filterToDestinationCitiesOnly(stops: TripStop[]): TripStop[] {
    console.log(`🔒 STRICT FILTERING: Input ${stops.length} stops`);
    
    const destinationCities = stops.filter(stop => this.isDestinationCity(stop));
    
    console.log(`🔒 STRICT FILTERING: Output ${destinationCities.length} destination cities`);
    console.log(`🏛️ Approved cities: ${destinationCities.map(s => s.name).join(', ')}`);
    
    const rejected = stops.filter(s => !destinationCities.includes(s));
    if (rejected.length > 0) {
      console.log(`🚫 Rejected non-destination cities: ${rejected.map(s => `${s.name} (${s.category})`).join(', ')}`);
    }
    
    return destinationCities;
  }

  /**
   * Validate that all stops in a trip plan are destination cities
   */
  static validateTripPlan(segments: any[]): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];
    
    segments.forEach((segment, index) => {
      if (segment.recommendedStops) {
        segment.recommendedStops.forEach((stop: TripStop) => {
          if (!this.isDestinationCity(stop)) {
            violations.push(`Day ${index + 1}: ${stop.name} is not a destination city (${stop.category})`);
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
  static sanitizeTripPlan(segments: any[]): any[] {
    console.log(`🧹 SANITIZING: Processing ${segments.length} segments`);
    
    return segments.map((segment, index) => {
      const sanitizedSegment = { ...segment };
      
      if (segment.recommendedStops) {
        const originalCount = segment.recommendedStops.length;
        sanitizedSegment.recommendedStops = this.filterToDestinationCitiesOnly(segment.recommendedStops);
        
        if (sanitizedSegment.recommendedStops.length !== originalCount) {
          console.log(`🧹 Day ${index + 1}: Filtered ${originalCount} → ${sanitizedSegment.recommendedStops.length} stops`);
        }
      }
      
      return sanitizedSegment;
    });
  }
}
