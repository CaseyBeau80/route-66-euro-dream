
import { useMemo } from 'react';
import { TripFormData } from '../types/tripCalculator';

export const useFormValidation = (formData: TripFormData) => {
  const isFormValid = useMemo(() => {
    return Boolean(
      formData.startLocation && 
      formData.endLocation && 
      formData.travelDays && 
      formData.travelDays > 0 &&
      formData.startLocation !== formData.endLocation
    );
  }, [formData.startLocation, formData.endLocation, formData.travelDays]);

  return { isFormValid };
};
