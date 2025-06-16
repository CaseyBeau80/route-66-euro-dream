
import React from 'react';
import { AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { TripFormData } from '../types/tripCalculator';

interface FormValidationHelperProps {
  formData: TripFormData;
  isFormValid: boolean;
}

const FormValidationHelper: React.FC<FormValidationHelperProps> = ({
  formData,
  isFormValid
}) => {
  const validationChecks = [
    {
      id: 'start-location',
      label: 'Start location selected',
      isValid: !!formData.startLocation,
      value: formData.startLocation || 'Not selected'
    },
    {
      id: 'end-location',
      label: 'Destination selected',
      isValid: !!formData.endLocation,
      value: formData.endLocation || 'Not selected'
    },
    {
      id: 'travel-days',
      label: 'Trip duration set (1-14 days)',
      isValid: formData.travelDays > 0 && formData.travelDays <= 14,
      value: formData.travelDays > 0 ? `${formData.travelDays} days` : 'Not set'
    },
    {
      id: 'start-date',
      label: 'Start date selected (required for weather)',
      isValid: !!formData.tripStartDate,
      value: formData.tripStartDate 
        ? formData.tripStartDate.toLocaleDateString()
        : 'Not selected'
    }
  ];

  const incompleteChecks = validationChecks.filter(check => !check.isValid);

  if (isFormValid) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Ready to plan your Route 66 adventure!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-2 mb-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-amber-800 mb-1">
            Complete these steps to plan your trip:
          </h4>
          <ul className="space-y-1 text-sm text-amber-700">
            {incompleteChecks.map((check) => (
              <li key={check.id} className="flex items-center gap-2">
                {check.id === 'start-date' && <Calendar className="h-4 w-4" />}
                <span>• {check.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FormValidationHelper;
