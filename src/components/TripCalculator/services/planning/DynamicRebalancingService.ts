
import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { DailySegment } from './DailySegmentCreator';
import { DriveTimeTarget } from './DriveTimeBalancingService';
import { DestinationSelectionByDriveTime } from './DestinationSelectionByDriveTime';

export interface RebalancingResult {
  rebalancedSegments: DailySegment[];
  wasRebalanced: boolean;
  actions: string[];
  newTotalDays?: number;
}

export class DynamicRebalancingService {
  private static readonly MAX_DRIVE_TIME_HOURS = 8;
  private static readonly MIN_DRIVE_TIME_HOURS = 2;
  private static readonly SEVERE_IMBALANCE_THRESHOLD = 4; // hours difference

  /**
   * Detect and correct severe drive time imbalances
   */
  static rebalanceSevereDriveTimeImbalances(
    segments: DailySegment[],
    availableStops: TripStop[],
    driveTimeTargets: DriveTimeTarget[],
    startStop: TripStop,
    endStop: TripStop
  ): RebalancingResult {
    console.log('🔄 Detecting severe drive time imbalances');
    
    const actions: string[] = [];
    let rebalancedSegments = [...segments];
    let wasRebalanced = false;

    // Calculate current drive time statistics
    const driveTimes = segments.map(s => s.driveTimeHours);
    const maxTime = Math.max(...driveTimes);
    const minTime = Math.min(...driveTimes);
    const imbalance = maxTime - minTime;

    console.log(`📊 Current imbalance: ${imbalance.toFixed(1)}h (max: ${maxTime.toFixed(1)}h, min: ${minTime.toFixed(1)}h)`);

    // Check for severe imbalance
    if (imbalance > this.SEVERE_IMBALANCE_THRESHOLD) {
      console.log(`⚠️ Severe imbalance detected (${imbalance.toFixed(1)}h > ${this.SEVERE_IMBALANCE_THRESHOLD}h threshold)`);
      
      // Strategy 1: Try to redistribute existing segments
      const redistributedResult = this.redistributeSegments(rebalancedSegments, availableStops, startStop, endStop);
      
      if (redistributedResult.wasImproved) {
        rebalancedSegments = redistributedResult.segments;
        actions.push(...redistributedResult.actions);
        wasRebalanced = true;
        console.log('✅ Redistribution improved balance');
      } else {
        // Strategy 2: Add an extra day if segments are too long
        const hasExcessiveDriving = driveTimes.some(time => time > this.MAX_DRIVE_TIME_HOURS);
        
        if (hasExcessiveDriving && segments.length < 7) { // Max 7 days
          console.log('🔄 Adding extra day to reduce excessive driving');
          const extraDayResult = this.addExtraDay(rebalancedSegments, availableStops, startStop, endStop);
          
          if (extraDayResult.success) {
            rebalancedSegments = extraDayResult.segments;
            actions.push('Added extra day to balance drive times');
            wasRebalanced = true;
          }
        }
      }
    }

    // Final validation
    const finalDriveTimes = rebalancedSegments.map(s => s.driveTimeHours);
    const finalImbalance = Math.max(...finalDriveTimes) - Math.min(...finalDriveTimes);
    
    console.log(`🎯 Final imbalance: ${finalImbalance.toFixed(1)}h (improved: ${imbalance > finalImbalance})`);

    return {
      rebalancedSegments,
      wasRebalanced,
      actions,
      newTotalDays: rebalancedSegments.length
    };
  }

