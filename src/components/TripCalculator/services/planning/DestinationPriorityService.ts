
import { TripStop } from '../data/SupabaseDataService';
import { DriveTimeTarget } from './DriveTimeConstraints';
import { DestinationScoring } from './DestinationScoring';
import { DestinationCityValidator } from './DestinationCityValidator';

export class DestinationPriorityService {
  /**
   * Select destination with validated destination city priority
   */
  static selectDestinationWithPriority(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget
  ): TripStop | null {
    // First, try to find validated destination cities within drive time constraints
    const rawDestinationCities = availableStops.filter(stop => 
      stop.category === 'destination_city'
    );
    
    const validatedDestinationCities = DestinationCityValidator.filterValidDestinationCities(rawDestinationCities);

    console.log(`🏙️ Found ${validatedDestinationCities.length} validated destination cities (from ${rawDestinationCities.length} total)`);

    if (validatedDestinationCities.length > 0) {
      const cityDestination = DestinationScoring.findBestDestinationByDriveTime(
        currentStop,
        validatedDestinationCities,
        driveTimeTarget
      );
      
      if (cityDestination) {
        console.log(`✅ Selected validated destination city: ${cityDestination.name}`);
        return cityDestination;
      }
    }

    // If no validated destination cities fit, try major waypoints
    const majorWaypoints = availableStops.filter(stop => 
      stop.category === 'route66_waypoint' && stop.is_major_stop
    );

    console.log(`🛤️ Found ${majorWaypoints.length} major waypoints to evaluate`);

    if (majorWaypoints.length > 0) {
      const waypointDestination = DestinationScoring.findBestDestinationByDriveTime(
        currentStop,
        majorWaypoints,
        driveTimeTarget
      );
      
      if (waypointDestination) {
        console.log(`✅ Selected major waypoint: ${waypointDestination.name}`);
        return waypointDestination;
      }
    }

    // Last resort: try all stops
    console.log(`🔄 Falling back to all stops for drive time selection`);
    return DestinationScoring.findBestDestinationByDriveTime(
      currentStop,
      availableStops,
      driveTimeTarget
    );
  }
}
