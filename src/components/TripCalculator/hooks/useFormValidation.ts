
import { useMemo, useEffect, useState } from 'react';
import { TripFormData } from '../types/tripCalculator';
import { TravelDayValidator, DayValidationResult } from '../services/validation/TravelDayValidator';
import { TripStyleLogic } from '../services/planning/TripStyleLogic';

export const useFormValidation = (formData: TripFormData) => {
  const MAX_DAYS = 14;
  const MIN_DAYS = 1;
  
  const [validation, setValidation] = useState<DayValidationResult | null>(null);
  
  // Async validation effect
  useEffect(() => {
    const performValidation = async () => {
      if (formData.startLocation && formData.endLocation) {
        const styleConfig = TripStyleLogic.getStyleConfig(formData.tripStyle);
        const result = await TravelDayValidator.validateTravelDays(
          formData.startLocation,
          formData.endLocation,
          formData.travelDays,
          styleConfig
        );
        setValidation(result);
      } else {
        setValidation(null);
      }
    };
    
    performValidation();
  }, [formData.startLocation, formData.endLocation, formData.travelDays, formData.tripStyle]);

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

    // THREE-CONDITION VALIDATION: Check min, max, and user preference
    if (hasStartLocation && hasEndLocation && validation) {
      console.log('🔍 FULL DEBUG: Starting day adjustment check');
      
      console.log('🔍 FULL DEBUG: Validation result:', {
        isValid: validation.isValid,
        minDaysRequired: validation.minDaysRequired,
        maxDaysRecommended: validation.maxDaysRecommended,
        currentDays: validation.currentDays,
        issues: validation.issues,
        recommendations: validation.recommendations
      });

      // FIXED: Only create dayAdjustmentInfo when user days are OUTSIDE valid bounds
      if (validation.minDaysRequired && formData.travelDays < validation.minDaysRequired) {
        // User requested days are BELOW minimum - need to increase
        dayAdjustmentInfo = {
          requested: formData.travelDays,
          minimum: validation.minDaysRequired,
          reason: `Safety limit: Your ${formData.travelDays}-day trip would require ${Math.round((validation.minDaysRequired * 300) / formData.travelDays)} miles per day, which exceeds our 300-mile daily safety limit. We've adjusted it to ${validation.minDaysRequired} days for comfortable driving.`
        };
        recommendedDays = validation.minDaysRequired;
        
        console.log('🔥 FULL DEBUG: DAY ADJUSTMENT INFO CREATED (BELOW MIN):', {
          dayAdjustmentInfo, 
          userDays: formData.travelDays,
          minRequired: validation.minDaysRequired,
          needsAdjustment: true
        });
      } else if (validation.minDaysRequired && formData.travelDays >= validation.minDaysRequired && formData.travelDays <= validation.maxDaysRecommended) {
        // User requested days are WITHIN valid range - respect their choice
        console.log('🔍 FULL DEBUG: User days within valid range - respecting user choice:', {
          userDays: formData.travelDays,
          minRequired: validation.minDaysRequired,
          maxRecommended: validation.maxDaysRecommended,
          withinBounds: true
        });
      } else {
        console.log('🔍 FULL DEBUG: No adjustment needed or no minimum days calculated');
      }
    } else {
      console.log('🔍 FULL DEBUG: Skipping day adjustment check - missing required data:', {
        hasStartLocation,
        hasEndLocation
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
      needsActionableMessage: dayAdjustmentInfo ? dayAdjustmentInfo.minimum > formData.travelDays : false,
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
