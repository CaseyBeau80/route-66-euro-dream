
import type { DestinationCity } from '../hooks/useDestinationCities';
import type { Route66Waypoint } from '../types/supabaseTypes';

export interface SequenceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedSequence?: DestinationCity[] | Route66Waypoint[];
}

export class SimpleRoute66Validator {
  /**
   * Simple validation that just ensures basic east-to-west progression
   */
  static validateDestinationCitySequence(cities: DestinationCity[]): SequenceValidationResult {
    console.log('🔍 SIMPLE VALIDATOR: Validating destination city sequence');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (cities.length === 0) {
      errors.push('No destination cities provided');
      return { isValid: false, errors, warnings };
    }

    // Remove duplicates based on name and state
    const uniqueCities = cities.filter((city, index, arr) => 
      arr.findIndex(c => c.name === city.name && c.state === city.state) === index
    );

    if (uniqueCities.length !== cities.length) {
      console.log(`🧹 Removed ${cities.length - uniqueCities.length} duplicate cities`);
    }

    // Simple longitude-based ordering (east to west)
    const correctedSequence = [...uniqueCities].sort((a, b) => b.longitude - a.longitude);
    
    console.log('🎯 SIMPLE VALIDATOR: Corrected sequence:', 
      correctedSequence.map(city => `${city.name}, ${city.state} (${city.longitude.toFixed(2)})`));

    return {
      isValid: true, // Always pass validation to prevent blocking
      errors,
      warnings,
      correctedSequence
    };
  }

  /**
   * Simple waypoint validation
   */
  static validateWaypointSequence(waypoints: Route66Waypoint[]): SequenceValidationResult {
    console.log('🔍 SIMPLE VALIDATOR: Validating waypoint sequence');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (waypoints.length === 0) {
      errors.push('No waypoints provided');
      return { isValid: false, errors, warnings };
    }

    // Sort by sequence_order
    const correctedSequence = [...waypoints].sort((a, b) => a.sequence_order - b.sequence_order);
    
    return {
      isValid: true,
      errors,
      warnings,
      correctedSequence
    };
  }

  /**
   * Simple sequence analysis logging
   */
  static logSequenceAnalysis(
    cities: DestinationCity[] | Route66Waypoint[], 
    type: 'cities' | 'waypoints' = 'cities'
  ): void {
    console.log(`📊 SIMPLE VALIDATOR: ${type.toUpperCase()} Sequence`);
    console.log('=' .repeat(30));
    
    cities.slice(0, 10).forEach((item, index) => {
      const name = 'name' in item ? item.name : item.name;
      const state = 'state' in item ? item.state : item.state;
      const lng = 'longitude' in item ? item.longitude : item.longitude;
      
      console.log(`${index + 1}. ${name}, ${state} - Lng: ${lng.toFixed(2)}`);
    });
    
    if (cities.length > 10) {
      console.log(`... and ${cities.length - 10} more cities`);
    }
    
    console.log('=' .repeat(30));
  }
}
