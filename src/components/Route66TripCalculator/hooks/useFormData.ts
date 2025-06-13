
import { useState, useEffect } from 'react';
import { route66Towns } from '@/types/route66';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';

const STORAGE_KEY = 'route66-trip-form-data';

export const useFormData = () => {
  const [formData, setFormData] = useState<TripFormData>({
    startLocation: '',
    endLocation: '',
    travelDays: 7,
    dailyDrivingLimit: 6,
    tripStartDate: undefined,
    tripStyle: 'balanced'
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    console.log('💾 useFormData: Saving form data to localStorage:', formData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Load form data from localStorage on mount
  useEffect(() => {
    console.log('💾 useFormData: Loading saved trip data from localStorage...');
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        
        // Convert tripStartDate string back to Date object if it exists
        if (parsedData.tripStartDate && typeof parsedData.tripStartDate === 'string') {
          console.log('📅 useFormData: Converting tripStartDate string to Date object:', parsedData.tripStartDate);
          parsedData.tripStartDate = new Date(parsedData.tripStartDate);
          
          // Validate the parsed date
          if (isNaN(parsedData.tripStartDate.getTime())) {
            console.warn('⚠️ useFormData: Invalid date found, removing it');
            parsedData.tripStartDate = undefined;
          }
        }
        
        console.log('✅ useFormData: Loaded saved form data:', parsedData);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error('❌ useFormData: Error loading saved data:', error);
    }
  }, []);

  const getAvailableEndLocations = () => {
    return route66Towns.filter(town => town.name !== formData.startLocation);
  };

  const isCalculateDisabled = !formData.startLocation || 
                             !formData.endLocation || 
                             formData.travelDays <= 0 || 
                             !formData.tripStartDate;

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
