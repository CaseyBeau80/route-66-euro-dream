
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

    // SIMPLIFIED LOGIC: Check day adjustment as soon as we have locations and travel days
    // This ensures the message appears immediately when the user makes selections
    if (hasStartLocation && hasEndLocation && formData.travelDays > 0 && formData.travelDays <= MAX_DAYS) {
      console.log('🔍 DEBUGGING: Checking day adjustment with simplified logic...');
      
      const styleConfig = TripStyleLogic.getStyleConfig(formData.tripStyle);
      console.log('🔍 DEBUGGING: Style config:', styleConfig);
      
      const validation = TravelDayValidator.validateTravelDays(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays,
        styleConfig
      );

      console.log('🔍 DEBUGGING: Travel day validation result:', validation);

      // Create day adjustment info when minimum days required exceeds requested days
      if (validation.minDaysRequired && validation.minDaysRequired > formData.travelDays) {
        dayAdjustmentInfo = {
          requested: formData.travelDays,
          minimum: validation.minDaysRequired,
          reason: validation.issues && validation.issues.length > 0 
            ? validation.issues[0] 
            : `Route requires ${validation.minDaysRequired} days minimum for safe driving limits (max 10 hours/day)`
        };
        recommendedDays = validation.minDaysRequired;
        
        console.log('🎯 DEBUGGING: Day adjustment info created:', dayAdjustmentInfo);
      }
    }

    // IMPORTANT: Form can be valid even with day adjustment (the system will use adjusted days)
    // Only mark as invalid if required fields are missing
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
