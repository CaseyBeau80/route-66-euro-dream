
export class RouteProgressCalculator {
  /**
   * Determine route section based on progress percentage
   */
  static getRouteSection(progressPercent: number): string {
    if (progressPercent <= 33) return 'Early Route';
    if (progressPercent <= 66) return 'Mid Route';
    return 'Final Stretch';
  }

  /**
   * Calculate cumulative progress along the route
   */
  static calculateCumulativeProgress(
    currentDistance: number,
    totalDistance: number
  ): number {
    return (currentDistance / totalDistance) * 100;
  }
}
