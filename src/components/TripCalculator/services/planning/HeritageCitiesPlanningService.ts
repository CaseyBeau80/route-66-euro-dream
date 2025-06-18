
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../../types/TripStop';
import { TripBoundaryService } from './TripBoundaryService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';

export class HeritageCitiesPlanningService {
  /**
   * Plan a Heritage Cities focused trip with enhanced stop matching
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

      // Calculate total distance
      const totalDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        endStop.latitude,
        endStop.longitude
      );

      console.log(`📏 HeritageCitiesPlanningService: Total distance: ${totalDistance.toFixed(1)} miles`);

      // Create logical progression of destinations
      const logicalDestinations = this.createLogicalProgression(
        startStop, 
        endStop, 
        routeStops, 
        travelDays
      );
      
      console.log(`🏛️ HeritageCitiesPlanningService: Created logical progression with ${logicalDestinations.length} destinations`);

      // Create segments with validated drive times
      const segments = this.createValidatedSegments(
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
        totalDrivingTime: totalDrivingTime.toFixed(1)
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ HeritageCitiesPlanningService: Error planning heritage trip:', error);
      throw new Error(`Heritage Cities planning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a logical geographic progression from start to end
   */
  private static createLogicalProgression(
    startStop: TripStop,
    endStop: TripStop,
    routeStops: TripStop[],
    travelDays: number
  ): TripStop[] {
    console.log(`🗺️ Creating logical progression for ${travelDays} days`);

    // Calculate total distance to determine progression
    const totalDistance = DistanceCalculationService.calculateDistance(
      startStop.latitude,
      startStop.longitude,
      endStop.latitude,
      endStop.longitude
    );

    // Determine if we're going east to west or west to east
    const isEastToWest = startStop.longitude < endStop.longitude;
    console.log(`🧭 Direction: ${isEastToWest ? 'East to West' : 'West to East'}`);

    // Filter and sort stops by their position along the route
    const validStops = routeStops.filter(stop => {
      // Only include stops that are geographically between start and end
      if (isEastToWest) {
        return stop.longitude > startStop.longitude && stop.longitude < endStop.longitude;
      } else {
        return stop.longitude < startStop.longitude && stop.longitude > endStop.longitude;
      }
    });

    // Sort stops by longitude to maintain geographic progression
    validStops.sort((a, b) => {
      return isEastToWest ? a.longitude - b.longitude : b.longitude - a.longitude;
    });

    console.log(`🛣️ Valid stops along route: ${validStops.map(s => s.name).join(' → ')}`);

    // Select destinations based on available days and distances
    const destinations: TripStop[] = [];
    const availableDays = travelDays - 1; // Subtract 1 for the final day to destination
    
    if (availableDays <= 0 || validStops.length === 0) {
      console.log(`⚠️ Not enough days (${availableDays}) or stops (${validStops.length}) for intermediate destinations`);
      return [];
    }

    // Calculate target distances for each day
    const averageDailyDistance = totalDistance / travelDays;
    console.log(`📏 Average daily distance target: ${averageDailyDistance.toFixed(0)} miles`);

    let currentPosition = startStop;
    
    for (let day = 1; day <= availableDays; day++) {
      const targetDistance = averageDailyDistance * day;
      
      // Find the best stop for this day's target distance
      const bestStop = this.findBestStopForDistance(
        startStop,
        validStops,
        destinations,
        targetDistance
      );

      if (bestStop) {
        destinations.push(bestStop);
        console.log(`📍 Day ${day + 1} destination: ${bestStop.name} (${targetDistance.toFixed(0)} miles target)`);
      }
    }

    return destinations;
  }

  /**
   * Find the best stop for a target distance from start
   */
  private static findBestStopForDistance(
    startStop: TripStop,
    availableStops: TripStop[],
    alreadySelected: TripStop[],
    targetDistance: number
  ): TripStop | null {
    const remainingStops = availableStops.filter(stop => 
      !alreadySelected.some(selected => selected.id === stop.id)
    );

    if (remainingStops.length === 0) return null;

    // Find the stop closest to our target distance
    let bestStop: TripStop | null = null;
    let bestScore = Infinity;

    for (const stop of remainingStops) {
      const distanceFromStart = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        stop.latitude,
        stop.longitude
      );

      // Score based on how close we are to target distance
      const distanceScore = Math.abs(distanceFromStart - targetDistance);
      
      // Bonus for high heritage value
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
   * Create segments with validated drive times
   */
  private static createValidatedSegments(
    startStop: TripStop,
    endStop: TripStop,
    destinations: TripStop[],
    travelDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log(`🛠️ Creating ${travelDays} validated segments`);

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

      // Validate drive time (warn if over 8 hours, cap at 10 hours)
      let validatedDriveTime = driveTime;
      let driveTimeWarning: string | undefined;

      if (driveTime > 10) {
        validatedDriveTime = 10;
        driveTimeWarning = `Original drive time of ${driveTime.toFixed(1)} hours was capped at 10 hours maximum.`;
        console.warn(`⚠️ Day ${day}: Drive time capped at 10 hours (was ${driveTime.toFixed(1)}h)`);
      } else if (driveTime > 8) {
        driveTimeWarning = `Long driving day of ${driveTime.toFixed(1)} hours. Consider planning for fewer stops.`;
        console.warn(`⚠️ Day ${day}: Long drive time of ${driveTime.toFixed(1)} hours`);
      }

      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.city_name || currentStop.name} to ${nextStop.city_name || nextStop.name}`,
        startCity: currentStop.city_name || currentStop.name,
        endCity: nextStop.city_name || nextStop.name,
        distance: Math.max(distance, 1),
        approximateMiles: Math.round(Math.max(distance, 1)),
        driveTimeHours: Math.max(validatedDriveTime, 0.1),
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
        driveTimeWarning
      };

      segments.push(segment);
      
      console.log(`📅 Day ${day}: ${currentStop.name} → ${nextStop.name}, ${distance.toFixed(1)} miles, ${validatedDriveTime.toFixed(1)} hours`);
    }

    return segments;
  }
}
