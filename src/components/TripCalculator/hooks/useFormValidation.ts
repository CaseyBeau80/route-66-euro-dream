
import { useMemo } from 'react';
import { TripFormData } from '../types/tripCalculator';

export const useFormValidation = (formData: TripFormData) => {
  const MAX_DAYS = 14;
  const MIN_DAYS = 1; // FIXED: Changed from 2 to 1

  const isFormValid = useMemo(() => {
    const hasStartLocation = !!formData.startLocation;
    const hasEndLocation = !!formData.endLocation;
    // FIXED: Updated validation to allow 1-14 range
    const hasValidTravelDays = formData.travelDays > 0 && formData.travelDays >= MIN_DAYS && formData.travelDays <= MAX_DAYS;
    const hasStartDate = !!formData.tripStartDate;

    console.log('🔍 FIXED: Form validation check:', {
      hasStartLocation,
      hasEndLocation,
      hasValidTravelDays,
      travelDays: formData.travelDays,
      hasStartDate,
      isWithinLimits: `${formData.travelDays} is between ${MIN_DAYS} and ${MAX_DAYS}`,
      isValid: hasStartLocation && hasEndLocation && hasValidTravelDays && hasStartDate
    });

    return hasStartLocation && hasEndLocation && hasValidTravelDays && hasStartDate;
  }, [
    formData.startLocation,
    formData.endLocation,
    formData.travelDays,
    formData.tripStartDate
  ]);

  const validationIssues = useMemo(() => {
    const issues = [];
    
    if (!formData.startLocation) issues.push('Start location required');
    if (!formData.endLocation) issues.push('End location required');
    if (!formData.tripStartDate) issues.push('Start date required');
    // FIXED: Updated validation messages for 1-14 range
    if (formData.travelDays === 0) issues.push('Travel days must be selected');
    if (formData.travelDays > 0 && formData.travelDays < MIN_DAYS) issues.push(`Minimum ${MIN_DAYS} day required`);
    if (formData.travelDays > MAX_DAYS) issues.push(`Maximum ${MAX_DAYS} days allowed`);

    return issues;
  }, [formData]);

  return { 
    isFormValid, 
    validationIssues,
    MIN_DAYS,
    MAX_DAYS
  };
};
