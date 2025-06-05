
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
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
      <p className="text-sm text-yellow-800">
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
