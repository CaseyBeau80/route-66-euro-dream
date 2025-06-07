
import { useState, useCallback } from 'react';
import { route66Towns } from '@/types/route66';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import { UnifiedTripPlanningService, TripPlanningResult } from '../../TripCalculator/services/planning/UnifiedTripPlanningService';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { TripStop } from '../../TripCalculator/types/TripStop';
import { toast } from '@/hooks/use-toast';

export const useTripCalculation = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | undefined>();
  const [isCalculating, setIsCalculating] = useState(false);
  const [planningResult, setPlanningResult] = useState<TripPlanningResult | undefined>();

  // Convert Route66Town to TripStop
  const convertRoute66TownToTripStop = useCallback((town: typeof route66Towns[0]): TripStop => {
    const [latitude, longitude] = town.latLng;
    const parts = town.name.split(', ');
    const cityName = parts[0];
    const state = parts[1] || '';
    
    return {
      id: `route66-${town.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
      name: town.name,
      description: `Historic Route 66 stop in ${town.name}`,
      category: 'destination_city',
      city_name: cityName,
      city: cityName,
      state: state,
      latitude: latitude,
      longitude: longitude,
      is_major_stop: true,
      is_official_destination: true
    };
  }, []);

  const calculateTrip = useCallback(async (formData: TripFormData) => {
    if (!formData.startLocation || !formData.endLocation) {
      console.error('❌ Missing required form data');
      return;
    }

    setIsCalculating(true);
    setTripPlan(undefined);
    setPlanningResult(undefined);

    try {
      console.log('🚗 Starting trip calculation with style:', formData.tripStyle);

      // Find the actual Route66Town objects from route66Towns
      const startTown = route66Towns.find(town => town.name === formData.startLocation);
      const endTown = route66Towns.find(town => town.name === formData.endLocation);

      if (!startTown || !endTown) {
        throw new Error('Could not find start or end location in Route 66 towns data');
      }

      // Convert Route66Town objects to TripStop objects
      const startStop = convertRoute66TownToTripStop(startTown);
      const endStop = convertRoute66TownToTripStop(endTown);
      
      // Convert all route66Towns to TripStop objects for the planning service
      const allStops = route66Towns.map(convertRoute66TownToTripStop);

      const result = await UnifiedTripPlanningService.createTripPlan(
        startStop,
        endStop,
        allStops,
        formData.travelDays,
        formData.startLocation,
        formData.endLocation,
        formData.tripStyle
      );

      setPlanningResult(result);
      setTripPlan(result.tripPlan);

      // Show success toast notification
      toast({
        title: "🎉 Trip Plan Created!",
        description: `Your ${formData.travelDays}-day Route 66 adventure from ${formData.startLocation} to ${formData.endLocation} is ready to explore!`,
      });

      // Show warnings if any
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          toast({
            title: "Planning Notice",
            description: warning,
            variant: "default"
          });
        });
      }

      // Auto-scroll to trip results after successful calculation
      setTimeout(() => {
        const tripResultsElement = document.getElementById('trip-results');
        if (tripResultsElement) {
          tripResultsElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);

      console.log('✅ Trip calculation completed successfully');
    } catch (error) {
      console.error('❌ Trip calculation failed:', error);
      toast({
        title: "Planning Failed",
        description: "Could not create your trip plan. Please try different settings.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  }, [convertRoute66TownToTripStop]);

  const resetTrip = useCallback(() => {
    setTripPlan(undefined);
    setPlanningResult(undefined);
  }, []);

  return {
    tripPlan,
    isCalculating,
    planningResult,
    calculateTrip,
    resetTrip
  };
};
