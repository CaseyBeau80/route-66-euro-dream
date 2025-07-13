import { TripPlan } from './planning/TripPlanTypes';
import { TripCompletionAnalysis } from './planning/TripCompletionService';

export interface EnhancedTripPlanResult {
  tripPlan: TripPlan;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
  warnings?: string[];
  validationResults?: any;
  debugInfo?: any;
}

export type { TripPlan as TripPlanType };