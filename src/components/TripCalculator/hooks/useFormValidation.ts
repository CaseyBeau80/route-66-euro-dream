
import { useMemo } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { TravelDayValidator } from '../services/validation/TravelDayValidator';
import { TripStyleLogic } from '../services/planning/TripStyleLogic';

export const useFormValidation = (formData: TripFormData) => {
  const MAX_DAYS = 14;
  const MIN_DAYS = 1;

  const validationResult = useMemo(() => {
    console.log('🔍 FULL DEBUG useFormValidation START:', {
      timestamp: new Date().toISOString(),
      formData: {
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        travelDays: formData.travelDays,
        tripStyle: formData.tripStyle,
        tripStartDate: formData.tripStartDate?.toISOString()
      }
    });

    const hasStartLocation = !!formData.startLocation;
    const hasEndLocation = !!formData.endLocation;
    const hasValidTravelDays = formData.travelDays > 0 && formData.travelDays >= MIN_DAYS && formData.travelDays <= MAX_DAYS;
    const hasStartDate = !!formData.tripStartDate;

    console.log('🔍 FULL DEBUG initial checks:', {
      hasStartLocation,
      hasEndLocation,
      hasValidTravelDays,
      hasStartDate,
      travelDays: formData.travelDays
    });

    let dayAdjustmentInfo = null;
    let recommendedDays = null;

    // CRITICAL: Always check day adjustment when we have the required data
    if (hasStartLocation && hasEndLocation && formData.travelDays > 0) {
      console.log('🔍 FULL DEBUG: Starting day adjustment check');
      
      const styleConfig = TripStyleLogic.getStyleConfig(formData.tripStyle);
      console.log('🔍 FULL DEBUG: Style config:', styleConfig);
      
      const validation = TravelDayValidator.validateTravelDays(
        formData.startLocation,
        formData.endLocation,
        formData.travelDays,
        styleConfig
      );

      console.log('🔍 FULL DEBUG: Validation result:', {
        isValid: validation.isValid,
        minDaysRequired: validation.minDaysRequired,
        maxDaysRecommended: validation.maxDaysRecommended,
        currentDays: validation.currentDays,
        issues: validation.issues,
        recommendations: validation.recommendations
      });

      // CRITICAL: Show day adjustment if minimum required is greater than requested
      if (validation.minDaysRequired && validation.minDaysRequired > formData.travelDays) {
        dayAdjustmentInfo = {
          requested: formData.travelDays,
          minimum: validation.minDaysRequired,
          reason: `Safety limit: Your ${formData.travelDays}-day trip would require ${Math.round((validation.minDaysRequired * 300) / formData.travelDays)} miles per day, which exceeds our 300-mile daily safety limit. We've adjusted it to ${validation.minDaysRequired} days for comfortable ${Math.round((validation.minDaysRequired * 300) / validation.minDaysRequired)} miles per day.`
        };
        recommendedDays = validation.minDaysRequired;
        
        console.log('🔥 FULL DEBUG: DAY ADJUSTMENT CREATED:', dayAdjustmentInfo);
      } else {
        console.log('🔍 FULL DEBUG: No day adjustment needed:', {
          minDaysRequired: validation.minDaysRequired,
          requestedDays: formData.travelDays,
          condition: `${validation.minDaysRequired} > ${formData.travelDays} = ${validation.minDaysRequired > formData.travelDays}`
        });
      }
    } else {
      console.log('🔍 FULL DEBUG: Skipping day adjustment check - missing required data:', {
        hasStartLocation,
        hasEndLocation,
        hasTravelDays: formData.travelDays > 0
      });
    }

    // TWO-PHASE PLANNING: Form is valid even when day adjustment is needed (will be handled in phases)
    const isFormValid = hasStartLocation && hasEndLocation && hasValidTravelDays && hasStartDate;

    console.log('🔥 FULL DEBUG: Final validation result (TWO-PHASE):', {
      isFormValid,
      dayAdjustmentInfo,
      recommendedDays,
      hasStartLocation,
      hasEndLocation,
      hasValidTravelDays,
      hasStartDate,
      dayAdjustmentPresent: !!dayAdjustmentInfo,
      twoPhaseMode: 'Form valid even with day adjustment - will handle in phases'
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
