import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget } from './DriveTimeBalancingService';

export interface BalancingSegment {
  startStop: TripStop;
  endStop: TripStop;
  distance: number;
  driveTimeHours: number;
  isFixed?: boolean;
}

export interface RedistributionAction {
  type: 'extend' | 'shorten' | 'swap';
  fromDay: number;
  toDay: number;
  newDestination?: TripStop;
  timeTransfer: number;
}

export class DriveTimeRedistributionService {
  private static readonly AVG_SPEED_MPH = 50;
  private static readonly MIN_TRANSFER_HOURS = 0.5;

  /**
   * Redistribute drive times to achieve better balance
   */
  static redistributeDriveTimes(
    segments: BalancingSegment[],
    availableStops: TripStop[],
    driveTimeTargets: DriveTimeTarget[]
  ): { segments: BalancingSegment[]; actions: RedistributionAction[] } {
    console.log('🔄 Starting drive time redistribution');
    
    const redistributedSegments = [...segments];
    const actions: RedistributionAction[] = [];
    
    // Identify segments that need adjustment
    const adjustments = this.identifyAdjustmentNeeds(segments, driveTimeTargets);
    
    for (const adjustment of adjustments) {
      const action = this.findBestRedistributionAction(
        redistributedSegments,
        availableStops,
        driveTimeTargets,
        adjustment
      );
      
      if (action && this.applyRedistributionAction(redistributedSegments, action, availableStops)) {
        actions.push(action);
        console.log(`✅ Applied redistribution: ${action.type} from day ${action.fromDay} to day ${action.toDay}`);
      }
    }
    
    console.log(`🎯 Redistribution complete: ${actions.length} actions applied`);
    return { segments: redistributedSegments, actions };
  }

  /**
   * Identify which segments need drive time adjustments
   */
  private static identifyAdjustmentNeeds(
    segments: BalancingSegment[],
    driveTimeTargets: DriveTimeTarget[]
  ): Array<{ day: number; currentTime: number; targetTime: number; deficit: number }> {
    const adjustments = [];
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const target = driveTimeTargets[i];
      const deficit = target.targetHours - segment.driveTimeHours;
      
      // Only consider significant deficits
      if (Math.abs(deficit) > this.MIN_TRANSFER_HOURS) {
        adjustments.push({
          day: i + 1,
          currentTime: segment.driveTimeHours,
          targetTime: target.targetHours,
          deficit
        });
      }
    }
    
    // Sort by deficit magnitude (largest first)
    adjustments.sort((a, b) => Math.abs(b.deficit) - Math.abs(a.deficit));
    
    return adjustments;
  }

  /**
   * Find the best redistribution action for an adjustment
   */
  private static findBestRedistributionAction(
    segments: BalancingSegment[],
    availableStops: TripStop[],
    driveTimeTargets: DriveTimeTarget[],
    adjustment: { day: number; deficit: number }
  ): RedistributionAction | null {
    const segmentIndex = adjustment.day - 1;
    const segment = segments[segmentIndex];
    
    if (segment.isFixed) return null;
    
    // If segment is too short, try to extend it
    if (adjustment.deficit > 0) {
      return this.findExtensionAction(segment, availableStops, adjustment.deficit, segmentIndex);
    }
    
    // If segment is too long, try to shorten it
    if (adjustment.deficit < 0) {
      return this.findShorteningAction(segment, availableStops, Math.abs(adjustment.deficit), segmentIndex);
    }
    
    return null;
  }

  /**
   * Find action to extend a segment's drive time
   */
  private static findExtensionAction(
    segment: BalancingSegment,
    availableStops: TripStop[],
    neededHours: number,
    dayIndex: number
  ): RedistributionAction | null {
    const neededDistance = neededHours * this.AVG_SPEED_MPH;
    const currentDistance = segment.distance;
    const targetDistance = currentDistance + neededDistance;
    
    // Find stops that would create a segment closer to target distance
    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;
    
    for (const stop of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        segment.startStop.latitude, segment.startStop.longitude,
        stop.latitude, stop.longitude
      );
      
      if (distance <= currentDistance) continue; // Must be longer
      
      const score = Math.abs(distance - targetDistance);
      
      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }
    
    if (bestStop) {
      const newDistance = DistanceCalculationService.calculateDistance(
        segment.startStop.latitude, segment.startStop.longitude,
        bestStop.latitude, bestStop.longitude
      );
      
      return {
        type: 'extend',
        fromDay: dayIndex + 1,
        toDay: dayIndex + 1,
        newDestination: bestStop,
        timeTransfer: (newDistance - currentDistance) / this.AVG_SPEED_MPH
      };
    }
    
    return null;
  }

  /**
   * Find action to shorten a segment's drive time
   */
  private static findShorteningAction(
    segment: BalancingSegment,
    availableStops: TripStop[],
    excessHours: number,
    dayIndex: number
  ): RedistributionAction | null {
    const excessDistance = excessHours * this.AVG_SPEED_MPH;
    const currentDistance = segment.distance;
    const targetDistance = currentDistance - excessDistance;
    
    // Find stops that would create a segment closer to target distance
    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;
    
    for (const stop of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        segment.startStop.latitude, segment.startStop.longitude,
        stop.latitude, stop.longitude
      );
      
      if (distance >= currentDistance) continue; // Must be shorter
      
      const score = Math.abs(distance - targetDistance);
      
      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }
    
    if (bestStop) {
      const newDistance = DistanceCalculationService.calculateDistance(
        segment.startStop.latitude, segment.startStop.longitude,
        bestStop.latitude, bestStop.longitude
      );
      
      return {
        type: 'shorten',
        fromDay: dayIndex + 1,
        toDay: dayIndex + 1,
        newDestination: bestStop,
        timeTransfer: (currentDistance - newDistance) / this.AVG_SPEED_MPH
      };
    }
    
    return null;
  }

  /**
   * Apply a redistribution action to segments
   */
  private static applyRedistributionAction(
    segments: BalancingSegment[],
    action: RedistributionAction,
    availableStops: TripStop[]
  ): boolean {
    const segmentIndex = action.fromDay - 1;
    
    if (!action.newDestination || segmentIndex >= segments.length) {
      return false;
    }
    
    // Update the segment
    const newDistance = DistanceCalculationService.calculateDistance(
      segments[segmentIndex].startStop.latitude,
      segments[segmentIndex].startStop.longitude,
      action.newDestination.latitude,
      action.newDestination.longitude
    );
    
    // Remove old destination from available stops if it was being used
    const oldDestination = segments[segmentIndex].endStop;
    const oldIndex = availableStops.findIndex(s => s.id === oldDestination.id);
    if (oldIndex === -1) {
      availableStops.push(oldDestination);
    }
    
    // Remove new destination from available stops
    const newIndex = availableStops.findIndex(s => s.id === action.newDestination!.id);
    if (newIndex > -1) {
      availableStops.splice(newIndex, 1);
    }
    
    // Update segment
    segments[segmentIndex] = {
      ...segments[segmentIndex],
      endStop: action.newDestination,
      distance: newDistance,
      driveTimeHours: newDistance / this.AVG_SPEED_MPH
    };
    
    // Update next segment's start if not the last segment
    if (segmentIndex < segments.length - 1) {
      segments[segmentIndex + 1].startStop = action.newDestination;
    }
    
    return true;
  }
}
