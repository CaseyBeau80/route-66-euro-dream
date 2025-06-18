
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { TripBoundaryService } from './TripBoundaryService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class HeritageCitiesPlanningService {
  // STRICT LIMITS - These are absolute maximums
  private static readonly MAX_DAILY_DRIVE_HOURS = 8;
  private static readonly PREFERRED_DAILY_DRIVE_HOURS = 6;
  private static readonly MAX_DAILY_DISTANCE = 450; // Absolute maximum miles per day
  private static readonly PREFERRED_DAILY_DISTANCE = 350; // Preferred miles per day
  
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
    console.log(`📊 HeritageCitiesPlanningService: Available stops: ${allStops.length}`);

    try {
      // Find boundary stops with enhanced matching
      const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
        startLocation,
        endLocation,
        allStops
      );

      console.log(`✅ HeritageCitiesPlanningService: Found boundary stops:`, {
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

      console.log(`📏 HeritageCitiesPlanningService: Total distance: ${totalDistance.toFixed(1)} miles`);

      // Check if trip is feasible with our constraints
      const maxPossibleDistance = travelDays * this.MAX_DAILY_DISTANCE;
      if (totalDistance > maxPossibleDistance) {
        console.warn(`⚠️ Trip may require longer drives than preferred. Total: ${totalDistance.toFixed(0)}mi, Max possible: ${maxPossibleDistance.toFixed(0)}mi`);
      }

      // Create logical progression with STRICT distance controls
      const logicalDestinations = this.createLogicalProgressionWithStrictControls(
        startStop, 
        endStop, 
        routeStops, 
        travelDays,
        totalDistance
      );
      
      console.log(`🏛️ HeritageCitiesPlanningService: Created logical progression with ${logicalDestinations.length} destinations`);

      // Create segments with STRICT validation
      const segments = this.createStrictlyValidatedSegments(
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

      console.log(`✅ HeritageCitiesPlanningService: Trip planned successfully`, {
        segments: segments.length,
        totalDistance: totalDistance.toFixed(1),
        totalDrivingTime: totalDrivingTime.toFixed(1),
        maxDailyDriveTime: Math.max(...segments.map(s => s.driveTimeHours || 0)).toFixed(1)
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ HeritageCitiesPlanningService: Error planning heritage trip:', error);
      throw new Error(`Heritage Cities planning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create logical progression with STRICT distance and geographic controls
   */
  private static createLogicalProgressionWithStrictControls(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    travelDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🗺️ Creating logical progression with STRICT controls for ${travelDays} days`);

    // Determine direction (east-west or west-east)
    const isEastToWest = startStop.longitude < endStop.longitude;
    console.log(`🧭 Direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // Filter stops that are truly between start and end geographically
    const validStops = this.filterGeographicallyValidStops(startStop, endStop, routeStops, isEastToWest);

    // Sort by geographic progression
    validStops.sort((a, b) => {
      return isEastToWest ? a.longitude - b.longitude : b.longitude - a.longitude;
    });

    console.log(`🛣️ Valid stops along route: ${validStops.map(s => s.name).join(' → ')}`);

    // Select destinations with STRICT distance validation
    const destinations: TripStop[] = [];
    let currentStop = startStop;
    const availableDays = travelDays - 1; // Reserve last day for final destination

    for (let day = 1; day <= availableDays; day++) {
      const nextStop = this.findNextLogicalStop(
        currentStop,
        endStop,
        validStops,
        destinations,
        day,
        availableDays
      );

      if (nextStop) {
        const distance = DistanceCalculationService.calculateDistance(
          currentStop.latitude,
          currentStop.longitude,
          nextStop.latitude,
          nextStop.longitude
        );

        // STRICT validation - reject if over maximum
        if (distance > this.MAX_DAILY_DISTANCE) {
          console.warn(`❌ Rejecting ${nextStop.name}: ${distance.toFixed(0)}mi exceeds maximum ${this.MAX_DAILY_DISTANCE}mi`);
          break;
        }

        destinations.push(nextStop);
        currentStop = nextStop;
        console.log(`📍 Day ${day + 1} destination: ${nextStop.name} (${distance.toFixed(0)}mi)`);
      } else {
        console.log(`⚠️ No suitable stop found for day ${day + 1}, stopping progression`);
        break;
      }
    }

    return destinations;
  }

  /**
   * Filter stops that are geographically between start and end points
   */
  private static filterGeographicallyValidStops(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    isEastToWest: boolean
  ): TripStop[] {
    return routeStops.filter(stop => {
      // Check if geographically between start and end
      const isBetween = isEastToWest 
        ? stop.longitude > startStop.longitude && stop.longitude < endStop.longitude
        : stop.longitude < startStop.longitude && stop.longitude > endStop.longitude;
      
      if (!isBetween) return false;
      
      // Check if the stop is within reasonable distance from the direct route
      const distanceFromRoute = this.calculateDistanceFromDirectRoute(startStop, endStop, stop);
      const isReasonableDistance = distanceFromRoute < 100; // Within 100 miles of direct route
      
      console.log(`🔍 Stop ${stop.name}: between=${isBetween}, routeDistance=${distanceFromRoute.toFixed(0)}mi, valid=${isReasonableDistance}`);
      
      return isReasonableDistance;
    });
  }

  /**
   * Find the next logical stop with strict distance and progression controls
   */
  private static findNextLogicalStop(
    currentStop: TripStop,
    endStop: TripStop,
    availableStops: TripStop[],
    alreadySelected: TripStop[],
    currentDay: number,
    totalDays: number
  ): TripStop | null {
    const remainingStops = availableStops.filter(stop => 
      !alreadySelected.some(selected => selected.id === stop.id)
    );

    if (remainingStops.length === 0) return null;

    // Calculate remaining distance to end
    const remainingDistance = DistanceCalculationService.calculateDistance(
      currentStop.latitude,
      currentStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    const remainingDays = totalDays - currentDay;
    
    // Target distance should not exceed our daily limits
    const targetDistance = Math.min(
      this.PREFERRED_DAILY_DISTANCE,
      remainingDistance / remainingDays
    );

    console.log(`🎯 Day ${currentDay}: Target distance ${targetDistance.toFixed(0)}mi (remaining: ${remainingDistance.toFixed(0)}mi, days left: ${remainingDays})`);

    let bestStop: TripStop | null = null;
    let bestScore = Infinity;

    for (const stop of remainingStops) {
      const distance = DistanceCalculationService.calculateDistance(
        currentStop.latitude,
        currentStop.longitude,
        stop.latitude,
        stop.longitude
      );

      // STRICT: Skip if over maximum distance
      if (distance > this.MAX_DAILY_DISTANCE) {
        console.log(`❌ Skipping ${stop.name}: ${distance.toFixed(0)}mi exceeds maximum ${this.MAX_DAILY_DISTANCE}mi`);
        continue;
      }

      // Score based on how close to target distance
      const distanceScore = Math.abs(distance - targetDistance);
      
      // Bonus for heritage value
      const heritageBonus = stop.heritage_value === 'high' ? -50 : 
                           stop.heritage_value === 'medium' ? -25 : 0;
      
      const totalScore = distanceScore + heritageBonus;

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
   * Create segments with STRICT validation and realistic drive times
   */
  private static createStrictlyValidatedSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    travelDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🛠️ Creating ${travelDays} strictly validated segments`);

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

      // STRICT validation - Cap distance at maximum
      const cappedDistance = Math.min(distance, this.MAX_DAILY_DISTANCE);
      const wasDistanceCapped = distance > this.MAX_DAILY_DISTANCE;

      // Calculate realistic drive time - never exceed maximum hours
      const driveTime = Math.min(
        cappedDistance / 55, // 55 mph average
        this.MAX_DAILY_DRIVE_HOURS
      );

      if (wasDistanceCapped) {
        console.error(`❌ DISTANCE CAPPED: Day ${day} distance ${distance.toFixed(0)}mi capped to ${this.MAX_DAILY_DISTANCE}mi`);
      }

      if (driveTime > this.PREFERRED_DAILY_DRIVE_HOURS) {
        console.warn(`⚠️ LONG DRIVE: Day ${day} drive time ${driveTime.toFixed(1)}h exceeds preferred ${this.PREFERRED_DAILY_DRIVE_HOURS}h`);
      }

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.city_name || currentStop.name} to ${nextStop.city_name || nextStop.name}`,
        startCity: currentStop.city_name || currentStop.name,
        endCity: nextStop.city_name || nextStop.name,
        distance: cappedDistance,
        approximateMiles: Math.round(cappedDistance),
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
        }],
        driveTimeWarning: wasDistanceCapped ? 
          `Route distance was capped at ${this.MAX_DAILY_DISTANCE} miles maximum (originally ${distance.toFixed(0)} miles)` : 
          undefined
      };

      segments.push(segment);
      
      console.log(`📅 Day ${day}: ${currentStop.name} → ${nextStop.name}, ${cappedDistance.toFixed(1)} miles, ${driveTime.toFixed(1)} hours${wasDistanceCapped ? ' (DISTANCE CAPPED)' : ''}`);
    }

    return segments;
  }
}
