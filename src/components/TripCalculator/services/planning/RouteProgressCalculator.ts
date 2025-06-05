
export class RouteProgressCalculator {
  /**
   * Calculate cumulative progress percentage
   */
  static calculateCumulativeProgress(cumulativeDistance: number, totalDistance: number): number {
    return Math.min(100, (cumulativeDistance / totalDistance) * 100);
  }

  /**
   * Get route section based on progress
   */
  static getRouteSection(progressPercent: number): string {
    if (progressPercent <= 20) return 'Illinois & Missouri';
    if (progressPercent <= 40) return 'Oklahoma & Texas';
    if (progressPercent <= 70) return 'New Mexico';
    if (progressPercent <= 90) return 'Arizona';
    return 'California';
  }
}
