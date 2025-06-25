
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class RouteValidationService {
  /**
   * SIMPLIFIED: Basic validation for route waypoints
   */
  static validateWaypoints(waypoints: Route66Waypoint[]): {
    isValid: boolean;
    errors: string[];
    majorStops: Route66Waypoint[];
  } {
    console.log('🔍 RouteValidationService: SIMPLIFIED validation');
    
    const errors: string[] = [];
    
    // Get major stops
    const majorStops = waypoints.filter(wp => wp.is_major_stop === true);
    
    // Basic validations
    if (waypoints.length === 0) {
      errors.push('No waypoints provided');
    }
    
    if (majorStops.length < 2) {
      errors.push('Need at least 2 major stops for route');
    }
    
    // Check for required endpoints
    const hasChicago = majorStops.some(wp => 
      wp.name.toLowerCase().includes('chicago') && wp.state === 'IL'
    );
    
    const hasSantaMonica = majorStops.some(wp => 
      wp.name.toLowerCase().includes('santa monica') && wp.state === 'CA'
    );
    
    if (!hasChicago) {
      console.warn('⚠️ No Chicago start point found');
    }
    
    if (!hasSantaMonica) {
      console.warn('⚠️ No Santa Monica end point found');
    }
    
    const isValid = errors.length === 0;
    
    console.log('🔍 Validation result:', {
      isValid,
      errors,
      majorStopsCount: majorStops.length,
      hasChicago,
      hasSantaMonica
    });
    
    return {
      isValid,
      errors,
      majorStops: majorStops.sort((a, b) => a.sequence_order - b.sequence_order)
    };
  }
}
