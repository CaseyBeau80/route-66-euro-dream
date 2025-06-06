
import { DestinationCity } from '@/components/Route66Planner/types';

export interface TripPlan {
  id: string;
  title?: string;
  startCity: string;
  endCity: string;
  startDate: Date;
  totalDays: number;
  totalDistance: number;
  totalDrivingTime?: number;
  totalMiles?: number;
  dailySegments: DailySegment[];
  segments?: DailySegment[];
  startCityImage?: string;
  endCityImage?: string;
  driveTimeBalance?: {
    isBalanced: boolean;
    averageDriveTime: number;
    balanceQuality: string;
  };
}

export interface DailySegment {
  day: number;
  startCity: string;
  endCity: string;
  distance: number;
  approximateMiles?: number;
  driveTimeHours: number;
  driveTimeCategory?: DriveTimeCategory;
  recommendedStops?: RecommendedStop[];
  weatherData?: any; // Weather data field
  weather?: any;
  title?: string;
  routeSection?: string;
  subStopTimings?: any[];
  attractions?: string[] | any[];
  drivingTime?: number;
  balanceMetrics?: any;
  destination?: {
    city: string;
    state?: string;
  };
}

export interface DriveTimeCategory {
  category: 'short' | 'optimal' | 'long' | 'extreme';
  message: string;
}

export interface RecommendedStop {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  category?: string;
}

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

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
