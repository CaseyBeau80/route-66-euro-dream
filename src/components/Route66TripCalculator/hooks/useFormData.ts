
import { useState, useEffect } from 'react';
import { route66Towns } from '@/types/route66';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';

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
    console.log('💾 useFormData: Loading saved trip data from localStorage...');
    
    // Load saved trip data from local storage on component mount
    try {
      const savedFormData = localStorage.getItem('tripFormData');
      if (savedFormData) {
        const parsedFormData = JSON.parse(savedFormData) as TripFormData;
        console.log('✅ useFormData: Loaded saved form data:', parsedFormData);
        setFormData(parsedFormData);
      } else {
        console.log('ℹ️ useFormData: No saved form data found, using defaults');
      }
    } catch (error) {
      console.error('❌ useFormData: Error parsing saved form data:', error);
      // Reset to defaults if there's an error
      localStorage.removeItem('tripFormData');
    }
  }, []);

  useEffect(() => {
    console.log('💾 useFormData: Saving form data to localStorage:', formData);
    
    // Save form data to local storage whenever it changes
    try {
      localStorage.setItem('tripFormData', JSON.stringify(formData));
    } catch (error) {
      console.error('❌ useFormData: Error saving form data to localStorage:', error);
    }
  }, [formData]);

  const getAvailableEndLocations = () => {
    // Filter out the selected start location from the available end locations
    const available = route66Towns.filter(town => town.name !== formData.startLocation);
    console.log('📍 useFormData: Available end locations:', available.length);
    return available;
  };

  const isCalculateDisabled = !formData.startLocation || !formData.endLocation || formData.travelDays < 1;

  console.log('📝 useFormData: Current state:', {
    startLocation: formData.startLocation,
    endLocation: formData.endLocation,
    travelDays: formData.travelDays,
    isCalculateDisabled
  });

  return {
    formData,
    setFormData,
    getAvailableEndLocations,
    isCalculateDisabled
  };
};