  /**
   * Redistribute segments to improve balance
   */
  private static redistributeSegments(
    segments: DailySegment[],
    availableStops: TripStop[],
    startStop: TripStop,
    endStop: TripStop
  ): { segments: DailySegment[]; wasImproved: boolean; actions: string[] } {
    console.log('🔄 Attempting segment redistribution');
    
    const actions: string[] = [];
    let improvedSegments = [...segments];
    let wasImproved = false;

    // Find the longest segment
    const longestSegmentIndex = segments.findIndex(s => 
      s.driveTimeHours === Math.max(...segments.map(seg => seg.driveTimeHours))
    );
    
    const longestSegment = segments[longestSegmentIndex];
    
    if (longestSegment.driveTimeHours > this.MAX_DRIVE_TIME_HOURS) {
      console.log(`🎯 Redistributing longest segment: Day ${longestSegment.day} (${longestSegment.driveTimeHours.toFixed(1)}h)`);
      
      // Try to find a closer intermediate destination for this segment
      const segmentStartStop = longestSegmentIndex === 0 ? startStop : 
        this.findStopByName(improvedSegments[longestSegmentIndex - 1].endCity, availableStops);
      
      if (segmentStartStop) {
        const targetDriveTime = Math.min(longestSegment.driveTimeHours * 0.7, 6); // Reduce by 30% or to 6h max
        
        const betterDestination = this.findBetterDestination(
          segmentStartStop,
          availableStops,
          targetDriveTime
        );
        
        if (betterDestination) {
          // Update the segment with the better destination
          const newDistance = DistanceCalculationService.calculateDistance(
            segmentStartStop.latitude, segmentStartStop.longitude,
            betterDestination.latitude, betterDestination.longitude
          );
          
          improvedSegments[longestSegmentIndex] = {
            ...longestSegment,
            endCity: betterDestination.name,
            approximateMiles: Math.round(newDistance),
            driveTimeHours: Math.round((newDistance / 50) * 10) / 10
          };
          
          actions.push(`Shortened Day ${longestSegment.day} to ${betterDestination.name}`);
          wasImproved = true;
        }
      }
    }

    return { segments: improvedSegments, wasImproved, actions };
  }

  /**
   * Add an extra day to reduce excessive driving
   */
  private static addExtraDay(
    segments: DailySegment[],
    availableStops: TripStop[],
    startStop: TripStop,
    endStop: TripStop
  ): { segments: DailySegment[]; success: boolean } {
    console.log('➕ Adding extra day to rebalance trip');
    
    // Find where to split the longest segment
    const longestSegmentIndex = segments.findIndex(s => 
      s.driveTimeHours === Math.max(...segments.map(seg => seg.driveTimeHours))
    );
    
    const longestSegment = segments[longestSegmentIndex];
    
    // Try to find intermediate destinations using geographic progression
    const intermediateDestinations = DestinationSelectionByDriveTime.findIntermediateDestinations(
      startStop,
      endStop,
      availableStops,
      segments.length + 1
    );
    
    if (intermediateDestinations.length >= segments.length) {
      // Rebuild segments with the new intermediate destinations
      const newSegments: DailySegment[] = [];
      let currentStop = startStop;
      
      for (let day = 1; day <= segments.length + 1; day++) {
        const isLastDay = day === segments.length + 1;
        const destination = isLastDay ? endStop : intermediateDestinations[day - 1];
        
        if (destination) {
          const distance = DistanceCalculationService.calculateDistance(
            currentStop.latitude, currentStop.longitude,
            destination.latitude, destination.longitude
          );
          
          newSegments.push({
            day,
            title: `Day ${day}: ${currentStop.name} to ${destination.name}`,
            startCity: currentStop.name,
            endCity: destination.name,
            approximateMiles: Math.round(distance),
            recommendedStops: [],
            driveTimeHours: Math.round((distance / 50) * 10) / 10,
            subStopTimings: []
          });
          
          currentStop = destination;
        }
      }
      
      return { segments: newSegments, success: true };
    }
    
    return { segments, success: false };
  }

  /**
   * Find a better destination with target drive time
   */
  private static findBetterDestination(
    currentStop: TripStop,
    availableStops: TripStop[],
    targetDriveTimeHours: number
  ): TripStop | null {
    const targetDistance = targetDriveTimeHours * 50; // 50 mph average
    
    let bestStop: TripStop | null = null;
    let bestScore = Number.MAX_VALUE;
    
    // Prioritize destination cities
    const destinationCities = availableStops.filter(stop => stop.category === 'destination_city');
    const candidateStops = destinationCities.length > 0 ? destinationCities : availableStops;
    
    for (const stop of candidateStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );
      
      const score = Math.abs(distance - targetDistance);
      
      if (score < bestScore) {
        bestScore = score;
        bestStop = stop;
      }
    }
    
    return bestStop;
  }

  /**
   * Find stop by name in available stops
   */
  private static findStopByName(name: string, stops: TripStop[]): TripStop | null {
    return stops.find(stop => stop.name === name) || null;
  }
}
