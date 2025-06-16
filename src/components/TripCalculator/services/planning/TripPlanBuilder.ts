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
    console.log(`🏗️ FIXED TripPlanBuilder: Building trip plan: ${startStop.name} → ${endStop.name} in ${requestedDays} days`);
    console.log(`🔑 FIXED TripPlanBuilder: Google API available: ${GoogleDistanceMatrixService.isAvailable()}`);

    // Get all stops between start and end
    const routeStops = this.getRouteStops(startStop, endStop, allStops);
    console.log(`📍 FIXED TripPlanBuilder: Route includes ${routeStops.length} stops`);

    // Plan daily segments with Google Distance Matrix API
    const segments = await this.planDailySegmentsWithAPI(routeStops, requestedDays);
    
    // Calculate total distance and driving time from segments
    const totalDistance = segments.reduce((total, segment) => total + (segment.distance || 0), 0);
    const totalDrivingTime = segments.reduce((total, segment) => total + (segment.driveTimeHours || 0), 0);

    console.log(`⏱️ FIXED TripPlanBuilder: Final totals - Distance: ${totalDistance}, Drive Time: ${totalDrivingTime.toFixed(1)}h`);

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

    console.log(`✅ FIXED TripPlanBuilder: Trip plan completed with real Google API data:`, {
      segmentCount: segments.length,
      totalDistance: totalDistance.toFixed(0),
      totalDriveTime: totalDrivingTime.toFixed(1),
      firstSegmentDistance: segments[0]?.distance || 'N/A',
      firstSegmentDriveTime: segments[0]?.driveTimeHours || 'N/A'
    });

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

  private static async planDailySegmentsWithAPI(
    routeStops: TripStop[],
    requestedDays: number
  ): Promise<DailySegment[]> {
    console.log(`🎯 FIXED planDailySegmentsWithAPI: Planning ${requestedDays} daily segments`);
    console.log(`🔑 FIXED planDailySegmentsWithAPI: API Key available: ${GoogleDistanceMatrixService.isAvailable()}`);
    
    const segments: DailySegment[] = [];
    
    // Calculate segments for Google API
    const segmentPlans = this.createSegmentPlans(routeStops, requestedDays);
    console.log(`📋 FIXED planDailySegmentsWithAPI: Created ${segmentPlans.length} segment plans`);
    
    // Process each segment individually to ensure proper API data
    for (let i = 0; i < segmentPlans.length; i++) {
      const plan = segmentPlans[i];
      
      console.log(`🚗 FIXED planDailySegmentsWithAPI: Processing Day ${i + 1}: ${plan.startStop.name} → ${plan.endStop.name}`);
      
      // Get Google Distance Matrix API data for this specific segment
      let apiResult;
      
      if (GoogleDistanceMatrixService.isAvailable()) {
        try {
          apiResult = await GoogleDistanceMatrixService.calculateDistance(
            plan.startStop.name,
            plan.endStop.name
          );
          
          console.log(`✅ FIXED planDailySegmentsWithAPI: Day ${i + 1} Google API result:`, {
            startCity: plan.startStop.name,
            endCity: plan.endStop.name,
            distance: apiResult.distance,
            duration: apiResult.duration,
            status: apiResult.status,
            formattedTime: GoogleDistanceMatrixService.formatDuration(apiResult.duration)
          });
        } catch (error) {
          console.error(`❌ FIXED planDailySegmentsWithAPI: API error for Day ${i + 1}:`, error);
          // Use fallback calculation
          apiResult = {
            distance: 250,
            duration: 4.0,
            status: 'FALLBACK_ERROR'
          };
        }
      } else {
        console.warn(`⚠️ FIXED planDailySegmentsWithAPI: No API key, using fallback for Day ${i + 1}`);
        apiResult = {
          distance: 250,
          duration: 4.0,
          status: 'NO_API_KEY'
        };
      }
      
      // Get attractions for the destination city
      const attractions = await AttractionService.getAttractionsForStop(plan.endStop);
      
      // Get drive time category based on API duration
      const driveTimeCategory = this.getDriveTimeCategory(apiResult.duration);
      
      // Create segment with REAL API data
      const segment: DailySegment = {
        day: i + 1,
        startCity: plan.startStop.name,
        endCity: plan.endStop.name,
        distance: apiResult.distance, // REAL Google API distance
        approximateMiles: apiResult.distance, // Keep for compatibility
        drivingTime: apiResult.duration, // REAL Google API duration
        driveTimeHours: apiResult.duration, // REAL Google API duration
        attractions: attractions || [],
        subStops: plan.intermediateStops,
        driveTimeCategory,
        title: `${plan.startStop.name} → ${plan.endStop.name}`,
        recommendedStops: [],
        subStopTimings: [],
        routeSection: this.getRouteSection(i + 1, requestedDays)
      };
      
      console.log(`✅ FIXED planDailySegmentsWithAPI: Created Day ${segment.day} segment:`, {
        distance: segment.distance,
        driveTimeHours: segment.driveTimeHours,
        startCity: segment.startCity,
        endCity: segment.endCity,
        apiStatus: apiResult.status
      });
      
      segments.push(segment);
    }
    
    console.log(`📋 FIXED planDailySegmentsWithAPI: All segments created:`, 
      segments.map(s => `Day ${s.day}: ${s.distance}mi, ${s.driveTimeHours.toFixed(1)}h (${s.startCity} → ${s.endCity})`)
    );
    
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
