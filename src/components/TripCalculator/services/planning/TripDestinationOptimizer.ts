
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { StopFilteringService } from './StopFilteringService';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { DirectionEnforcerService } from './DirectionEnforcerService';
import { GeographicProgressionService } from './GeographicProgressionService';

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

    // Create geographic progression constraints
    const progressionConstraints = GeographicProgressionService.createProgressionConstraints(
      startStop, endStop, requestedDays
    );
    console.log(`🧭 Created progression constraints: ${progressionConstraints.preferredDirection} direction`);

    // CRITICAL FIX: Select exactly the required number of intermediate destinations
    const selectedDestinations: TripStop[] = [];
    const requiredIntermediateDestinations = requestedDays - 1; // For N days, need exactly N-1 intermediate stops
    const targetSegmentDistance = totalRouteDistance / requestedDays;

    console.log(`🎯 FIXING OFF-BY-ONE: For ${requestedDays} days trip, need exactly ${requiredIntermediateDestinations} intermediate destinations`);
    console.log(`🎯 Target segment distance: ${targetSegmentDistance.toFixed(0)} miles`);
    console.log(`📊 Available destination cities: ${destinationsWithDistance.length}`);

    let lastSelectedDistance = 0;

    // FIXED LOOP: Select destinations with fallback logic to prevent 13-day limitation
    for (let i = 0; i < requiredIntermediateDestinations; i++) {
      const targetDistance = (i + 1) * targetSegmentDistance;
      
      // Find available destination cities that haven't been used and maintain forward progression
      let availableDestinations = destinationsWithDistance.filter(dest => 
        !selectedDestinations.find(selected => selected.id === dest.stop.id) &&
        dest.distanceFromStart > lastSelectedDistance + 50 && // Ensure minimum 50-mile progression
        DirectionEnforcerService.isForwardProgression(
          selectedDestinations.length > 0 ? selectedDestinations[selectedDestinations.length - 1] : startStop,
          dest.stop,
          endStop
        )
      );

      // FALLBACK 1: If no destinations with 50-mile progression, reduce minimum to 25 miles
      if (availableDestinations.length === 0) {
        console.log(`🔄 FALLBACK 1: Reducing minimum progression to 25 miles for day ${i + 2}`);
        availableDestinations = destinationsWithDistance.filter(dest => 
          !selectedDestinations.find(selected => selected.id === dest.stop.id) &&
          dest.distanceFromStart > lastSelectedDistance + 25
        );
      }

      // FALLBACK 2: If still no destinations, remove progression requirement entirely
      if (availableDestinations.length === 0) {
        console.log(`🔄 FALLBACK 2: Removing progression requirement for day ${i + 2}`);
        availableDestinations = destinationsWithDistance.filter(dest => 
          !selectedDestinations.find(selected => selected.id === dest.stop.id)
        );
      }

      // FINAL CHECK: If absolutely no destinations available, log and break
      if (availableDestinations.length === 0) {
        console.log(`⚠️ ABSOLUTE LIMIT: No more destination cities available for day ${i + 2}. Selected ${selectedDestinations.length} out of ${requiredIntermediateDestinations} required destinations.`);
        console.log(`🔍 DIAGNOSIS: Total destinations in database: ${destinationsWithDistance.length}, already selected: ${selectedDestinations.length}`);
        break; // Exit only as absolute last resort
      }

      // Find destination city closest to target distance with progression scoring
      const bestDestination = availableDestinations.reduce((best, current) => {
        const currentStop = selectedDestinations.length > 0 ? selectedDestinations[selectedDestinations.length - 1] : startStop;
        
        // Distance score (how close to target distance)
        const bestDistanceDiff = Math.abs(best.distanceFromStart - targetDistance);
        const currentDistanceDiff = Math.abs(current.distanceFromStart - targetDistance);
        const bestDistanceScore = Math.max(0, 100 - bestDistanceDiff / 10);
        const currentDistanceScore = Math.max(0, 100 - currentDistanceDiff / 10);
        
        // Geographic progression score
        const bestProgressionScore = DirectionEnforcerService.calculateProgressionScore(
          currentStop, best.stop, endStop
        );
        const currentProgressionScore = DirectionEnforcerService.calculateProgressionScore(
          currentStop, current.stop, endStop
        );
        
        // Combined score (60% distance, 40% progression)
        const bestTotalScore = bestDistanceScore * 0.6 + bestProgressionScore * 0.4;
        const currentTotalScore = currentDistanceScore * 0.6 + currentProgressionScore * 0.4;
        
        return currentTotalScore > bestTotalScore ? current : best;
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

    // Optimize the order of selected destinations for better geographic flow
    const optimizedDestinations = GeographicProgressionService.optimizeDestinationOrder(
      startStop, endStop, selectedDestinations
    );
    console.log(`🔄 Optimized destination order for better geographic progression`);

    // Validate geographic progression
    const progressionValidation = GeographicProgressionService.validateProgressionConstraints(
      [startStop, ...optimizedDestinations, endStop]
    );
    
    if (!progressionValidation.isValid) {
      console.warn(`⚠️ Geographic progression issues:`, progressionValidation.violations);
      console.log(`💡 Suggestions:`, progressionValidation.suggestions);
    } else {
      console.log(`✅ Geographic progression validated - Score: ${progressionValidation.score}%`);
    }

    return { destinations: optimizedDestinations, actualDays };
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
