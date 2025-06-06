
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { CityDisplayService } from '../utils/CityDisplayService';

export interface SegmentDestination {
  stop: TripStop;
  score: number;
  isOfficialDestination: boolean;
  distanceFromStart: number;
  distanceToEnd: number;
  driveTimeFromCurrent: number;
}

export class SegmentDestinationPlanner {
  private static readonly AVG_SPEED_MPH = 50;
  private static readonly IDEAL_DRIVE_TIME = 6;
  private static readonly MIN_DRIVE_TIME = 3;
  private static readonly MAX_DRIVE_TIME = 8;

  /**
   * Select optimal destinations for daily segments, prioritizing official destination cities
   */
  static selectDailyDestinations(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    totalDays: number
  ): TripStop[] {
    console.log(`🎯 SegmentDestinationPlanner: Selecting destinations for ${totalDays} days`);

    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    console.log(`📏 Total distance: ${totalDistance.toFixed(0)} miles`);

    // Separate official destination cities from other stops
    const officialDestinations = allStops.filter(stop => 
      stop.category === 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );

    const otherStops = allStops.filter(stop => 
      stop.category !== 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );

    console.log(`🏙️ Found ${officialDestinations.length} official destination cities`);
    console.log(`📍 Found ${otherStops.length} other stops available`);

    const selectedDestinations: TripStop[] = [];
    let currentStop = startStop;
    const targetDailyDistance = totalDistance / totalDays;

    // Select destinations for each intermediate day
    for (let day = 1; day < totalDays; day++) {
      const targetDistanceFromStart = targetDailyDistance * day;
      
      console.log(`📅 Day ${day + 1}: Looking for destination around ${targetDistanceFromStart.toFixed(0)} miles from start`);

      const candidateDestination = this.selectBestDestinationForDay(
        currentStop,
        endStop,
        officialDestinations,
        otherStops,
        selectedDestinations,
        targetDistanceFromStart
      );

      if (candidateDestination) {
        selectedDestinations.push(candidateDestination);
        currentStop = candidateDestination;
        
        console.log(`✅ Selected ${candidateDestination.name} (${candidateDestination.category}) in ${CityDisplayService.getCityDisplayName(candidateDestination)}`);
      } else {
        console.log(`⚠️ No suitable destination found for day ${day + 1}`);
        break;
      }
    }

    console.log(`🎯 Final selection: ${selectedDestinations.length} destinations for ${totalDays} days`);
    return selectedDestinations;
  }

  /**
   * Select the best destination for a specific day
   */
  private static selectBestDestinationForDay(
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
      
      if (scored && this.validateGeographicProgression(currentStop, destination, endStop)) {
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
        
        if (scored && this.validateGeographicProgression(currentStop, stop, endStop)) {
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

  /**
   * Score a destination candidate based on multiple factors
   */
  private static scoreDestinationCandidate(
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
    const positionScore = Math.max(0, 100 - Math.abs(distanceFromStart - targetDistanceFromStart));

    // Drive time score - prefer optimal drive times
    const driveTimeScore = this.calculateDriveTimeScore(driveTimeFromCurrent);

    // Official destination bonus
    const officialBonus = isOfficialDestination ? 50 : 0;

    // Category bonus for non-official destinations
    const categoryBonus = !isOfficialDestination ? this.getCategoryBonus(candidate.category) : 0;

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
   * Calculate drive time score based on optimal ranges
   */
  private static calculateDriveTimeScore(driveTimeHours: number): number {
    if (driveTimeHours < this.MIN_DRIVE_TIME) {
      // Too short - penalize
      return Math.max(0, 20 - (this.MIN_DRIVE_TIME - driveTimeHours) * 10);
    } else if (driveTimeHours > this.MAX_DRIVE_TIME) {
      // Too long - penalize heavily
      return Math.max(0, 20 - (driveTimeHours - this.MAX_DRIVE_TIME) * 15);
    } else {
      // In acceptable range - score based on proximity to ideal
      const deviation = Math.abs(driveTimeHours - this.IDEAL_DRIVE_TIME);
      return Math.max(0, 30 - deviation * 10);
    }
  }

  /**
   * Get category bonus for non-official destinations
   */
  private static getCategoryBonus(category: string): number {
    switch (category) {
      case 'route66_waypoint':
        return 20;
      case 'attraction':
        return 15;
      case 'historic_site':
        return 10;
      case 'hidden_gem':
        return 5;
      default:
        return 0;
    }
  }

  /**
   * Validate geographic progression toward final destination
   */
  private static validateGeographicProgression(
    currentStop: TripStop,
    candidateStop: TripStop,
    finalDestination: TripStop
  ): boolean {
    const currentToFinal = DistanceCalculationService.calculateDistance(
      currentStop.latitude, currentStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    const candidateToFinal = DistanceCalculationService.calculateDistance(
      candidateStop.latitude, candidateStop.longitude,
      finalDestination.latitude, finalDestination.longitude
    );

    // Ensure we're getting closer to the final destination
    const isProgressing = candidateToFinal < currentToFinal;
    
    if (!isProgressing) {
      console.log(`⚠️ ${candidateStop.name} rejected - not progressing toward destination`);
    }
    
    return isProgressing;
  }

  /**
   * Get summary of destination selection strategy
   */
  static getSelectionSummary(destinations: TripStop[]): string {
    const officialCount = destinations.filter(d => d.category === 'destination_city').length;
    const otherCount = destinations.length - officialCount;
    
    return `Selected ${destinations.length} destinations: ${officialCount} official cities, ${otherCount} other stops`;
  }
}
