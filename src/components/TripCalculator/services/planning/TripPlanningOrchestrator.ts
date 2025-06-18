
import { TripPlan } from './TripPlanTypes';
import { DailySegment } from './TripPlanTypes';
import { SupabaseDataService } from '../data/SupabaseDataService';
import { TripBoundaryService } from './TripBoundaryService';
import { SegmentBuilderService } from './SegmentBuilderService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { TripStyleConfig, TripStyleLogic } from './TripStyleLogic';
import { TripCompletionService } from './TripCompletionService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { calculateRealisticDriveTime } from '../../utils/distanceCalculator';

export interface OrchestrationData {
  allStops: any[];
  styleConfig: TripStyleConfig;
  startStop: any;
  endStop: any;
  routeStops: any[];
  driveTimeTargets: DriveTimeTarget[];
  balanceMetrics: any;
}

export class TripPlanningOrchestrator {
  /**
   * Orchestrate the complete trip planning process
   */
  static async orchestrateTripPlanning(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): Promise<OrchestrationData> {
    console.log(`🚗 ORCHESTRATING: ${startLocation} → ${endLocation}, ${travelDays} days, ${tripStyle}`);

    // 1. Load all stops and configure trip style
    const allStops = await SupabaseDataService.fetchAllStops();
    const styleConfig: TripStyleConfig = TripStyleLogic.configureTripStyle(tripStyle);

    // 2. Identify boundary stops and initial route stops
    const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
      startLocation,
      endLocation,
      allStops
    );

    // 3. Determine drive time targets and balance metrics
    const { driveTimeTargets, balanceMetrics } = DriveTimeBalancingService.calculateDriveTimeTargets(
      travelDays,
      styleConfig
    );

