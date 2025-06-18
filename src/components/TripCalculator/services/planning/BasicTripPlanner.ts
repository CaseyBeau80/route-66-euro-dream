
import { TripPlan, DailySegment } from './TripPlanBuilder';
import { TripBoundaryService } from './TripBoundaryService';
import { DistanceCalculationService } from '../utils/DistanceCalculationService';
import { Route66StopsService } from '../Route66StopsService';

export class BasicTripPlanner {
  static async planBasicTrip(
    startLocation: string,
    endLocation: string,
    travelDays: number,
    tripStyle: 'destination-focused'
  ): Promise<TripPlan> {
    console.log('🗺️ BasicTripPlanner: Starting trip planning with distance calculations');

    try {
      // Get Route 66 stops
      const allStops = await Route66StopsService.getAllStops();
      console.log(`📍 Loaded ${allStops.length} Route 66 stops`);

      // Find boundary stops
      const { startStop, endStop, routeStops } = TripBoundaryService.findBoundaryStops(
        startLocation,
        endLocation,
        allStops
      );

      // Calculate total distance
      const totalDistance = DistanceCalculationService.calculateDistance(
        startStop.latitude,
        startStop.longitude,
        endStop.latitude,
        endStop.longitude
      );

      console.log(`📏 Total trip distance: ${totalDistance.toFixed(1)} miles`);

      // Create segments with proper distance calculations
      const segments = this.createSegmentsWithDistances(
        startStop,
        endStop,
        routeStops,
        travelDays,
        totalDistance
      );

      // Calculate total driving time
      const totalDrivingTime = segments.reduce((total, segment) => {
        return total + (segment.driveTimeHours || 0);
      }, 0);

      const tripPlan: TripPlan = {
        id: `trip-${Date.now()}`,
        startLocation,
        endLocation,
        startCity: startStop.city_name || startStop.name,
        endCity: endStop.city_name || endStop.name,
        totalDistance,
        totalMiles: totalDistance,
        totalDays: travelDays,
        totalDrivingTime,
        segments,
        stops: [startStop, ...routeStops, endStop],
        dailySegments: segments,
        startDate: new Date(),
        title: `${startLocation} to ${endLocation} Route 66 Adventure`,
        tripStyle
      };

      console.log('✅ BasicTripPlanner: Trip planned successfully', {
        segments: segments.length,
        totalDistance: totalDistance.toFixed(1),
        totalDrivingTime: totalDrivingTime.toFixed(1)
      });

      return tripPlan;

    } catch (error) {
      console.error('❌ BasicTripPlanner: Error planning trip:', error);
      throw new Error(`Failed to plan trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static createSegmentsWithDistances(
    startStop: any,
    endStop: any,
    routeStops: any[],
    travelDays: number,
    totalDistance: number
  ): DailySegment[] {
    console.log('🛠️ Creating segments with proper distance calculations');

    const segments: DailySegment[] = [];
    const allStops = [startStop, ...routeStops, endStop];
    
    // Calculate distances between consecutive stops
    const legDistances: number[] = [];
    for (let i = 0; i < allStops.length - 1; i++) {
      const distance = DistanceCalculationService.calculateDistance(
        allStops[i].latitude,
        allStops[i].longitude,
        allStops[i + 1].latitude,
        allStops[i + 1].longitude
      );
      legDistances.push(distance);
    }

    const totalCalculatedDistance = legDistances.reduce((sum, d) => sum + d, 0);
    console.log(`📊 Total calculated distance from legs: ${totalCalculatedDistance.toFixed(1)} miles`);

    // Distribute stops across days
    if (travelDays === 1) {
      // Single day trip
      const segment: DailySegment = {
        day: 1,
        startCity: startStop.city_name || startStop.name,
        endCity: endStop.city_name || endStop.name,
        distance: totalDistance,
        driveTimeHours: DistanceCalculationService.calculateDriveTime(totalDistance),
        attractions: routeStops.slice(0, 5).map(stop => ({
          name: stop.name,
          description: stop.description,
          category: stop.category,
          coordinates: {
            latitude: stop.latitude,
            longitude: stop.longitude
          }
        }))
      };

      segments.push(segment);
      console.log(`📅 Created single day segment: ${segment.distance.toFixed(1)} miles, ${segment.driveTimeHours.toFixed(1)} hours`);

    } else {
      // Multi-day trip - distribute evenly
      const averageDistancePerDay = totalDistance / travelDays;
      console.log(`📈 Average distance per day: ${averageDistancePerDay.toFixed(1)} miles`);

      let currentDistance = 0;
      let currentStopIndex = 0;
      
      for (let day = 1; day <= travelDays; day++) {
        const isLastDay = day === travelDays;
        let dayDistance = 0;
        let startCity = '';
        let endCity = '';
        let dayAttractions: any[] = [];

        if (day === 1) {
          startCity = startStop.city_name || startStop.name;
        }

        // Calculate distance for this day
        if (isLastDay) {
          // Last day - go to final destination
          dayDistance = totalDistance - currentDistance;
          endCity = endStop.city_name || endStop.name;
        } else {
          // Calculate target distance for this day
          const targetDistance = Math.min(averageDistancePerDay, totalDistance - currentDistance);
          dayDistance = targetDistance;
          
          // Find appropriate end stop for this day
          if (currentStopIndex < routeStops.length) {
            endCity = routeStops[currentStopIndex].city_name || routeStops[currentStopIndex].name;
            dayAttractions.push({
              name: routeStops[currentStopIndex].name,
              description: routeStops[currentStopIndex].description,
              category: routeStops[currentStopIndex].category,
              coordinates: {
                latitude: routeStops[currentStopIndex].latitude,
                longitude: routeStops[currentStopIndex].longitude
              }
            });
            currentStopIndex++;
          } else {
            endCity = endStop.city_name || endStop.name;
          }
        }

        // Set start city for subsequent days
        if (day > 1) {
          startCity = segments[day - 2].endCity;
        }

        const driveTimeHours = DistanceCalculationService.calculateDriveTime(dayDistance);

        const segment: DailySegment = {
          day,
          startCity,
          endCity,
          distance: Math.max(dayDistance, 1), // Ensure minimum 1 mile
          driveTimeHours: Math.max(driveTimeHours, 0.1), // Ensure minimum drive time
          attractions: dayAttractions
        };

        segments.push(segment);
        currentDistance += dayDistance;

        console.log(`📅 Day ${day}: ${startCity} → ${endCity}, ${dayDistance.toFixed(1)} miles, ${driveTimeHours.toFixed(1)} hours`);
      }
    }

    return segments;
  }
}
