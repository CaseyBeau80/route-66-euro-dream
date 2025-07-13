import { TripStop } from '../../types/TripStop';

/**
 * Service for enforcing directional constraints in Route 66 trip planning
 * Prevents ping-ponging and ensures logical geographic progression
 */
export class DirectionEnforcerService {
  
  /**
   * Calculates the primary direction between two points
   */
  static calculateDirection(from: TripStop, to: TripStop): 'east' | 'west' | 'neutral' {
    if (!from.longitude || !to.longitude) return 'neutral';
    
    const longitudeDiff = to.longitude - from.longitude;
    const threshold = 0.1; // Minimum threshold for directional significance
    
    if (longitudeDiff > threshold) return 'east';
    if (longitudeDiff < -threshold) return 'west';
    return 'neutral';
  }

  /**
   * Determines if a destination maintains forward progression
   */
  static isForwardProgression(
    current: TripStop, 
    candidate: TripStop, 
    finalDestination: TripStop
  ): boolean {
    const currentToFinal = this.calculateDirection(current, finalDestination);
    const currentToCandidate = this.calculateDirection(current, candidate);
    
    // If we're heading east to the final destination, candidate should also be east or neutral
    if (currentToFinal === 'east') {
      return currentToCandidate === 'east' || currentToCandidate === 'neutral';
    }
    
    // If we're heading west to the final destination, candidate should also be west or neutral
    if (currentToFinal === 'west') {
      return currentToCandidate === 'west' || currentToCandidate === 'neutral';
    }
    
    return true; // If direction is neutral, allow any progression
  }

  /**
   * Calculates progression score based on directional alignment
   */
  static calculateProgressionScore(
    current: TripStop,
    candidate: TripStop,
    finalDestination: TripStop
  ): number {
    const totalDistance = this.calculateDistance(current, finalDestination);
    const progressDistance = this.calculateDistance(current, candidate);
    const remainingDistance = this.calculateDistance(candidate, finalDestination);
    
    // Base progression score
    let score = (progressDistance / totalDistance) * 100;
    
    // Bonus for forward progression
    if (this.isForwardProgression(current, candidate, finalDestination)) {
      score += 20;
    } else {
      score -= 30; // Penalty for backward movement
    }
    
    // Bonus for getting closer to destination
    if (remainingDistance < totalDistance) {
      score += 10;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validates an entire route for directional consistency
   */
  static validateRouteProgression(stops: TripStop[]): {
    isValid: boolean;
    violations: string[];
    progressionScore: number;
  } {
    if (stops.length < 2) {
      return { isValid: true, violations: [], progressionScore: 100 };
    }

    const violations: string[] = [];
    let totalScore = 0;
    let scoredSegments = 0;

    for (let i = 0; i < stops.length - 2; i++) {
      const current = stops[i];
      const next = stops[i + 1];
      const final = stops[stops.length - 1];

      if (!this.isForwardProgression(current, next, final)) {
        violations.push(
          `Backward progression detected: ${current.city_name} → ${next.city_name}`
        );
      }

      const segmentScore = this.calculateProgressionScore(current, next, final);
      totalScore += segmentScore;
      scoredSegments++;
    }

    const averageScore = scoredSegments > 0 ? totalScore / scoredSegments : 100;
    
    return {
      isValid: violations.length === 0,
      violations,
      progressionScore: Math.round(averageScore)
    };
  }

  /**
   * Filters destinations to maintain forward progression
   */
  static filterForwardDestinations(
    current: TripStop,
    candidates: TripStop[],
    finalDestination: TripStop,
    strictness: 'strict' | 'moderate' | 'lenient' = 'moderate'
  ): TripStop[] {
    const thresholds = {
      strict: 70,
      moderate: 50,
      lenient: 30
    };

    return candidates.filter(candidate => {
      const score = this.calculateProgressionScore(current, candidate, finalDestination);
      return score >= thresholds[strictness];
    });
  }

  /**
   * Simple distance calculation between two points
   */
  static calculateDistance(from: TripStop, to: TripStop): number {
    if (!from.latitude || !from.longitude || !to.latitude || !to.longitude) {
      return 0;
    }

    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(to.latitude - from.latitude);
    const dLon = this.toRadians(to.longitude - from.longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(from.latitude)) * Math.cos(this.toRadians(to.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}