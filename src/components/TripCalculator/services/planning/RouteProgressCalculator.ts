
export class RouteProgressCalculator {
  /**
   * Calculate cumulative progress percentage
   */
  static calculateCumulativeProgress(cumulativeDistance: number, totalDistance: number): number {
    if (totalDistance <= 0) return 0;
    return Math.min(100, Math.max(0, (cumulativeDistance / totalDistance) * 100));
  }

  /**
   * Get route section based on progress with proper state mapping
   */
  static getRouteSection(progressPercent: number): string {
    // Clamp progress to valid range
    const clampedProgress = Math.min(100, Math.max(0, progressPercent));
    
    if (clampedProgress <= 20) return 'Illinois & Missouri';
    if (clampedProgress <= 40) return 'Oklahoma & Texas';
    if (clampedProgress <= 65) return 'New Mexico';
    if (clampedProgress <= 85) return 'Arizona';
    return 'California';
  }

  /**
   * Get detailed route section with mileage context
   */
  static getDetailedRouteSection(progressPercent: number, cumulativeDistance: number): {
    section: string;
    description: string;
    states: string[];
  } {
    const clampedProgress = Math.min(100, Math.max(0, progressPercent));
    
    if (clampedProgress <= 20) {
      return {
        section: 'Illinois & Missouri',
        description: 'Beginning of the Mother Road',
        states: ['Illinois', 'Missouri']
      };
    }
    if (clampedProgress <= 40) {
      return {
        section: 'Oklahoma & Texas',
        description: 'Heart of Route 66',
        states: ['Oklahoma', 'Texas']
      };
    }
    if (clampedProgress <= 65) {
      return {
        section: 'New Mexico',
        description: 'Land of Enchantment',
        states: ['New Mexico']
      };
    }
    if (clampedProgress <= 85) {
      return {
        section: 'Arizona',
        description: 'Desert Southwest',
        states: ['Arizona']
      };
    }
    return {
      section: 'California',
      description: 'Pacific Coast Finale',
      states: ['California']
    };
  }

  /**
   * Calculate accurate cumulative distance for route section determination
   */
  static calculateAccurateCumulativeDistance(
    segmentIndex: number,
    segments: Array<{ approximateMiles: number }>
  ): number {
    let cumulativeDistance = 0;
    
    for (let i = 0; i <= segmentIndex; i++) {
      cumulativeDistance += segments[i]?.approximateMiles || 0;
    }
    
    return cumulativeDistance;
  }
}
