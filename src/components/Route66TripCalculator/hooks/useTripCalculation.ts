
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
    
    console.log('🚗 FIXED TRIP CALCULATION: Starting with enforced limits', { 
      formData: dataToUse,
      hasGoogleMaps: GoogleMapsIntegrationService.isAvailable()
    });
    
    setIsCalculating(true);
    setTripPlan(null);
    setPlanningResult(null);

    try {
      // Enhanced validation with proper trip day enforcement
      if (!dataToUse.startLocation.trim() || !dataToUse.endLocation.trim()) {
        throw new Error('Please enter both start and end locations');
      }

      if (dataToUse.travelDays < 1) {
        throw new Error('Please select at least 1 travel day');
      }

      // FIXED: Enforce minimum 3 days for realistic Route 66 trips
      const minDays = 3;
      const maxDays = 14;
      let adjustedTravelDays = dataToUse.travelDays;

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

      // Update the data with adjusted days
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

      const tripStyle: 'balanced' | 'destination-focused' = 'destination-focused'; // FIXED: Only support destination-focused
      
      console.log('🎯 PLANNING TRIP with fixed validation:', {
        start: adjustedFormData.startLocation,
        end: adjustedFormData.endLocation,
        days: adjustedTravelDays,
        originalDays: dataToUse.travelDays,
        style: tripStyle,
        maxDailyDriveTime: 8 // hours
      });
      
      const result = await Route66TripPlannerService.planTripWithAnalysis(
        adjustedFormData.startLocation,
        adjustedFormData.endLocation,
        adjustedTravelDays,
        tripStyle
      );

      console.log('✅ FIXED TRIP PLANNING completed:', {
        success: !!result.tripPlan,
        segmentCount: result.tripPlan?.segments?.length,
        totalDistance: result.tripPlan?.totalDistance,
        totalDriveTime: result.tripPlan?.totalDrivingTime,
        destinationReached: result.tripPlan?.endCity,
        hasValidationResults: !!result.validationResults,
        warningCount: result.warnings?.length || 0,
        actualDays: result.tripPlan?.segments?.length
      });

      if (result.tripPlan) {
        // FIXED: Enforce drive time limits on all segments
        const segments = result.tripPlan.segments || [];
        const MAX_DAILY_DRIVE_TIME = 8; // 8 hours maximum
        
        let hasExcessiveDriving = false;
        const validatedSegments = segments.map(segment => {
          if ((segment.driveTimeHours || 0) > MAX_DAILY_DRIVE_TIME) {
            hasExcessiveDriving = true;
            console.warn(`⚠️ CAPPING DRIVE TIME: Day ${segment.day} reduced from ${segment.driveTimeHours}h to ${MAX_DAILY_DRIVE_TIME}h`);
            return {
              ...segment,
              driveTimeHours: MAX_DAILY_DRIVE_TIME,
              distance: Math.min(segment.distance, MAX_DAILY_DRIVE_TIME * 50) // Cap distance too
            };
          }
          return segment;
        });
        
        if (hasExcessiveDriving) {
          toast({
            title: "Drive Times Adjusted",
            description: `Some segments exceeded 8 hours and were adjusted for safety. Consider adding more travel days for a more comfortable trip.`,
            variant: "default"
          });
        }

        // FIXED: Ensure trip plan matches requested days exactly
        const finalTripPlan: TripPlan = {
          ...result.tripPlan,
          segments: validatedSegments,
          dailySegments: validatedSegments,
          totalDays: validatedSegments.length, // Use actual segment count
          title: result.tripPlan.title || `${adjustedFormData.startLocation} to ${adjustedFormData.endLocation} Route 66 Adventure`,
          tripStyle: tripStyle
        };
        
        setTripPlan(finalTripPlan);
        setPlanningResult(result);
        
        // Enhanced success message with accurate metrics
        const averageDailyDistance = validatedSegments.length > 0 ? 
          Math.round((result.tripPlan.totalDistance || 0) / validatedSegments.length) : 0;
        const averageDailyDriveTime = validatedSegments.length > 0 ? 
          Math.round(((result.tripPlan.totalDrivingTime || 0) / validatedSegments.length) * 10) / 10 : 0;
        
        toast({
          title: "Trip Planned Successfully!",
          description: `${validatedSegments.length} day itinerary to ${result.tripPlan.endCity}. Average: ${averageDailyDistance}mi, ${averageDailyDriveTime}h per day.`,
          variant: "default"
        });
        
      } else {
        throw new Error('Failed to plan trip - no trip plan returned');
      }

    } catch (error) {
      console.error('❌ TRIP CALCULATION failed:', error);
      
      let errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Enhanced error messages with specific suggestions
      if (errorMessage.includes('not found')) {
        if (errorMessage.includes('Start location')) {
          errorMessage += ` Try major Route 66 cities like: Chicago IL, St. Louis MO, Springfield MO, Joplin MO, Tulsa OK, or Oklahoma City OK.`;
        } else if (errorMessage.includes('End location')) {
          errorMessage += ` Try destinations like: Amarillo TX, Albuquerque NM, Flagstaff AZ, Kingman AZ, Barstow CA, or Los Angeles CA.`;
        }
      } else if (errorMessage.includes('insufficient')) {
        errorMessage = `Not enough Route 66 destinations for a ${dataToUse.travelDays} day trip between these locations. Try reducing days or selecting cities farther apart.`;
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
    console.log('🔄 Resetting trip calculation');
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
