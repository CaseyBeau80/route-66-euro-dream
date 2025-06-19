
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CentralizedStopValidator } from './utils/CentralizedStopValidator';

export class RouteStopFilterService {
  /**
   * Filter stops to only those along the route with comprehensive validation
   */
  static getStopsAlongRoute(
    startStop: TripStop,
    endStop: TripStop,
    candidateStops: TripStop[]
  ): TripStop[] {
    console.log(`🛤️ Finding stops along route from ${startStop?.name || 'undefined'} to ${endStop?.name || 'undefined'}`);

    // CRITICAL: Validate all inputs first
    const startValidation = CentralizedStopValidator.validateTripStop(startStop, 'route-filter-start');
    if (!startValidation.isValid) {
      console.error('❌ ROUTE FILTER: Invalid start stop:', startValidation.errors);
      return [];
    }

    const endValidation = CentralizedStopValidator.validateTripStop(endStop, 'route-filter-end');
    if (!endValidation.isValid) {
      console.error('❌ ROUTE FILTER: Invalid end stop:', endValidation.errors);
      return [];
    }

    // Validate and filter candidate stops
    const validCandidates = CentralizedStopValidator.filterValidStops(candidateStops, 'route-filter-candidates');
    
    if (validCandidates.length === 0) {
      console.warn('⚠️ ROUTE FILTER: No valid candidate stops available');
      return [];
    }

    // Calculate total distance with validation
    const totalDistance = DistanceCalculationService.calculateDistanceBetweenObjects(startStop, endStop);
    
    if (totalDistance === 0) {
      console.error('❌ ROUTE FILTER: Cannot calculate total distance');
      return [];
    }

    console.log(`📏 Total distance: ${totalDistance.toFixed(1)} miles`);

    const routeStops: TripStop[] = [];
    const maxDeviation = 100; // Maximum miles deviation from direct route

    for (const candidate of validCandidates) {
      // Skip if it's the start or end stop
      if (candidate.id === startStop.id || candidate.id === endStop.id) {
        console.log(`🔍 Filtering out candidate: ${JSON.stringify({
          id: candidate.id,
          name: candidate.name,
          reason: candidate.id === startStop.id ? 'is start stop' : 'is end stop'
        })}`);
        continue;
      }

      // Calculate distance from start to candidate
      const distanceToCandidate = DistanceCalculationService.calculateDistanceBetweenObjects(startStop, candidate);
      
      // Calculate distance from candidate to end
      const distanceFromCandidateToEnd = DistanceCalculationService.calculateDistanceBetweenObjects(candidate, endStop);

      // Check if candidate is roughly along the route
      const totalThroughCandidate = distanceToCandidate + distanceFromCandidateToEnd;
      const deviation = totalThroughCandidate - totalDistance;

      console.log(`📏 Distance calculation: ${JSON.stringify({
        from: `${startStop.latitude}, ${startStop.longitude}`,
        to: `${candidate.latitude}, ${candidate.longitude}`,
        distance: `${distanceToCandidate.toFixed(1)} miles`
      })}`);

      console.log(`📏 Distance calculation: ${JSON.stringify({
        from: `${candidate.latitude}, ${candidate.longitude}`,
        to: `${endStop.latitude}, ${endStop.longitude}`,
        distance: `${distanceFromCandidateToEnd.toFixed(1)} miles`
      })}`);

      if (deviation <= maxDeviation) {
        routeStops.push(candidate);
        console.log(`✅ ROUTE: ${candidate.name} is along route (deviation: ${deviation.toFixed(1)} miles)`);
      } else {
        console.log(`🚫 ROUTE: ${candidate.name} deviates too much (${deviation.toFixed(1)} miles)`);
      }
    }

    console.log(`🛤️ Found ${routeStops.length} stops along route`);
    return routeStops;
  }
}
