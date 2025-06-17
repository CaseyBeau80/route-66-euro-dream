import { TripStop } from '../data/SupabaseDataService';
import { TripStyleConfig } from './TripStyleLogic';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface DriveTimeValidationResult {
  isValid: boolean;
  actualDriveTime: number;
  maxAllowed: number;
  excessTime: number;
  recommendation?: string;
}

export interface DriveTimeEnforcementResult {
  isValid: boolean;
  segments: Array<{ startStop: TripStop; endStop: TripStop }>;
  warnings: string[];
  intermediateStopsAdded: number;
}

export class DriveTimeEnforcementService {
  /**
   * CRITICAL FIX: Calculate realistic drive time with hard limits
   */
  static calculateRealisticDriveTime(distance: number): number {
    console.log(`🚗 CRITICAL FIX: Calculating drive time for ${distance.toFixed(1)} miles`);
    
    // CRITICAL: For extremely long distances (over 500 miles), cap the calculation
    if (distance > 500) {
      console.warn(`⚠️ CRITICAL FIX: Distance ${distance.toFixed(1)}mi exceeds 500mi - capping at 10 hours max`);
      return 10; // Hard cap at 10 hours
    }
    
    let avgSpeed: number;
    let bufferMultiplier: number;
    
    if (distance < 50) {
      avgSpeed = 45; // Urban/city driving
      bufferMultiplier = 1.2; // More traffic, lights
    } else if (distance < 150) {
      avgSpeed = 55; // Mixed roads
      bufferMultiplier = 1.15; // Some traffic
    } else if (distance < 300) {
      avgSpeed = 65; // Mostly highway
      bufferMultiplier = 1.1; // Light traffic
    } else {
      avgSpeed = 70; // Long highway stretches
      bufferMultiplier = 1.05; // Minimal stops
    }
    
    const baseTime = distance / avgSpeed;
    const calculatedTime = baseTime * bufferMultiplier;
    
    // CRITICAL: Never exceed 10 hours for any single day
    const finalTime = Math.min(calculatedTime, 10);
    
    console.log(`🚗 CRITICAL FIX: Drive time calculation:`, {
      distance: distance.toFixed(1),
      avgSpeed,
      bufferMultiplier,
      baseTime: baseTime.toFixed(1),
      calculatedTime: calculatedTime.toFixed(1),
      finalTime: finalTime.toFixed(1),
      wasCapped: calculatedTime > 10
    });
    
    return Math.max(finalTime, 0.5); // Minimum 30 minutes
  }

