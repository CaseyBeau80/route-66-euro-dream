
import { useState, useCallback } from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { EnhancedTripPlanResult } from '../../TripCalculator/services/Route66TripPlannerService';
import { Route66TripPlannerService } from '../../TripCalculator/services/Route66TripPlannerService';
import { toast } from '@/hooks/use-toast';

export const useTripCalculation = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [planningResult, setPlanningResult] = useState<EnhancedTripPlanResult | null>(null);

  const calculateTrip = useCallback(async (formData: TripFormData) => {
    console.log('🚗 useTripCalculation: Starting enhanced trip calculation with debug info', { formData });
    
    setIsCalculating(true);
    setTripPlan(null);
    setPlanningResult(null);

    try {
      // Use the enhanced trip planning service with full debug information
      const result = await Route66TripPlannerService.planTripWithAnalysis(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays,
        formData.tripStyle || 'balanced'
      );

      console.log('✅ useTripCalculation: Enhanced trip planning completed with debug info', {
        success: !!result.tripPlan,
        segmentCount: result.tripPlan?.segments?.length,
        hasDebugInfo: !!result.debugInfo,
        hasValidationResults: !!result.validationResults,
        warningCount: result.warnings?.length || 0
      });

      if (result.tripPlan) {
        setTripPlan(result.tripPlan);
        setPlanningResult(result);
        
        // Enhanced success message with validation status
        const validationStatus = result.validationResults?.driveTimeValidation?.isValid && result.validationResults?.sequenceValidation?.isValid
          ? 'All constraints validated ✅'
          : `${result.warnings?.length || 0} constraint warnings ⚠️`;
        
        toast({
          title: "Trip Planned Successfully!",
          description: `Created ${result.tripPlan.segments?.length || 0} day itinerary. ${validationStatus}`,
          variant: result.warnings?.length > 0 ? "default" : "default"
        });
      } else {
        throw new Error('Failed to plan trip - no trip plan returned');
      }

    } catch (error) {
      console.error('❌ useTripCalculation: Trip calculation failed', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Trip Planning Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      setTripPlan(null);
      setPlanningResult(null);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const resetTrip = useCallback(() => {
    console.log('🔄 useTripCalculation: Resetting trip');
    setTripPlan(null);
    setPlanningResult(null);
    setIsCalculating(false);
  }, []);

  return {
    tripPlan,
    isCalculating,
    planningResult,
    calculateTrip,
    resetTrip
  };
};
