
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
    
    console.log('🚗 ENHANCED TRIP CALCULATION: Starting with improved destination matching', { 
      formData: dataToUse,
      hasGoogleMaps: GoogleMapsIntegrationService.isAvailable()
    });
    
    setIsCalculating(true);
    setTripPlan(null);
    setPlanningResult(null);

    try {
      // Enhanced validation
      if (!dataToUse.startLocation.trim() || !dataToUse.endLocation.trim()) {
        throw new Error('Please enter both start and end locations');
      }

      if (dataToUse.travelDays < 1) {
        throw new Error('Please select at least 1 travel day');
      }

      if (dataToUse.travelDays > 14) {
        throw new Error('Maximum trip length is 14 days. For longer trips, plan multiple segments.');
      }

      // Provide helpful suggestions for common destinations
      const startLower = dataToUse.startLocation.toLowerCase();
      const endLower = dataToUse.endLocation.toLowerCase();
      
      if (startLower.includes('joliet') && !startLower.includes('il')) {
        console.log('💡 SUGGESTION: Adding IL to Joliet for better matching');
        dataToUse.startLocation = dataToUse.startLocation + ', IL';
      }
      
      if (endLower.includes('kingman') && !endLower.includes('az')) {
        console.log('💡 SUGGESTION: Adding AZ to Kingman for better matching');
        dataToUse.endLocation = dataToUse.endLocation + ', AZ';
      }

      const tripStyle: 'balanced' | 'destination-focused' = dataToUse.tripStyle === 'destination-focused' ? 'destination-focused' : 'balanced';
      
      console.log('🎯 PLANNING TRIP with enhanced matching:', {
        start: dataToUse.startLocation,
        end: dataToUse.endLocation,
        days: dataToUse.travelDays,
        style: tripStyle
      });
      
      const result = await Route66TripPlannerService.planTripWithAnalysis(
        dataToUse.startLocation,
        dataToUse.endLocation,
        dataToUse.travelDays,
        tripStyle
      );

      console.log('✅ ENHANCED TRIP PLANNING completed:', {
        success: !!result.tripPlan,
        segmentCount: result.tripPlan?.segments?.length,
        totalDistance: result.tripPlan?.totalDistance,
        totalDriveTime: result.tripPlan?.totalDrivingTime,
        destinationReached: result.tripPlan?.endCity,
        hasValidationResults: !!result.validationResults,
        warningCount: result.warnings?.length || 0
      });

      if (result.tripPlan) {
        // Validate the trip plan results
        const segments = result.tripPlan.segments || [];
        const hasExcessiveDriving = segments.some(segment => 
          (segment.driveTimeHours || 0) > 10
        );
        
        if (hasExcessiveDriving) {
          console.warn('⚠️ VALIDATION: Some segments exceed 10 hours of driving');
          toast({
            title: "Long Driving Days Detected",
            description: "Some days have more than 10 hours of driving. Consider adding more travel days for a more comfortable trip.",
            variant: "default"
          });
        }

        const unifiedTripPlan: TripPlan = {
          ...result.tripPlan,
          title: result.tripPlan.title || `${dataToUse.startLocation} to ${dataToUse.endLocation} Route 66 Adventure`,
          tripStyle: tripStyle
        };
        
        setTripPlan(unifiedTripPlan);
        setPlanningResult(result);
        
        // Enhanced success message
        const averageDailyDistance = segments.length > 0 ? 
          Math.round((result.tripPlan.totalDistance || 0) / segments.length) : 0;
        const averageDailyDriveTime = segments.length > 0 ? 
          Math.round(((result.tripPlan.totalDrivingTime || 0) / segments.length) * 10) / 10 : 0;
        
        toast({
          title: "Trip Planned Successfully!",
          description: `${segments.length} day itinerary to ${result.tripPlan.endCity}. Average: ${averageDailyDistance}mi, ${averageDailyDriveTime}h per day.`,
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
