
import { SimpleRoute66Validator } from './SimpleRoute66Validator';
import type { DestinationCity } from '../hooks/useDestinationCities';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class SequenceOrderService {
  /**
   * SIMPLE: Get properly ordered destination cities
   */
  static getOrderedDestinationCities(cities: DestinationCity[]): DestinationCity[] {
    console.log('🔄 SequenceOrderService: Getting ordered destination cities (SIMPLE)');
    
    if (cities.length === 0) {
      console.warn('⚠️ No destination cities provided to order');
      return [];
    }

    // Use simple validator
    const validation = SimpleRoute66Validator.validateDestinationCitySequence(cities);
    const orderedCities = validation.correctedSequence as DestinationCity[] || cities;
    
    console.log('🎯 SIMPLE ORDERED SEQUENCE:');
    SimpleRoute66Validator.logSequenceAnalysis(orderedCities, 'cities');
    
    return orderedCities;
  }

  /**
   * Get properly ordered waypoints
   */
  static getOrderedWaypoints(waypoints: Route66Waypoint[]): Route66Waypoint[] {
    console.log('🔄 SequenceOrderService: Getting ordered waypoints (SIMPLE)');
    
    if (waypoints.length === 0) {
      console.warn('⚠️ No waypoints provided to order');
      return [];
    }

    // Simple sort by sequence_order
    const orderedWaypoints = [...waypoints].sort((a, b) => a.sequence_order - b.sequence_order);
    
    console.log('🎯 Waypoints ordered by sequence_order:', 
      orderedWaypoints.slice(0, 5).map(w => `${w.name} (${w.sequence_order})`));
    
    return orderedWaypoints;
  }

  /**
   * Create simple sequence metadata
   */
  static createSequenceMetadata(cities: DestinationCity[]): {
    totalCities: number;
    hasChicago: boolean;
    hasSantaMonica: boolean;
    longitudeProgression: 'correct' | 'incorrect' | 'mixed';
  } {
    const chicago = cities.find(city => city.name.toLowerCase().includes('chicago'));
    const santaMonica = cities.find(city => city.name.toLowerCase().includes('santa monica'));

    // Simple longitude progression check
    let correctProgression = 0;
    for (let i = 0; i < cities.length - 1; i++) {
      if (cities[i].longitude >= cities[i + 1].longitude) {
        correctProgression++;
      }
    }

    const totalTransitions = cities.length - 1;
    const progressionPercentage = totalTransitions > 0 ? (correctProgression / totalTransitions) : 0;
    
    const longitudeProgression = progressionPercentage > 0.7 ? 'correct' : 
                                progressionPercentage < 0.3 ? 'incorrect' : 'mixed';

    return {
      totalCities: cities.length,
      hasChicago: !!chicago,
      hasSantaMonica: !!santaMonica,
      longitudeProgression
    };
  }
}
