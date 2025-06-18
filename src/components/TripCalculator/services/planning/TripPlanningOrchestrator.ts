
import { TripPlan } from './TripPlanTypes';
import { DailySegment } from './TripPlanTypes';
import { SupabaseDataService } from '../data/SupabaseDataService';
import { TripBoundaryService } from './TripBoundaryService';
import { SegmentBuilderService } from './SegmentBuilderService';
import { DriveTimeBalancingService, DriveTimeTarget } from './DriveTimeBalancingService';
import { TripStyleConfig, TripStyleLogic } from './TripStyleLogic';
import { TripCompletionService } from './TripCompletionService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

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
    tripStyle: 'balanced' | 'destination-focused'
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
   * Build the final trip plan from orchestration data with proper day constraints
   */
  static async buildTripPlan(
    orchestrationData: OrchestrationData,
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'balanced' | 'destination-focused'
  ): Promise<TripPlan> {
    const { startStop, endStop, allStops, styleConfig } = orchestrationData;

    console.log(`🎯 Building trip plan for exactly ${travelDays} days`);

    // Calculate total distance for the trip
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude, 
      startStop.longitude,
      endStop.latitude, 
      endStop.longitude
    );

    console.log(`📏 Total trip distance: ${totalDistance.toFixed(0)} miles`);

    // Create balanced daily segments
    const segments = await this.createBalancedDailySegments(
      startStop,
      endStop,
      allStops,
      travelDays,
      totalDistance,
      styleConfig
    );

    // Validate we have the correct number of segments
    if (segments.length !== travelDays) {
      console.error(`❌ Segment count mismatch: expected ${travelDays}, got ${segments.length}`);
    }

    // Calculate totals from actual segments
    const actualTotalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
    const totalDrivingTime = segments.reduce((sum, seg) => sum + seg.driveTimeHours, 0);

    // Create the trip plan
    const tripPlan: TripPlan = {
      id: `enhanced-trip-${Date.now()}`,
      title: `${startLocation} to ${endLocation} Route 66 Adventure`,
      startCity: startLocation,
      endCity: endLocation,
      startLocation,
      endLocation,
      startDate: new Date(),
      totalDays: travelDays, // Use the requested days, not the segment count
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

    console.log(`✅ Final trip plan: ${segments.length} days, ${Math.round(actualTotalDistance)} miles`);

    return tripPlan;
  }

  /**
   * Create balanced daily segments for the exact number of requested days
   */
  private static async createBalancedDailySegments(
    startStop: any,
    endStop: any,
    allStops: any[],
    travelDays: number,
    totalDistance: number,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment[]> {
    const segments: DailySegment[] = [];
    const targetDailyDistance = totalDistance / travelDays;
    
    console.log(`🎯 Target daily distance: ${targetDailyDistance.toFixed(0)} miles`);

    // Filter route stops between start and end
    const routeStops = this.filterRouteStops(startStop, endStop, allStops);
    
    let currentStop = startStop;
    let remainingDistance = totalDistance;

    for (let day = 1; day <= travelDays; day++) {
      const isLastDay = day === travelDays;
      let targetDistance: number;
      
      if (isLastDay) {
        // Last day: go to end destination
        targetDistance = remainingDistance;
      } else {
        // Calculate proportional distance for this day
        const remainingDays = travelDays - day + 1;
        targetDistance = Math.min(targetDailyDistance, remainingDistance / remainingDays);
      }

      // Find the best stop for this day's target distance
      const dayDestination = isLastDay ? endStop : this.findBestStopForDistance(
        currentStop,
        routeStops,
        targetDistance,
        endStop
      );

      // Calculate actual distance and drive time
      const actualDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      const driveTimeHours = Math.max(2.0, actualDistance / 50); // Minimum 2 hours, 50 mph average

      // Create the segment
      const segment: DailySegment = {
        day,
        startCity: currentStop.name || currentStop.city_name || startStop.name,
        endCity: dayDestination.name || dayDestination.city_name || endStop.name,
        startStop: currentStop,
        endStop: dayDestination,
        distance: actualDistance,
        driveTimeHours,
        attractions: [],
        weatherData: null,
        isGoogleMapsData: false
      };

      segments.push(segment);
      
      console.log(`📍 Day ${day}: ${segment.startCity} → ${segment.endCity} (${actualDistance.toFixed(0)} miles, ${driveTimeHours.toFixed(1)}h)`);

      currentStop = dayDestination;
      remainingDistance -= actualDistance;

      if (isLastDay) break;
    }

    return segments;
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

  /**
   * Find the best stop for a target distance
   */
  private static findBestStopForDistance(
    currentStop: any,
    availableStops: any[],
    targetDistance: number,
    finalDestination: any
  ): any {
    if (availableStops.length === 0) {
      return finalDestination;
    }

    let bestStop = availableStops[0];
    let bestScore = Infinity;

    for (const stop of availableStops) {
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

    return bestStop;
  }
}
