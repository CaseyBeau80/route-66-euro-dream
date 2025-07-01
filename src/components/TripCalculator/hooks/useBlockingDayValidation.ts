
import { useState, useCallback } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from './useFormValidation';
import { BlockingConfirmationService } from '../services/BlockingConfirmationService';

export const useBlockingDayValidation = (formData: TripFormData) => {
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [hasConfirmedAdjustment, setHasConfirmedAdjustment] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const checkAndConfirmAdjustment = useCallback(async (): Promise<boolean> => {
    console.log('🚨 useBlockingDayValidation: Checking day adjustment');
    
    // If no adjustment needed, allow planning
    if (!dayAdjustmentInfo) {
      console.log('✅ No day adjustment needed');
      return true;
    }

    // If already confirmed this adjustment, allow planning
    if (hasConfirmedAdjustment) {
      console.log('✅ Day adjustment already confirmed');
      return true;
    }

    console.log('🚨 Day adjustment needed - blocking for confirmation');
    setIsBlocked(true);

    try {
      const confirmed = await BlockingConfirmationService.confirmDayAdjustment(
        dayAdjustmentInfo.requested,
        dayAdjustmentInfo.minimum,
        formData.startLocation,
        formData.endLocation
      );

      if (confirmed) {
        setHasConfirmedAdjustment(true);
        console.log('✅ User confirmed day adjustment');
        return true;
      } else {
        console.log('❌ User rejected day adjustment');
        return false;
      }
    } finally {
      setIsBlocked(false);
    }
  }, [dayAdjustmentInfo, hasConfirmedAdjustment, formData]);

  // Reset confirmation when form data changes significantly
  const resetConfirmation = useCallback(() => {
    setHasConfirmedAdjustment(false);
  }, []);

  const canProceedWithPlanning = isFormValid && (!dayAdjustmentInfo || hasConfirmedAdjustment);

  return {
    dayAdjustmentInfo,
    isFormValid,
    canProceedWithPlanning,
    hasConfirmedAdjustment,
    isBlocked,
    checkAndConfirmAdjustment,
    resetConfirmation
  };
};
