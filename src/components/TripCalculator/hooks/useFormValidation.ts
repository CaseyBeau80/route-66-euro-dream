
import { useMemo } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { TravelDayValidator } from '../services/validation/TravelDayValidator';
import { TripStyleLogic } from '../services/planning/TripStyleLogic';

export const useFormValidation = (formData: TripFormData) => {
  const MAX_DAYS = 14;
  const MIN_DAYS = 1;

  const validationResult = useMemo(() => {
    const hasStartLocation = !!formData.startLocation;
    const hasEndLocation = !!formData.endLocation;
    const hasValidTravelDays = formData.travelDays > 0 && formData.travelDays >= MIN_DAYS && formData.travelDays <= MAX_DAYS;
    const hasStartDate = !!formData.tripStartDate;

    let dayAdjustmentInfo = null;
    let recommendedDays = null;

    console.log('🔍 DEBUGGING useFormValidation inputs:', {
      startLocation: formData.startLocation,
      endLocation: formData.endLocation,
      travelDays: formData.travelDays,
      tripStyle: formData.tripStyle,
      hasStartLocation,
      hasEndLocation,
      hasValidTravelDays
    });

    // CRITICAL: Always check day adjustment when we have the required data
    if (hasStartLocation && hasEndLocation && formData.travelDays > 0) {
      console.log('🔍 DEBUGGING: Checking day adjustment - ALWAYS when locations + days present');
      
      const styleConfig = TripStyleLogic.getStyleConfig(formData.tripStyle);
      console.log('🔍 DEBUGGING: Style config:', styleConfig);
      
      const validation = TravelDayValidator.validateTravelDays(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays,
        styleConfig
      );

      console.log('🔍 DEBUGGING: Travel day validation result:', validation);

      // CRITICAL: Show day adjustment if minimum required is greater than requested
      if (validation.minDaysRequired && validation.minDaysRequired > formData.travelDays) {
        dayAdjustmentInfo = {
          requested: formData.travelDays,
          minimum: validation.minDaysRequired,
          reason: `Safety limit: Your ${formData.travelDays}-day trip would require ${Math.round((validation.minDaysRequired * 300) / formData.travelDays)} miles per day, which exceeds our 300-mile daily safety limit. We've adjusted it to ${validation.minDaysRequired} days for comfortable ${Math.round((validation.minDaysRequired * 300) / validation.minDaysRequired)} miles per day.`
        };
        recommendedDays = validation.minDaysRequired;
        
        console.log('🎯 DEBUGGING: Day adjustment info created:', dayAdjustmentInfo);
      }
    }

    // CRITICAL: Form is NOT valid when day adjustment is needed
    // This forces the user to acknowledge the change before proceeding
    const isFormValid = hasStartLocation && hasEndLocation && hasValidTravelDays && hasStartDate && !dayAdjustmentInfo;

    console.log('🎯 DEBUGGING: Final validation result:', {
      hasStartLocation,
      hasEndLocation,
      hasValidTravelDays,
      travelDays: formData.travelDays,
      hasStartDate,
      dayAdjustmentPresent: !!dayAdjustmentInfo,
      dayAdjustmentDetails: dayAdjustmentInfo,
      recommendedDays,
      isFormValid
    });

    return {
      isFormValid,
      dayAdjustmentInfo,
      recommendedDays
    };
  }, [
    formData.startLocation,
    formData.endLocation,
    formData.travelDays,
    formData.tripStartDate,
    formData.tripStyle
  ]);

  const validationIssues = useMemo(() => {
    const issues = [];
    
    if (!formData.startLocation) issues.push('Start location required');
    if (!formData.endLocation) issues.push('End location required');
    if (!formData.tripStartDate) issues.push('Start date required');
    if (formData.travelDays === 0) issues.push('Travel days must be selected');
    if (formData.travelDays > 0 && formData.travelDays < MIN_DAYS) issues.push(`Minimum ${MIN_DAYS} day required`);
    if (formData.travelDays > MAX_DAYS) issues.push(`Maximum ${MAX_DAYS} days allowed`);

    return issues;
  }, [formData]);

  return { 
    isFormValid: validationResult.isFormValid, 
    validationIssues,
    dayAdjustmentInfo: validationResult.dayAdjustmentInfo,
    recommendedDays: validationResult.recommendedDays,
    MIN_DAYS,
    MAX_DAYS
  };
};