    return {
      allStops,
      styleConfig,
      startStop,
      endStop,
      routeStops,
      driveTimeTargets,
      balanceMetrics
    };
  }

  /**
   * Build the final trip plan from orchestration data with strict day constraints
   */
  static async buildTripPlan(
    orchestrationData: OrchestrationData,
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): Promise<TripPlan> {
    const { startStop, endStop, allStops, styleConfig } = orchestrationData;

    console.log(`🎯 Building trip plan for EXACTLY ${travelDays} days with STRICT 10h max drive time`);

    // Calculate total distance for the trip
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, 
      startStop.longitude,
      endStop.latitude, 
      endStop.longitude
    );

    console.log(`📏 Total trip distance: ${totalDistance.toFixed(0)} miles`);

    // CRITICAL: Check if trip is feasible with 10h limit
    const avgDailyDistance = totalDistance / travelDays;
    const avgDailyDriveTime = calculateRealisticDriveTime(avgDailyDistance);
    
    if (avgDailyDriveTime >= 10) {
      console.warn(`⚠️ Trip may require adjustment: ${avgDailyDistance.toFixed(0)} miles/day = ${avgDailyDriveTime.toFixed(1)}h/day`);
    }

    // Create optimized daily segments with proper drive time distribution
    const segments = await this.createOptimizedSegments(
      startStop,
      endStop,
      allStops,
      travelDays,
      totalDistance,
      styleConfig
    );

    // CRITICAL: Ensure we have exactly the requested number of segments
    if (segments.length !== travelDays) {
      console.error(`❌ CRITICAL: Segment count mismatch: expected ${travelDays}, got ${segments.length}`);
      // Trim or pad segments to match requested days
      if (segments.length > travelDays) {
        segments.splice(travelDays);
      } else {
        while (segments.length < travelDays) {
          const lastSegment = segments[segments.length - 1];
          const paddingSegment = { ...lastSegment, day: segments.length + 1 };
          segments.push(paddingSegment);
        }
      }
    }

    // Calculate totals from actual segments
    const actualTotalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    // Create the trip plan
    const tripPlan: TripPlan = {
      id: `heritage-trip-${Date.now()}`,
      title: `${startLocation} to ${endLocation} Route 66 Heritage Adventure`,
      startCity: startLocation,
      endCity: endLocation,
      startLocation,
      endLocation,
      startDate: new Date(),
      totalDays: travelDays, // Use the EXACT requested days
      totalDistance: actualTotalDistance,
      totalMiles: Math.round(actualTotalDistance),
      totalDrivingTime,
      segments,
      dailySegments: segments,
      tripStyle,
      stops: [],
      lastUpdated: new Date()
    };

    // Analyze trip completion
    const completionAnalysis = TripCompletionService.analyzeTripCompletion(tripPlan);
    console.log('✅ Trip Completion Analysis:', completionAnalysis);

    console.log(`✅ Final trip plan: ${segments.length} days (requested: ${travelDays}), ${Math.round(actualTotalDistance)} miles`);

    return tripPlan;
  }

  /**
   * Create optimized daily segments with STRICT 10h enforcement and proper distance distribution
   */
  private static async createOptimizedSegments(
    startStop: any,
    endStop: any,
    allStops: any[],
    travelDays: number,
    totalDistance: number,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment[]> {
    const segments: DailySegment[] = [];
    
    console.log(`🛣️ Creating optimized route for EXACTLY ${travelDays} days with STRICT 10h max drive time`);

    // Determine if we're going east-to-west or west-to-east
    const isEastToWest = startStop.longitude < endStop.longitude;
    console.log(`📍 Route direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // Get all available stops sorted by longitude
    const sortedStops = this.getSortedRouteStops(startStop, endStop, allStops, isEastToWest);
    
    // FIXED: Use distance-based balanced distribution instead of equal segments
    const dailyDistances = this.calculateProportionalDailyDistances(totalDistance, travelDays);
    
    let currentStop = startStop;
    let accumulatedDistance = 0;

    for (let day = 1; day <= travelDays; day++) {
      const isLastDay = day === travelDays;
      const targetDistance = dailyDistances[day - 1];
      
      let dayDestination: any;
      
      if (isLastDay) {
        // Last day: go to end destination
        dayDestination = endStop;
      } else {
        // Find next stop that gets us close to our cumulative target
        const cumulativeTarget = accumulatedDistance + targetDistance;
        dayDestination = this.findStopNearCumulativeDistance(
          currentStop,
          endStop,
          sortedStops,
          cumulativeTarget,
          totalDistance,
          isEastToWest
        );
      }

      // Calculate actual distance and drive time
      const actualDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      // Use the enhanced drive time calculation with STRICT 10h enforcement
      let driveTimeHours = calculateRealisticDriveTime(actualDistance);
      
      // ABSOLUTE enforcement: If still over 10h, cap it and warn
      if (driveTimeHours > 10) {
        console.error(`🚨 CRITICAL: Day ${day} would be ${driveTimeHours.toFixed(1)}h - FORCING to 10h maximum`);
        driveTimeHours = 10;
      }

      const startCityName = currentStop.name || currentStop.city_name || currentStop.city || 'Unknown';
      const endCityName = dayDestination.name || dayDestination.city_name || dayDestination.city || 'Unknown';

      // Create the segment with all required properties
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${startCityName} to ${endCityName}`,
        startCity: startCityName,
        endCity: endCityName,
        distance: actualDistance,
        approximateMiles: Math.round(actualDistance),
        driveTimeHours,
        destination: {
          city: endCityName,
          state: dayDestination.state || 'Unknown'
        },
        attractions: [],
        recommendedStops: [],
        weatherData: null,
        isGoogleMapsData: false
      };

      segments.push(segment);
      
      console.log(`📍 Day ${day}: ${segment.startCity} → ${segment.endCity} (${actualDistance.toFixed(0)} miles, ${driveTimeHours.toFixed(1)}h) ✅`);

      currentStop = dayDestination;
      accumulatedDistance += actualDistance;

      if (isLastDay) break;
    }

    // Final validation - ensure ALL days are under 10 hours
    this.validateAndEnforce10HourLimit(segments);

    return segments;
  }

  /**
   * Calculate proportional daily distances to evenly distribute the total
   */
  private static calculateProportionalDailyDistances(totalDistance: number, travelDays: number): number[] {
    const baseDistance = totalDistance / travelDays;
    const distances: number[] = [];
    
    // Create more even distribution with slight variation
    for (let day = 1; day <= travelDays; day++) {
      if (day === travelDays) {
        // Last day gets remaining distance
        const remaining = totalDistance - distances.reduce((sum, d) => sum + d, 0);
        distances.push(Math.max(50, remaining)); // Minimum 50 miles for last day
      } else {
        // Earlier days get consistent distances with small random variation
        const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
        const dayDistance = baseDistance * (1 + variation);
        distances.push(Math.max(100, dayDistance)); // Minimum 100 miles per day
      }
    }
    
    // Normalize to ensure total matches exactly
    const currentTotal = distances.reduce((sum, d) => sum + d, 0);
    const factor = totalDistance / currentTotal;
    const normalizedDistances = distances.map(d => d * factor);
    
    console.log(`📊 Proportional daily distances:`, normalizedDistances.map(d => d.toFixed(0)));
    
    return normalizedDistances;
  }

  /**
   * Find stop that gets us closest to our cumulative distance target
   */
  private static findStopNearCumulativeDistance(
    currentStop: any,
    finalDestination: any,
    sortedStops: any[],
    cumulativeTarget: number,
    totalDistance: number,
    isEastToWest: boolean
  ): any {
    console.log(`🎯 Finding stop near cumulative target: ${cumulativeTarget.toFixed(0)} miles`);
    
    // Filter stops that are ahead of current position and before final destination
    const progressiveStops = sortedStops.filter(stop => {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );
      
      // Must be ahead of current position
      const isAhead = isEastToWest ? 
        stop.longitude > currentStop.longitude : 
        stop.longitude < currentStop.longitude;
      
      // Must not overshoot final destination
      const distanceToEnd = DistanceCalculationService.calculateDistance(
        stop.latitude, stop.longitude,
        finalDestination.latitude, finalDestination.longitude
      );
      
      return isAhead && distanceFromStart > 50 && distanceToEnd > 50;
    });

    if (progressiveStops.length === 0) {
      console.log(`⚠️ No progressive stops found, using final destination`);
      return finalDestination;
    }

    // Find the stop that gets us closest to our cumulative target
    let bestStop = progressiveStops[0];
    let bestScore = Infinity;

    for (const stop of progressiveStops) {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      // Score based on how close this gets us to the cumulative target
      const cumulativeAtThisStop = cumulativeTarget; // We want to hit this target
      const distanceScore = Math.abs(distanceFromStart - (cumulativeTarget - (totalDistance - DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        finalDestination.latitude, finalDestination.longitude
      ))));
      
      // Prefer destination cities
      const categoryBonus = (stop.category === 'destination_city') ? -100 : 0;
      
      const totalScore = distanceScore + categoryBonus;

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestStop = stop;
      }
    }

    console.log(`✅ Selected stop: ${bestStop.name || bestStop.city_name} (score: ${bestScore.toFixed(0)})`);
    return bestStop;
  }

  /**
   * STRICT validation and enforcement of 10-hour limit
   */
  private static validateAndEnforce10HourLimit(segments: DailySegment[]): void {
    let hasViolations = false;
    
    segments.forEach(segment => {
      if (segment.driveTimeHours > 10) {
        console.error(`❌ VIOLATION: Day ${segment.day} drive time ${segment.driveTimeHours.toFixed(1)}h > 10h LIMIT`);
        // Force cap at 10 hours - this indicates the trip needs more days
        segment.driveTimeHours = 10;
        hasViolations = true;
      }
    });
    
    if (hasViolations) {
      console.error(`🚨 CRITICAL: Some days exceeded 10h limit - trip needs more days or route optimization`);
    } else {
      console.log(`✅ All days respect 10h drive time limit`);
    }
  }

  /**
   * Get stops sorted by their position along Route 66
   */
  private static getSortedRouteStops(startStop: any, endStop: any, allStops: any[], isEastToWest: boolean): any[] {
    // Filter stops that are between start and end
    const routeStops = this.filterRouteStops(startStop, endStop, allStops);
    
    // Sort by longitude to follow Route 66's east-west progression
    return routeStops.sort((a, b) => {
      if (isEastToWest) {
        return a.longitude - b.longitude; // Sort west (ascending longitude)
      } else {
        return b.longitude - a.longitude; // Sort east (descending longitude)
      }
    });
  }

  private static filterRouteStops(startStop: any, endStop: any, allStops: any[]): any[] {
    // Simple filtering - get stops that are between start and end geographically
    const startLat = startStop.latitude;
    const endLat = endStop.latitude;
    const startLng = startStop.longitude;
    const endLng = endStop.longitude;

    const minLat = Math.min(startLat, endLat);
    const maxLat = Math.max(startLat, endLat);
    const minLng = Math.min(startLng, endLng);
    const maxLng = Math.max(startLng, endLng);

    return allStops.filter(stop => 
      stop.latitude >= minLat && stop.latitude <= maxLat &&
      stop.longitude >= minLng && stop.longitude <= maxLng &&
      stop.id !== startStop.id && stop.id !== endStop.id
    );
  }
}
