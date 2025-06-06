
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { ScoreCalculationService } from './ScoreCalculationService';
import { GeographicValidationService } from './GeographicValidationService';
import { DestinationCityValidator } from './DestinationCityValidator';
import { DriveTimeTarget, DriveTimeConstraints } from './DriveTimeConstraints';

export interface SegmentDestination {
  stop: TripStop;
  score: number;
  isOfficialDestination: boolean;
  distanceFromStart: number;
  distanceToEnd: number;
  driveTimeFromCurrent: number;
  driveTimeValidation: any;
}

export class DestinationCandidateService {
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Score a destination candidate with enhanced validation
   */
  static scoreDestinationCandidate(
    currentStop: TripStop,
    endStop: TripStop,
    candidate: TripStop,
    targetDistanceFromStart: number,
    isOfficialDestination: boolean,
    driveTimeTarget?: DriveTimeTarget
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

    // Validate drive time constraints
    const driveTimeValidation = DriveTimeConstraints.validateDriveTime(driveTimeFromCurrent);
    
    // If drive time target is provided, check compatibility
    if (driveTimeTarget) {
      if (driveTimeFromCurrent < driveTimeTarget.minHours || 
          driveTimeFromCurrent > driveTimeTarget.maxHours) {
        console.log(`⚠️ ${candidate.name} outside drive time target: ${driveTimeFromCurrent.toFixed(1)}h (target: ${driveTimeTarget.minHours.toFixed(1)}-${driveTimeTarget.maxHours.toFixed(1)}h)`);
        return null;
      }
    }

    // Position score - how close to target distance
    const positionScore = ScoreCalculationService.calculatePositionScore(distanceFromStart, targetDistanceFromStart);

    // Drive time score - prefer optimal drive times
    const driveTimeScore = ScoreCalculationService.calculateDriveTimeScore(driveTimeFromCurrent);

    // Enhanced destination city scoring
    let officialBonus = 0;
    if (isOfficialDestination) {
      const importanceScore = DestinationCityValidator.getDestinationImportanceScore(candidate);
      officialBonus = importanceScore; // Use importance score directly
    }

    // Category bonus for non-official destinations
    const categoryBonus = !isOfficialDestination ? ScoreCalculationService.getCategoryBonus(candidate.category) : 0;

    // Geographic progression bonus
    const currentToFinalDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      endStop.latitude, endStop.longitude
    );
    const progressRatio = distanceFromStart / currentToFinalDistance;
    const isMovingToward = distanceToEnd < currentToFinalDistance;
    const progressionBonus = ScoreCalculationService.calculateProgressionBonus(progressRatio, isMovingToward);

    // Drive time target alignment bonus
    let targetAlignmentBonus = 0;
    if (driveTimeTarget) {
      const targetDiff = Math.abs(driveTimeFromCurrent - driveTimeTarget.targetHours);
      targetAlignmentBonus = Math.max(0, 25 - (targetDiff * 10));
    }

    const totalScore = positionScore + driveTimeScore + officialBonus + categoryBonus + progressionBonus + targetAlignmentBonus;

    return {
      stop: candidate,
      score: totalScore,
      isOfficialDestination,
      distanceFromStart,
      distanceToEnd,
      driveTimeFromCurrent,
      driveTimeValidation
    };
  }

  /**
   * Select the best destination for a specific day with enhanced constraints
   */
  static selectBestDestinationForDay(
    currentStop: TripStop,
    endStop: TripStop,
    officialDestinations: TripStop[],
    otherStops: TripStop[],
    alreadySelected: TripStop[],
    targetDistanceFromStart: number,
    driveTimeTarget?: DriveTimeTarget
  ): TripStop | null {
    // Add comprehensive null safety checks
    if (!currentStop || !endStop) {
      console.log('⚠️ Current or end stop is null/undefined');
      return null;
    }

    if (!officialDestinations) officialDestinations = [];
    if (!otherStops) otherStops = [];
    if (!alreadySelected) alreadySelected = [];

    // Filter and validate destination cities
    const availableOfficials = officialDestinations
      .filter(dest => dest && !alreadySelected.some(selected => selected && selected.id === dest.id))
      .filter(dest => DestinationCityValidator.isValidDestinationCity(dest));
    
    const availableOthers = otherStops.filter(stop => 
      stop && !alreadySelected.some(selected => selected && selected.id === stop.id)
    );

    console.log(`🔍 Evaluating ${availableOfficials.length} validated destination cities and ${availableOthers.length} other stops`);

    // Score all candidates
    const scoredCandidates: SegmentDestination[] = [];

    // Score validated destination cities first (highest priority)
    for (const destination of availableOfficials) {
      if (!destination) continue;
      
      const scored = this.scoreDestinationCandidate(
        currentStop,
        endStop,
        destination,
        targetDistanceFromStart,
        true,
        driveTimeTarget
      );
      
      if (scored && GeographicValidationService.validateGeographicProgression(currentStop, destination, endStop)) {
        scoredCandidates.push(scored);
        console.log(`🏙️ Validated city ${destination.name}: score ${scored.score.toFixed(1)}, drive ${scored.driveTimeFromCurrent.toFixed(1)}h`);
      }
    }

    // Only consider other stops if no good destination cities are found
    if (scoredCandidates.length === 0) {
      console.log(`⚠️ No suitable destination cities found, considering other stops`);
      
      for (const stop of availableOthers) {
        if (!stop) continue;
        
        const scored = this.scoreDestinationCandidate(
          currentStop,
          endStop,
          stop,
          targetDistanceFromStart,
          false,
          driveTimeTarget
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
      console.log(`🏆 Best candidate: ${best.stop.name} (score: ${best.score.toFixed(1)}, official: ${best.isOfficialDestination}, drive: ${best.driveTimeFromCurrent.toFixed(1)}h)`);
      return best.stop;
    }

    // Enhanced fallback with constraint awareness
    console.log(`⚠️ No suitable candidates found with constraints, using constraint-aware fallback`);
    
    // Try to find any destination city that meets basic drive time constraints
    const fallbackDestination = availableOfficials.find(dest => {
      if (!dest) return false;
      const driveTime = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dest.latitude, dest.longitude
      ) / this.AVG_SPEED_MPH;
      
      const validation = DriveTimeConstraints.validateDriveTime(driveTime);
      return validation.isValid;
    });
    
    if (fallbackDestination) {
      console.log(`🔄 Using constraint-aware fallback: ${fallbackDestination.name}`);
      return fallbackDestination;
    }

    // Last resort - return end stop
    console.log(`🚨 Last resort: using end stop as destination`);
    return endStop;
  }
}
