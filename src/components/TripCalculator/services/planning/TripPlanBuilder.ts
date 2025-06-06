import { DestinationCity } from '@/components/Route66Planner/types';

export interface TripPlan {
  id: string;
  startCity: string;
  endCity: string;
  startDate: Date;
  totalDays: number;
  totalDistance: number;
  dailySegments: DailySegment[];
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
  weatherData?: any; // Adding weatherData field to fix the type error
  weather?: any;
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

  build(): TripPlan {
    this.tripPlan.dailySegments = this.dailySegments;
    return this.tripPlan;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
