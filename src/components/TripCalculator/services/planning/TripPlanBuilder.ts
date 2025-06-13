
import { TripPlan, DailySegment } from './TripPlanTypes';
import { TripStop } from '../data/SupabaseDataService';
import { TripPlanningService } from './TripPlanningService';
import { TripPlanUtils } from './TripPlanUtils';

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
      id: TripPlanUtils.generateId(),
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

  /**
   * Build enhanced trip plan with strict destination city enforcement
   * @deprecated Use TripPlanningService.buildTripPlan instead
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
    console.log('⚠️ TripPlanBuilder.buildTripPlan is deprecated. Use TripPlanningService.buildTripPlan instead.');
    return TripPlanningService.buildTripPlan(
      startStop,
      endStop,
      allStops,
      tripDays,
      startCityName,
      endCityName,
      tripStyle
    );
  }
}
