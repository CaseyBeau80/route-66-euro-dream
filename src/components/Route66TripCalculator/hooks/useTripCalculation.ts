
import { useState, useCallback } from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanTypes';
import { Route66TripPlannerService } from '../../TripCalculator/services/Route66TripPlannerService';
import { TripCompletionService, TripCompletionAnalysis } from '../../TripCalculator/services/planning/TripCompletionService';
import { toast } from '@/hooks/use-toast';

interface PlanningResult {
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
}

export const useTripCalculation = () => {
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 0,
    dailyDrivingLimit: 300,
    tripStyle: 'destination-focused',
    tripStartDate: new Date()
  });

  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [planningResult, setPlanningResult] = useState<PlanningResult | null>(null);

  const calculateTrip = useCallback(async (data: TripFormData) => {
    if (!data.startLocation || !data.endLocation || data.travelDays <= 0) {
      toast({
        title: "Invalid Trip Data",
        description: "Please provide start location, end location, and travel days.",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      console.log('🚗 Starting trip calculation:', data);

      const result = await Route66TripPlannerService.planTrip(
        data.startLocation,
        data.endLocation,
        data.travelDays,
        data.tripStyle
      );

      // Set the start date from form data
      result.startDate = data.tripStartDate || new Date();

      // Analyze trip completion - FIXED: Only pass the trip plan, not the days
      const analysis = TripCompletionService.analyzeTripCompletion(result);
      
      setTripPlan(result);
      setPlanningResult({
        completionAnalysis: analysis,
        originalRequestedDays: data.travelDays
      });

      toast({
        title: "Trip Planned Successfully! 🎉",
        description: `Your ${data.travelDays}-day Route 66 adventure is ready!`,
        variant: "default"
      });

    } catch (error) {
      console.error('❌ Trip calculation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to plan trip';
      
      toast({
        title: "Planning Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const resetTrip = useCallback(() => {
    setTripPlan(null);
    setPlanningResult(null);
  }, []);

  return {
    formData,
    setFormData,
    tripPlan,
    isCalculating,
    planningResult,
    calculateTrip,
    resetTrip
  };
};
