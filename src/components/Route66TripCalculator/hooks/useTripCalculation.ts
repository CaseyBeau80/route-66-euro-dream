
import { useState, useCallback } from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { TripPlanningResult } from '../../TripCalculator/services/planning/UnifiedTripPlanningService';
import { UnifiedTripPlanningService } from '../../TripCalculator/services/planning/UnifiedTripPlanningService';
import { toast } from '@/hooks/use-toast';

export const useTripCalculation = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [planningResult, setPlanningResult] = useState<TripPlanningResult | null>(null);

  const calculateTrip = useCallback(async (formData: TripFormData) => {
    console.log('🚗 useTripCalculation: Starting trip calculation', { formData });
    
    setIsCalculating(true);
    setTripPlan(null);
    setPlanningResult(null);

    try {
      // Use static method call instead of instance method
      const result = await UnifiedTripPlanningService.planTrip(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays,
        formData.tripStyle || 'balanced'
      );

      console.log('✅ useTripCalculation: Trip planning completed', {
        success: result.success,
        segmentCount: result.tripPlan?.segments?.length
      });

      if (result.success && result.tripPlan) {
        setTripPlan(result.tripPlan);
        setPlanningResult(result);
        
        toast({
          title: "Trip Planned Successfully!",
          description: `Created ${result.tripPlan.segments?.length || 0} day itinerary from ${formData.startLocation} to ${formData.endLocation}`,
          variant: "default"
        });
      } else {
        throw new Error(result.error || 'Failed to plan trip');
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
