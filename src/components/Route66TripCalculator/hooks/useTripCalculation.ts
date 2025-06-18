
import { useState, useCallback } from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanTypes';
import { EnhancedTripPlanResult } from '../../TripCalculator/services/Route66TripPlannerService';
import { Route66TripPlannerService } from '../../TripCalculator/services/Route66TripPlannerService';
import { GoogleMapsIntegrationService } from '../../TripCalculator/services/GoogleMapsIntegrationService';
import { toast } from '@/hooks/use-toast';

export const useTripCalculation = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [planningResult, setPlanningResult] = useState<EnhancedTripPlanResult | null>(null);

  const calculateTrip = useCallback(async (
    formData: TripFormData,
    onProgress?: (current: number, total: number, currentSegment?: string) => void
  ) => {
    console.log('🚗 useTripCalculation: Starting enhanced trip calculation with Google Maps integration', { 
      formData,
      hasGoogleMaps: GoogleMapsIntegrationService.isAvailable()
    });
    
    setIsCalculating(true);
    setTripPlan(null);
    setPlanningResult(null);

    try {
      // Fix: Use the correct number of arguments and ensure tripStyle is properly typed
      const tripStyle: 'balanced' | 'destination-focused' = formData.tripStyle === 'destination-focused' ? 'destination-focused' : 'balanced';
      
      const result = await Route66TripPlannerService.planTripWithAnalysis(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays,
        tripStyle
      );

      console.log('✅ useTripCalculation: Enhanced trip planning completed with Google Maps integration', {
        success: !!result.tripPlan,
        segmentCount: result.tripPlan?.segments?.length,
        hasDebugInfo: !!result.debugInfo,
        hasValidationResults: !!result.validationResults,
        warningCount: result.warnings?.length || 0,
        googleMapsUsed: result.tripPlan?.segments?.some(s => s.isGoogleMapsData)
      });

      if (result.tripPlan) {
        // Ensure the trip plan has the required title property
        const unifiedTripPlan: TripPlan = {
          ...result.tripPlan,
          title: result.tripPlan.title || `${formData.startLocation} to ${formData.endLocation} Route 66 Adventure`,
          tripStyle: tripStyle
        };
        
        setTripPlan(unifiedTripPlan);
        setPlanningResult(result);
        
        // Enhanced success message with Google Maps status
        const googleMapsStatus = result.tripPlan.segments?.some(s => s.isGoogleMapsData) 
          ? '🗺️ Google Maps data used' 
          : '📐 Estimated calculations used';
        
        const validationStatus = result.validationResults?.driveTimeValidation?.isValid && result.validationResults?.sequenceValidation?.isValid
          ? 'All constraints validated ✅'
          : `${result.warnings?.length || 0} constraint warnings ⚠️`;
        
        toast({
          title: "Trip Planned Successfully!",
          description: `Created ${result.tripPlan.segments?.length || 0} day itinerary. ${googleMapsStatus}. ${validationStatus}`,
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
