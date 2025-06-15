import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SegmentTimingCalculator } from './SegmentTimingCalculator';
import { DriveTimeBalancingService } from './DriveTimeBalancingService';
import { AttractionService } from './AttractionService';
import { TripPlan, DailySegment, DriveTimeCategory, RecommendedStop, SegmentTiming } from './TripPlanTypes';

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
    console.log(`🏗️ Building trip plan: ${startStop.name} → ${endStop.name} in ${requestedDays} days`);

    // Get all stops between start and end
    const routeStops = this.getRouteStops(startStop, endStop, allStops);
    console.log(`📍 Route includes ${routeStops.length} stops`);

    // Calculate total distance for the entire route
    const totalDistance = this.calculateTotalRouteDistance(routeStops);
    console.log(`🗺️ Total route distance: ${totalDistance.toFixed(1)} miles`);

    // Plan daily segments
    const segments = await this.planDailySegments(routeStops, requestedDays, totalDistance);
    
    // Calculate total driving time from all segments
    const totalDrivingTime = segments.reduce((total, segment) => {
      const segmentDriveTime = segment.driveTimeHours || 0;
      console.log(`📊 Segment ${segment.day}: ${segment.startCity} → ${segment.endCity} = ${segmentDriveTime.toFixed(1)}h`);
      return total + segmentDriveTime;
    }, 0);

    console.log(`⏱️ Total driving time calculated: ${totalDrivingTime.toFixed(1)} hours from ${segments.length} segments`);

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
      totalDrivingTime, // Now properly calculated from segments
      segments,
      dailySegments: segments, // For legacy compatibility
      route,
      // Set additional properties
      title: `${startStop.name} to ${endStop.name} Route 66 Adventure`,
      totalMiles: Math.round(totalDistance)
    };

    console.log(`✅ Trip plan built successfully: ${segments.length} days, ${totalDistance.toFixed(0)} miles, ${totalDrivingTime.toFixed(1)}h driving`);
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

  private static async planDailySegments(
    routeStops: TripStop[],
    requestedDays: number,
    totalDistance: number
  ): Promise<DailySegment[]> {
    const segments: DailySegment[] = [];
    const stopsPerDay = Math.max(1, Math.floor(routeStops.length / requestedDays));
    
    let currentStopIndex = 0;
    
    for (let day = 1; day <= requestedDays; day++) {
      const isLastDay = day === requestedDays;
      const startStopIndex = currentStopIndex;
      
      let endStopIndex: number;
      if (isLastDay) {
        endStopIndex = routeStops.length - 1;
      } else {
        endStopIndex = Math.min(
          startStopIndex + stopsPerDay,
          routeStops.length - 2
        );
      }
      
      const dayStartStop = routeStops[startStopIndex];
      const dayEndStop = routeStops[endStopIndex];
      const dayIntermediateStops = routeStops.slice(startStopIndex + 1, endStopIndex);
      
      // Calculate segment distance and drive time
      const segmentDistance = DistanceCalculationService.calculateDistance(
        dayStartStop.latitude, dayStartStop.longitude,
        dayEndStop.latitude, dayEndStop.longitude
      );

      // Calculate realistic drive time for this segment
      const segmentDriveTime = this.calculateSegmentDriveTime(segmentDistance);
      
      console.log(`🚗 Day ${day}: ${dayStartStop.name} → ${dayEndStop.name} - Distance: ${segmentDistance.toFixed(1)}mi, Drive Time: ${segmentDriveTime.toFixed(1)}h`);
      
      // Get attractions for the destination city
      const attractions = await AttractionService.getAttractionsForStop(dayEndStop);
      
      // Get drive time category object instead of string
      const driveTimeCategory = this.getDriveTimeCategory(segmentDriveTime);
      
      const segment: DailySegment = {
        day,
        startCity: dayStartStop.name,
        endCity: dayEndStop.name,
        distance: Math.round(segmentDistance),
        approximateMiles: Math.round(segmentDistance),
        drivingTime: segmentDriveTime,
        driveTimeHours: segmentDriveTime, // This is the key property for drive time
        attractions: attractions || [],
        subStops: dayIntermediateStops,
        driveTimeCategory,
        title: `${dayStartStop.name} → ${dayEndStop.name}`,
        recommendedStops: [], // Initialize empty, will be populated by other services
        subStopTimings: [], // Initialize empty, will be populated by other services
        routeSection: this.getRouteSection(day, requestedDays)
      };
      
      segments.push(segment);
      currentStopIndex = endStopIndex;
      
      if (endStopIndex >= routeStops.length - 1) break;
    }
    
    console.log(`📋 Created ${segments.length} segments with total drive time: ${segments.reduce((t, s) => t + s.driveTimeHours, 0).toFixed(1)}h`);
    return segments;
  }

  private static calculateSegmentDriveTime(distance: number): number {
    // Realistic drive time calculation based on Route 66 conditions
    let avgSpeed: number;
    
    if (distance < 50) {
      avgSpeed = 45; // Urban/city driving with stops
    } else if (distance < 150) {
      avgSpeed = 55; // Mixed highway/rural roads
    } else {
      avgSpeed = 65; // Highway driving
    }
    
    // Calculate base time and add small buffer for stops
    const baseTime = distance / avgSpeed;
    const bufferMultiplier = distance < 100 ? 1.1 : 1.05;
    
    return Math.max(baseTime * bufferMultiplier, 0.5);
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
