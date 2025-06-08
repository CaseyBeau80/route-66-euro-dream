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
  tripStyle?: 'balanced' | 'destination-focused';
  warnings?: string[];
  driveTimeBalance?: {
    isBalanced: boolean;
    averageDriveTime: number;
    balanceQuality: "excellent" | "good" | "fair" | "poor";
    suggestions?: string[];
  };
  originalDays?: number;
  wasAdjusted?: boolean;
}

export interface DailySegment {
  day: number;
  title?: string;
  startCity: string;
  endCity: string;
  distance: number;
  driveTimeHours?: number;
  approximateMiles?: number;
  weather?: any;
  weatherData?: any;
  destination?: any;
  attractions?: Array<{
    name?: string;
    title?: string;
    description?: string;
    city?: string;
  }>;
  stops?: Array<{
    name?: string;
    title?: string;
    description?: string;
    city?: string;
  }>;
  notes?: string;
  recommendations?: string[];
  driveTimeCategory?: DriveTimeCategory;
  routeSection?: string;
  recommendedStops?: RecommendedStop[];
  subStopTimings?: SegmentTiming[];
  balanceMetrics?: any;
  drivingTime?: number;
}

export interface DriveTimeCategory {
  category: 'short' | 'optimal' | 'long' | 'extreme';
  message: string;
  color?: string;
}

export interface RecommendedStop {
  id: string;
  name: string;
  description: string; // Changed from optional to required
  latitude: number;
  longitude: number;
  category?: string;
  city_name?: string;
  state?: string;
  city: string; // Added to match TripStop
}

export interface SegmentTiming {
  fromStop: any;
  toStop: any;
  distance: number;
  drivingTime: number;
  distanceMiles: number;
  driveTimeHours: number;
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

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
