
import { useState } from 'react';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';

export const useFormData = () => {
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 0,
    dailyDrivingLimit: 300,
    tripStyle: 'destination-focused', // FIXED: Only destination-focused allowed
    tripStartDate: new Date()
  });

  return {
    formData,
    setFormData
  };
};
