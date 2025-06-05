
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DriveTimeTarget } from './DriveTimeBalancingService';

export interface BalancingSegment {
  startStop: TripStop;
  endStop: TripStop;
  distance: number;
  driveTimeHours: number;
  day: number;
  isFixed: boolean;
}

export interface BalancingResult {
  segments: BalancingSegment[];
  isBalanced: boolean;
  iterations: number;
  finalVariance: number;
}

export class IterativeDriveTimeBalancer {
  private static readonly MAX_ITERATIONS = 10;
  private static readonly TARGET_VARIANCE_THRESHOLD = 1.5; // hours
  private static readonly AVG_SPEED_MPH = 50;

  /**
   * Iteratively balance drive times across days
   */
  static balanceDriveTimes(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    driveTimeTargets: DriveTimeTarget[]
  ): BalancingResult {
    console.log('🔄 Starting iterative drive time balancing');
    
    let currentSegments = this.createInitialSegments(startStop, endStop, availableStops, driveTimeTargets);
    let bestSegments = [...currentSegments];
    let bestVariance = this.calculateVariance(currentSegments);
    
    console.log(`📊 Initial variance: ${bestVariance.toFixed(2)} hours`);

    for (let iteration = 0; iteration < this.MAX_ITERATIONS; iteration++) {
      console.log(`🔄 Iteration ${iteration + 1}/${this.MAX_ITERATIONS}`);
      
      const improvedSegments = this.attemptBalanceImprovement(currentSegments, availableStops, driveTimeTargets);
      const currentVariance = this.calculateVariance(improvedSegments);
      
      console.log(`📊 Current variance: ${currentVariance.toFixed(2)} hours`);
      
      if (currentVariance < bestVariance) {
        bestSegments = [...improvedSegments];
        bestVariance = currentVariance;
        console.log(`✅ Improved variance to ${bestVariance.toFixed(2)} hours`);
      }
      
      if (bestVariance <= this.TARGET_VARIANCE_THRESHOLD) {
        console.log(`🎯 Target variance achieved in ${iteration + 1} iterations`);
        break;
      }
      
      currentSegments = improvedSegments;
    }

    const isBalanced = bestVariance <= this.TARGET_VARIANCE_THRESHOLD;
    console.log(`🏁 Balancing complete: ${isBalanced ? 'BALANCED' : 'UNBALANCED'} (variance: ${bestVariance.toFixed(2)}h)`);

    return {
      segments: bestSegments,
      isBalanced,
      iterations: this.MAX_ITERATIONS,
      finalVariance: bestVariance
    };
  }

  /**
   * Create initial segments using simple distance division
   */
  private static createInitialSegments(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    driveTimeTargets: DriveTimeTarget[]
  ): BalancingSegment[] {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const targetDailyDistance = totalDistance / driveTimeTargets.length;
    const segments: BalancingSegment[] = [];
    
    let currentStop = startStop;
    let remainingDistance = totalDistance;
    
    for (let day = 0; day < driveTimeTargets.length; day++) {
      const isLastDay = day === driveTimeTargets.length - 1;
      let nextStop: TripStop;
      
      if (isLastDay) {
        nextStop = endStop;
      } else {
        // Find stop closest to target distance
        const targetDistance = Math.min(targetDailyDistance, remainingDistance * 0.8);
        nextStop = this.findOptimalStopByDistance(currentStop, availableStops, targetDistance) || endStop;
      }
      
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );
      
      segments.push({
        startStop: currentStop,
        endStop: nextStop,
        distance: segmentDistance,
        driveTimeHours: segmentDistance / this.AVG_SPEED_MPH,
        day: day + 1,
        isFixed: isLastDay
      });
      
      currentStop = nextStop;
      remainingDistance -= segmentDistance;
      
      // Remove used stop from available stops
      const usedIndex = availableStops.findIndex(s => s.id === nextStop.id);
      if (usedIndex > -1) {
        availableStops.splice(usedIndex, 1);
      }
    }
    
    return segments;
  }

  /**
   * Attempt to improve balance by swapping destinations
   */
  private static attemptBalanceImprovement(
    segments: BalancingSegment[],
    availableStops: TripStop[],
    driveTimeTargets: DriveTimeTarget[]
  ): BalancingSegment[] {
    const improvedSegments = [...segments];
    
    // Find the most unbalanced segment
    const imbalances = segments.map((segment, index) => ({
      index,
      deviation: Math.abs(segment.driveTimeHours - driveTimeTargets[index].targetHours)
    }));
    
    imbalances.sort((a, b) => b.deviation - a.deviation);
    
    // Try to improve the most unbalanced segment
    for (const { index } of imbalances.slice(0, 3)) {
      if (improvedSegments[index].isFixed) continue;
      
      const betterDestination = this.findBetterDestination(
        improvedSegments[index],
        availableStops,
        driveTimeTargets[index]
      );
      
      if (betterDestination) {
        // Update segment with better destination
        const newDistance = DistanceCalculationService.calculateDistance(
          improvedSegments[index].startStop.latitude,
          improvedSegments[index].startStop.longitude,
          betterDestination.latitude,
          betterDestination.longitude
        );
        
        improvedSegments[index] = {
          ...improvedSegments[index],
          endStop: betterDestination,
          distance: newDistance,
          driveTimeHours: newDistance / this.AVG_SPEED_MPH
        };
        
        // Update next segment's start
        if (index < improvedSegments.length - 1) {
          improvedSegments[index + 1].startStop = betterDestination;
        }
        
        break; // Only improve one segment per iteration
      }
    }
    
    return improvedSegments;
  }

  /**
   * Find better destination for a segment
   */
  private static findBetterDestination(
    segment: BalancingSegment,
    availableStops: TripStop[],
    target: DriveTimeTarget
  ): TripStop | null {
    const targetDistance = target.targetHours * this.AVG_SPEED_MPH;
    
    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;
    
    for (const stop of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        segment.startStop.latitude, segment.startStop.longitude,
        stop.latitude, stop.longitude
      );
      
      const driveTime = distance / this.AVG_SPEED_MPH;
      
      // Check if within acceptable range
      if (driveTime < target.minHours || driveTime > target.maxHours) {
        continue;
      }
      
      // Score based on how close to target
      const timeDiff = Math.abs(driveTime - target.targetHours);
      let score = timeDiff;
      
      // Bonus for destination cities
      if (stop.category === 'destination_city') {
        score -= 2.0;
      }
      
      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }
    
    return bestStop;
  }

  /**
   * Find optimal stop by target distance
   */
  private static findOptimalStopByDistance(
    currentStop: TripStop,
    availableStops: TripStop[],
    targetDistance: number
  ): TripStop | null {
    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;
    
    for (const stop of availableStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );
      
      const distanceDiff = Math.abs(distance - targetDistance);
      let score = distanceDiff;
      
      // Bonus for destination cities
      if (stop.category === 'destination_city') {
        score -= 100;
      }
      
      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }
    
    return bestStop;
  }

  /**
   * Calculate variance in drive times
   */
  private static calculateVariance(segments: BalancingSegment[]): number {
    const driveTimes = segments.map(s => s.driveTimeHours);
    const average = driveTimes.reduce((sum, time) => sum + time, 0) / driveTimes.length;
    
    const variance = driveTimes.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / driveTimes.length;
    return Math.sqrt(variance); // Return standard deviation
  }
}
