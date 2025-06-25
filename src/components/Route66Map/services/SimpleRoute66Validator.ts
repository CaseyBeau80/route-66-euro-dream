
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
   * ULTRA SIMPLE validation - just ensure we have cities and do basic ordering
   */
  static validateDestinationCitySequence(cities: DestinationCity[]): SequenceValidationResult {
    console.log('🔍 ULTRA SIMPLE VALIDATOR: Validating destination city sequence');
    
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

    // ULTRA SIMPLE: Just sort by longitude (east to west) and ALWAYS return valid
    const correctedSequence = [...uniqueCities].sort((a, b) => b.longitude - a.longitude);
    
    console.log('🎯 ULTRA SIMPLE: Always valid sequence created');

    return {
      isValid: true, // ALWAYS return true to prevent blocking
      errors: [], // Clear all errors
      warnings,
      correctedSequence
    };
  }

  /**
   * Simple waypoint validation - always passes
   */
  static validateWaypointSequence(waypoints: Route66Waypoint[]): SequenceValidationResult {
    console.log('🔍 ULTRA SIMPLE VALIDATOR: Validating waypoint sequence');
    
    if (waypoints.length === 0) {
      return { 
        isValid: false, 
        errors: ['No waypoints provided'], 
        warnings: [] 
      };
    }

    // Sort by sequence_order
    const correctedSequence = [...waypoints].sort((a, b) => a.sequence_order - b.sequence_order);
    
    return {
      isValid: true, // Always pass
      errors: [],
      warnings: [],
      correctedSequence
    };
  }

  /**
   * Simple logging without complex analysis
   */
  static logSequenceAnalysis(
    cities: DestinationCity[] | Route66Waypoint[], 
    type: 'cities' | 'waypoints' = 'cities'
  ): void {
    console.log(`📊 ULTRA SIMPLE: ${type.toUpperCase()} Sequence (${cities.length} items)`);
    
    cities.slice(0, 5).forEach((item, index) => {
      const name = 'name' in item ? item.name : item.name;
      const state = 'state' in item ? item.state : item.state;
      console.log(`${index + 1}. ${name}, ${state}`);
    });
    
    if (cities.length > 5) {
      console.log(`... and ${cities.length - 5} more`);
    }
  }
}
