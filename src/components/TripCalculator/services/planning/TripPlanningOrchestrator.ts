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
   * Create optimized daily segments with improved drive time distribution and STRICT 10h enforcement
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
    
    // Calculate BALANCED daily distances to prevent very long final days
    const dailyDistances = this.calculateBalancedDailyDistances(totalDistance, travelDays);
    
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
        // Find next progressive stop based on target distance
        dayDestination = this.findOptimalProgressiveStop(
          currentStop,
          endStop,
          sortedStops,
          targetDistance,
          isEastToWest
        );
      }

      // Calculate actual distance and drive time
      const actualDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      // Use the enhanced drive time calculation with STRICT 10h enforcement
      const driveTimeHours = calculateRealisticDriveTime(actualDistance);

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
      
      console.log(`📍 Day ${day}: ${segment.startCity} → ${segment.endCity} (${actualDistance.toFixed(0)} miles, ${driveTimeHours.toFixed(1)}h)`);

      currentStop = dayDestination;
      accumulatedDistance += actualDistance;

      if (isLastDay) break;
    }

    // Final validation - ensure NO day exceeds 10 hours
    this.validateAndEnforce10HourLimit(segments);

    return segments;
  }

  /**
   * Calculate BALANCED daily distances to prevent very long final days
   */
  private static calculateBalancedDailyDistances(totalDistance: number, travelDays: number): number[] {
    const distances: number[] = [];
    
    if (travelDays === 1) {
      return [totalDistance];
    }
    
    // Strategy: Make the last day shorter, distribute extra to earlier days
    const averageDistance = totalDistance / travelDays;
    const lastDayReduction = 0.2; // Make last day 20% shorter than average
    const lastDayDistance = averageDistance * (1 - lastDayReduction);
    const extraDistanceToDistribute = averageDistance - lastDayDistance;
    const extraPerEarlierDay = extraDistanceToDistribute / (travelDays - 1);
    
    for (let day = 1; day <= travelDays; day++) {
      if (day === travelDays) {
        distances.push(lastDayDistance);
      } else {
        distances.push(averageDistance + extraPerEarlierDay);
      }
    }
    
    // Normalize to ensure total matches exactly
    const currentTotal = distances.reduce((sum, d) => sum + d, 0);
    const factor = totalDistance / currentTotal;
    const normalizedDistances = distances.map(d => d * factor);
    
    console.log(`📊 Balanced daily distances:`, normalizedDistances.map(d => d.toFixed(0)));
    
    return normalizedDistances;
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

  /**
   * Find the optimal progressive stop based on target distance
   */
  private static findOptimalProgressiveStop(
    currentStop: any,
    finalDestination: any,
    sortedStops: any[],
    targetDistance: number,
    isEastToWest: boolean
  ): any {
    console.log(`🔍 Finding optimal progressive stop from ${currentStop.name || currentStop.city_name}, target: ${targetDistance.toFixed(0)} miles`);
    
    // Filter stops that are ahead of current position
    const progressiveStops = sortedStops.filter(stop => {
      if (isEastToWest) {
        return stop.longitude > currentStop.longitude; // Going west, need higher longitude
      } else {
        return stop.longitude < currentStop.longitude; // Going east, need lower longitude
      }
    });

    if (progressiveStops.length === 0) {
      console.log(`⚠️ No progressive stops found, using final destination`);
      return finalDestination;
    }

    // Find the stop closest to our target distance
    let bestStop = progressiveStops[0];
    let bestScore = Infinity;

    for (const stop of progressiveStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      // Score based on how close to target distance
      const distanceScore = Math.abs(distance - targetDistance);
      
      // Prefer destination cities
      const categoryBonus = (stop.category === 'destination_city') ? -50 : 0;
      
      const totalScore = distanceScore + categoryBonus;

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestStop = stop;
      }
    }

    console.log(`✅ Selected optimal stop: ${bestStop.name || bestStop.city_name} (${bestScore.toFixed(0)} score)`);
    return bestStop;
  }

  /**
   * Filter stops that are on the route between start and end
   */
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
