
import { TripStop } from '../../types/TripStop';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CentralizedStopValidator } from './utils/CentralizedStopValidator';

export class RouteStopFilterService {
  /**
   * Filter stops to only those along the route with comprehensive validation
   * PHASE 1-4: Implement comprehensive error handling and validation
   */
  static getStopsAlongRoute(
    startStop: TripStop,
    endStop: TripStop,
    candidateStops: TripStop[]
  ): TripStop[] {
    console.log(`🛤️ PHASE 1 DEBUG: Route filtering requested`, {
      startStop: {
        name: startStop?.name || 'undefined',
        hasLatLng: !!(startStop?.latitude && startStop?.longitude),
        lat: startStop?.latitude,
        lng: startStop?.longitude
      },
      endStop: {
        name: endStop?.name || 'undefined',
        hasLatLng: !!(endStop?.latitude && endStop?.longitude),
        lat: endStop?.latitude,
        lng: endStop?.longitude
      },
      candidateCount: candidateStops?.length || 0,
      stack: new Error().stack?.split('\n').slice(1, 3).join('\n')
    });

    // PHASE 2: BULLETPROOF input validation
    try {
      const startValidation = CentralizedStopValidator.validateTripStop(startStop, 'route-filter-start');
      if (!startValidation.isValid) {
        console.error('❌ PHASE 2: Invalid start stop:', startValidation.errors);
        return [];
      }

      const endValidation = CentralizedStopValidator.validateTripStop(endStop, 'route-filter-end');
      if (!endValidation.isValid) {
        console.error('❌ PHASE 2: Invalid end stop:', endValidation.errors);
        return [];
      }

      // Validate and filter candidate stops
      const validCandidates = CentralizedStopValidator.filterValidStops(candidateStops, 'route-filter-candidates');
      
      if (validCandidates.length === 0) {
        console.warn('⚠️ PHASE 2: No valid candidate stops available');
        return [];
      }

      // PHASE 4: Calculate total distance with error handling
      console.log(`📏 PHASE 4: Calculating total distance between validated stops`);
      const distanceValidation = DistanceCalculationService.validateDistanceInputs(startStop, endStop);
      
      if (!distanceValidation.isValid) {
        console.error('❌ PHASE 4: Cannot calculate distance between start and end:', distanceValidation.errors);
        return [];
      }

      const totalDistance = DistanceCalculationService.calculateDistanceBetweenObjects(startStop, endStop);
      
      if (totalDistance === 0) {
        console.error('❌ PHASE 4: Total distance calculation returned 0');
        return [];
      }

      console.log(`📏 PHASE 4: Total distance validated: ${totalDistance.toFixed(1)} miles`);

      const routeStops: TripStop[] = [];
      const maxDeviation = 100; // Maximum miles deviation from direct route

      // PHASE 4: Process each candidate with comprehensive error handling
      for (const candidate of validCandidates) {
        try {
          // Skip if it's the start or end stop
          if (candidate.id === startStop.id || candidate.id === endStop.id) {
            console.log(`🔍 PHASE 4: Skipping endpoint: ${candidate.name}`);
            continue;
          }

          // PHASE 4: Validate candidate before distance calculations
          const candidateValidation = DistanceCalculationService.validateDistanceInputs(startStop, candidate);
          if (!candidateValidation.isValid) {
            console.warn(`⚠️ PHASE 4: Skipping invalid candidate ${candidate.name}:`, candidateValidation.errors);
            continue;
          }

          const endCandidateValidation = DistanceCalculationService.validateDistanceInputs(candidate, endStop);
          if (!endCandidateValidation.isValid) {
            console.warn(`⚠️ PHASE 4: Skipping candidate ${candidate.name} (invalid for end calculation):`, endCandidateValidation.errors);
            continue;
          }

          // Calculate distances with validated inputs
          const distanceToCandidate = DistanceCalculationService.calculateDistanceBetweenObjects(startStop, candidate);
          const distanceFromCandidateToEnd = DistanceCalculationService.calculateDistanceBetweenObjects(candidate, endStop);

          // PHASE 4: Validate distance calculations
          if (distanceToCandidate === 0 || distanceFromCandidateToEnd === 0) {
            console.warn(`⚠️ PHASE 4: Zero distance calculated for ${candidate.name}, skipping`);
            continue;
          }

          // Check if candidate is roughly along the route
          const totalThroughCandidate = distanceToCandidate + distanceFromCandidateToEnd;
          const deviation = totalThroughCandidate - totalDistance;

          console.log(`📏 PHASE 4: Distance analysis for ${candidate.name}:`, {
            toCandidate: distanceToCandidate.toFixed(1),
            fromCandidateToEnd: distanceFromCandidateToEnd.toFixed(1),
            totalThrough: totalThroughCandidate.toFixed(1),
            directDistance: totalDistance.toFixed(1),
            deviation: deviation.toFixed(1)
          });

          if (deviation <= maxDeviation) {
            routeStops.push(candidate);
            console.log(`✅ PHASE 4: ${candidate.name} is along route (deviation: ${deviation.toFixed(1)} miles)`);
          } else {
            console.log(`🚫 PHASE 4: ${candidate.name} deviates too much (${deviation.toFixed(1)} miles)`);
          }

        } catch (error) {
          // PHASE 3: Catch and handle individual candidate processing errors
          console.error(`❌ PHASE 3: Error processing candidate ${candidate.name}:`, {
            error: error instanceof Error ? error.message : 'Unknown error',
            candidate: candidate.name,
            stack: error instanceof Error ? error.stack : 'No stack trace'
          });
          continue; // Skip this candidate and continue with others
        }
      }

      console.log(`🛤️ PHASE 5: Route filtering completed - found ${routeStops.length} valid stops along route`);
      return routeStops;

    } catch (error) {
      // PHASE 3: Top-level error boundary
      console.error('❌ PHASE 3: Critical error in route filtering:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        startStopName: startStop?.name || 'undefined',
        endStopName: endStop?.name || 'undefined',
        candidateCount: candidateStops?.length || 0,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      return []; // Return empty array instead of crashing
    }
  }
}
