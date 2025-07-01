
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

    // FIXED: Check if route requires day adjustment - only need locations and valid travel days
    if (hasStartLocation && hasEndLocation && formData.travelDays > 0 && formData.travelDays <= MAX_DAYS) {
      console.log('🔍 DEBUGGING: Checking day adjustment logic for valid travel days...');
      
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
        'validation has issues': validation.issues?.length > 0
      });

      // ENHANCED: Create day adjustment info when minimum days required exceeds requested days
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
      } else {
        console.log('🔍 DEBUGGING: No day adjustment needed - either validation passed or no minimum required');
        console.log('🔍 DEBUGGING: Reasons:', {
          'validation.minDaysRequired': validation.minDaysRequired,
          'formData.travelDays': formData.travelDays,
          'comparison': validation.minDaysRequired <= formData.travelDays ? 'sufficient days' : 'insufficient days'
        });
      }
    } else {
      console.log('🔍 DEBUGGING: Skipping day adjustment check - missing required fields or invalid travel days:', {
        hasStartLocation,
        hasEndLocation,
        travelDays: formData.travelDays,
        isValidTravelDays: formData.travelDays > 0 && formData.travelDays <= MAX_DAYS
      });
    }

    // IMPORTANT: Form validity is independent of day adjustment
    const isFormValid = hasStartLocation && hasEndLocation && hasValidTravelDays && hasStartDate;

    console.log('🎯 DEBUGGING: Final validation result:', {
      hasStartLocation,
      hasEndLocation,
      hasValidTravelDays,
      travelDays: formData.travelDays,
      hasStartDate,
      dayAdjustmentInfo: !!dayAdjustmentInfo,
      dayAdjustmentDetails: dayAdjustmentInfo,
      recommendedDays,
      isFormValid,
      'both can show': !!dayAdjustmentInfo && isFormValid
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
