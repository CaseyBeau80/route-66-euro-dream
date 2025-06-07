
import { useState, useEffect } from 'react';
import { route66Towns } from '@/types/route66';
import { TripFormData } from '../types/tripCalculator';

export const useFormData = () => {
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 7,
    dailyDrivingLimit: 6,
    tripStartDate: undefined,
    tripStyle: 'balanced' // Default to balanced
  });

  useEffect(() => {
    // Load saved trip data from local storage on component mount
    const savedFormData = localStorage.getItem('tripFormData');
    if (savedFormData) {
      try {
        const parsedFormData = JSON.parse(savedFormData) as TripFormData;
        setFormData(parsedFormData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save form data to local storage whenever it changes
    localStorage.setItem('tripFormData', JSON.stringify(formData));
  }, [formData]);

  const getAvailableEndLocations = () => {
    // Filter out the selected start location from the available end locations
    return route66Towns.filter(town => town.name !== formData.startLocation);
  };

  const isCalculateDisabled = !formData.startLocation || !formData.endLocation || formData.travelDays < 1;

  return {
    formData,
    setFormData,
    getAvailableEndLocations,
    isCalculateDisabled
  };
};
