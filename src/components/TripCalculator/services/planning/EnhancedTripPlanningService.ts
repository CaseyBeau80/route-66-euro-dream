
import { TripPlan } from './TripPlanTypes';
import { BasicTripPlanner } from './BasicTripPlanner';
import { GoogleMapsTripPlanner } from './GoogleMapsTripPlanner';

export class EnhancedTripPlanningService {
  /**
   * Plan a trip with enhanced logic, Google Maps integration, and data validation
   */
  static async planEnhancedTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<TripPlan> {
    return await BasicTripPlanner.planBasicTrip(
      startLocation,
      endLocation,
      travelDays,
      tripStyle
    );
  }

  /**
   * Plan a trip with validated segments and Google Maps integration
   */
  static async planTripWithGoogleMaps(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<TripPlan> {
    return await GoogleMapsTripPlanner.planTripWithGoogleMaps(
      startLocation,
      endLocation,
      travelDays,
      tripStyle
    );
  }

  // Replace the problematic category assignment with proper mapping
  private static mapDriveTimeCategory(category: string): 'short' | 'optimal' | 'long' | 'extreme' {
    switch (category) {
      case 'moderate':
        return 'optimal';
      case 'comfortable':
        return 'short';
      case 'extended':
        return 'long';
      default:
        return 'optimal';
    }
  }
}
