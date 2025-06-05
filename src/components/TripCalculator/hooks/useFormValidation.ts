
import { useMemo } from 'react';
import { TripFormData } from '../types/tripCalculator';

export const useFormValidation = (formData: TripFormData) => {
  const isFormValid = useMemo(() => {
    const hasStartLocation = Boolean(formData.startLocation);
    const hasEndLocation = Boolean(formData.endLocation);
    const hasTravelDays = Boolean(formData.travelDays && formData.travelDays > 0);
    const differentLocations = formData.startLocation !== formData.endLocation;
    
    console.log('🔍 Form validation check:', {
      hasStartLocation,
      hasEndLocation,
      hasTravelDays,
      differentLocations,
      travelDays: formData.travelDays,
      startLocation: formData.startLocation,
      endLocation: formData.endLocation
    });
    
    const isValid = hasStartLocation && hasEndLocation && hasTravelDays && differentLocations;
    
    console.log('✅ Form validation result:', { isValid });
    
    return isValid;
  }, [formData.startLocation, formData.endLocation, formData.travelDays]);

  return { isFormValid };
};
