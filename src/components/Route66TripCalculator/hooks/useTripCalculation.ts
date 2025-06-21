
import { useState, useCallback } from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanTypes';
import { EnhancedTripPlanResult } from '../../TripCalculator/services/Route66TripPlannerService';
import { Route66TripPlannerService } from '../../TripCalculator/services/Route66TripPlannerService';
import { GoogleMapsIntegrationService } from '../../TripCalculator/services/GoogleMapsIntegrationService';
import { DestinationMatchingService } from '../../TripCalculator/services/DestinationMatchingService';
import { toast } from '@/hooks/use-toast';

export const useTripCalculation = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [planningResult, setPlanningResult] = useState<EnhancedTripPlanResult | null>(null);
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 0,
    dailyDrivingLimit: 300,
    tripStyle: 'destination-focused',
    tripStartDate: new Date()
  });

  const calculateTrip = useCallback(async (
    inputFormData?: TripFormData,
    onProgress?: (current: number, total: number, currentSegment?: string) => void
  ) => {
    const dataToUse = inputFormData || formData;
    
    console.log('🚗 useTripCalculation: Starting enhanced trip calculation with improved matching', { 
      formData: dataToUse,
      hasGoogleMaps: GoogleMapsIntegrationService.isAvailable()
    });
    
    setIsCalculating(true);
    setTripPlan(null);
    setPlanningResult(null);

    try {
      // Validate destinations before planning
      if (!dataToUse.startLocation.trim() || !dataToUse.endLocation.trim()) {
        throw new Error('Please enter both start and end locations');
      }

      if (dataToUse.travelDays < 1) {
        throw new Error('Please select at least 1 travel day');
      }

      // Fix: Use the correct number of arguments and ensure tripStyle is properly typed
      const tripStyle: 'balanced' | 'destination-focused' = dataToUse.tripStyle === 'destination-focused' ? 'destination-focused' : 'balanced';
      
      const result = await Route66TripPlannerService.planTripWithAnalysis(
        dataToUse.startLocation,
        dataToUse.endLocation,
        dataToUse.travelDays,
        tripStyle
      );

      console.log('✅ useTripCalculation: Enhanced trip planning completed', {
        success: !!result.tripPlan,
        segmentCount: result.tripPlan?.segments?.length,
        hasDebugInfo: !!result.debugInfo,
        hasValidationResults: !!result.validationResults,
        warningCount: result.warnings?.length || 0,
        googleMapsUsed: result.tripPlan?.segments?.some(s => s.isGoogleMapsData),
        totalDistance: result.tripPlan?.totalDistance,
        realDistanceData: result.tripPlan?.segments?.filter(s => s.isGoogleMapsData).length
      });

      if (result.tripPlan) {
        // Ensure the trip plan has the required title property
        const unifiedTripPlan: TripPlan = {
          ...result.tripPlan,
          title: result.tripPlan.title || `${dataToUse.startLocation} to ${dataToUse.endLocation} Route 66 Adventure`,
          tripStyle: tripStyle
        };
        
        setTripPlan(unifiedTripPlan);
        setPlanningResult(result);
        
        // Enhanced success message with real distance information
        const googleMapsStatus = result.tripPlan.segments?.some(s => s.isGoogleMapsData) 
          ? '🗺️ Real distance data used' 
          : '📐 Estimated calculations used';
        
        const distanceInfo = result.tripPlan.totalDistance 
          ? `${Math.round(result.tripPlan.totalDistance)} miles total`
          : 'Distance calculated';
        
        const validationStatus = result.validationResults?.driveTimeValidation?.isValid && result.validationResults?.sequenceValidation?.isValid
          ? 'All constraints validated ✅'
          : `${result.warnings?.length || 0} constraint warnings ⚠️`;
        
        toast({
          title: "Trip Planned Successfully!",
          description: `Created ${result.tripPlan.segments?.length || 0} day itinerary. ${distanceInfo}. ${googleMapsStatus}. ${validationStatus}`,
          variant: result.warnings?.length > 0 ? "default" : "default"
        });
      } else {
        throw new Error('Failed to plan trip - no trip plan returned');
      }

    } catch (error) {
      console.error('❌ useTripCalculation: Trip calculation failed', error);
      
      let errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Enhanced error messages for common issues
      if (errorMessage.includes('No match found') || errorMessage.includes('not found')) {
        errorMessage = `Could not find Route 66 destinations matching your locations. Please try major Route 66 cities like Chicago, Springfield, St. Louis, Tulsa, Oklahoma City, Amarillo, Albuquerque, Flagstaff, or Los Angeles.`;
      } else if (errorMessage.includes('insufficient')) {
        errorMessage = `Not enough Route 66 destinations available for a ${dataToUse.travelDays} day trip. Try reducing the number of days or selecting different start/end points.`;
      }
      
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
  }, [formData]);

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
    formData,
    setFormData,
    calculateTrip,
    resetTrip
  };
};
