
import React from 'react';
import { TripFormData } from '../types/tripCalculator';

interface FormValidationHelperProps {
  formData: TripFormData;
  isFormValid: boolean;
}

const FormValidationHelper: React.FC<FormValidationHelperProps> = ({
  formData,
  isFormValid
}) => {
  if (isFormValid) return null;

  const missingFields = [];
  
  if (!formData.startLocation) {
    missingFields.push('Starting City');
  }
  if (!formData.endLocation) {
    missingFields.push('Destination City');
  }
  if (!formData.travelDays) {
    missingFields.push('Trip Duration');
  }
  if (formData.startLocation === formData.endLocation && formData.startLocation && formData.endLocation) {
    missingFields.push('Different start and end cities');
  }

  return (
    <div 
      className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <p className="text-sm text-red-600 font-medium">
        Please fill in: {missingFields.join(', ')}
      </p>
    </div>
  );
};

export default FormValidationHelper;