  /**
   * ENHANCED: Enforce maximum drive time per segment with automatic rebalancing
   */
  static enforceMaxDriveTimePerSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    styleConfig: TripStyleConfig
  ): DriveTimeEnforcementResult {
    console.log(`🚗 ENFORCING DRIVE TIME: ${startStop.name} → ${endStop.name}, max ${styleConfig.maxDailyDriveHours}h`);
    
    const validation = this.validateSegmentDriveTime(startStop, endStop, styleConfig);
    
    if (validation.isValid) {
      console.log(`✅ DRIVE TIME OK: ${validation.actualDriveTime.toFixed(1)}h within ${styleConfig.maxDailyDriveHours}h limit`);
      return {
        isValid: true,
        segments: [{ startStop, endStop }],
        warnings: [],
        intermediateStopsAdded: 0
      };
    }

    console.log(`❌ DRIVE TIME VIOLATION: ${validation.actualDriveTime.toFixed(1)}h exceeds ${styleConfig.maxDailyDriveHours}h limit by ${validation.excessTime.toFixed(1)}h`);
    
    // CRITICAL: For extremely long segments, force split regardless of available stops
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    if (distance > 500) {
      console.log(`🚨 CRITICAL: Distance ${distance.toFixed(1)}mi exceeds 500mi - forcing artificial split`);
      return this.forceSegmentSplit(startStop, endStop, styleConfig);
    }
    
    // Try to split the segment with intermediate stops
    const splitResult = this.splitLongSegment(startStop, endStop, availableStops, styleConfig);
    
    if (splitResult.success) {
      console.log(`✅ SEGMENT SPLIT: Created ${splitResult.segments.length} segments with ${splitResult.intermediateStopsAdded} intermediate stops`);
      return {
        isValid: true,
        segments: splitResult.segments,
        warnings: splitResult.warnings,
        intermediateStopsAdded: splitResult.intermediateStopsAdded
      };
    }

    // Fallback: Create warning but allow segment with capped drive time
    console.warn(`⚠️ DRIVE TIME FAILSAFE: Could not split segment, capping at 10h with warning`);
    return {
      isValid: false,
      segments: [{ startStop, endStop }],
      warnings: [
        `Day with ${validation.actualDriveTime.toFixed(1)} hour drive exceeds ${styleConfig.maxDailyDriveHours}h safe limit - capped at 10h`,
        'Consider extending trip duration or adding intermediate stops for safer drive times'
      ],
      intermediateStopsAdded: 0
    };
  }

  /**
   * CRITICAL: Force split extremely long segments using artificial waypoints
   */
  private static forceSegmentSplit(
    startStop: TripStop,
    endStop: TripStop,
    styleConfig: TripStyleConfig
  ): DriveTimeEnforcementResult {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const maxSegmentDistance = styleConfig.maxDailyDriveHours * 60; // Conservative 60 mph average
    const segmentsNeeded = Math.ceil(distance / maxSegmentDistance);
    
    console.log(`🔧 FORCE SPLIT: Creating ${segmentsNeeded} segments for ${distance.toFixed(1)}mi`);
    
    const artificialStops = this.createArtificialWaypoints(startStop, endStop, segmentsNeeded - 1);
    const allStops = [startStop, ...artificialStops, endStop];
    const segments = this.createSegmentsFromStops(allStops);
    
    return {
      isValid: true,
      segments,
      warnings: [`Extremely long distance split into ${segments.length} manageable driving days`],
      intermediateStopsAdded: artificialStops.length
    };
  }

  /**
   * Split a long segment into multiple segments using intermediate stops
   */
  private static splitLongSegment(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    styleConfig: TripStyleConfig
  ): {
    success: boolean;
    segments: Array<{ startStop: TripStop; endStop: TripStop }>;
    warnings: string[];
    intermediateStopsAdded: number;
  } {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const totalDriveTime = this.calculateRealisticDriveTime(totalDistance);
    const maxSegmentDistance = styleConfig.maxDailyDriveHours * 50; // Approximate miles per hour
    
    // Calculate how many segments we need
    const segmentsNeeded = Math.ceil(totalDistance / maxSegmentDistance);
    
    if (segmentsNeeded <= 1) {
      return { success: false, segments: [], warnings: [], intermediateStopsAdded: 0 };
    }

    console.log(`🔧 SPLITTING: Need ${segmentsNeeded} segments for ${totalDistance.toFixed(1)}mi (${totalDriveTime.toFixed(1)}h)`);
    
    // Find suitable intermediate stops
    const intermediateStops = this.findIntermediateStops(
      startStop,
      endStop,
      availableStops,
      segmentsNeeded - 1,
      maxSegmentDistance
    );
    
    if (intermediateStops.length === 0) {
      // Create artificial waypoints if no suitable stops found
      const artificialStops = this.createArtificialWaypoints(
        startStop,
        endStop,
        segmentsNeeded - 1
      );
      
      const segments = this.createSegmentsFromStops(
        [startStop, ...artificialStops, endStop]
      );
      
      return {
        success: true,
        segments,
        warnings: [`Created ${artificialStops.length} waypoints to manage drive time`],
        intermediateStopsAdded: artificialStops.length
      };
    }
    
    // Create segments using found intermediate stops
    const allStops = [startStop, ...intermediateStops, endStop];
    const segments = this.createSegmentsFromStops(allStops);
    
    // Validate all segments meet drive time requirements
    const invalidSegments = segments.filter(seg => {
      const validation = this.validateSegmentDriveTime(seg.startStop, seg.endStop, styleConfig);
      return !validation.isValid;
    });
    
    if (invalidSegments.length > 0) {
      console.warn(`⚠️ SPLIT VALIDATION: ${invalidSegments.length} segments still exceed limits`);
      return { success: false, segments: [], warnings: [], intermediateStopsAdded: 0 };
    }
    
    return {
      success: true,
      segments,
      warnings: [`Split long drive into ${segments.length} manageable segments`],
      intermediateStopsAdded: intermediateStops.length
    };
  }

  /**
   * Find suitable intermediate stops along the route
   */
  private static findIntermediateStops(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    needed: number,
    maxSegmentDistance: number
  ): TripStop[] {
    const routeDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    // Filter stops that are roughly along the route
    const candidateStops = availableStops.filter(stop => {
      const distFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        stop.latitude, stop.longitude
      );
      const distToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        endStop.latitude, endStop.longitude
      );
      
      // Stop should be reasonably along the route (not too much deviation)
      const routeDeviation = (distFromStart + distToEnd) - routeDistance;
      const isAlongRoute = routeDeviation < 50; // Within 50 miles of direct route
      
      // Stop should be at a reasonable distance for splitting
      const isGoodDistance = distFromStart > 50 && distFromStart < routeDistance - 50;
      
      return isAlongRoute && isGoodDistance;
    });
    
    // Sort by distance from start and select appropriate stops
    candidateStops.sort((a, b) => {
      const distA = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        a.latitude, a.longitude
      );
      const distB = DistanceCalculationService.calculateDistance(
        startStop.latitude, startStop.longitude,
        b.latitude, b.longitude
      );
      return distA - distB;
    });
    
    // Select stops that create reasonable segment lengths
    const selectedStops: TripStop[] = [];
    const targetIntervals = routeDistance / (needed + 1);
    
    for (let i = 1; i <= needed && candidateStops.length > 0; i++) {
      const targetDistance = targetIntervals * i;
      
      // Find stop closest to target distance
      const bestStop = candidateStops.reduce((best, stop) => {
        const stopDist = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          stop.latitude, stop.longitude
        );
        const bestDist = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          best.latitude, best.longitude
        );
        
        const stopError = Math.abs(stopDist - targetDistance);
        const bestError = Math.abs(bestDist - targetDistance);
        
        return stopError < bestError ? stop : best;
      });
      
      selectedStops.push(bestStop);
      
      // Remove selected stop and nearby stops to avoid clustering
      const removeIndex = candidateStops.findIndex(s => s.id === bestStop.id);
      if (removeIndex >= 0) {
        candidateStops.splice(removeIndex, 1);
      }
    }
    
    console.log(`🎯 INTERMEDIATE STOPS: Found ${selectedStops.length}/${needed} suitable stops`);
    return selectedStops.slice(0, needed);
  }

  /**
   * Create artificial waypoints when no suitable stops are available
   */
  private static createArtificialWaypoints(
    startStop: TripStop,
    endStop: TripStop,
    needed: number
  ): TripStop[] {
    const waypoints: TripStop[] = [];
    
    for (let i = 1; i <= needed; i++) {
      const progress = i / (needed + 1);
      
      const lat = startStop.latitude + (endStop.latitude - startStop.latitude) * progress;
      const lng = startStop.longitude + (endStop.longitude - startStop.longitude) * progress;
      
      const waypoint: TripStop = {
        id: `waypoint-${Date.now()}-${i}`,
        name: `Drive Break Point ${i}`,
        city_name: `Waypoint ${i}`,
        city: `Waypoint ${i}`,
        state: startStop.state,
        latitude: lat,
        longitude: lng,
        category: 'waypoint',
        description: `Strategic waypoint to manage drive time on Route 66`
      };
      
      waypoints.push(waypoint);
    }
    
    console.log(`🛣️ ARTIFICIAL WAYPOINTS: Created ${waypoints.length} waypoints`);
    return waypoints;
  }

  /**
   * Create segments from a sequence of stops
   */
  private static createSegmentsFromStops(
    stops: TripStop[]
  ): Array<{ startStop: TripStop; endStop: TripStop }> {
    const segments: Array<{ startStop: TripStop; endStop: TripStop }> = [];
    
    for (let i = 0; i < stops.length - 1; i++) {
      segments.push({
        startStop: stops[i],
        endStop: stops[i + 1]
      });
    }
    
    return segments;
  }

  /**
   * Validate if a segment meets drive-time requirements
   */
  static validateSegmentDriveTime(
    startStop: TripStop,
    endStop: TripStop,
    styleConfig: TripStyleConfig
  ): DriveTimeValidationResult {
    const distance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const actualDriveTime = this.calculateRealisticDriveTime(distance);
    const maxAllowed = styleConfig.maxDailyDriveHours;
    const excessTime = Math.max(0, actualDriveTime - maxAllowed);
    const isValid = actualDriveTime <= maxAllowed;

    console.log(`🚗 Drive time validation: ${startStop.name} → ${endStop.name}`, {
      distance: distance.toFixed(1),
      actualDriveTime: actualDriveTime.toFixed(1),
      maxAllowed,
      isValid,
      excessTime: excessTime.toFixed(1)
    });

    let recommendation: string | undefined;
    if (!isValid) {
      recommendation = `Consider breaking this ${actualDriveTime.toFixed(1)}h drive into multiple days or adding intermediate stops`;
    }

    return {
      isValid,
      actualDriveTime,
      maxAllowed,
      excessTime,
      recommendation
    };
  }

  /**
   * Get enforcement level based on trip style
   */
  static getEnforcementLevel(styleConfig: TripStyleConfig): 'strict' | 'moderate' | 'flexible' {
    return styleConfig.enforcementLevel || 'strict';
  }

  /**
   * Check if rebalancing is needed for trip segments
   */
  static requiresRebalancing(
    segments: Array<{ startStop: TripStop; endStop: TripStop }>,
    styleConfig: TripStyleConfig
  ): boolean {
    const enforcementLevel = this.getEnforcementLevel(styleConfig);
    
    if (enforcementLevel === 'flexible') {
      return false;
    }

    // Check if any segment violates drive-time limits
    for (const segment of segments) {
      const validation = this.validateSegmentDriveTime(
        segment.startStop,
        segment.endStop,
        styleConfig
      );
      
      if (!validation.isValid) {
        console.log(`⚠️ Rebalancing needed: ${segment.startStop.name} → ${segment.endStop.name} exceeds ${styleConfig.maxDailyDriveHours}h limit`);
        return true;
      }
    }

    return false;
  }
}
