import { DestinationCity } from '@/components/Route66Planner/types';

export interface TripPlan {
  startCity: string;
  endCity: string;
  totalDays: number;
  totalDistance: number;
  segments: DailySegment[];
  isEnriched?: boolean;
  lastUpdated?: Date;
  enrichmentStatus?: {
    weatherData: boolean;
    stopsData: boolean;
    validationComplete: boolean;
  };
}

export interface DailySegment {
  day: number;
  startCity: string;
  endCity?: string;
  destination?: string;
  distance: number;
  driveTimeHours: number;
  recommendedStops?: any[];
  weather?: any;
  weatherData?: any;
  attractions?: any[];
  isEnriched?: boolean;
}

// Enhanced data validation service
export class TripPlanDataValidator {
  static validateTripPlan(tripPlan: TripPlan): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!tripPlan) {
      issues.push('Trip plan is null or undefined');
      return { isValid: false, issues };
    }
    
    // Validate basic fields
    if (!tripPlan.startCity || tripPlan.startCity.trim() === '') {
      issues.push('Start city is missing or empty');
    }
    
    if (!tripPlan.endCity || tripPlan.endCity.trim() === '') {
      issues.push('End city is missing or empty');
    }
    
    if (!tripPlan.totalDays || isNaN(tripPlan.totalDays) || tripPlan.totalDays <= 0) {
      issues.push('Total days is invalid or missing');
    }
    
    if (!tripPlan.totalDistance || isNaN(tripPlan.totalDistance) || tripPlan.totalDistance <= 0) {
      issues.push('Total distance is invalid or missing');
    }
    
    // Validate segments
    if (!tripPlan.segments || !Array.isArray(tripPlan.segments)) {
      issues.push('Segments array is missing or invalid');
    } else {
      tripPlan.segments.forEach((segment, index) => {
        const segmentIssues = this.validateSegment(segment, index);
        issues.push(...segmentIssues);
      });
    }
    
    return { isValid: issues.length === 0, issues };
  }
  
  static validateSegment(segment: DailySegment, index: number): string[] {
    const issues: string[] = [];
    const prefix = `Segment ${index + 1}`;
    
    if (!segment) {
      issues.push(`${prefix}: Segment is null or undefined`);
      return issues;
    }
    
    if (!segment.day || isNaN(segment.day) || segment.day <= 0) {
      issues.push(`${prefix}: Day number is invalid`);
    }
    
    if (!segment.startCity || segment.startCity.trim() === '') {
      issues.push(`${prefix}: Start city is missing`);
    }
    
    if (!segment.endCity && !segment.destination) {
      issues.push(`${prefix}: End city/destination is missing`);
    }
    
    if (isNaN(segment.distance) || segment.distance < 0) {
      issues.push(`${prefix}: Distance is invalid (${segment.distance})`);
    }
    
    if (isNaN(segment.driveTimeHours) || segment.driveTimeHours < 0) {
      issues.push(`${prefix}: Drive time is invalid (${segment.driveTimeHours})`);
    }
    
    return issues;
  }
  
  static sanitizeSegment(segment: DailySegment): DailySegment {
    return {
      ...segment,
      distance: isNaN(segment.distance) ? 0 : Math.max(0, segment.distance),
      driveTimeHours: isNaN(segment.driveTimeHours) ? 0 : Math.max(0, segment.driveTimeHours),
      startCity: segment.startCity || 'Unknown',
      endCity: segment.endCity || segment.destination || 'Unknown'
    };
  }
  
  static sanitizeTripPlan(tripPlan: TripPlan): TripPlan {
    if (!tripPlan) {
      console.error('Cannot sanitize null trip plan');
      return tripPlan;
    }
    
    return {
      ...tripPlan,
      totalDistance: isNaN(tripPlan.totalDistance) ? 0 : Math.max(0, tripPlan.totalDistance),
      totalDays: isNaN(tripPlan.totalDays) ? 1 : Math.max(1, tripPlan.totalDays),
      segments: (tripPlan.segments || []).map(segment => this.sanitizeSegment(segment)),
      lastUpdated: new Date()
    };
  }
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
