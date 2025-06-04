
import { useState } from 'react';
import { route66Towns } from '@/types/route66';
import { TripFormData } from '../types/tripCalculator';
import { Route66TripPlannerService, TripPlan } from '../services/Route66TripPlannerService';
import { toast } from '@/hooks/use-toast';

export const useEnhancedTripCalculation = () => {
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 0,
    dailyDrivingLimit: [300]
  });
  
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Get available end locations based on start location
  const availableEndLocations = route66Towns.filter(town => town.name !== formData.startLocation);

  // Calculate intelligent trip plan
  const calculateTrip = async () => {
    console.log('🔄 Enhanced trip calculation started with:', formData);
    
    if (!formData.startLocation || !formData.endLocation || formData.travelDays <= 0) {
      toast({
        title: "Missing Information",
        description: "Please select start location, end location, and number of travel days.",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    console.log('🚀 Starting Route66TripPlannerService.planTrip...');
    
    try {
      const plan = await Route66TripPlannerService.planTrip(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays
      );
      
      console.log('✅ Trip plan generated successfully:', plan);
      setTripPlan(plan);
      
      toast({
        title: "Trip Planned Successfully!",
        description: `Your ${formData.travelDays}-day Route 66 adventure has been planned with ${plan.dailySegments.length} daily segments.`,
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ Trip calculation error:', error);
      toast({
        title: "Planning Error",
        description: error instanceof Error ? error.message : "Could not plan your trip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return {
    formData,
    setFormData,
    tripPlan,
    availableEndLocations,
    calculateTrip,
    isCalculating,
    isCalculateDisabled: !formData.startLocation || !formData.endLocation || formData.travelDays <= 0
  };
};
