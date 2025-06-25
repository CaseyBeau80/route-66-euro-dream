
import { Route66SequenceValidator } from './Route66SequenceValidator';
import type { DestinationCity } from '../hooks/useDestinationCities';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class SequenceOrderService {
  /**
   * ENHANCED: Get properly ordered destination cities with validation
   * Fixes ping-ponging by ensuring correct Springfield sequence
   */
  static getOrderedDestinationCities(cities: DestinationCity[]): DestinationCity[] {
    console.log('🔄 SequenceOrderService: Getting ordered destination cities with VALIDATION');
    
    if (cities.length === 0) {
      console.warn('⚠️ No destination cities provided to order');
      return [];
    }

    // Validate and get corrected sequence
    const validation = Route66SequenceValidator.validateDestinationCitySequence(cities);
    
    if (!validation.isValid) {
      console.error('❌ CRITICAL: Destination city sequence validation failed:', validation.errors);
      validation.errors.forEach(error => console.error(`  • ${error}`));
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Sequence warnings:', validation.warnings);
      validation.warnings.forEach(warning => console.warn(`  • ${warning}`));
    }

    const orderedCities = validation.correctedSequence as DestinationCity[] || cities;
    
    // Log the final sequence for verification
    console.log('🎯 FINAL ORDERED SEQUENCE (No More Ping-Ponging):');
    Route66SequenceValidator.logSequenceAnalysis(orderedCities, 'cities');
    
    // Verify critical sequence points
    this.verifyCriticalSequence(orderedCities);
    
    return orderedCities;
  }

  /**
   * Get properly ordered waypoints with validation
   */
  static getOrderedWaypoints(waypoints: Route66Waypoint[]): Route66Waypoint[] {
    console.log('🔄 SequenceOrderService: Getting ordered waypoints with validation');
    
    if (waypoints.length === 0) {
      console.warn('⚠️ No waypoints provided to order');
      return [];
    }

    // Validate waypoint sequence
    const validation = Route66SequenceValidator.validateWaypointSequence(waypoints);
    
    if (!validation.isValid) {
      console.error('❌ Waypoint sequence validation failed:', validation.errors);
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Waypoint sequence warnings:', validation.warnings);
    }

    const orderedWaypoints = validation.correctedSequence as Route66Waypoint[] || 
      [...waypoints].sort((a, b) => a.sequence_order - b.sequence_order);
    
    console.log('🎯 Waypoints ordered by sequence_order:', 
      orderedWaypoints.map(w => `${w.name} (${w.sequence_order})`));
    
    return orderedWaypoints;
  }

  /**
   * Verify critical sequence points to prevent ping-ponging
   */
  private static verifyCriticalSequence(cities: DestinationCity[]): void {
    console.log('🔍 Verifying critical sequence points for ping-pong prevention...');
    
    const chicago = cities.findIndex(city => city.name.toLowerCase().includes('chicago'));
    const springfieldIL = cities.findIndex(city => 
      city.name.toLowerCase().includes('springfield') && city.state === 'IL'
    );
    const stLouis = cities.findIndex(city => 
      city.name.toLowerCase().includes('st. louis') || city.name.toLowerCase().includes('saint louis')
    );
    const springfieldMO = cities.findIndex(city => 
      city.name.toLowerCase().includes('springfield') && city.state === 'MO'
    );
    const santaMonica = cities.findIndex(city => city.name.toLowerCase().includes('santa monica'));

    console.log('🔍 Critical sequence positions:', {
      chicago: chicago !== -1 ? `Position ${chicago + 1}` : 'NOT FOUND',
      springfieldIL: springfieldIL !== -1 ? `Position ${springfieldIL + 1}` : 'NOT FOUND',
      stLouis: stLouis !== -1 ? `Position ${stLouis + 1}` : 'NOT FOUND',
      springfieldMO: springfieldMO !== -1 ? `Position ${springfieldMO + 1}` : 'NOT FOUND',
      santaMonica: santaMonica !== -1 ? `Position ${santaMonica + 1}` : 'NOT FOUND'
    });

    // CRITICAL: Verify Springfield sequence to prevent ping-ponging
    if (springfieldIL !== -1 && stLouis !== -1) {
      if (springfieldIL > stLouis) {
        console.error('🚨 PING-PONG ALERT: Springfield, IL comes AFTER St. Louis, MO - this will cause ping-ponging!');
      } else {
        console.log('✅ CORRECT: Springfield, IL comes BEFORE St. Louis, MO - no ping-ponging');
      }
    }

    if (stLouis !== -1 && springfieldMO !== -1) {
      if (stLouis > springfieldMO) {
        console.error('🚨 PING-PONG ALERT: St. Louis, MO comes AFTER Springfield, MO - this will cause ping-ponging!');
      } else {
        console.log('✅ CORRECT: St. Louis, MO comes BEFORE Springfield, MO - no ping-ponging');
      }
    }

    // Verify endpoints
    if (chicago === 0) {
      console.log('✅ CORRECT: Chicago is the first city (start point)');
    } else {
      console.warn('⚠️ WARNING: Chicago should be the first city');
    }

    if (santaMonica === cities.length - 1) {
      console.log('✅ CORRECT: Santa Monica is the last city (end point)');
    } else {
      console.warn('⚠️ WARNING: Santa Monica should be the last city');
    }
  }

  /**
   * Create sequence metadata for debugging
   */
  static createSequenceMetadata(cities: DestinationCity[]): {
    totalCities: number;
    hasChicago: boolean;
    hasSantaMonica: boolean;
    springfieldSequence: string;
    longitudeProgression: 'correct' | 'incorrect' | 'mixed';
  } {
    const chicago = cities.find(city => city.name.toLowerCase().includes('chicago'));
    const santaMonica = cities.find(city => city.name.toLowerCase().includes('santa monica'));
    
    const springfieldIL = cities.find(city => 
      city.name.toLowerCase().includes('springfield') && city.state === 'IL'
    );
    const stLouis = cities.find(city => 
      city.name.toLowerCase().includes('st. louis') || city.name.toLowerCase().includes('saint louis')
    );
    const springfieldMO = cities.find(city => 
      city.name.toLowerCase().includes('springfield') && city.state === 'MO'
    );

    let springfieldSequence = 'unknown';
    if (springfieldIL && stLouis && springfieldMO) {
      const ilIndex = cities.indexOf(springfieldIL);
      const stlIndex = cities.indexOf(stLouis);
      const moIndex = cities.indexOf(springfieldMO);
      
      if (ilIndex < stlIndex && stlIndex < moIndex) {
        springfieldSequence = 'correct (IL → STL → MO)';
      } else {
        springfieldSequence = 'incorrect (will cause ping-ponging)';
      }
    }

    // Check longitude progression
    let correctProgression = 0;
    let incorrectProgression = 0;
    
    for (let i = 0; i < cities.length - 1; i++) {
      if (cities[i].longitude >= cities[i + 1].longitude) {
        correctProgression++;
      } else {
        incorrectProgression++;
      }
    }

    const longitudeProgression = correctProgression > incorrectProgression ? 'correct' : 
                                incorrectProgression > correctProgression ? 'incorrect' : 'mixed';

    return {
      totalCities: cities.length,
      hasChicago: !!chicago,
      hasSantaMonica: !!santaMonica,
      springfieldSequence,
      longitudeProgression
    };
  }
}
