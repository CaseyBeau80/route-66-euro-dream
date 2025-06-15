
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class TripPlanUtils {
  /**
   * Calculate total distance for a trip
   */
  static calculateTotalDistance(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[]
  ): number {
    const allStops = [startStop, ...destinationCities, endStop];
    let totalDistance = 0;
    
    for (let i = 0; i < allStops.length - 1; i++) {
      const currentStop = allStops[i];
      const nextStop = allStops[i + 1];
      
      totalDistance += DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );
    }
    
    return totalDistance;
  }

  /**
   * Get drive time category with color coding
   */
  static getDriveTimeCategory(driveTimeHours: number) {
    if (driveTimeHours <= 3) {
      return { category: 'short' as const, message: 'Short drive', color: 'green' };
    } else if (driveTimeHours <= 6) {
      return { category: 'optimal' as const, message: 'Comfortable drive', color: 'blue' };
    } else if (driveTimeHours <= 8) {
      return { category: 'long' as const, message: 'Long drive', color: 'orange' };
    } else {
      return { category: 'extreme' as const, message: 'Very long drive', color: 'red' };
    }
  }

  /**
   * Get route section based on progress
   */
  static getRouteSection(day: number, totalDays: number): string {
    const progress = day / totalDays;
    
    if (progress <= 0.33) {
      return 'Eastern Route 66';
    } else if (progress <= 0.66) {
      return 'Central Route 66';
    } else {
      return 'Western Route 66';
    }
  }

  /**
   * Generate random ID
   */
  static generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
