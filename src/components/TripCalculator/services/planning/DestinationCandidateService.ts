
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { ScoreCalculationService } from './ScoreCalculationService';
import { GeographicValidationService } from './GeographicValidationService';

export interface SegmentDestination {
  stop: TripStop;
  score: number;
  isOfficialDestination: boolean;
  distanceFromStart: number;
  distanceToEnd: number;
  driveTimeFromCurrent: number;
}

export class DestinationCandidateService {
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Score a destination candidate based on multiple factors
   */
  static scoreDestinationCandidate(
    currentStop: TripStop,
    endStop: TripStop,
    candidate: TripStop,
    targetDistanceFromStart: number,
    isOfficialDestination: boolean
  ): SegmentDestination | null {
    const distanceFromStart = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      candidate.latitude, candidate.longitude
    );

    const distanceToEnd = DistanceCalculationService.calculateDistance(
      candidate.latitude, candidate.longitude,
      endStop.latitude, endStop.longitude
    );

    const driveTimeFromCurrent = distanceFromStart / this.AVG_SPEED_MPH;

    // Position score - how close to target distance
    const positionScore = ScoreCalculationService.calculatePositionScore(distanceFromStart, targetDistanceFromStart);

    // Drive time score - prefer optimal drive times
    const driveTimeScore = ScoreCalculationService.calculateDriveTimeScore(driveTimeFromCurrent);

    // Official destination bonus
    const officialBonus = isOfficialDestination ? 50 : 0;

    // Category bonus for non-official destinations
    const categoryBonus = !isOfficialDestination ? ScoreCalculationService.getCategoryBonus(candidate.category) : 0;

    const totalScore = positionScore + driveTimeScore + officialBonus + categoryBonus;

    return {
      stop: candidate,
      score: totalScore,
      isOfficialDestination,
      distanceFromStart,
      distanceToEnd,
      driveTimeFromCurrent
    };
  }

  /**
   * Select the best destination for a specific day
   */
  static selectBestDestinationForDay(
    currentStop: TripStop,
    endStop: TripStop,
    officialDestinations: TripStop[],
    otherStops: TripStop[],
    alreadySelected: TripStop[],
    targetDistanceFromStart: number
  ): TripStop | null {
    // Filter out already selected destinations
    const availableOfficials = officialDestinations.filter(dest => 
      !alreadySelected.some(selected => selected.id === dest.id)
    );
    
    const availableOthers = otherStops.filter(stop => 
      !alreadySelected.some(selected => selected.id === stop.id)
    );

    // Score all candidates
    const scoredCandidates: SegmentDestination[] = [];

    // Score official destination cities (higher priority)
    for (const destination of availableOfficials) {
      const scored = this.scoreDestinationCandidate(
        currentStop,
        endStop,
        destination,
        targetDistanceFromStart,
        true
      );
      
      if (scored && GeographicValidationService.validateGeographicProgression(currentStop, destination, endStop)) {
        scoredCandidates.push(scored);
      }
    }

    // Only consider other stops if no good official destinations are found
    if (scoredCandidates.length === 0) {
      console.log(`⚠️ No suitable official destinations found, considering other stops`);
      
      for (const stop of availableOthers) {
        const scored = this.scoreDestinationCandidate(
          currentStop,
          endStop,
          stop,
          targetDistanceFromStart,
          false
        );
        
        if (scored && GeographicValidationService.validateGeographicProgression(currentStop, stop, endStop)) {
          scoredCandidates.push(scored);
        }
      }
    }

    // Sort by score (higher is better) and return the best
    scoredCandidates.sort((a, b) => b.score - a.score);

    if (scoredCandidates.length > 0) {
      const best = scoredCandidates[0];
      console.log(`🏆 Best candidate: ${best.stop.name} (score: ${best.score.toFixed(1)}, official: ${best.isOfficialDestination})`);
      return best.stop;
    }

    return null;
  }
}
