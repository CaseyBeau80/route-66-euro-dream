
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
    // Add null safety check
    if (!currentStop || !endStop || !candidate) {
      console.log('⚠️ Null safety check failed in scoreDestinationCandidate');
      return null;
    }

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
   * Select the best destination for a specific day with enhanced null safety
   */
  static selectBestDestinationForDay(
    currentStop: TripStop,
    endStop: TripStop,
    officialDestinations: TripStop[],
    otherStops: TripStop[],
    alreadySelected: TripStop[],
    targetDistanceFromStart: number
  ): TripStop | null {
    // Add comprehensive null safety checks
    if (!currentStop || !endStop) {
      console.log('⚠️ Current or end stop is null/undefined');
      return null;
    }

    if (!officialDestinations) officialDestinations = [];
    if (!otherStops) otherStops = [];
    if (!alreadySelected) alreadySelected = [];

    // Filter out already selected destinations
    const availableOfficials = officialDestinations.filter(dest => 
      dest && !alreadySelected.some(selected => selected && selected.id === dest.id)
    );
    
    const availableOthers = otherStops.filter(stop => 
      stop && !alreadySelected.some(selected => selected && selected.id === stop.id)
    );

    // Score all candidates
    const scoredCandidates: SegmentDestination[] = [];

    // Score official destination cities (higher priority)
    for (const destination of availableOfficials) {
      if (!destination) continue;
      
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
        if (!stop) continue;
        
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

    // If no candidates found, return a safe fallback
    console.log(`⚠️ No suitable candidates found, using fallback logic`);
    
    // Try to find any destination city that's not already selected
    const fallbackDestination = officialDestinations.find(dest => 
      dest && !alreadySelected.some(selected => selected && selected.id === dest.id)
    );
    
    if (fallbackDestination) {
      console.log(`🔄 Using fallback destination: ${fallbackDestination.name}`);
      return fallbackDestination;
    }

    // Last resort - return end stop if nothing else works
    console.log(`🚨 Last resort: using end stop as destination`);
    return endStop;
  }
}
