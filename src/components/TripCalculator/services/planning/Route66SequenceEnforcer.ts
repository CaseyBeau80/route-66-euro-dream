
import { TripStop } from '../data/SupabaseDataService';
import { DailySegment } from './TripPlanTypes';

export interface SequenceValidationResult {
  isValid: boolean;
  violations: string[];
  direction: 'east-to-west' | 'west-to-east';
  backtrackingSegments: number;
}

export class Route66SequenceEnforcer {
  /**
   * Enforce proper Route 66 sequence direction throughout the trip
   */
  static enforceSequenceDirection(
    startStop: TripStop,
    endStop: TripStop,
    candidateStops: TripStop[]
  ): {
    validStops: TripStop[];
    direction: 'east-to-west' | 'west-to-east';
    rejectedStops: Array<{ stop: TripStop; reason: string }>;
  } {
    console.log(`🧭 ENFORCING SEQUENCE: ${startStop.name} → ${endStop.name}`);
    
    // Determine trip direction based on longitude
    const direction = endStop.longitude < startStop.longitude ? 'east-to-west' : 'west-to-east';
    console.log(`🧭 TRIP DIRECTION: ${direction}`);
    
    const validStops: TripStop[] = [];
    const rejectedStops: Array<{ stop: TripStop; reason: string }> = [];
    
    for (const stop of candidateStops) {
      const validation = this.validateStopSequence(startStop, stop, endStop, direction);
      
      if (validation.isValid) {
        validStops.push(stop);
      } else {
        rejectedStops.push({ stop, reason: validation.reason });
        console.log(`🚫 REJECTED: ${stop.name} - ${validation.reason}`);
      }
    }
    
    console.log(`✅ SEQUENCE ENFORCEMENT: ${validStops.length} valid, ${rejectedStops.length} rejected`);
    
    return { validStops, direction, rejectedStops };
  }
  
  /**
   * Validate that a stop maintains proper sequence
   */
  private static validateStopSequence(
    startStop: TripStop,
    candidateStop: TripStop,
    endStop: TripStop,
    direction: 'east-to-west' | 'west-to-east'
  ): { isValid: boolean; reason: string } {
    // Check longitude progression
    if (direction === 'east-to-west') {
      // Going west: longitude should decrease
      if (candidateStop.longitude > startStop.longitude) {
        return { isValid: false, reason: 'Backtracking eastward on westbound trip' };
      }
      if (candidateStop.longitude < endStop.longitude) {
        return { isValid: false, reason: 'Overshooting destination westward' };
      }
    } else {
      // Going east: longitude should increase
      if (candidateStop.longitude < startStop.longitude) {
        return { isValid: false, reason: 'Backtracking westward on eastbound trip' };
      }
      if (candidateStop.longitude > endStop.longitude) {
        return { isValid: false, reason: 'Overshooting destination eastward' };
      }
    }
    
    return { isValid: true, reason: 'Valid sequence progression' };
  }
  
  /**
   * Validate final trip sequence for any violations
   */
  static validateTripSequence(segments: DailySegment[]): SequenceValidationResult {
    const violations: string[] = [];
    let backtrackingSegments = 0;
    
    if (segments.length < 2) {
      return { isValid: true, violations: [], direction: 'west-to-east', backtrackingSegments: 0 };
    }
    
    // Determine overall direction from first to last segment
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const direction = lastSegment.endCity.includes('Los Angeles') || lastSegment.endCity.includes('Santa Monica') 
      ? 'west-to-east' 
      : 'east-to-west';
    
    // Check each segment transition
    for (let i = 0; i < segments.length - 1; i++) {
      const currentSegment = segments[i];
      const nextSegment = segments[i + 1];
      
      // This is a simplified check - in a real implementation, we'd use actual coordinates
      const isBacktracking = this.detectBacktracking(currentSegment.endCity, nextSegment.endCity, direction);
      
      if (isBacktracking) {
        backtrackingSegments++;
        violations.push(`Day ${currentSegment.day} → Day ${nextSegment.day}: Backtracking from ${currentSegment.endCity} to ${nextSegment.endCity}`);
      }
    }
    
    const isValid = violations.length === 0;
    
    console.log(`🔍 SEQUENCE VALIDATION: ${isValid ? 'VALID' : 'INVALID'} - ${violations.length} violations, ${backtrackingSegments} backtracking segments`);
    
    return { isValid, violations, direction, backtrackingSegments };
  }
  
  /**
   * Simple backtracking detection based on city names
   */
  private static detectBacktracking(fromCity: string, toCity: string, direction: 'east-to-west' | 'west-to-east'): boolean {
    // Simplified Route 66 city order (west to east)
    const route66Cities = [
      'Santa Monica', 'Los Angeles', 'Barstow', 'Needles', 'Kingman', 'Flagstaff', 
      'Winslow', 'Holbrook', 'Gallup', 'Albuquerque', 'Santa Fe', 'Tucumcari', 
      'Amarillo', 'Oklahoma City', 'Tulsa', 'Joplin', 'Springfield', 'St. Louis', 'Chicago'
    ];
    
    const fromIndex = route66Cities.findIndex(city => fromCity.includes(city));
    const toIndex = route66Cities.findIndex(city => toCity.includes(city));
    
    // If cities not found in our list, assume valid
    if (fromIndex === -1 || toIndex === -1) return false;
    
    if (direction === 'west-to-east') {
      return toIndex < fromIndex; // Going backwards in the array
    } else {
      return toIndex > fromIndex; // Going forwards when should go backwards
    }
  }
}
