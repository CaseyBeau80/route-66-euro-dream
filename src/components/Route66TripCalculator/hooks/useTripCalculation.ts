
import { useState, useCallback } from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanTypes';
import { EnhancedTripPlanResult } from '../../TripCalculator/services/Route66TripPlannerService';
import { Route66TripPlannerService } from '../../TripCalculator/services/Route66TripPlannerService';
import { GoogleMapsIntegrationService } from '../../TripCalculator/services/GoogleMapsIntegrationService';
import { TripValidationService } from '../../TripCalculator/services/validation/TripValidationService';
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
    
    console.log('🚗 ENHANCED TRIP CALCULATION: Starting with validation', { 
      formData: dataToUse,
      hasGoogleMaps: GoogleMapsIntegrationService.isAvailable()
    });
    
    setIsCalculating(true);
    setTripPlan(null);
    setPlanningResult(null);

    try {
      // Enhanced pre-validation
      if (!dataToUse.startLocation.trim() || !dataToUse.endLocation.trim()) {
        throw new Error('Please enter both start and end locations');
      }

      if (dataToUse.travelDays < 1) {
        throw new Error('Please select at least 1 travel day');
      }

      // ENHANCED: Use validation service to check trip feasibility
      console.log('🔍 Running enhanced trip validation...');
      const validation = TripValidationService.validateTrip(
        dataToUse.startLocation,
        dataToUse.endLocation,
        dataToUse.travelDays
      );

      console.log('📊 Validation results:', {
        isValid: validation.isValid,
        feasibilityScore: validation.feasibilityScore,
        suggestedDays: validation.suggestedDays,
        issues: validation.issues,
        canOptimize: validation.canBeOptimized
      });

      // Handle validation failures with better UX
      if (!validation.isValid) {
        const primaryIssue = validation.issues[0] || 'Trip parameters need adjustment';
        
        // If we have optimization suggestions, show them
        if (validation.optimizationSuggestions.length > 0) {
          const suggestion = validation.optimizationSuggestions[0];
          if (suggestion.type === 'increase_days' && suggestion.actionValue) {
            throw new Error(
              `${primaryIssue} Try ${suggestion.actionValue} days instead for a better experience.`
            );
          }
        }
        
        throw new Error(`${primaryIssue} Please adjust your trip parameters.`);
      }

      // Show validation warnings for sub-optimal trips
      if (validation.feasibilityScore < 80 && validation.recommendations.length > 0) {
        toast({
          title: "Trip Plan Notice",
          description: validation.recommendations[0],
          variant: "default"
        });
      }

      // Use suggested days if significantly better than requested
      let adjustedTravelDays = dataToUse.travelDays;
      if (validation.suggestedDays && 
          validation.feasibilityScore < 60 && 
          Math.abs(validation.suggestedDays - dataToUse.travelDays) <= 2) {
        
        adjustedTravelDays = validation.suggestedDays;
        console.log(`🎯 Auto-adjusting days from ${dataToUse.travelDays} to ${adjustedTravelDays} for better feasibility`);
        
        toast({
          title: "Trip Duration Optimized",
          description: `Adjusted to ${adjustedTravelDays} days for optimal experience based on route analysis.`,
          variant: "default"
        });
      }

      // Apply hard limits as fallback
      const minDays = 3;
      const maxDays = 14;
      
      if (adjustedTravelDays < minDays) {
        adjustedTravelDays = minDays;
        toast({
          title: "Trip Days Adjusted",
          description: `Minimum ${minDays} days required for Route 66 trips. Adjusted to ${minDays} days.`,
          variant: "default"
        });
      }

      if (adjustedTravelDays > maxDays) {
        adjustedTravelDays = maxDays;
        toast({
          title: "Trip Days Adjusted", 
          description: `Maximum ${maxDays} days for single trip planning. Adjusted to ${maxDays} days.`,
          variant: "default"
        });
      }

      // Update the data with validated/adjusted days
      const adjustedFormData = {
        ...dataToUse,
        travelDays: adjustedTravelDays
      };

      // Enhanced location suggestions for better matching
      const startLower = adjustedFormData.startLocation.toLowerCase();
      const endLower = adjustedFormData.endLocation.toLowerCase();
      
      if (startLower.includes('joliet') && !startLower.includes('il')) {
        console.log('💡 SUGGESTION: Adding IL to Joliet for better matching');
        adjustedFormData.startLocation = adjustedFormData.startLocation + ', IL';
      }
      
      if (endLower.includes('kingman') && !endLower.includes('az')) {
        console.log('💡 SUGGESTION: Adding AZ to Kingman for better matching');
        adjustedFormData.endLocation = adjustedFormData.endLocation + ', AZ';
      }

      const tripStyle: 'balanced' | 'destination-focused' = 'destination-focused';
      
      console.log('🎯 PLANNING VALIDATED TRIP:', {
        start: adjustedFormData.startLocation,
        end: adjustedFormData.endLocation,
        originalDays: dataToUse.travelDays,
        adjustedDays: adjustedTravelDays,
        validationScore: validation.feasibilityScore,
        style: tripStyle
      });
      
      const result = await Route66TripPlannerService.planTripWithAnalysis(
        adjustedFormData.startLocation,
        adjustedFormData.endLocation,
        adjustedTravelDays,
        tripStyle
      );

      console.log('✅ ENHANCED TRIP PLANNING completed:', {
        success: !!result.tripPlan,
        segmentCount: result.tripPlan?.segments?.length,
        totalDistance: result.tripPlan?.totalDistance,
        totalDriveTime: result.tripPlan?.totalDrivingTime,
        destinationReached: result.tripPlan?.endCity,
        hasValidationResults: !!result.validationResults,
        warningCount: result.warnings?.length || 0,
        actualDays: result.tripPlan?.segments?.length,
        validationScore: validation.feasibilityScore
      });

      if (result.tripPlan) {
        // Apply final validation and drive time limits
        const segments = result.tripPlan.segments || [];
        
        if (segments.length === 0) {
          throw new Error(`No trip segments were created. Please try different locations or adjust the number of days.`);
        }
        
        // ENHANCED: Apply validation-based drive time limits
        const MAX_DAILY_DRIVE_TIME = 10; // 10 hours maximum from validation service
        
        let hasExcessiveDriving = false;
        const validatedSegments = segments.map(segment => {
          if ((segment.driveTimeHours || 0) > MAX_DAILY_DRIVE_TIME) {
            hasExcessiveDriving = true;
            console.warn(`⚠️ VALIDATION: Capping drive time for Day ${segment.day} from ${segment.driveTimeHours}h to ${MAX_DAILY_DRIVE_TIME}h`);
            return {
              ...segment,
              driveTimeHours: MAX_DAILY_DRIVE_TIME,
              distance: Math.min(segment.distance, MAX_DAILY_DRIVE_TIME * 50)
            };
          }
          return segment;
        });
        
        if (hasExcessiveDriving) {
          toast({
            title: "Drive Times Optimized",
            description: `Some segments exceeded safe driving limits and were adjusted. Your trip maintains the validation score of ${Math.round(validation.feasibilityScore)}%.`,
            variant: "default"
          });
        }

        if (validatedSegments.length === 0) {
          throw new Error(`Trip planning failed to create valid daily segments. Please try different locations.`);
        }

        // Create final trip plan with validation metadata
        const finalTripPlan: TripPlan = {
          ...result.tripPlan,
          segments: validatedSegments,
          dailySegments: validatedSegments,
          totalDays: validatedSegments.length,
          title: result.tripPlan.title || `${adjustedFormData.startLocation} to ${adjustedFormData.endLocation} Route 66 Adventure`,
          tripStyle: tripStyle,
          // Add validation metadata
          validationScore: validation.feasibilityScore,
          wasOptimized: adjustedTravelDays !== dataToUse.travelDays,
          originalRequestedDays: dataToUse.travelDays
        };
        
        console.log('🎯 FINAL VALIDATED TRIP PLAN:', {
          requestedDays: dataToUse.travelDays,
          adjustedDays: adjustedTravelDays,
          actualSegments: validatedSegments.length,
          validationScore: validation.feasibilityScore,
          wasOptimized: finalTripPlan.wasOptimized
        });
        
        setTripPlan(finalTripPlan);
        setPlanningResult(result);
        
        // Enhanced success message with validation info
        const averageDailyDistance = validatedSegments.length > 0 ? 
          Math.round((result.tripPlan.totalDistance || 0) / validatedSegments.length) : 0;
        const averageDailyDriveTime = validatedSegments.length > 0 ? 
          Math.round(((result.tripPlan.totalDrivingTime || 0) / validatedSegments.length) * 10) / 10 : 0;
        
        toast({
          title: "Trip Validated & Planned Successfully! 🎯",
          description: `${validatedSegments.length} day itinerary to ${result.tripPlan.endCity}. Feasibility: ${Math.round(validation.feasibilityScore)}%. Avg: ${averageDailyDistance}mi, ${averageDailyDriveTime}h/day.`,
          variant: "default"
        });
        
      } else {
        throw new Error('Failed to plan trip - no trip plan returned from service');
      }

    } catch (error) {
      console.error('❌ ENHANCED TRIP CALCULATION failed:', error);
      
      let errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Enhanced error messages with validation context
      if (errorMessage.includes('not found')) {
        if (errorMessage.includes('Start location')) {
          errorMessage += ` Try major Route 66 cities like: Chicago IL, St. Louis MO, Springfield MO, Joplin MO, Tulsa OK, or Oklahoma City OK.`;
        } else if (errorMessage.includes('End location')) {
          errorMessage += ` Try destinations like: Amarillo TX, Albuquerque NM, Flagstaff AZ, Kingman AZ, Barstow CA, or Los Angeles CA.`;
        }
      } else if (errorMessage.includes('too short') || errorMessage.includes('days needed')) {
        errorMessage += ` Use the validation suggestions above to optimize your trip duration.`;
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
    console.log('🔄 Resetting enhanced trip calculation');
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
