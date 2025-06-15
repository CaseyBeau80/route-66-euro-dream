
import { TripStop } from '../../types/TripStop';
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
      officialBonus = candidate.category === 'destination_city' ? 1000 : 500;
    }

    const totalScore = positionScore + driveTimeScore - officialBonus;

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
}
