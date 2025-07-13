
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopFilteringService } from './StopFilteringService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';

export class TripDestinationOptimizer {
  /**
   * Select optimal destinations with STRICT destination city enforcement
   */
  static selectOptimalDestinations(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): { destinations: TripStop[]; actualDays: number } {
    console.log(`🎯 STRICT: Selecting destination cities only for ${requestedDays} days from ${startStop.name} to ${endStop.name}`);
    
    // STEP 1: STRICT FILTERING - Only destination cities allowed
    const destinationCitiesOnly = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly(allStops);
    
    if (destinationCitiesOnly.length === 0) {
      console.log('❌ No destination cities found in the database');
      return { destinations: [], actualDays: 1 };
    }

    console.log(`🏙️ Found ${destinationCitiesOnly.length} destination cities in database`);

    // STEP 2: Filter for valid route progression
    const validDestinationCities = StopFilteringService.filterValidStops(
      destinationCitiesOnly, 
      startStop, 
      endStop, 
      300 // More generous for Route 66
    );

    if (validDestinationCities.length === 0) {
      console.log('⚠️ No destination cities found between start and end points');
      return { destinations: [], actualDays: 1 };
    }

    console.log(`📍 Found ${validDestinationCities.length} destination cities along the route`);

    // Calculate total route distance for distribution
    const totalRouteDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    // Calculate distances from start for all destination cities
    const destinationsWithDistance = validDestinationCities.map(dest => ({
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

    // CRITICAL FIX: Select exactly the required number of intermediate destinations
    const selectedDestinations: TripStop[] = [];
    const requiredIntermediateDestinations = requestedDays - 1; // For N days, need exactly N-1 intermediate stops
    const targetSegmentDistance = totalRouteDistance / requestedDays;

    console.log(`🎯 FIXING OFF-BY-ONE: For ${requestedDays} days trip, need exactly ${requiredIntermediateDestinations} intermediate destinations`);
    console.log(`🎯 Target segment distance: ${targetSegmentDistance.toFixed(0)} miles`);
    console.log(`📊 Available destination cities: ${destinationsWithDistance.length}`);

    let lastSelectedDistance = 0;

    // FIXED LOOP: Only check if we have reached the required number, not available destinations
    for (let i = 0; i < requiredIntermediateDestinations; i++) {
      const targetDistance = (i + 1) * targetSegmentDistance;
      
      // Find available destination cities that haven't been used
      const availableDestinations = destinationsWithDistance.filter(dest => 
        !selectedDestinations.find(selected => selected.id === dest.stop.id) &&
        dest.distanceFromStart > lastSelectedDistance + 50 // Ensure minimum 50-mile progression
      );

      if (availableDestinations.length === 0) {
        console.log(`⚠️ No more available destination cities for day ${i + 2}. Selected ${selectedDestinations.length} out of ${requiredIntermediateDestinations} required destinations.`);
        break; // Exit early if no more destinations available
      }

      // Find destination city closest to target distance
      const bestDestination = availableDestinations.reduce((best, current) => {
        const bestDiff = Math.abs(best.distanceFromStart - targetDistance);
        const currentDiff = Math.abs(current.distanceFromStart - targetDistance);
        return currentDiff < bestDiff ? current : best;
      });

      selectedDestinations.push(bestDestination.stop);
      lastSelectedDistance = bestDestination.distanceFromStart;

      console.log(`✅ Selected destination city: ${bestDestination.stop.name}, ${bestDestination.stop.state} for day ${i + 2} (${bestDestination.distanceFromStart.toFixed(0)} miles from start)`);
    }

    // Calculate actual days based on segments that will be created
    // Each segment = 1 day, segments = selectedDestinations.length + 1 (for final segment to end)
    const actualDays = selectedDestinations.length + 1;
    
    console.log(`🎯 DESTINATION SELECTION SUMMARY: Requested ${requestedDays} days, selected ${selectedDestinations.length} intermediate destinations, will create ${actualDays} travel days`);

    // FINAL VALIDATION: Ensure all selected are destination cities
    const finalValidation = StrictDestinationCityEnforcer.validateAllAreDestinationCities(selectedDestinations);
    if (!finalValidation.isValid) {
      console.error(`❌ FINAL VALIDATION FAILED:`, finalValidation.violations);
    }

    console.log(`✅ STRICT SELECTION COMPLETE: ${selectedDestinations.length} destination cities for ${actualDays} days:`, 
      selectedDestinations.map(d => `${d.name}, ${d.state}`));

    return { destinations: selectedDestinations, actualDays };
  }

  /**
   * Ensure minimum viable trip with strict destination city enforcement
   */
  static ensureMinimumViableTrip(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): { destinations: TripStop[]; actualDays: number; limitMessage?: string } {
    console.log(`🛡️ STRICT: Ensuring minimum viable trip with destination cities only`);

    const result = this.selectOptimalDestinations(startStop, endStop, allStops, requestedDays);

    // Validate no duplicates in the result
    const uniqueDestinations = result.destinations.filter((dest, index, array) => 
      array.findIndex(d => d.id === dest.id) === index
    );

    if (uniqueDestinations.length !== result.destinations.length) {
      console.warn('⚠️ Removed duplicate destination cities from result');
      result.destinations = uniqueDestinations;
      result.actualDays = uniqueDestinations.length + 1;
    }

    // If we have fewer days than requested, provide a helpful message
    if (result.actualDays < requestedDays) {
      const limitMessage = `Trip optimized to ${result.actualDays} days using only major Route 66 destination cities between ${startStop.name} and ${endStop.name}. This ensures meaningful stops at iconic cities without including smaller attractions.`;
      
      console.log(`📝 Trip limited: ${requestedDays} requested → ${result.actualDays} actual days (destination cities only)`);
      
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
