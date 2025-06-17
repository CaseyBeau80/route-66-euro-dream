import { TripStop } from '../../../types/TripStop';
import { DistanceCalculationService } from '../../utils/DistanceCalculationService';
import { CanonicalRoute66Cities } from '../CanonicalRoute66Cities';

export class DestinationSelectionStrategy {
  /**
   * Progressive selection that validates each step to prevent long segments
   */
  static selectOptimalDestinationsProgressive(
    startStop: TripStop,
    endStop: TripStop,
    availableCities: TripStop[],
    neededDestinations: number,
    maxDailyDriveHours: number
  ): TripStop[] {
    const selectedDestinations: TripStop[] = [];
    let currentStop = startStop;

    // Calculate target distance per segment
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    const targetDistancePerSegment = totalDistance / (neededDestinations + 1);

    console.log(`🎯 PROGRESSIVE SELECTION: Target ${targetDistancePerSegment.toFixed(0)}mi per segment`);

    for (let segmentIndex = 0; segmentIndex < neededDestinations; segmentIndex++) {
      const targetDistance = targetDistancePerSegment * (segmentIndex + 1);
      
      // Find cities that are within distance limits from current stop
      const validFromCurrent = availableCities.filter(city => 
        !selectedDestinations.some(selected => selected.id === city.id)
      );

      if (validFromCurrent.length === 0) {
        console.warn(`⚠️ NO VALID DESTINATIONS from ${currentStop.name} within ${maxDailyDriveHours}h limit`);
        break;
      }

      // Select the best destination for this segment
      const bestDestination = this.selectBestDestinationForSegment(
        currentStop, endStop, validFromCurrent, targetDistance
      );

      if (bestDestination) {
        selectedDestinations.push(bestDestination);
        currentStop = bestDestination;
        
        const segmentDistance = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          bestDestination.latitude, bestDestination.longitude
        );
        
        console.log(`✅ SEGMENT ${segmentIndex + 1}: ${bestDestination.name} at ${segmentDistance.toFixed(0)}mi`);
      } else {
        console.warn(`⚠️ Could not find valid destination for segment ${segmentIndex + 1}`);
        break;
      }
    }

    return selectedDestinations;
  }

  /**
   * Select the best destination for a specific segment
   */
  private static selectBestDestinationForSegment(
    currentStop: TripStop,
    endStop: TripStop,
    candidates: TripStop[],
    targetDistanceFromStart: number
  ): TripStop | null {
    let bestDestination: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;

    for (const candidate of candidates) {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        candidate.latitude, candidate.longitude
      );

      const distanceToEnd = DistanceCalculationService.calculateDistance(
        candidate.latitude, candidate.longitude,
        endStop.latitude, endStop.longitude
      );

      // Ensure geographic progression
      const currentToEndDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        endStop.latitude, endStop.longitude
      );

      if (distanceToEnd >= currentToEndDistance) {
        continue; // Not making progress toward end
      }

      // Score based on proximity to target and destination priority
      const distanceScore = Math.abs(distanceFromStart - targetDistanceFromStart);
      const canonicalInfo = CanonicalRoute66Cities.getDestinationInfo(
        candidate.city_name || candidate.name, candidate.state
      );
      const priorityBonus = canonicalInfo ? (canonicalInfo.priority * -10) : 0;

      const totalScore = distanceScore + priorityBonus;

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestDestination = candidate;
      }
    }

    return bestDestination;
  }
}
