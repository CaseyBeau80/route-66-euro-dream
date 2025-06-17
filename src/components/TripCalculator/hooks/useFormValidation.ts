
import { useMemo } from 'react';
import { TripFormData } from '../types/tripCalculator';

export const useFormValidation = (formData: TripFormData) => {
  const MAX_DAYS = 14;
  const MIN_DAYS = 2;

  const isFormValid = useMemo(() => {
    const hasStartLocation = !!formData.startLocation;
    const hasEndLocation = !!formData.endLocation;
    const hasValidTravelDays = formData.travelDays >= MIN_DAYS && formData.travelDays <= MAX_DAYS;
    const hasStartDate = !!formData.tripStartDate;

    console.log('🔍 Form validation check:', {
      hasStartLocation,
      hasEndLocation,
      hasValidTravelDays,
      travelDays: formData.travelDays,
      hasStartDate,
      isValid: hasStartLocation && hasEndLocation && hasValidTravelDays && hasStartDate
    });

    return hasStartLocation && hasEndLocation && hasValidTravelDays && hasStartDate;
  }, [
    formData.startLocation,
    formData.endLocation,
    formData.travelDays,
    formData.tripStartDate
  ]);

  return { isFormValid };
};
