
import { TripPlan } from './TripPlanTypes';
import { DailySegment } from './TripPlanTypes';
import { SupabaseDataService } from '../data/SupabaseDataService';
import { TripBoundaryService } from './TripBoundaryService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { TripStyleConfig, TripStyleLogic } from './TripStyleLogic';
import { TripCompletionService } from './TripCompletionService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { calculateRealisticDriveTime, validateGeographicProgression } from '../../utils/distanceCalculator';
import { EnhancedHeritageCitiesService } from './EnhancedHeritageCitiesService';

export interface OrchestrationData {
  allStops: any[];
  styleConfig: TripStyleConfig;
  startStop: any;
  endStop: any;
  routeStops: any[];
  driveTimeTargets: DriveTimeTarget[];
  balanceMetrics: any;
  stopsLimited?: boolean;
  limitMessage?: string;
}

export class TripPlanningOrchestrator {
  // STRICT LIMITS - Enforced absolutely
  private static readonly MAX_STOPS_LIMIT = 8;
  private static readonly ABSOLUTE_MAX_DRIVE_HOURS = 10;
  private static readonly OPTIMAL_DAYS_PER_STOP = 1.5;

  /**
   * Orchestrate enhanced trip planning with strict constraints
   */
  static async orchestrateTripPlanning(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): Promise<OrchestrationData> {
    console.log(`🚗 ENHANCED ORCHESTRATING: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle}`);

    // FIX 0-DAY BUG: Validate and fix travel days
    const validatedTravelDays = Math.max(1, Math.floor(travelDays));
    if (validatedTravelDays !== travelDays) {
      console.warn(`⚠️ FIXED 0-DAY BUG: ${travelDays} → ${validatedTravelDays} days`);
    }

    // Load data and configure style
    const allStops = await SupabaseDataService.fetchAllStops();
    const styleConfig: TripStyleConfig = TripStyleLogic.configureTripStyle(tripStyle);

    // Find boundary stops
    const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
      startLocation,
      endLocation,
      allStops
    );

    // CRITICAL CONSTRAINT CHECKING
    const constraintCheck = this.checkCriticalConstraints(startStop, endStop, validatedTravelDays, routeStops.length);
    
    // Apply stops limitation if needed
    let finalRouteStops = routeStops;
    if (constraintCheck.shouldLimitStops) {
      console.warn(`⚠️ STOPS LIMITED: ${constraintCheck.limitMessage}`);
      finalRouteStops = this.limitStopsIntelligently(routeStops, startStop, endStop);
    }

    // Calculate drive time targets with strict enforcement
    const { driveTimeTargets, balanceMetrics } = DriveTimeBalancingService.calculateDriveTimeTargets(
      validatedTravelDays,
      styleConfig
    );

