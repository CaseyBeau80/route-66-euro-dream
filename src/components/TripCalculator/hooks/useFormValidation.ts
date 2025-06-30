
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

    // Check if route requires day adjustment
    if (hasStartLocation && hasEndLocation && hasValidTravelDays) {
      console.log('🔍 DEBUGGING: Checking day adjustment logic...');
      
      const styleConfig = TripStyleLogic.getStyleConfig(formData.tripStyle);
      console.log('🔍 DEBUGGING: Style config:', styleConfig);
      
      const validation = TravelDayValidator.validateTravelDays(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays,
        styleConfig
      );

      console.log('🔍 DEBUGGING: Travel day validation result:', validation);
      console.log('🔍 DEBUGGING: Validation details:', {
        'validation.isValid': validation.isValid,
        'validation.minDaysRequired': validation.minDaysRequired,
        'formData.travelDays': formData.travelDays,
        'minDaysRequired > travelDays': validation.minDaysRequired > formData.travelDays,
        'should create dayAdjustmentInfo': !validation.isValid && validation.minDaysRequired > formData.travelDays
      });

      // FIXED: Check if minimum days required is greater than requested days
      if (validation.minDaysRequired > formData.travelDays) {
        dayAdjustmentInfo = {
          requested: formData.travelDays,
          minimum: validation.minDaysRequired,
          reason: validation.issues[0] || 'Route requires more days for safe driving limits'
        };
        recommendedDays = validation.minDaysRequired;
        
        console.log('🔍 DEBUGGING: Day adjustment info created:', dayAdjustmentInfo);
      } else {
        console.log('🔍 DEBUGGING: No day adjustment needed - validation passed or no minimum required');
      }
    } else {
      console.log('🔍 DEBUGGING: Skipping day adjustment check - missing required fields');
    }

    const isFormValid = hasStartLocation && hasEndLocation && hasValidTravelDays && hasStartDate;

    console.log('🔍 DEBUGGING: Final validation result:', {
      hasStartLocation,
      hasEndLocation,
      hasValidTravelDays,
      travelDays: formData.travelDays,
      hasStartDate,
      dayAdjustmentInfo,
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
