import { TripStop } from '../../types/TripStop';
import { TripStyleConfig } from './TripStyleLogic';
import { DriveTimeEnforcementService } from './DriveTimeEnforcementService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export interface BalancingResult {
  success: boolean;
  rebalancedSegments: Array<{ startStop: TripStop; endStop: TripStop }>;
  warnings: string[];
  totalDaysNeeded: number;
}

export class SegmentBalancingService {
  /**
   * Rebalance segments to meet drive-time constraints
   */
  static rebalanceSegments(
    originalSegments: Array<{ startStop: TripStop; endStop: TripStop }>,
    availableStops: TripStop[],
    styleConfig: TripStyleConfig,
    targetDays: number
  ): BalancingResult {
    console.log(`🔄 Starting segment rebalancing for ${originalSegments.length} segments, target ${targetDays} days`);
    
    const warnings: string[] = [];
    const rebalancedSegments: Array<{ startStop: TripStop; endStop: TripStop }> = [];
    
    for (const segment of originalSegments) {
      const validation = DriveTimeEnforcementService.validateSegmentDriveTime(
        segment.startStop,
        segment.endStop,
        styleConfig
      );
      
      if (validation.isValid) {
        // Segment is fine, keep as-is
        rebalancedSegments.push(segment);
        console.log(`✅ Segment OK: ${segment.startStop.name} → ${segment.endStop.name} (${validation.actualDriveTime.toFixed(1)}h)`);
      } else {
        // Segment needs splitting
        console.log(`🔨 Splitting long segment: ${segment.startStop.name} → ${segment.endStop.name} (${validation.actualDriveTime.toFixed(1)}h → max ${validation.maxAllowed}h)`);
        
        const splitResult = this.splitLongSegment(
          segment.startStop,
          segment.endStop,
          availableStops,
          styleConfig
        );
        
        if (splitResult.success) {
          rebalancedSegments.push(...splitResult.segments);
          warnings.push(...splitResult.warnings);
        } else {
          // If splitting fails, keep original but warn
          rebalancedSegments.push(segment);
          warnings.push(`Unable to split ${segment.startStop.name} → ${segment.endStop.name}. ${validation.recommendation || 'Drive time may be excessive.'}`);
        }
      }
    }
    
    const totalDaysNeeded = rebalancedSegments.length;
    const success = totalDaysNeeded <= targetDays + 2; // Allow some flexibility
    
    console.log(`🎯 Rebalancing result: ${rebalancedSegments.length} segments, success: ${success}`);
    
    return {
      success,
      rebalancedSegments,
      warnings,
      totalDaysNeeded
    };
  }

  /**
   * Split a long segment into smaller, manageable segments
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
  } {
    const warnings: string[] = [];
    
    // Find intermediate stops between start and end
    const intermediateStops = this.findIntermediateStops(
      startStop,
      endStop,
      availableStops,
      styleConfig.maxDailyDriveHours
    );
    
    if (intermediateStops.length === 0) {
      console.log(`❌ No intermediate stops found between ${startStop.name} and ${endStop.name}`);
      return {
        success: false,
        segments: [],
        warnings: [`No suitable intermediate stops found between ${startStop.name} and ${endStop.name}`]
      };
    }
    
    // Create segments using intermediate stops
    const segments: Array<{ startStop: TripStop; endStop: TripStop }> = [];
    const allStops = [startStop, ...intermediateStops, endStop];
    
    for (let i = 0; i < allStops.length - 1; i++) {
      const segmentStart = allStops[i];
      const segmentEnd = allStops[i + 1];
      
      segments.push({
        startStop: segmentStart,
        endStop: segmentEnd
      });
      
      console.log(`📍 Created segment: ${segmentStart.name} → ${segmentEnd.name}`);
    }
    
    return {
      success: true,
      segments,
      warnings
    };
  }

  /**
   * Find intermediate stops to break up a long segment
   */
  private static findIntermediateStops(
    startStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    maxDriveHours: number
  ): TripStop[] {
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );
    
    const maxDistancePerDay = maxDriveHours * 55; // 55 mph average
    const neededStops = Math.ceil(totalDistance / maxDistancePerDay) - 1;
    
    if (neededStops <= 0) {
      return [];
    }
    
    console.log(`🔍 Finding ${neededStops} intermediate stops for ${totalDistance.toFixed(1)}mi journey`);
    
    // Filter to destination cities only for better trip structure
    const destinationCities = availableStops.filter(stop => 
      stop.category === 'destination_city' &&
      stop.id !== startStop.id &&
      stop.id !== endStop.id
    );
    
    const intermediateStops: TripStop[] = [];
    
    for (let i = 1; i <= neededStops; i++) {
      const targetDistance = (totalDistance / (neededStops + 1)) * i;
      
      // Find the closest destination city to this target distance
      let bestStop: TripStop | null = null;
      let bestScore = Number.MAX_VALUE;
      
      for (const stop of destinationCities) {
        // Skip if already selected
        if (intermediateStops.some(selected => selected.id === stop.id)) {
          continue;
        }
        
        const distanceFromStart = DistanceCalculationService.calculateDistance(
          startStop.latitude, startStop.longitude,
          stop.latitude, stop.longitude
        );
        
        // Check if this stop is roughly on the path (not too far off route)
        const distanceToEnd = DistanceCalculationService.calculateDistance(
          stop.latitude, stop.longitude,
          endStop.latitude, endStop.longitude
        );
        
        const detourDistance = (distanceFromStart + distanceToEnd) - totalDistance;
        
        // Skip if this creates too much detour (more than 20% extra distance)
        if (detourDistance > totalDistance * 0.2) {
          continue;
        }
        
        const score = Math.abs(distanceFromStart - targetDistance) + (detourDistance * 0.5);
        
        if (score < bestScore) {
          bestScore = score;
          bestStop = stop;
        }
      }
      
      if (bestStop) {
        intermediateStops.push(bestStop);
        console.log(`✅ Added intermediate stop ${i}: ${bestStop.name}`);
      }
    }
    
    // Sort by distance from start to maintain proper order
    intermediateStops.sort((a, b) => {
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
    
    return intermediateStops;
  }
}
