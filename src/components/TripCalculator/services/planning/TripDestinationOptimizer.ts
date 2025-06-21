
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopFilteringService } from './StopFilteringService';

export class TripDestinationOptimizer {
  /**
   * Select optimal destinations for the specified number of days with improved logic to prevent ping ponging
   */
  static selectOptimalDestinations(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): { destinations: TripStop[]; actualDays: number } {
    console.log(`🎯 FIXED: Selecting destinations for ${requestedDays} days from ${startStop.name} to ${endStop.name}`);
    
    // Filter valid stops with more generous distance limits
    const validStops = StopFilteringService.filterValidStops(allStops, startStop, endStop, 300);
    
    // Focus on destination cities and major waypoints
    const destinationCities = validStops.filter(stop => 
      stop.category === 'destination_city' || stop.category === 'major_waypoint'
    );

    console.log(`📍 FIXED: Found ${destinationCities.length} destination cities/waypoints`);

    if (destinationCities.length === 0) {
      console.log('⚠️ No destination cities found, creating direct route');
      return { destinations: [], actualDays: 1 };
    }

    // Calculate total route distance for distribution
    const totalRouteDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    // Calculate distances from start for all destinations
    const destinationsWithDistance = destinationCities.map(dest => ({
      stop: dest,
      distanceFromStart: DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        dest.latitude,
        dest.longitude
      ),
      distanceFromEnd: DistanceCalculationService.calculateDistance(
        dest.latitude,
        dest.longitude,
        endStop.latitude,
        endStop.longitude
      )
    }));

    // Sort by distance from start to ensure progression
    destinationsWithDistance.sort((a, b) => a.distanceFromStart - b.distanceFromStart);

    // FIXED: Improved selection logic to prevent ping ponging
    const selectedDestinations: TripStop[] = [];
    const maxDestinations = Math.max(1, requestedDays - 1); // Ensure at least 1 destination
    const targetSegmentDistance = totalRouteDistance / requestedDays;

    console.log(`🎯 FIXED: Target segment distance: ${targetSegmentDistance.toFixed(0)} miles`);

    let currentPosition = 0; // Track progress along route
    let lastSelectedDistance = 0;

    for (let i = 0; i < maxDestinations && selectedDestinations.length < destinationsWithDistance.length; i++) {
      const targetDistance = (i + 1) * targetSegmentDistance;
      
      // Find the best destination for this segment that hasn't been used
      const availableDestinations = destinationsWithDistance.filter(dest => 
        !selectedDestinations.find(selected => selected.id === dest.stop.id) &&
        dest.distanceFromStart > lastSelectedDistance + 50 // Ensure minimum 50-mile progression
      );

      if (availableDestinations.length === 0) {
        console.log(`⚠️ FIXED: No more available destinations for day ${i + 2}`);
        break;
      }

      // Find destination closest to target distance
      const bestDestination = availableDestinations.reduce((best, current) => {
        const bestDiff = Math.abs(best.distanceFromStart - targetDistance);
        const currentDiff = Math.abs(current.distanceFromStart - targetDistance);
        return currentDiff < bestDiff ? current : best;
      });

      selectedDestinations.push(bestDestination.stop);
      lastSelectedDistance = bestDestination.distanceFromStart;

      console.log(`✅ FIXED: Selected ${bestDestination.stop.name} for day ${i + 2} (${bestDestination.distanceFromStart.toFixed(0)} miles from start)`);
    }

    const actualDays = selectedDestinations.length + 1; // +1 for final day to end destination

    console.log(`✅ FIXED: Selected ${selectedDestinations.length} unique destinations for ${actualDays} days:`, 
      selectedDestinations.map(d => `${d.name} (${d.city || d.city_name}, ${d.state})`));

    return { destinations: selectedDestinations, actualDays };
  }

  /**
   * Ensure minimum viable trip with proper day distribution and no ping ponging
   */
  static ensureMinimumViableTrip(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): { destinations: TripStop[]; actualDays: number; limitMessage?: string } {
    console.log(`🛡️ FIXED: Ensuring minimum viable trip for ${requestedDays} requested days`);

    const result = this.selectOptimalDestinations(startStop, endStop, allStops, requestedDays);

    // Validate no duplicates in the result
    const uniqueDestinations = result.destinations.filter((dest, index, array) => 
      array.findIndex(d => d.id === dest.id) === index
    );

    if (uniqueDestinations.length !== result.destinations.length) {
      console.warn('⚠️ FIXED: Removed duplicate destinations from result');
      result.destinations = uniqueDestinations;
      result.actualDays = uniqueDestinations.length + 1;
    }

    // If we have fewer days than requested, provide a helpful message
    if (result.actualDays < requestedDays) {
      const limitMessage = `Trip optimized to ${result.actualDays} days with unique Route 66 destinations between ${startStop.name} and ${endStop.name}. This ensures meaningful stops without repeating cities.`;
      
      console.log(`📝 FIXED: Trip limited: ${requestedDays} requested -> ${result.actualDays} actual days (no ping pong)`);
      
      return {
        ...result,
        limitMessage
      };
    }

    return result;
  }

  /**
   * Calculate optimal daily driving distances
   */
  static calculateOptimalDistribution(
    totalDistance: number,
    actualDays: number,
    maxDailyDrive: number = 500
  ): number[] {
    console.log(`📊 Calculating optimal distribution: ${totalDistance} miles over ${actualDays} days`);

    const averageDaily = totalDistance / actualDays;
    const dailyDistances: number[] = [];

    for (let i = 0; i < actualDays; i++) {
      // Keep daily drives reasonable
      const dailyDistance = Math.min(averageDaily, maxDailyDrive);
      dailyDistances.push(dailyDistance);
    }

    // Adjust last day if needed
    const totalAllocated = dailyDistances.reduce((sum, dist) => sum + dist, 0);
    const difference = totalDistance - totalAllocated;
    
    if (difference > 0 && dailyDistances.length > 0) {
      dailyDistances[dailyDistances.length - 1] += difference;
    }

    console.log(`✅ Daily distance distribution:`, dailyDistances.map(d => `${Math.round(d)}mi`));
    return dailyDistances;
  }
}
