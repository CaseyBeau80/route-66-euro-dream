import { TripStop } from '../data/SupabaseDataService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { SegmentTimingCalculator } from './SegmentTimingCalculator';
import { DriveTimeBalancingService } from './DriveTimeBalancingService';
import { AttractionService } from './AttractionService';

export interface DailySegment {
  day: number;
  startCity: string;
  endCity: string;
  distance: number;
  approximateMiles: number;
  drivingTime?: number;
  driveTimeHours: number;
  attractions: TripStop[];
  subStops: TripStop[];
  driveTimeCategory: DriveTimeCategory;
}

export type DriveTimeCategory = 'light' | 'moderate' | 'heavy' | 'extreme';

export interface TripPlan {
  startCity: string;
  endCity: string;
  totalDistance: number;
  totalDays: number;
  totalDrivingTime: number; // This should always be calculated properly
  segments: DailySegment[];
  route: { lat: number; lng: number }[];
}

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
      return total + (segment.driveTimeHours || 0);
    }, 0);

    console.log(`⏱️ Total driving time calculated: ${totalDrivingTime.toFixed(1)} hours`);

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
      route
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
      
      // Get attractions for the destination city
      const attractions = await AttractionService.getAttractionsForStop(dayEndStop);
      
      // Get drive time category
      const driveTimeCategory = SegmentTimingCalculator.getDriveTimeCategory(segmentDriveTime);
      
      const segment: DailySegment = {
        day,
        startCity: dayStartStop.name,
        endCity: dayEndStop.name,
        distance: Math.round(segmentDistance),
        approximateMiles: Math.round(segmentDistance),
        drivingTime: segmentDriveTime,
        driveTimeHours: segmentDriveTime,
        attractions,
        subStops: dayIntermediateStops,
        driveTimeCategory
      };
      
      segments.push(segment);
      currentStopIndex = endStopIndex;
      
      console.log(`📅 Day ${day}: ${dayStartStop.name} → ${dayEndStop.name} (${segmentDistance.toFixed(0)}mi, ${segmentDriveTime.toFixed(1)}h)`);
      
      if (endStopIndex >= routeStops.length - 1) break;
    }
    
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
}
