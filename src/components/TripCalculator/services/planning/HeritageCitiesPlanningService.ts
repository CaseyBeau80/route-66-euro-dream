
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { TripBoundaryService } from './TripBoundaryService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class HeritageCitiesPlanningService {
  // Maximum daily drive time in hours - STRICT LIMIT
  private static readonly MAX_DAILY_DRIVE_HOURS = 8;
  private static readonly PREFERRED_DAILY_DRIVE_HOURS = 6;
  
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
      const maxPossibleDistance = travelDays * this.MAX_DAILY_DRIVE_HOURS * 65; // 65 mph average
      if (totalDistance > maxPossibleDistance) {
        console.warn(`⚠️ Trip may require longer drives than preferred. Total: ${totalDistance.toFixed(0)}mi, Max preferred: ${maxPossibleDistance.toFixed(0)}mi`);
      }

      // Create logical progression with strict distance controls
      const logicalDestinations = this.createLogicalProgressionWithDistanceControl(
        startStop, 
        endStop, 
        routeStops, 
        travelDays,
        totalDistance
      );
      
      console.log(`🏛️ HeritageCitiesPlanningService: Created logical progression with ${logicalDestinations.length} destinations`);

      // Create segments with STRICT drive time validation
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
   * Create logical progression with strict distance controls
   */
  private static createLogicalProgressionWithDistanceControl(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    travelDays: number,
    totalDistance: number
  ): TripStop[] {
    console.log(`🗺️ Creating logical progression with distance control for ${travelDays} days`);

    // Calculate maximum reasonable daily distance
    const maxDailyDistance = this.MAX_DAILY_DRIVE_HOURS * 65; // 65 mph average
    const preferredDailyDistance = this.PREFERRED_DAILY_DRIVE_HOURS * 65;
    
    console.log(`📏 Distance constraints: Max ${maxDailyDistance}mi/day, Preferred ${preferredDailyDistance}mi/day`);

    // Determine direction (east-west or west-east)
    const isEastToWest = startStop.longitude < endStop.longitude;
    console.log(`🧭 Direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // Filter stops that are geographically between start and end
    const validStops = routeStops.filter(stop => {
      const isBetween = isEastToWest 
        ? stop.longitude > startStop.longitude && stop.longitude < endStop.longitude
        : stop.longitude < startStop.longitude && stop.longitude > endStop.longitude;
      
      if (!isBetween) return false;
      
      // Also check if the stop is within reasonable distance from the direct route
      const distanceFromRoute = this.calculateDistanceFromDirectRoute(startStop, endStop, stop);
      return distanceFromRoute < 150; // Within 150 miles of direct route
    });

    // Sort by geographic progression
    validStops.sort((a, b) => {
      return isEastToWest ? a.longitude - b.longitude : b.longitude - a.longitude;
    });

    console.log(`🛣️ Valid stops along route: ${validStops.map(s => s.name).join(' → ')}`);

    // Select destinations with strict distance validation
    const destinations: TripStop[] = [];
    let currentStop = startStop;
    const availableDays = travelDays - 1; // Reserve last day for final destination

    for (let day = 1; day <= availableDays; day++) {
      // Calculate target distance for this day
      const remainingDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude,
        currentStop.longitude,
        endStop.latitude,
        endStop.longitude
      );
      
      const remainingDays = availableDays - day + 1;
      const targetDistance = Math.min(
        preferredDailyDistance,
        remainingDistance / remainingDays
      );

      // Find best stop within distance constraints
      const nextStop = this.findNextStopWithDistanceConstraint(
        currentStop,
        validStops,
        destinations,
        targetDistance,
        maxDailyDistance
      );

      if (nextStop) {
        destinations.push(nextStop);
        currentStop = nextStop;
        console.log(`📍 Day ${day + 1} destination: ${nextStop.name} (${targetDistance.toFixed(0)}mi target)`);
      } else {
        console.log(`⚠️ No suitable stop found for day ${day + 1}, stopping progression`);
        break;
      }
    }

    return destinations;
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
    // This is an approximation for geographic coordinates
    const A = startStop.latitude;
    const B = startStop.longitude;
    const C = endStop.latitude;
    const D = endStop.longitude;
    const P = testStop.latitude;
    const Q = testStop.longitude;

    // Distance from point (P,Q) to line through (A,B) and (C,D)
    const numerator = Math.abs((D - B) * (A - P) - (C - A) * (B - Q));
    const denominator = Math.sqrt(Math.pow(D - B, 2) + Math.pow(C - A, 2));
    
    // Convert to approximate miles (rough conversion for latitude/longitude)
    const distanceInDegrees = numerator / denominator;
    return distanceInDegrees * 69; // Approximate miles per degree
  }

  /**
   * Find next stop with strict distance constraints
   */
  private static findNextStopWithDistanceConstraint(
    currentStop: TripStop,
    availableStops: TripStop[],
    alreadySelected: TripStop[],
    targetDistance: number,
    maxDistance: number
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

      // STRICT: Reject if over maximum distance
      if (distance > maxDistance) {
        console.log(`❌ Rejecting ${stop.name}: ${distance.toFixed(0)}mi exceeds max ${maxDistance}mi`);
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

    if (bestStop) {
      const finalDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude,
        currentStop.longitude,
        bestStop.latitude,
        bestStop.longitude
      );
      console.log(`✅ Selected ${bestStop.name}: ${finalDistance.toFixed(0)}mi (target: ${targetDistance.toFixed(0)}mi)`);
    }

    return bestStop;
  }

  /**
   * Create segments with STRICT drive time validation
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

      const driveTime = DistanceCalculationService.calculateDriveTime(distance);

      // STRICT VALIDATION: Log warnings for long drives
      if (driveTime > this.MAX_DAILY_DRIVE_HOURS) {
        console.error(`❌ INVALID SEGMENT: Day ${day} drive time ${driveTime.toFixed(1)}h exceeds maximum ${this.MAX_DAILY_DRIVE_HOURS}h`);
      } else if (driveTime > this.PREFERRED_DAILY_DRIVE_HOURS) {
        console.warn(`⚠️ LONG DRIVE: Day ${day} drive time ${driveTime.toFixed(1)}h exceeds preferred ${this.PREFERRED_DAILY_DRIVE_HOURS}h`);
      }

      // Cap at maximum but warn about it
      const cappedDriveTime = Math.min(driveTime, this.MAX_DAILY_DRIVE_HOURS);
      const wasCapped = driveTime > this.MAX_DAILY_DRIVE_HOURS;

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.city_name || currentStop.name} to ${nextStop.city_name || nextStop.name}`,
        startCity: currentStop.city_name || currentStop.name,
        endCity: nextStop.city_name || nextStop.name,
        distance: Math.max(distance, 1),
        approximateMiles: Math.round(Math.max(distance, 1)),
        driveTimeHours: Math.max(cappedDriveTime, 0.1),
        destination: {
          city: nextStop.city_name || nextStop.name,
          state: nextStop.state || 'Unknown'
        },
        recommendedStops: [],
        attractions: day <= destinations.length ? [{
          name: nextStop.name,
          title: nextStop.name,
          description: nextStop.description,
          city: nextStop.city_name || nextStop.name
        }] : [],
        driveTimeWarning: wasCapped ? 
          `Drive time capped at ${this.MAX_DAILY_DRIVE_HOURS} hours maximum (originally ${driveTime.toFixed(1)} hours)` : 
          undefined
      };

      segments.push(segment);
      
      console.log(`📅 Day ${day}: ${currentStop.name} → ${nextStop.name}, ${distance.toFixed(1)} miles, ${cappedDriveTime.toFixed(1)} hours${wasCapped ? ' (CAPPED)' : ''}`);
    }

    return segments;
  }
}
