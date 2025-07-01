
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

    // CRITICAL FIX: Always check day adjustment when we have the required data
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
          reason: `Your route from ${formData.startLocation} to ${formData.endLocation} covers approximately ${Math.round(validation.minDaysRequired * 300)} miles. To keep daily driving under our 10-hour safety limit (maximum 300 miles per day), we need ${validation.minDaysRequired} days instead of ${formData.travelDays} days.`
        };
        recommendedDays = validation.minDaysRequired;
        
        console.log('🎯 DEBUGGING: Day adjustment info created:', dayAdjustmentInfo);
      }
    }

    // Form is valid when all required fields are present - day adjustment doesn't invalidate the form
    const isFormValid = hasStartLocation && hasEndLocation && hasValidTravelDays && hasStartDate;

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
