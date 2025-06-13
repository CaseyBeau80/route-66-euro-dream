import { TripPlan, DailySegment } from './TripPlanTypes';
import { StrictDestinationCityEnforcer } from './StrictDestinationCityEnforcer';
import { EnhancedDestinationSelector } from './EnhancedDestinationSelector';

// Re-export types for backward compatibility
export type { 
  TripPlan, 
  DailySegment, 
  DriveTimeCategory, 
  RecommendedStop, 
  SegmentTiming 
} from './TripPlanTypes';

// Re-export helper functions
export { getDestinationCityName, getDestinationCityWithState } from './TripPlanHelpers';

// Re-export validator
export { TripPlanDataValidator } from './TripPlanDataValidator';

export class TripPlanBuilder {
  private tripPlan: TripPlan;
  private dailySegments: DailySegment[] = [];

  constructor(
    startCity: string,
    endCity: string,
    startDate: Date,
    totalDays: number
  ) {
    this.tripPlan = {
      id: this.generateId(),
      startCity,
      endCity,
      startDate,
      totalDays,
      totalDistance: 0,
      segments: [],
      dailySegments: [],
    };
  }

  static create(
    startCity: string,
    endCity: string,
    startDate: Date,
    totalDays: number
  ): TripPlanBuilder {
    return new TripPlanBuilder(startCity, endCity, startDate, totalDays);
  }

  addSegment(segment: DailySegment): TripPlanBuilder {
    this.dailySegments.push(segment);
    return this;
  }

  withTotalDistance(totalDistance: number): TripPlanBuilder {
    this.tripPlan.totalDistance = totalDistance;
    return this;
  }

  withTitle(title: string): TripPlanBuilder {
    this.tripPlan.title = title;
    return this;
  }

  withTotalDrivingTime(totalDrivingTime: number): TripPlanBuilder {
    this.tripPlan.totalDrivingTime = totalDrivingTime;
    return this;
  }

  withStartCityImage(imageUrl: string): TripPlanBuilder {
    this.tripPlan.startCityImage = imageUrl;
    return this;
  }

  withEndCityImage(imageUrl: string): TripPlanBuilder {
    this.tripPlan.endCityImage = imageUrl;
    return this;
  }

  build(): TripPlan {
    this.tripPlan.dailySegments = this.dailySegments;
    this.tripPlan.segments = this.dailySegments; // Ensure both properties point to the same data
    this.tripPlan.totalMiles = Math.round(this.tripPlan.totalDistance); // Set totalMiles as rounded totalDistance
    return this.tripPlan;
  }

  // Improved buildTripPlan method with proper array handling
  static buildTripPlan(
    startCity: string, 
    endCity: string, 
    startDate: Date, 
    totalDays: number, 
    segments: DailySegment[] | undefined, 
    totalDistance: number
  ): TripPlan {
    const builder = new TripPlanBuilder(startCity, endCity, startDate, totalDays);
    builder.withTotalDistance(totalDistance);
    
    // Ensure segments is an array before using forEach
    const safeSegments = Array.isArray(segments) ? segments : [];
    
    safeSegments.forEach(segment => {
      builder.addSegment(segment);
    });
    
    return builder.build();
  }

  /**
   * Build enhanced trip plan with strict destination city enforcement
   */
  static buildTripPlan(
    startStop: TripStop,
    endStop: TripStop,
    allStops: TripStop[],
    tripDays: number,
    startCityName: string,
    endCityName: string,
    tripStyle: 'balanced' | 'destination-focused' = 'balanced'
  ): TripPlan {
    console.log(`🏗️ ENHANCED TRIP PLAN BUILDER: ${tripDays} days with strict destination city enforcement`);
    
    // STEP 1: Ensure start and end are destination cities
    if (!StrictDestinationCityEnforcer.isDestinationCity(startStop)) {
      console.warn(`⚠️ START CITY NOT A DESTINATION CITY: ${startStop.name} (${startStop.category})`);
    }
    if (!StrictDestinationCityEnforcer.isDestinationCity(endStop)) {
      console.warn(`⚠️ END CITY NOT A DESTINATION CITY: ${endStop.name} (${endStop.category})`);
    }

    // STEP 2: Select only destination cities for intermediate stops
    const selectedDestinationCities = EnhancedDestinationSelector.selectDestinationCitiesForTrip(
      startStop, endStop, allStops, tripDays
    );

    // STEP 3: Build segments with destination cities only
    const segments = this.buildSegmentsWithDestinationCities(
      startStop, endStop, selectedDestinationCities, tripDays
    );

    // STEP 4: Strict validation and sanitization
    const sanitizedSegments = StrictDestinationCityEnforcer.sanitizeTripPlan(segments);
    
    const validation = StrictDestinationCityEnforcer.validateTripPlan(sanitizedSegments);
    if (!validation.isValid) {
      console.error(`❌ TRIP PLAN VALIDATION FAILED:`, validation.violations);
    } else {
      console.log(`✅ TRIP PLAN VALIDATION PASSED: All stops are destination cities`);
    }

    return {
      title: `${tripDays}-Day Route 66 Journey: ${startCityName} to ${endCityName}`,
      segments: sanitizedSegments,
      totalDays: tripDays,
      totalDistance: this.calculateTotalDistance(startStop, endStop, selectedDestinationCities),
      tripStyle,
      startCity: startCityName,
      endCity: endCityName
    };
  }

  private static buildSegmentsWithDestinationCities(
    startStop: TripStop,
    endStop: TripStop,
    destinationCities: TripStop[],
    tripDays: number
  ): DailySegment[] {
    const segments: DailySegment[] = [];
    
    // Create array of all stops in order: start, destination cities, end
    const allDayStops = [startStop, ...destinationCities, endStop];
    
    for (let day = 1; day <= tripDays; day++) {
      const currentStop = allDayStops[day - 1];
      const nextStop = allDayStops[day];
      
      if (!currentStop || !nextStop) continue;
      
      const segmentDistance = DistanceCalculationService.calculateDistance(
        currentStop.latitude, currentStop.longitude,
        nextStop.latitude, nextStop.longitude
      );
      
      const driveTimeHours = segmentDistance / 50; // 50 mph average
      
      // Only include destination cities as recommended stops
      const segmentStops = StrictDestinationCityEnforcer.filterToDestinationCitiesOnly([nextStop]);
      
      const segment: DailySegment = {
        day,
        title: `Day ${day}: ${currentStop.city_name} to ${nextStop.city_name}`,
        startCity: CityDisplayService.getCityDisplayName(currentStop),
        endCity: CityDisplayService.getCityDisplayName(nextStop),
        distance: segmentDistance,
        approximateMiles: Math.round(segmentDistance),
        driveTimeHours: parseFloat(driveTimeHours.toFixed(1)),
        destination: {
          city: nextStop.city_name,
          state: nextStop.state
        },
        recommendedStops: segmentStops,
        attractions: segmentStops.map(stop => ({
          name: stop.name,
          title: stop.name,
          description: stop.description,
          city: stop.city_name
        })),
        driveTimeCategory: this.getDriveTimeCategory(driveTimeHours),
        routeSection: this.getRouteSection(day, tripDays)
      };
      
      segments.push(segment);
    }
    
    return segments;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