    return {
      allStops,
      styleConfig,
      startStop,
      endStop,
      routeStops: finalRouteStops,
      driveTimeTargets,
      balanceMetrics,
      stopsLimited: constraintCheck.shouldLimitStops,
      limitMessage: constraintCheck.shouldLimitStops ? constraintCheck.limitMessage : undefined
    };
  }

  /**
   * Check critical constraints and determine if stops should be limited
   */
  private static checkCriticalConstraints(
    startStop: any,
    endStop: any,
    travelDays: number,
    availableStops: number
  ): { shouldLimitStops: boolean; limitMessage: string; feasibilityWarning?: string } {
    
    // Calculate total distance and basic feasibility
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, startStop.longitude,
      endStop.latitude, endStop.longitude
    );

    const avgDailyDistance = totalDistance / travelDays;
    const avgDailyDriveTime = calculateRealisticDriveTime(avgDailyDistance);
    
    // Check if trip is fundamentally feasible
    let feasibilityWarning = '';
    if (avgDailyDriveTime > this.ABSOLUTE_MAX_DRIVE_HOURS) {
      const minRequiredDays = Math.ceil(totalDistance / (this.ABSOLUTE_MAX_DRIVE_HOURS * 50));
      feasibilityWarning = `⚠️ ${travelDays} days may require ${avgDailyDriveTime.toFixed(1)}h/day. Consider ${minRequiredDays}+ days.`;
    }

    // Determine if we should limit stops
    const optimalStops = Math.ceil(travelDays / this.OPTIMAL_DAYS_PER_STOP);
    const shouldLimitStops = availableStops > this.MAX_STOPS_LIMIT || 
                            (travelDays > 6 && availableStops > optimalStops);

    let limitMessage = '';
    if (shouldLimitStops) {
      if (availableStops > this.MAX_STOPS_LIMIT) {
        limitMessage = `🎯 Limited to ${this.MAX_STOPS_LIMIT} major destinations for optimal ${travelDays}-day experience. Focus on quality over quantity.`;
      } else {
        limitMessage = `🎯 ${travelDays} days allows for leisurely exploration of ${Math.min(availableStops, optimalStops)} destinations with extra time at each location.`;
      }
    }

    console.log(`🔍 Constraint check:`, {
      totalDistance: totalDistance.toFixed(1),
      travelDays,
      avgDailyDistance: avgDailyDistance.toFixed(1),
      avgDailyDriveTime: avgDailyDriveTime.toFixed(1),
      availableStops,
      shouldLimitStops,
      feasibilityWarning
    });

    return { shouldLimitStops, limitMessage, feasibilityWarning };
  }

  /**
   * Intelligently limit stops to the most important ones
   */
  private static limitStopsIntelligently(routeStops: any[], startStop: any, endStop: any): any[] {
    if (routeStops.length <= this.MAX_STOPS_LIMIT) {
      return routeStops;
    }

    // Determine direction for geographic sorting
    const isEastToWest = startStop.longitude < endStop.longitude;

    // Sort geographically first
    const geographicallySorted = routeStops.sort((a, b) => {
      return isEastToWest ? a.longitude - b.longitude : b.longitude - a.longitude;
    });

    // Prioritize by importance and geographic distribution
    const prioritized = geographicallySorted
      .filter(stop => stop.id !== startStop.id && stop.id !== endStop.id)
      .map(stop => ({
        ...stop,
        priority: this.calculateStopPriority(stop)
      }))
      .sort((a, b) => b.priority - a.priority);

    // Select top stops ensuring geographic distribution
    const selected = this.selectDistributedStops(prioritized, this.MAX_STOPS_LIMIT, isEastToWest);

    console.log(`📍 Limited stops (${selected.length}):`, selected.map(s => s.name));

    return selected;
  }

  /**
   * Calculate priority score for a stop
   */
  private static calculateStopPriority(stop: any): number {
    let priority = 0;

    // Category priorities
    const categoryScores = {
      'destination_city': 100,
      'heritage_site': 80,
      'historic_site': 70,
      'attraction': 60,
      'monument': 50,
      'landmark': 40
    };
    
    priority += categoryScores[stop.category] || 30;

    // Heritage value bonus
    const heritageScores = { 'high': 50, 'medium': 30, 'low': 10 };
    priority += heritageScores[stop.heritage_value] || 0;

    // Significance bonus
    if (stop.significance === 'national') priority += 40;
    if (stop.significance === 'state') priority += 20;
    if (stop.description && stop.description.toLowerCase().includes('historic')) priority += 20;

    return priority;
  }

  /**
   * Select stops with good geographic distribution
   */
  private static selectDistributedStops(stops: any[], maxCount: number, isEastToWest: boolean): any[] {
    if (stops.length <= maxCount) return stops;

    const selected: any[] = [];
    const totalRange = Math.abs(stops[stops.length - 1].longitude - stops[0].longitude);
    const segmentSize = totalRange / maxCount;

    let currentSegmentStart = stops[0].longitude;
    let segmentIndex = 0;

    while (selected.length < maxCount && segmentIndex < maxCount) {
      const segmentEnd = currentSegmentStart + (isEastToWest ? segmentSize : -segmentSize);
      
      // Find best stop in this segment
      const segmentStops = stops.filter(stop => {
        const inRange = isEastToWest 
          ? stop.longitude >= currentSegmentStart && stop.longitude <= segmentEnd
          : stop.longitude <= currentSegmentStart && stop.longitude >= segmentEnd;
        return inRange && !selected.includes(stop);
      });

      if (segmentStops.length > 0) {
        // Select highest priority stop in this segment
        const bestInSegment = segmentStops.reduce((best, current) => 
          current.priority > best.priority ? current : best
        );
        selected.push(bestInSegment);
      }

      currentSegmentStart = segmentEnd;
      segmentIndex++;
    }

    // Fill remaining slots with highest priority stops not yet selected
    while (selected.length < maxCount) {
      const remaining = stops.filter(stop => !selected.includes(stop));
      if (remaining.length === 0) break;
      
      const highest = remaining.reduce((best, current) => 
        current.priority > best.priority ? current : best
      );
      selected.push(highest);
    }

    return selected;
  }

  /**
   * Build the final trip plan using the enhanced service
   */
  static async buildTripPlan(
    orchestrationData: OrchestrationData,
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): Promise<TripPlan> {
    console.log(`🎯 Building enhanced trip plan for EXACTLY ${travelDays} days with STRICT constraints`);
    
    // Use the enhanced Heritage Cities service
    const tripPlan = await EnhancedHeritageCitiesService.planEnhancedHeritageCitiesTrip(
      startLocation,
      endLocation,
      travelDays,
      orchestrationData.allStops
    );

    // Validate geographic progression
    const isEastToWest = orchestrationData.startStop.longitude < orchestrationData.endStop.longitude;
    const progressionValidation = validateGeographicProgression(tripPlan.stops || [], isEastToWest);
    
    if (!progressionValidation.isValid) {
      console.warn(`⚠️ Geographic progression issues:`, progressionValidation.violations);
    }

    // Add orchestration metadata
    const enhancedTripPlan: TripPlan = {
      ...tripPlan,
      stopsLimited: orchestrationData.stopsLimited,
      limitMessage: orchestrationData.limitMessage
    };
    
    // Analyze completion
    const completionAnalysis = TripCompletionService.analyzeTripCompletion(enhancedTripPlan);
    console.log('✅ Enhanced Trip Analysis:', completionAnalysis);

    console.log(`✅ Enhanced trip plan complete: ${enhancedTripPlan.segments.length} days, strict constraints enforced`);

    return enhancedTripPlan;
  }
}
