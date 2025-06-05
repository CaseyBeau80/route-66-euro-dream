
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

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <p className="text-sm text-red-600 font-medium">
        Please fill in: 
        {!formData.startLocation && ' Starting City'}
        {!formData.endLocation && ' Destination City'}
        {!formData.travelDays && ' Trip Duration'}
        {formData.startLocation === formData.endLocation && ' Different start and end cities'}
      </p>
    </div>
  );
};

export default FormValidationHelper;
