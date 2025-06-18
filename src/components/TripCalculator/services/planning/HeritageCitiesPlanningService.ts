
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { TripBoundaryService } from './TripBoundaryService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class HeritageCitiesPlanningService {
  // STRICT LIMITS - These are absolute maximums
  private static readonly MAX_DAILY_DRIVE_HOURS = 8;
  private static readonly PREFERRED_DAILY_DRIVE_HOURS = 6;
  private static readonly MAX_DAILY_DISTANCE = 400; // Reduced from 450 for safety
  private static readonly PREFERRED_DAILY_DISTANCE = 300; // Reduced from 350
  private static readonly MIN_DAILY_DISTANCE = 150; // Minimum to avoid too-short days
  
  /**
   * Plan a Heritage Cities focused trip with logical geographic progression
   */
  static async planHeritageCitiesTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    allStops: TripStop[]
  ): Promise<TripPlan> {
    console.log(`🏛️ HeritageCitiesPlanningService: Planning trip from "${startLocation}" to "${endLocation}" in ${travelDays} days`);

    try {
      // Find boundary stops with enhanced matching
      const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
        startLocation,
        endLocation,
        allStops
      );

      console.log(`✅ Found boundary stops:`, {
        start: `${startStop.name} (${startStop.state})`,
        end: `${endStop.name} (${endStop.state})`,
        routeStops: routeStops.length
      });

      // Calculate total distance and validate feasibility
      const totalDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        endStop.latitude,
        endStop.longitude
      );

      console.log(`📏 Total distance: ${totalDistance.toFixed(1)} miles for ${travelDays} days`);

      // Create logical progression with balanced segments
      const logicalDestinations = this.createBalancedProgression(
        startStop, 
        endStop, 
        routeStops, 
        travelDays,
        totalDistance
      );
      
      console.log(`🏛️ Created progression with ${logicalDestinations.length} intermediate destinations`);

      // Create segments with strict validation
      const segments = this.createBalancedSegments(
        startStop,
        endStop,
        logicalDestinations,
        travelDays,
        totalDistance
      );

      const totalDrivingTime = segments.reduce((total, segment) => {
        return total + (segment.driveTimeHours || 0);
      }, 0);

      const tripPlan: TripPlan = {
        id: `heritage-trip-${Date.now()}`,
        startLocation,
        endLocation,
        startCity: startStop.city_name || startStop.name,
        endCity: endStop.city_name || endStop.name,
        totalDistance,
        totalMiles: totalDistance,
        totalDays: travelDays,
        totalDrivingTime,
        segments,
        stops: [startStop, ...logicalDestinations, endStop],
        dailySegments: segments,
        startDate: new Date(),
        title: `${startLocation} to ${endLocation} Heritage Route 66 Journey`,
        tripStyle: 'destination-focused',
        lastUpdated: new Date()
      };

      console.log(`✅ Trip planned successfully`, {
        segments: segments.length,
        totalDistance: totalDistance.toFixed(1),
        totalDrivingTime: totalDrivingTime.toFixed(1),
        avgDailyDistance: (totalDistance / travelDays).toFixed(1),
        maxDailyDriveTime: Math.max(...segments.map(s => s.driveTimeHours || 0)).toFixed(1)
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ Heritage Cities planning failed:', error);
      throw new Error(`Heritage Cities planning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create balanced progression ensuring no day is too short or too long
   */
  private static createBalancedProgression(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    travelDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🗺️ Creating balanced progression for ${travelDays} days, ${totalDistance.toFixed(0)} miles`);

    // Target distance per day
    const targetDailyDistance = totalDistance / travelDays;
    console.log(`🎯 Target daily distance: ${targetDailyDistance.toFixed(0)} miles`);

    // Determine direction (east-west or west-east)
    const isEastToWest = startStop.longitude < endStop.longitude;
    console.log(`🧭 Direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // Filter and sort stops geographically
    const validStops = this.filterAndSortStops(startStop, endStop, routeStops, isEastToWest);
    
    if (validStops.length === 0) {
      console.warn('⚠️ No valid intermediate stops found');
      return [];
    }

    console.log(`🛣️ Valid stops: ${validStops.map(s => s.name).join(' → ')}`);

    // Select destinations ensuring balanced daily distances
    const destinations: TripStop[] = [];
    let currentStop = startStop;
    let totalDistanceCovered = 0;

    for (let day = 1; day < travelDays; day++) {
      const targetDistanceForDay = day * targetDailyDistance;
      
      const nextStop = this.findOptimalNextStop(
        currentStop,
        endStop,
        validStops,
        destinations,
        targetDistanceForDay - totalDistanceCovered,
        day,
        travelDays
      );

      if (nextStop) {
        const segmentDistance = DistanceCalculationService.calculateDistance(
          currentStop.latitude,
          currentStop.longitude,
          nextStop.latitude,
          nextStop.longitude
        );

        // Validate this segment meets our criteria
        if (segmentDistance >= this.MIN_DAILY_DISTANCE && segmentDistance <= this.MAX_DAILY_DISTANCE) {
          destinations.push(nextStop);
          currentStop = nextStop;
          totalDistanceCovered += segmentDistance;
          console.log(`📍 Day ${day + 1}: ${nextStop.name} (+${segmentDistance.toFixed(0)}mi, total: ${totalDistanceCovered.toFixed(0)}mi)`);
        } else {
          console.warn(`⚠️ Skipping ${nextStop.name}: ${segmentDistance.toFixed(0)}mi outside range [${this.MIN_DAILY_DISTANCE}-${this.MAX_DAILY_DISTANCE}]`);
          break;
        }
      } else {
        console.log(`⚠️ No suitable stop found for day ${day + 1}`);
        break;
      }
    }

    return destinations;
  }

  /**
   * Filter stops that are geographically between start and end, and sort them
   */
  private static filterAndSortStops(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    isEastToWest: boolean
  ): TripStop[] {
    const validStops = routeStops.filter(stop => {
      // Check if geographically between start and end
      const isBetween = isEastToWest 
        ? stop.longitude > startStop.longitude && stop.longitude < endStop.longitude
        : stop.longitude < startStop.longitude && stop.longitude > endStop.longitude;
      
      if (!isBetween) return false;
      
      // Check if the stop is within reasonable distance from the direct route
      const distanceFromRoute = this.calculateDistanceFromDirectRoute(startStop, endStop, stop);
      return distanceFromRoute < 100; // Within 100 miles of direct route
    });

    // Sort by geographic progression
    validStops.sort((a, b) => {
      return isEastToWest ? a.longitude - b.longitude : b.longitude - a.longitude;
    });

    return validStops;
  }

  /**
   * Find optimal next stop ensuring balanced daily distances
   */
  private static findOptimalNextStop(
    currentStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    alreadySelected: TripStop[],
    targetDistance: number,
    currentDay: number,
    totalDays: number
  ): TripStop | null {
    const remainingStops = availableStops.filter(stop => 
      !alreadySelected.some(selected => selected.id === stop.id)
    );

    if (remainingStops.length === 0) return null;

    let bestStop: TripStop | null = null;
    let bestScore = Infinity;

    for (const stop of remainingStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude,
        currentStop.longitude,
        stop.latitude,
        stop.longitude
      );

      // Skip if outside acceptable range
      if (distance < this.MIN_DAILY_DISTANCE || distance > this.MAX_DAILY_DISTANCE) {
        continue;
      }

      // Score based on how close to target distance (prefer slightly under target)
      const distanceScore = Math.abs(distance - targetDistance);
      
      // Bonus for heritage value
      const heritageBonus = stop.heritage_value === 'high' ? -50 : 
                           stop.heritage_value === 'medium' ? -25 : 0;
      
      // Penalty for stops that are too far ahead in progression
      const progressionPenalty = currentDay < totalDays - 1 ? 0 : 
        distance > (targetDistance * 1.2) ? 100 : 0;
      
      const totalScore = distanceScore + heritageBonus + progressionPenalty;

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestStop = stop;
      }
    }

    return bestStop;
  }

  /**
   * Calculate distance of a point from the direct route line
   */
  private static calculateDistanceFromDirectRoute(
    startStop: TripStop,
    endStop: TripStop,
    testStop: TripStop
  ): number {
    // Simplified calculation - distance from point to line
    const A = startStop.latitude;
    const B = startStop.longitude;
    const C = endStop.latitude;
    const D = endStop.longitude;
    const P = testStop.latitude;
    const Q = testStop.longitude;

    // Distance from point (P,Q) to line through (A,B) and (C,D)
    const numerator = Math.abs((D - B) * (A - P) - (C - A) * (B - Q));
    const denominator = Math.sqrt(Math.pow(D - B, 2) + Math.pow(C - A, 2));
    
    // Convert to approximate miles
    const distanceInDegrees = numerator / denominator;
    return distanceInDegrees * 69; // Approximate miles per degree
  }

  /**
   * Create balanced segments ensuring no extreme variations
   */
  private static createBalancedSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    travelDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🛠️ Creating ${travelDays} balanced segments`);

    const segments: DailySegment[] = [];
    const allStops = [startStop, ...destinations, endStop];
    
    for (let i = 0; i < allStops.length - 1; i++) {
      const currentStop = allStops[i];
      const nextStop = allStops[i + 1];
      const day = i + 1;

      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude,
        currentStop.longitude,
        nextStop.latitude,
        nextStop.longitude
      );

      // Calculate realistic drive time with Route 66 considerations
      const driveTime = this.calculateRealisticDriveTime(distance);

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.city_name || currentStop.name} to ${nextStop.city_name || nextStop.name}`,
        startCity: currentStop.city_name || currentStop.name,
        endCity: nextStop.city_name || nextStop.name,
        distance: Math.round(distance),
        approximateMiles: Math.round(distance),
        driveTimeHours: Math.round(driveTime * 10) / 10,
        destination: {
          city: nextStop.city_name || nextStop.name,
          state: nextStop.state || 'Unknown'
        },
        recommendedStops: [],
        attractions: [{
          name: nextStop.name,
          title: nextStop.name,
          description: nextStop.description,
          city: nextStop.city_name || nextStop.name
        }]
      };

      segments.push(segment);
      
      console.log(`📅 Day ${day}: ${currentStop.name} → ${nextStop.name}, ${distance.toFixed(1)} miles, ${driveTime.toFixed(1)} hours`);
    }

    return segments;
  }

  /**
   * Calculate realistic drive time for Route 66 with stops and sightseeing
   */
  private static calculateRealisticDriveTime(distance: number): number {
    // Base speed varies by distance (longer distances = faster average speed)
    let avgSpeed: number;
    
    if (distance < 100) {
      avgSpeed = 40; // Lots of stops, city driving
    } else if (distance < 200) {
      avgSpeed = 45; // Mixed driving
    } else if (distance < 300) {
      avgSpeed = 50; // Mostly highway
    } else {
      avgSpeed = 55; // Long highway stretches
    }
    
    const baseTime = distance / avgSpeed;
    
    // Add buffer for stops, traffic, sightseeing (15% buffer)
    const bufferMultiplier = 1.15;
    const calculatedTime = baseTime * bufferMultiplier;
    
    // Cap at maximum drive time
    return Math.min(calculatedTime, this.MAX_DAILY_DRIVE_HOURS);
  }
}
