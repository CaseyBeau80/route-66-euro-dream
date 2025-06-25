
import type { DestinationCity } from '../hooks/useDestinationCities';
import type { Route66Waypoint } from '../types/supabaseTypes';

export interface SequenceValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedSequence?: DestinationCity[] | Route66Waypoint[];
}

export class Route66SequenceValidator {
  /**
   * CRITICAL: Validates and corrects Route 66 destination city sequence
   * Ensures proper east-to-west ordering with Springfield, IL before St. Louis, MO
   */
  static validateDestinationCitySequence(cities: DestinationCity[]): SequenceValidationResult {
    console.log('🔍 VALIDATOR: Validating destination city sequence for ping-pong prevention');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (cities.length === 0) {
      errors.push('No destination cities provided');
      return { isValid: false, errors, warnings };
    }

    // Find critical cities
    const chicago = cities.find(city => city.name.toLowerCase().includes('chicago'));
    const springfieldIL = cities.find(city => 
      city.name.toLowerCase().includes('springfield') && city.state === 'IL'
    );
    const stLouis = cities.find(city => 
      city.name.toLowerCase().includes('st. louis') || city.name.toLowerCase().includes('saint louis')
    );
    const springfieldMO = cities.find(city => 
      city.name.toLowerCase().includes('springfield') && city.state === 'MO'
    );
    const santaMonica = cities.find(city => city.name.toLowerCase().includes('santa monica'));

    // Validate critical endpoints
    if (!chicago) {
      errors.push('Chicago (start point) not found in destination cities');
    }
    if (!santaMonica) {
      errors.push('Santa Monica (end point) not found in destination cities');
    }

    // Validate Springfield sequence - CRITICAL for preventing ping-pong
    if (springfieldIL && stLouis) {
      if (springfieldIL.longitude <= stLouis.longitude) {
        errors.push('CRITICAL: Springfield, IL must come BEFORE St. Louis, MO (higher longitude)');
      }
    }

    if (stLouis && springfieldMO) {
      if (stLouis.longitude <= springfieldMO.longitude) {
        errors.push('CRITICAL: St. Louis, MO must come BEFORE Springfield, MO (higher longitude)');
      }
    }

    // Create corrected sequence using longitude ordering
    const correctedSequence = this.createCorrectedSequence(cities);
    
    // Log validation results
    console.log('🔍 VALIDATOR: Sequence validation results:', {
      originalCount: cities.length,
      correctedCount: correctedSequence.length,
      hasChicago: !!chicago,
      hasSantaMonica: !!santaMonica,
      hasSpringfieldIL: !!springfieldIL,
      hasStLouis: !!stLouis,
      hasSpringfieldMO: !!springfieldMO,
      errorsCount: errors.length,
      warningsCount: warnings.length
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      correctedSequence
    };
  }

  /**
   * Creates corrected sequence with proper east-to-west ordering
   */
  private static createCorrectedSequence(cities: DestinationCity[]): DestinationCity[] {
    console.log('🔄 VALIDATOR: Creating corrected sequence with longitude ordering');
    
    // Sort by longitude descending (east to west: Chicago → Santa Monica)
    const sorted = [...cities].sort((a, b) => {
      // Manual override for critical Route 66 sequence points
      const cityOrder = this.getCitySequenceOrder();
      
      const aOrder = cityOrder[this.getCityKey(a.name, a.state)] || 999;
      const bOrder = cityOrder[this.getCityKey(b.name, b.state)] || 999;
      
      // Use manual order if both cities are in the override list
      if (aOrder !== 999 || bOrder !== 999) {
        return aOrder - bOrder;
      }
      
      // Fall back to longitude ordering (east to west)
      return b.longitude - a.longitude;
    });

    console.log('🔄 VALIDATOR: Corrected sequence created:', 
      sorted.map(city => `${city.name}, ${city.state} (${city.longitude.toFixed(2)})`));

    return sorted;
  }

  /**
   * Get manual sequence ordering for critical Route 66 cities
   */
  private static getCitySequenceOrder(): Record<string, number> {
    return {
      'chicago_il': 1,
      'springfield_il': 2,      // FIRST Springfield - BEFORE St. Louis
      'st. louis_mo': 3,        // AFTER Springfield, IL
      'saint louis_mo': 3,      // Alternative spelling
      'springfield_mo': 4,      // SECOND Springfield - AFTER St. Louis
      'joplin_mo': 5,
      'tulsa_ok': 6,
      'oklahoma city_ok': 7,
      'amarillo_tx': 8,
      'albuquerque_nm': 9,
      'flagstaff_az': 10,
      'los angeles_ca': 11,
      'santa monica_ca': 12
    };
  }

  /**
   * Create standardized city key for lookup
   */
  private static getCityKey(name: string, state: string): string {
    return `${name.toLowerCase()}_${state.toLowerCase()}`;
  }

  /**
   * Validate waypoint sequence from database
   */
  static validateWaypointSequence(waypoints: Route66Waypoint[]): SequenceValidationResult {
    console.log('🔍 VALIDATOR: Validating waypoint sequence from database');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (waypoints.length === 0) {
      errors.push('No waypoints provided');
      return { isValid: false, errors, warnings };
    }

    // Check for sequence gaps
    const sequences = waypoints.map(w => w.sequence_order).sort((a, b) => a - b);
    for (let i = 1; i < sequences.length; i++) {
      if (sequences[i] - sequences[i-1] > 1) {
        warnings.push(`Sequence gap detected between ${sequences[i-1]} and ${sequences[i]}`);
      }
    }

    // Check for duplicate sequences
    const duplicates = sequences.filter((seq, index) => sequences.indexOf(seq) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate sequence orders found: ${duplicates.join(', ')}`);
    }

    // Validate geographical progression (longitude should generally decrease)
    const sortedBySequence = [...waypoints].sort((a, b) => a.sequence_order - b.sequence_order);
    for (let i = 0; i < sortedBySequence.length - 1; i++) {
      const current = sortedBySequence[i];
      const next = sortedBySequence[i + 1];
      
      if (next.longitude > current.longitude + 3) { // Allow some tolerance
        warnings.push(`Potential eastward jump from ${current.name} to ${next.name}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      correctedSequence: sortedBySequence
    };
  }

  /**
   * Log comprehensive sequence analysis
   */
  static logSequenceAnalysis(
    cities: DestinationCity[] | Route66Waypoint[], 
    type: 'cities' | 'waypoints' = 'cities'
  ): void {
    console.log(`📊 VALIDATOR: ${type.toUpperCase()} Sequence Analysis`);
    console.log('=' .repeat(50));
    
    cities.forEach((item, index) => {
      const name = 'name' in item ? item.name : item.name;
      const state = 'state' in item ? item.state : item.state;
      const lng = 'longitude' in item ? item.longitude : item.longitude;
      const seq = 'sequence_order' in item ? item.sequence_order : index + 1;
      
      console.log(`${index + 1}. ${name}, ${state} - Lng: ${lng.toFixed(2)}, Seq: ${seq}`);
    });
    
    console.log('=' .repeat(50));
  }
}
