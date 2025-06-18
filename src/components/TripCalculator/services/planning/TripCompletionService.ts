
import { TripPlan } from './TripPlanTypes';

export interface TripCompletionAnalysis {
  isComplete: boolean;
  completionPercentage: number;
  missingElements: string[];
  recommendations: string[];
}

export class TripCompletionService {
  static analyzeTripCompletion(tripPlan: TripPlan): TripCompletionAnalysis {
    const missingElements: string[] = [];
    const recommendations: string[] = [];

    if (!tripPlan.segments || tripPlan.segments.length === 0) {
      missingElements.push('segments');
    }

    if (!tripPlan.startLocation) {
      missingElements.push('startLocation');
    }

    if (!tripPlan.endLocation) {
      missingElements.push('endLocation');
    }

    const completionPercentage = Math.max(0, 100 - (missingElements.length * 25));

    return {
      isComplete: missingElements.length === 0,
      completionPercentage,
      missingElements,
      recommendations
    };
  }
}
