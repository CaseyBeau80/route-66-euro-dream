
import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from './useFormValidation';

export const useBlockingDayValidation = (formData: TripFormData) => {
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [hasConfirmedAdjustment, setHasConfirmedAdjustment] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const checkAndConfirmAdjustment = useCallback(async (): Promise<boolean> => {
    console.log('🚨 useBlockingDayValidation: Skipping day adjustment confirmation - dialog removed');
    
    // Always allow planning - no more blocking confirmation dialog
    return true;
  }, []);

  // Reset confirmation when form data changes significantly
  const resetConfirmation = useCallback(() => {
    setHasConfirmedAdjustment(false);
  }, []);

  const canProceedWithPlanning = isFormValid;

  return {
    dayAdjustmentInfo,
    isFormValid,
    canProceedWithPlanning,
    hasConfirmedAdjustment,
    isBlocked: false, // Never blocked anymore
    checkAndConfirmAdjustment,
    resetConfirmation
  };
};
