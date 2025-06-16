import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SegmentTimingCalculator } from './SegmentTimingCalculator';
import { DriveTimeBalancingService } from './DriveTimeBalancingService';
import { AttractionService } from './AttractionService';
import { TripPlan, DailySegment, DriveTimeCategory, RecommendedStop, SegmentTiming } from './TripPlanTypes';
import { GoogleDistanceMatrixService } from '../GoogleDistanceMatrixService';

// Re-export types for backward compatibility
export type { TripPlan, DailySegment, DriveTimeCategory, RecommendedStop, SegmentTiming };

// Re-export utilities
export { getDestinationCityName, TripPlanDataValidator } from './TripPlanTypes';

export class TripPlanBuilder {
  static async buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    requestedDays: number
  ): Promise<TripPlan> {
    console.log(`🏗️ Building trip plan with Google Distance Matrix API: ${startStop.name} → ${endStop.name} in ${requestedDays} days`);

    // Get all stops between start and end
    const routeStops = this.getRouteStops(startStop, endStop, allStops);
    console.log(`📍 Route includes ${routeStops.length} stops`);

    // Plan daily segments with Google Distance Matrix API
    const segments = await this.planDailySegmentsWithAPI(routeStops, requestedDays);
    
    // Calculate total distance and driving time from segments
    const totalDistance = segments.reduce((total, segment) => total + (segment.distance || 0), 0);
    const totalDrivingTime = segments.reduce((total, segment) => total + (segment.driveTimeHours || 0), 0);

    console.log(`⏱️ Total driving time calculated from Google API: ${totalDrivingTime.toFixed(1)} hours from ${segments.length} segments`);

    // Create route coordinates
    const route = routeStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    const tripPlan: TripPlan = {
      startCity: startStop.name,
      endCity: endStop.name,
      totalDistance: Math.round(totalDistance),
      totalDays: segments.length,
      totalDrivingTime,
      segments,
      dailySegments: segments,
      route,
      title: `${startStop.name} to ${endStop.name} Route 66 Adventure`,
      totalMiles: Math.round(totalDistance)
    };

    console.log(`✅ Trip plan built with Google API: ${segments.length} days, ${totalDistance.toFixed(0)} miles, ${totalDrivingTime.toFixed(1)}h driving`);
    return tripPlan;
  }

  private static getRouteStops(startStop: TripStop, endStop: TripStop, allStops: TripStop[]): TripStop[] {
    const startIndex = allStops.findIndex(stop => stop.id === startStop.id);
    const endIndex = allStops.findIndex(stop => stop.id === endStop.id);
    
    if (startIndex === -1 || endIndex === -1) {
      console.warn('⚠️ Start or end stop not found in route, using provided stops');
      return [startStop, endStop];
    }
    
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    
    let routeStops = allStops.slice(start, end + 1);
    
    // If traveling backwards, reverse the route
    if (startIndex > endIndex) {
      routeStops.reverse();
    }
    
    return routeStops;
  }

  private static calculateTotalRouteDistance(routeStops: TripStop[]): number {
    let totalDistance = 0;
    
    for (let i = 0; i < routeStops.length - 1; i++) {
      const currentStop = routeStops[i];
      const nextStop = routeStops[i + 1];
      
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );
      
      totalDistance += segmentDistance;
    }
    
    return totalDistance;
  }

  private static async planDailySegmentsWithAPI(
    routeStops: TripStop[],
    requestedDays: number
  ): Promise<DailySegment[]> {
    const segments: DailySegment[] = [];
    
    console.log(`🎯 Planning ${requestedDays} daily segments with Google Distance Matrix API`);
    
    // Calculate segments for Google API
    const segmentPlans = this.createSegmentPlans(routeStops, requestedDays);
    
    // Prepare all segment pairs for batch API calls
    const segmentPairs = segmentPlans.map(plan => ({
      startCity: plan.startStop.name,
      endCity: plan.endStop.name
    }));

    // Get all distances and durations from Google API
    const apiResults = await GoogleDistanceMatrixService.calculateRouteSegments(segmentPairs);
    
    // Build segments with real API data
    for (let i = 0; i < segmentPlans.length; i++) {
      const plan = segmentPlans[i];
      const apiResult = apiResults.segmentResults[i];
      
      console.log(`🚗 Day ${i + 1}: ${plan.startStop.name} → ${plan.endStop.name} - API Distance: ${apiResult.distance}mi, API Duration: ${GoogleDistanceMatrixService.formatDuration(apiResult.duration)}`);
      
      // Get attractions for the destination city
      const attractions = await AttractionService.getAttractionsForStop(plan.endStop);
      
      // Get drive time category based on API duration
      const driveTimeCategory = this.getDriveTimeCategory(apiResult.duration);
      
      const segment: DailySegment = {
        day: i + 1,
        startCity: plan.startStop.name,
        endCity: plan.endStop.name,
        distance: Math.round(apiResult.distance),
        approximateMiles: Math.round(apiResult.distance),
        drivingTime: apiResult.duration,
        driveTimeHours: apiResult.duration,
        attractions: attractions || [],
        subStops: plan.intermediateStops,
        driveTimeCategory,
        title: `${plan.startStop.name} → ${plan.endStop.name}`,
        recommendedStops: [],
        subStopTimings: [],
        routeSection: this.getRouteSection(i + 1, requestedDays)
      };
      
      segments.push(segment);
    }
    
    console.log(`📋 Created ${segments.length} segments with Google Distance Matrix API data`);
    return segments;
  }

  private static createSegmentPlans(routeStops: TripStop[], requestedDays: number): Array<{
    startStop: TripStop;
    endStop: TripStop;
    intermediateStops: TripStop[];
  }> {
    const plans: Array<{
      startStop: TripStop;
      endStop: TripStop;
      intermediateStops: TripStop[];
    }> = [];
    
    // Distribute stops across days
    const stopsPerSegment = Math.max(1, Math.floor(routeStops.length / requestedDays));
    let currentStopIndex = 0;
    
    for (let day = 1; day <= requestedDays; day++) {
      const isLastDay = day === requestedDays;
      const startStopIndex = currentStopIndex;
      
      let endStopIndex: number;
      if (isLastDay) {
        endStopIndex = routeStops.length - 1;
      } else {
        endStopIndex = Math.min(startStopIndex + stopsPerSegment, routeStops.length - 1);
        // Make sure we don't end on the same stop we started
        if (endStopIndex === startStopIndex) {
          endStopIndex = Math.min(startStopIndex + 1, routeStops.length - 1);
        }
      }
      
      const startStop = routeStops[startStopIndex];
      const endStop = routeStops[endStopIndex];
      const intermediateStops = routeStops.slice(startStopIndex + 1, endStopIndex);
      
      plans.push({
        startStop,
        endStop,
        intermediateStops
      });
      
      currentStopIndex = endStopIndex;
      
      if (endStopIndex >= routeStops.length - 1) break;
    }
    
    return plans;
  }

  private static getDriveTimeCategory(driveTimeHours: number): DriveTimeCategory {
    if (driveTimeHours <= 3) {
      return {
        category: 'light',
        message: 'Easy driving day with plenty of time for stops and exploration.',
        color: 'green'
      };
    } else if (driveTimeHours <= 5) {
      return {
        category: 'moderate',
        message: 'Comfortable driving day with good balance of travel and sightseeing.',
        color: 'blue'
      };
    } else if (driveTimeHours <= 7) {
      return {
        category: 'heavy',
        message: 'Longer driving day - plan for fewer stops and more focused travel.',
        color: 'orange'
      };
    } else {
      return {
        category: 'extreme',
        message: 'Very long driving day - consider splitting this segment or starting early.',
        color: 'red'
      };
    }
  }

  private static getRouteSection(day: number, totalDays: number): string {
    const progress = day / totalDays;
    
    if (progress <= 0.33) {
      return 'Early Route';
    } else if (progress <= 0.66) {
      return 'Mid Route';
    } else {
      return 'Final Stretch';
    }
  }
}
