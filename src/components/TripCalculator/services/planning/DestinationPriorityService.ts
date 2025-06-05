
import { TripStop } from '../data/SupabaseDataService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';

export class DestinationPriorityService {
  /**
   * Select destination with strong destination city priority
   */
  static selectDestinationWithPriority(
    currentStop: TripStop,
    availableStops: TripStop[],
    driveTimeTarget: DriveTimeTarget
  ): TripStop | null {
    // First, try to find destination cities within drive time constraints
    const destinationCities = availableStops.filter(stop => 
      stop.category === 'destination_city'
    );

    console.log(`🏙️ Found ${destinationCities.length} destination cities to evaluate`);

    if (destinationCities.length > 0) {
      const cityDestination = DriveTimeBalancingService.findBestDestinationByDriveTime(
        currentStop,
        destinationCities,
        driveTimeTarget
      );
      
      if (cityDestination) {
        console.log(`✅ Selected destination city: ${cityDestination.name}`);
        return cityDestination;
      }
    }

    // If no destination cities fit, try major waypoints
    const majorWaypoints = availableStops.filter(stop => 
      stop.category === 'route66_waypoint' && stop.is_major_stop
    );

    console.log(`🛤️ Found ${majorWaypoints.length} major waypoints to evaluate`);

    if (majorWaypoints.length > 0) {
      const waypointDestination = DriveTimeBalancingService.findBestDestinationByDriveTime(
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
    return DriveTimeBalancingService.findBestDestinationByDriveTime(
      currentStop,
      availableStops,
      driveTimeTarget
    );
  }
}
