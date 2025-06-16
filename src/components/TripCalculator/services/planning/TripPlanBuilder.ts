
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
    console.log(`🔥 TripPlanBuilder: Building trip plan: ${startStop.name} → ${endStop.name} in ${requestedDays} days`);
    console.log(`🔑 TripPlanBuilder: Google API available: ${GoogleDistanceMatrixService.isAvailable()}`);

    if (!GoogleDistanceMatrixService.isAvailable()) {
      throw new Error('Google Distance Matrix API key is required for accurate trip planning');
    }

    // Get all stops between start and end
    const routeStops = this.getRouteStops(startStop, endStop, allStops);
    console.log(`📍 TripPlanBuilder: Route includes ${routeStops.length} stops`);

    // Build segments with ONLY Google API data - no fallbacks
    const segments = await this.buildSegmentsWithGoogleAPI(routeStops, requestedDays);
    
    // Calculate totals from ACTUAL Google API segment data only
    const totalDistance = segments.reduce((total, segment) => total + segment.distance, 0);
    const totalDrivingTime = segments.reduce((total, segment) => total + segment.driveTimeHours, 0);

    console.log(`🔥 TripPlanBuilder: Final totals from Google API - Distance: ${totalDistance}, Drive Time: ${totalDrivingTime.toFixed(1)}h`);

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

    console.log(`🔥 TripPlanBuilder: Trip plan completed with Google API data:`, {
      segmentCount: segments.length,
      totalDistance: totalDistance.toFixed(0),
      totalDriveTime: totalDrivingTime.toFixed(1),
      allSegmentsHaveGoogleAPIData: segments.every(s => s.distance > 0 && s.driveTimeHours > 0)
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

  // FIXED METHOD: Uses new getDistanceAndDuration method with NO fallbacks
  private static async buildSegmentsWithGoogleAPI(
    routeStops: TripStop[],
    requestedDays: number
  ): Promise<DailySegment[]> {
    console.log(`🔥 buildSegmentsWithGoogleAPI: Creating ${requestedDays} segments with Google API data`);
    
    // Step 1: Determine which stops will be start/end for each day
    const dayStopPairs = this.calculateDayStopPairs(routeStops, requestedDays);
    console.log(`🔥 Calculated ${dayStopPairs.length} day stop pairs`);
    
    // Step 2: Get Google API data for each day and build segments
    const segments: DailySegment[] = [];
    
    for (let i = 0; i < dayStopPairs.length; i++) {
      const pair = dayStopPairs[i];
      const dayNumber = i + 1;
      
      console.log(`🔥 Processing Day ${dayNumber}: ${pair.startStop.name} → ${pair.endStop.name}`);
      
      try {
        // Use NEW getDistanceAndDuration method - NO fallbacks
        const apiResult = await GoogleDistanceMatrixService.getDistanceAndDuration(
          pair.startStop.name,
          pair.endStop.name
        );
        
        // Convert to expected format
        const distanceMiles = GoogleDistanceMatrixService.convertKmToMiles(apiResult.distanceKm);
        const driveTimeHours = GoogleDistanceMatrixService.convertSecondsToHours(apiResult.durationSeconds);
        
        console.log(`🔥 Got Google API data for Day ${dayNumber}: ${distanceMiles} miles, ${GoogleDistanceMatrixService.formatDurationFromSeconds(apiResult.durationSeconds)}`);
        
        // Get attractions for the destination city
        const attractions = await AttractionService.getAttractionsForStop(pair.endStop);
        
        // Get drive time category based on actual duration
        const driveTimeCategory = this.getDriveTimeCategory(driveTimeHours);
        
        // Create segment with ONLY Google API data
        const segment: DailySegment = {
          day: dayNumber,
          startCity: pair.startStop.name,
          endCity: pair.endStop.name,
          distance: distanceMiles, // Google API distance in miles
          approximateMiles: distanceMiles, // Same value for compatibility
          drivingTime: driveTimeHours, // Google API duration in hours
          driveTimeHours: driveTimeHours, // Google API duration in hours
          attractions: attractions || [],
          subStops: pair.intermediateStops,
          driveTimeCategory,
          title: `${pair.startStop.name} → ${pair.endStop.name}`,
          recommendedStops: [],
          subStopTimings: [],
          routeSection: this.getRouteSection(dayNumber, requestedDays)
        };
        
        console.log(`🔥 Created segment ${segment.day} with Google API data:`, {
          distance: segment.distance,
          driveTimeHours: segment.driveTimeHours,
          startCity: segment.startCity,
          endCity: segment.endCity,
          dataSource: 'GOOGLE_API_ONLY'
        });
        
        segments.push(segment);
        
      } catch (error) {
        console.error(`🔥 Google API failed for Day ${dayNumber}:`, error);
        throw new Error(`Google API failed for Day ${dayNumber}: ${pair.startStop.name} → ${pair.endStop.name}. Error: ${error.message}`);
      }
    }
    
    console.log(`🔥 All segments built with Google API data:`, 
      segments.map(s => `Day ${s.day}: ${s.distance}mi, ${s.driveTimeHours.toFixed(1)}h (${s.startCity} → ${s.endCity})`)
    );
    
    return segments;
  }

  // ADDED: Missing calculateDayStopPairs method
  private static calculateDayStopPairs(routeStops: TripStop[], requestedDays: number): Array<{
    startStop: TripStop;
    endStop: TripStop;
    intermediateStops: TripStop[];
  }> {
    console.log(`🔥 calculateDayStopPairs: Distributing ${routeStops.length} stops across ${requestedDays} days`);
    
    const pairs: Array<{
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
        if (endStopIndex === startStopIndex) {
          endStopIndex = Math.min(startStopIndex + 1, routeStops.length - 1);
        }
      }
      
      const startStop = routeStops[startStopIndex];
      const endStop = routeStops[endStopIndex];
      const intermediateStops = routeStops.slice(startStopIndex + 1, endStopIndex);
      
      console.log(`🔥 Day ${day}: ${startStop.name} → ${endStop.name} (${intermediateStops.length} intermediate stops)`);
      
      pairs.push({
        startStop,
        endStop,
        intermediateStops
      });
      
      currentStopIndex = endStopIndex;
      
      if (endStopIndex >= routeStops.length - 1) break;
    }
    
    console.log(`🔥 Created ${pairs.length} day stop pairs`);
    return pairs;
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
