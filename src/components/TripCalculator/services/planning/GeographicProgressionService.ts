import { TripStop } from '../../types/TripStop';
import { DirectionEnforcerService } from './DirectionEnforcerService';

/**
 * Service for managing geographic progression in Route 66 trips
 * Ensures logical route flow and prevents unnecessary backtracking
 */
export class GeographicProgressionService {

  /**
   * Analyzes the geographic flow of a trip
   */
  static analyzeGeographicFlow(stops: TripStop[]): {
    overallDirection: 'eastbound' | 'westbound' | 'mixed';
    backtrackingSegments: number;
    flowEfficiency: number;
    recommendations: string[];
  } {
    if (stops.length < 2) {
      return {
        overallDirection: 'mixed',
        backtrackingSegments: 0,
        flowEfficiency: 100,
        recommendations: []
      };
    }

    const start = stops[0];
    const end = stops[stops.length - 1];
    const overallDirection = this.determineOverallDirection(start, end);
    
    let backtrackingSegments = 0;
    let forwardSegments = 0;
    const recommendations: string[] = [];

    // Analyze each segment
    for (let i = 0; i < stops.length - 1; i++) {
      const current = stops[i];
      const next = stops[i + 1];
      const direction = DirectionEnforcerService.calculateDirection(current, next);

      if (this.isBacktracking(direction, overallDirection)) {
        backtrackingSegments++;
        recommendations.push(
          `Consider reordering: ${current.city_name} → ${next.city_name} goes against main flow`
        );
      } else {
        forwardSegments++;
      }
    }

    const totalSegments = stops.length - 1;
    const flowEfficiency = totalSegments > 0 ? (forwardSegments / totalSegments) * 100 : 100;

    // Add overall recommendations
    if (flowEfficiency < 70) {
      recommendations.push('Route has significant backtracking - consider reordering destinations');
    }
    if (backtrackingSegments > totalSegments / 3) {
      recommendations.push('Too many segments go against the main direction');
    }

    return {
      overallDirection,
      backtrackingSegments,
      flowEfficiency: Math.round(flowEfficiency),
      recommendations
    };
  }

  /**
   * Optimizes the order of destinations for better geographic flow
   */
  static optimizeDestinationOrder(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[]
  ): TripStop[] {
    if (destinations.length <= 1) return destinations;

    const overallDirection = this.determineOverallDirection(startStop, endStop);
    
    // Sort destinations by longitude based on overall direction
    const sorted = [...destinations].sort((a, b) => {
      if (overallDirection === 'eastbound') {
        return a.longitude - b.longitude; // West to East
      } else {
        return b.longitude - a.longitude; // East to West
      }
    });

    // Fine-tune order to minimize total distance while maintaining direction
    return this.fineTuneOrder(startStop, endStop, sorted);
  }

  /**
   * Validates that a route maintains reasonable geographic progression
   */
  static validateProgressionConstraints(
    stops: TripStop[],
    constraints: {
      maxBacktrackingRatio?: number;
      minProgressionScore?: number;
      allowShortDetours?: boolean;
    } = {}
  ): {
    isValid: boolean;
    violations: string[];
    score: number;
    suggestions: string[];
  } {
    const {
      maxBacktrackingRatio = 0.3,
      minProgressionScore = 60,
      allowShortDetours = true
    } = constraints;

    const flow = this.analyzeGeographicFlow(stops);
    const progression = DirectionEnforcerService.validateRouteProgression(stops);
    
    const violations: string[] = [];
    const suggestions: string[] = [];

    // Check backtracking ratio
    const backtrackingRatio = flow.backtrackingSegments / Math.max(1, stops.length - 1);
    if (backtrackingRatio > maxBacktrackingRatio) {
      violations.push(`Too much backtracking: ${Math.round(backtrackingRatio * 100)}% of segments`);
      suggestions.push('Reorder destinations to reduce backtracking');
    }

    // Check progression score
    if (progression.progressionScore < minProgressionScore) {
      violations.push(`Low progression score: ${progression.progressionScore}%`);
      suggestions.push('Optimize destination sequence for better flow');
    }

    // Check flow efficiency
    if (flow.flowEfficiency < 70) {
      violations.push(`Poor geographic flow efficiency: ${flow.flowEfficiency}%`);
    }

    // Add recommendations from flow analysis
    suggestions.push(...flow.recommendations);

    return {
      isValid: violations.length === 0,
      violations,
      score: Math.round((progression.progressionScore + flow.flowEfficiency) / 2),
      suggestions: [...new Set(suggestions)] // Remove duplicates
    };
  }

  /**
   * Creates geographic constraints for destination selection
   */
  static createProgressionConstraints(
    startStop: TripStop,
    endStop: TripStop,
    requestedDays: number
  ): {
    preferredDirection: 'east' | 'west' | 'neutral';
    longitudeBounds: { min: number; max: number };
    progressionPoints: number[];
  } {
    const overallDirection = this.determineOverallDirection(startStop, endStop);
    const preferredDirection = overallDirection === 'eastbound' ? 'east' : 
                              overallDirection === 'westbound' ? 'west' : 'neutral';

    // Create longitude bounds
    const startLng = startStop.longitude;
    const endLng = endStop.longitude;
    const longitudeBounds = {
      min: Math.min(startLng, endLng) - 1, // Allow slight buffer
      max: Math.max(startLng, endLng) + 1
    };

    // Calculate ideal progression points
    const progressionPoints: number[] = [];
    for (let i = 1; i < requestedDays; i++) {
      const ratio = i / requestedDays;
      const progressLng = startLng + (endLng - startLng) * ratio;
      progressionPoints.push(progressLng);
    }

    return {
      preferredDirection,
      longitudeBounds,
      progressionPoints
    };
  }

  /**
   * Determines overall trip direction
   */
  private static determineOverallDirection(start: TripStop, end: TripStop): 'eastbound' | 'westbound' | 'mixed' {
    const direction = DirectionEnforcerService.calculateDirection(start, end);
    return direction === 'east' ? 'eastbound' : 
           direction === 'west' ? 'westbound' : 'mixed';
  }

  /**
   * Checks if a segment direction is backtracking relative to overall direction
   */
  private static isBacktracking(
    segmentDirection: 'east' | 'west' | 'neutral',
    overallDirection: 'eastbound' | 'westbound' | 'mixed'
  ): boolean {
    if (overallDirection === 'mixed' || segmentDirection === 'neutral') return false;
    
    return (overallDirection === 'eastbound' && segmentDirection === 'west') ||
           (overallDirection === 'westbound' && segmentDirection === 'east');
  }

  /**
   * Fine-tunes destination order to minimize distance while maintaining direction
   */
  private static fineTuneOrder(
    startStop: TripStop,
    endStop: TripStop,
    sortedDestinations: TripStop[]
  ): TripStop[] {
    if (sortedDestinations.length <= 2) return sortedDestinations;

    // Use a simple greedy approach to minimize total distance
    const result: TripStop[] = [];
    const remaining = [...sortedDestinations];
    let current = startStop;

    while (remaining.length > 0) {
      let bestIndex = 0;
      let bestScore = -Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        const distanceScore = -this.calculateDistance(current, candidate);
        const progressionScore = DirectionEnforcerService.calculateProgressionScore(
          current, candidate, endStop
        );
        const totalScore = distanceScore * 0.3 + progressionScore * 0.7;

        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestIndex = i;
        }
      }

      const selected = remaining.splice(bestIndex, 1)[0];
      result.push(selected);
      current = selected;
    }

    return result;
  }

  /**
   * Simple distance calculation
   */
  private static calculateDistance(from: TripStop, to: TripStop): number {
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