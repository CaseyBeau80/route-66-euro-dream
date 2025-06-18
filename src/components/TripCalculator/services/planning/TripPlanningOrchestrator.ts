
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

    // Create balanced daily segments with proper route progression
    const segments = await this.createProgressiveSegments(
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
   * Create progressive daily segments that follow Route 66's natural flow
   */
  private static async createProgressiveSegments(
    startStop: any,
    endStop: any,
    allStops: any[],
    travelDays: number,
    totalDistance: number,
    styleConfig: TripStyleConfig
  ): Promise<DailySegment[]> {
    const segments: DailySegment[] = [];
    
    console.log(`🛣️ Creating progressive route for ${travelDays} days`);

    // Determine if we're going east-to-west or west-to-east
    const isEastToWest = startStop.longitude < endStop.longitude;
    console.log(`📍 Route direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // Get all available stops sorted by longitude (Route 66 runs roughly east-west)
    const sortedStops = this.getSortedRouteStops(startStop, endStop, allStops, isEastToWest);
    
    // Create segments by selecting stops that progress naturally along the route
    let currentStop = startStop;
    const targetDailyDistance = totalDistance / travelDays;

    for (let day = 1; day <= travelDays; day++) {
      const isLastDay = day === travelDays;
      
      let dayDestination: any;
      
      if (isLastDay) {
        // Last day: go to end destination
        dayDestination = endStop;
      } else {
        // Find next progressive stop
        dayDestination = this.findNextProgressiveStop(
          currentStop,
          endStop,
          sortedStops,
          targetDailyDistance,
          isEastToWest
        );
      }

      // Calculate actual distance and drive time
      const actualDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        dayDestination.latitude, dayDestination.longitude
      );

      const driveTimeHours = Math.max(2.0, actualDistance / 50); // Minimum 2 hours, 50 mph average

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

      if (isLastDay) break;
    }

    return segments;
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
   * Find the next stop that progresses naturally along the route
   */
  private static findNextProgressiveStop(
    currentStop: any,
    finalDestination: any,
    sortedStops: any[],
    targetDistance: number,
    isEastToWest: boolean
  ): any {
    console.log(`🔍 Finding next progressive stop from ${currentStop.name || currentStop.city_name}`);
    
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

    // Find the stop closest to our target distance that progresses along the route
    let bestStop = progressiveStops[0];
    let bestScore = Infinity;

    for (const stop of progressiveStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        stop.latitude, stop.longitude
      );

      // Score based on how close to target distance (prefer stops near target)
      const distanceScore = Math.abs(distance - targetDistance);
      
      // Prefer destination cities
      const categoryBonus = (stop.category === 'destination_city') ? -50 : 0;
      
      const totalScore = distanceScore + categoryBonus;

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestStop = stop;
      }
    }

    console.log(`✅ Selected progressive stop: ${bestStop.name || bestStop.city_name} (${bestScore.toFixed(0)} score)`);
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
