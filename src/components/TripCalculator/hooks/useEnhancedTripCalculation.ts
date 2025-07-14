
import { useState } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { UnifiedTripPlanningService } from '../services/planning/UnifiedTripPlanningService';
import { TripService } from '../services/TripService';
import { TravelDayValidator } from '../services/validation/TravelDayValidator';
import { TripStyleLogic } from '../services/planning/TripStyleLogic';
import { toast } from '@/hooks/use-toast';
import { useItineraryLoading } from './useItineraryLoading';
import { useDestinationCities } from '@/components/Route66Planner/hooks/useDestinationCities';

export const useEnhancedTripCalculation = () => {
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 0,
    dailyDrivingLimit: 300,
    tripStartDate: undefined,
    tripStyle: 'destination-focused' // FIXED: Default to destination-focused
  });
  
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  
  const loadingState = useItineraryLoading();
  const { destinationCities } = useDestinationCities();

  // Get available end locations based on start location (using destination cities only)
  const availableEndLocations = destinationCities.filter(city => `${city.name}, ${city.state}` !== formData.startLocation);

  // Reset function
  const resetTrip = () => {
    setTripPlan(null);
    setShareUrl(null);
    loadingState.resetLoading();
    console.log('🔄 Trip reset - ready for new planning');
  };

  // Enhanced validation with style-aware logic
  const validateFormData = async (): Promise<boolean> => {
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

    // Enhanced day validation using new services
    const styleConfig = TripStyleLogic.getStyleConfig(formData.tripStyle);
    const validation = await TravelDayValidator.validateTravelDays(
      formData.startLocation,
      formData.endLocation,
      formData.travelDays,
      styleConfig
    );

    if (!validation.isValid) {
      toast({
        title: "Invalid Trip Duration",
        description: validation.issues[0] || "Please adjust your trip duration.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  // Enhanced trip calculation
  const calculateTrip = async () => {
    console.log('🔄 Enhanced trip calculation started with:', formData);
    console.log('🔍 [CRITICAL DEBUG] EXACT form data values being sent to trip planner:');
    console.log(`   startLocation: "${formData.startLocation}"`);
    console.log(`   endLocation: "${formData.endLocation}"`);
    console.log(`   travelDays: ${formData.travelDays}`);
    console.log(`   tripStyle: "${formData.tripStyle}"`);
    
    if (!(await validateFormData())) {
      return;
    }

    setIsCalculating(true);
    loadingState.startPreLoading(formData.travelDays);
    
    try {
      loadingState.updateProgress('Analyzing your route preferences...', 20);
      
      // CRITICAL: Log exactly what we're passing to the trip planner
      console.log('🚨 [CRITICAL] About to call UnifiedTripPlanningService.planTrip with:');
      console.log(`   startLocation parameter: "${formData.startLocation}"`);
      console.log(`   endLocation parameter: "${formData.endLocation}"`);
      
      // Use static method call instead of instance method
      const result = await UnifiedTripPlanningService.planTrip(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays,
        formData.tripStyle
      );
      
      loadingState.updateProgress('Creating optimized daily segments...', 60);
      
      if (!result.success || !result.tripPlan) {
        throw new Error(result.error || 'Failed to create trip plan');
      }
      
      console.log('✅ Enhanced trip plan generated:', result);
      setTripPlan(result.tripPlan);
      
      // Show warnings if any
      if (result.warnings && result.warnings.length > 0) {
        console.log('⚠️ Planning warnings:', result.warnings);
      }
      
      // Auto-save the trip
      try {
        loadingState.updateProgress('Saving your itinerary...', 80);
        
        const shareCode = await TripService.saveTrip(result.tripPlan);
        const generatedShareUrl = TripService.getShareUrl(shareCode);
        setShareUrl(generatedShareUrl);
        
        console.log('✅ Trip auto-saved with share URL:', generatedShareUrl);
      } catch (saveError) {
        console.error('⚠️ Failed to auto-save trip:', saveError);
      }
      
      loadingState.completeLoading();
      
      toast({
        title: "Trip Successfully Planned! 🎉",
        description: `Your ${formData.travelDays}-day ${formData.tripStyle} Route 66 journey is ready with smart day limits and style optimization.`,
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ Enhanced trip calculation error:', error);
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

  // Handle trip style changes - FIXED: Only destination-focused
  const handleTripStyleChange = async (style: 'destination-focused') => {
    console.log(`🎨 Trip style change handler called: ${style}`);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      tripStyle: style
    }));
    
    // If we have a trip plan, automatically re-calculate with new style
    if (tripPlan && (await validateFormData())) {
      console.log(`🔄 Re-calculating trip with ${style} style...`);
      
      toast({
        title: "Updating Trip Style",
        description: `Switching to ${style} planning style...`,
        variant: "default"
      });
      
      // Trigger recalculation
      await calculateTrip();
    }
  };

  // Calculate if form is ready (basic check - detailed validation happens in calculateTrip)
  const isCalculateDisabled = (() => {
    if (!formData.startLocation || !formData.endLocation || !formData.tripStartDate) {
      return true;
    }
    
    if (formData.travelDays <= 0) {
      return true;
    }
    
    return false;
  })();

  return {
    formData,
    setFormData,
    tripPlan,
    shareUrl,
    availableEndLocations,
    calculateTrip,
    resetTrip,
    isCalculating,
    isCalculateDisabled,
    loadingState,
    handleTripStyleChange
  };
};
