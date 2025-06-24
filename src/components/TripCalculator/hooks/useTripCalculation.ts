
import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { TripPlan } from '../services/planning/TripPlanTypes';

export const useTripCalculation = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 0,
    dailyDrivingLimit: 300,
    tripStyle: 'destination-focused', // FIXED: Only destination-focused allowed
    tripStartDate: new Date()
  });

  const calculateTrip = useCallback(async (data?: TripFormData) => {
    setIsCalculating(true);
    try {
      // Implementation would go here
      console.log('Calculating trip with data:', data || formData);
      // Simulate trip calculation
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsCalculating(false);
    }
  }, [formData]);

  const resetTrip = useCallback(() => {
    setTripPlan(null);
    setIsCalculating(false);
  }, []);

  return {
    tripPlan,
    isCalculating,
    formData,
    setFormData,
    calculateTrip,
    resetTrip,
    planningResult: null // Add planningResult to match the expected interface
  };
};
