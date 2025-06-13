
import { useState } from 'react';
import { route66Towns } from '@/types/route66';
import { TripFormData } from '../types/tripCalculator';
import { Route66TripPlannerService, TripPlan } from '../services/Route66TripPlannerService';
import { TripService } from '../services/TripService';
import { toast } from '@/hooks/use-toast';
import { useItineraryLoading } from './useItineraryLoading';

export const useEnhancedTripCalculation = () => {
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 0,
    dailyDrivingLimit: 300,
    tripStartDate: undefined,
    tripStyle: 'balanced'
  });
  
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  
  // Add loading state management
  const loadingState = useItineraryLoading();

  // Get available end locations based on start location
  const availableEndLocations = route66Towns.filter(town => town.name !== formData.startLocation);

  // Reset function to clear trip plan and allow new planning
  const resetTrip = () => {
    setTripPlan(null);
    setShareUrl(null);
    loadingState.resetLoading();
    console.log('🔄 Trip reset - ready for new planning');
  };

  // Validate form data
  const validateFormData = (): boolean => {
    if (!formData.startLocation) {
      toast({
        title: "Missing Start Location",
        description: "Please select where you want to start your Route 66 journey.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.endLocation) {
      toast({
        title: "Missing Destination",
        description: "Please select where you want to end your Route 66 journey.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.travelDays <= 0 || formData.travelDays > 30) {
      toast({
        title: "Invalid Trip Duration",
        description: "Please enter a trip duration between 1 and 30 days.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.tripStartDate) {
      toast({
        title: "Trip Start Date Required",
        description: "Please select a start date for your Route 66 journey to enable weather forecasts.",
        variant: "destructive"
      });
      return false;
    }

    if (formData.startLocation === formData.endLocation) {
      toast({
        title: "Invalid Route",
        description: "Start and end locations cannot be the same.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  // Calculate intelligent trip plan with pre-loading
  const calculateTrip = async () => {
    console.log('🔄 Enhanced trip calculation started with:', formData);
    
    if (!validateFormData()) {
      return;
    }

    setIsCalculating(true);
    
    // Start pre-loading sequence
    loadingState.startPreLoading(formData.travelDays);
    
    console.log('🚀 Starting Route66TripPlannerService.planTrip...');
    
    try {
      // Update progress during planning
      loadingState.updateProgress('Calculating your Route 66 journey...', 20);
      
      const plan = await Route66TripPlannerService.planTrip(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays,
        formData.tripStyle
      );
      
      loadingState.updateProgress('Processing travel segments...', 60);
      
      console.log('✅ Trip plan generated successfully:', plan);
      setTripPlan(plan);
      
      // Auto-save the trip and get share URL
      try {
        loadingState.updateProgress('Saving your itinerary...', 80);
        
        const shareCode = await TripService.saveTrip(plan);
        const generatedShareUrl = TripService.getShareUrl(shareCode);
        setShareUrl(generatedShareUrl);
        
        console.log('✅ Trip auto-saved with share URL:', generatedShareUrl);
      } catch (saveError) {
        console.error('⚠️ Failed to auto-save trip:', saveError);
        // Don't show error to user for auto-save failures
      }
      
      // Complete the loading sequence
      loadingState.completeLoading();
      
      toast({
        title: "You're All Set!",
        description: `Your ${formData.travelDays}-day Route 66 journey has been successfully planned with weather forecasts.`,
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ Trip calculation error:', error);
      loadingState.resetLoading();
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
    shareUrl,
    availableEndLocations,
    calculateTrip,
    resetTrip,
    isCalculating,
    isCalculateDisabled: !formData.startLocation || !formData.endLocation || formData.travelDays <= 0 || !formData.tripStartDate,
    // Expose loading state
    loadingState
  };
};
