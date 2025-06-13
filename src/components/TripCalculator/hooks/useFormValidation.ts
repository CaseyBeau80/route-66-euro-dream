
import { useMemo } from 'react';
import { TripFormData } from '../types/tripCalculator';

export const useFormValidation = (formData: TripFormData) => {
  const isFormValid = useMemo(() => {
    const hasStartLocation = !!formData.startLocation;
    const hasEndLocation = !!formData.endLocation;
    const hasValidTravelDays = formData.travelDays > 0 && formData.travelDays <= 30;
    const hasStartDate = !!formData.tripStartDate;

    console.log('📋 Form validation check:', {
      hasStartLocation,
      hasEndLocation,
      hasValidTravelDays,
      hasStartDate,
      formData: {
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        travelDays: formData.travelDays,
        tripStartDate: formData.tripStartDate
      }
    });

    return hasStartLocation && hasEndLocation && hasValidTravelDays && hasStartDate;
  }, [formData]);

  return { isFormValid };
};
