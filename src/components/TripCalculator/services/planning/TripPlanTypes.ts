import { PlanningAdjustment } from './PlanningPolicy';
import { TripAdjustmentNotice } from './TripAdjustmentService';

export interface TripPlan {
  id: string;
  title: string;
  startCity: string;
  endCity: string;
  startLocation: string;
  endLocation: string;
  startDate: Date;
  totalDays: number;
  totalDistance: number;
  totalMiles: number;
  totalDrivingTime: number;
  segments: DailySegment[];
  dailySegments: DailySegment[];
  stops: any[];
  tripStyle: string;
  lastUpdated: Date;
  stopsLimited?: boolean;
  limitMessage?: string;
  
  // New constraint-related fields
  planningAdjustments?: PlanningAdjustment[];
  adjustmentNotice?: TripAdjustmentNotice | null;
  originalRequestedDays?: number;
}

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  distance: number;
  approximateMiles: number;
  driveTimeHours?: number;
  destination: DestinationInfo;
  recommendedStops: any[];
  isGoogleMapsData?: boolean;
  attractions: Attraction[];
}

export interface DestinationInfo {
  city: string;
  state: string;
}

export interface Attraction {
  name: string;
  title: string;
  description: string;
  city: string;
  category: string;
}
