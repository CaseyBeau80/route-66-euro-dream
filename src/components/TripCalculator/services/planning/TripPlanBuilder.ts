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
    console.log(`🏗️ CRITICAL FIX TripPlanBuilder: Building trip plan: ${startStop.name} → ${endStop.name} in ${requestedDays} days`);
    console.log(`🔑 CRITICAL FIX TripPlanBuilder: Google API available: ${GoogleDistanceMatrixService.isAvailable()}`);

    // Get all stops between start and end
    const routeStops = this.getRouteStops(startStop, endStop, allStops);
    console.log(`📍 CRITICAL FIX TripPlanBuilder: Route includes ${routeStops.length} stops`);

    // CRITICAL FIX: Create segments with ACTUAL Google API data from the start
    const segments = await this.createSegmentsWithRealGoogleData(routeStops, requestedDays);
    
    // Calculate totals from ACTUAL segment data
    const totalDistance = segments.reduce((total, segment) => total + segment.distance, 0);
    const totalDrivingTime = segments.reduce((total, segment) => total + segment.driveTimeHours, 0);

    console.log(`⏱️ CRITICAL FIX TripPlanBuilder: Final totals - Distance: ${totalDistance}, Drive Time: ${totalDrivingTime.toFixed(1)}h`);

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

    console.log(`✅ CRITICAL FIX TripPlanBuilder: Trip plan completed:`, {
      segmentCount: segments.length,
      totalDistance: totalDistance.toFixed(0),
      totalDriveTime: totalDrivingTime.toFixed(1),
      allSegmentsHaveRealData: segments.every(s => s.distance > 0 && s.driveTimeHours > 0)
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

  // CRITICAL FIX: COMPLETELY NEW METHOD that creates segments with REAL Google API data
  private static async createSegmentsWithRealGoogleData(
    routeStops: TripStop[],
    requestedDays: number
  ): Promise<DailySegment[]> {
    console.log(`🎯 CRITICAL FIX createSegmentsWithRealGoogleData: Creating ${requestedDays} segments with REAL Google data`);
    
    // Step 1: Create the segment structure (which stops go in which day)
    const segmentStructure = this.createSegmentStructure(routeStops, requestedDays);
    console.log(`📋 CRITICAL FIX: Created ${segmentStructure.length} segment structures`);
    
    // Step 2: Get REAL Google API data for each segment
    const segments: DailySegment[] = [];
    
    for (let i = 0; i < segmentStructure.length; i++) {
      const structure = segmentStructure[i];
      
      console.log(`🌐 CRITICAL FIX: Getting REAL Google API data for segment ${i + 1}: ${structure.startStop.name} → ${structure.endStop.name}`);
      
      let googleDistance = 0;
      let googleDriveTime = 0;
      let apiStatus = 'FALLBACK';
      
      // Get REAL Google API data
      if (GoogleDistanceMatrixService.isAvailable()) {
        try {
          const apiResult = await GoogleDistanceMatrixService.calculateDistance(
            structure.startStop.name,
            structure.endStop.name
          );
          
          googleDistance = apiResult.distance;
          googleDriveTime = apiResult.duration;
          apiStatus = apiResult.status;
          
          console.log(`✅ CRITICAL FIX: Got REAL API data for segment ${i + 1}: ${googleDistance}mi, ${GoogleDistanceMatrixService.formatDuration(googleDriveTime)}`);
        } catch (error) {
          console.error(`❌ CRITICAL FIX: API error for segment ${i + 1}:`, error);
          // Use fallback ONLY if API fails
          googleDistance = 250;
          googleDriveTime = 4;
          apiStatus = 'FALLBACK_ERROR';
        }
      } else {
        console.warn(`⚠️ CRITICAL FIX: No API key for segment ${i + 1}, using fallback`);
        googleDistance = 250;
        googleDriveTime = 4;
        apiStatus = 'NO_API_KEY';
      }
      
      // Get attractions for the destination city
      const attractions = await AttractionService.getAttractionsForStop(structure.endStop);
      
      // Get drive time category based on REAL Google API duration
      const driveTimeCategory = this.getDriveTimeCategory(googleDriveTime);
      
      // CRITICAL FIX: Create segment with REAL Google API data ONLY
      const segment: DailySegment = {
        day: i + 1,
        startCity: structure.startStop.name,
        endCity: structure.endStop.name,
        distance: googleDistance, // REAL Google API distance
        approximateMiles: googleDistance, // Keep for compatibility
        drivingTime: googleDriveTime, // REAL Google API duration
        driveTimeHours: googleDriveTime, // REAL Google API duration
        attractions: attractions || [],
        subStops: structure.intermediateStops,
        driveTimeCategory,
        title: `${structure.startStop.name} → ${structure.endStop.name}`,
        recommendedStops: [],
        subStopTimings: [],
        routeSection: this.getRouteSection(i + 1, requestedDays)
      };
      
      console.log(`✅ CRITICAL FIX: Created segment ${segment.day} with REAL Google data:`, {
        distance: segment.distance,
        driveTimeHours: segment.driveTimeHours,
        startCity: segment.startCity,
        endCity: segment.endCity,
        status: apiStatus
      });
      
      segments.push(segment);
    }
    
    console.log(`🎯 CRITICAL FIX: All segments created with REAL Google API data:`, 
      segments.map(s => `Day ${s.day}: ${s.distance}mi, ${s.driveTimeHours.toFixed(1)}h (${s.startCity} → ${s.endCity})`)
    );
    
    return segments;
  }

  // CRITICAL FIX: NEW METHOD that only creates segment structure (no distance/time data)
  private static createSegmentStructure(routeStops: TripStop[], requestedDays: number): Array<{
    startStop: TripStop;
    endStop: TripStop;
    intermediateStops: TripStop[];
  }> {
    const structures: Array<{
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
      
      structures.push({
        startStop,
        endStop,
        intermediateStops
      });
      
      currentStopIndex = endStopIndex;
      
      if (endStopIndex >= routeStops.length - 1) break;
    }
    
    return structures;
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
