import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopFilteringService } from './StopFilteringService';

export class TripDestinationOptimizer {
  /**
   * Select optimal destinations for the specified number of days
   */
  static selectOptimalDestinations(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): { destinations: TripStop[]; actualDays: number } {
    console.log(`🎯 Selecting destinations for ${requestedDays} days from ${startStop.name} to ${endStop.name}`);
    
    // Filter valid stops first with more generous distance limits
    const validStops = StopFilteringService.filterValidStops(allStops, startStop, endStop, 200);
    
    // Focus on destination cities and major waypoints
    const destinationCities = validStops.filter(stop => 
      stop.category === 'destination_city' || stop.category === 'major_waypoint'
    );

    console.log(`📍 Found ${destinationCities.length} destination cities/waypoints`);

    if (destinationCities.length === 0) {
      console.log('⚠️ No destination cities found, creating direct route');
      return { destinations: [], actualDays: 1 };
    }

    // Calculate distances and select appropriate destinations
    const destinationsWithDistance = destinationCities.map(dest => ({
      stop: dest,
      distanceFromStart: DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        dest.latitude,
        dest.longitude
      )
    }));

    // Sort by distance from start
    destinationsWithDistance.sort((a, b) => a.distanceFromStart - b.distanceFromStart);

    // Select destinations based on requested days
    const maxDestinations = Math.min(requestedDays - 1, destinationsWithDistance.length);
    const selectedDestinations = destinationsWithDistance
      .slice(0, maxDestinations)
      .map(item => item.stop);

    const actualDays = selectedDestinations.length + 1; // +1 for final day to end destination

    console.log(`✅ Selected ${selectedDestinations.length} destinations for ${actualDays} days:`, 
      selectedDestinations.map(d => d.name));

    return { destinations: selectedDestinations, actualDays };
  }

  /**
   * Ensure minimum viable trip with proper day distribution
   */
  static ensureMinimumViableTrip(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): { destinations: TripStop[]; actualDays: number; limitMessage?: string } {
    console.log(`🛡️ Ensuring minimum viable trip for ${requestedDays} requested days`);

    const result = this.selectOptimalDestinations(startStop, endStop, allStops, requestedDays);

    // If we have fewer days than requested, provide a helpful message
    if (result.actualDays < requestedDays) {
      const limitMessage = `Trip optimized to ${result.actualDays} days based on available Route 66 destinations between ${startStop.name} and ${endStop.name}. This ensures meaningful stops and avoids excessive daily driving.`;
      
      console.log(`📝 Trip limited: ${requestedDays} requested -> ${result.actualDays} actual days`);
      
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
