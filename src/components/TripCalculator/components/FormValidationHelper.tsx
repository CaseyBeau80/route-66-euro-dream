
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useFormValidation } from '../hooks/useFormValidation';
import { TripFormData } from '../types/tripCalculator';

interface FormValidationHelperProps {
  formData: TripFormData;
  className?: string;
}

const FormValidationHelper: React.FC<FormValidationHelperProps> = ({
  formData,
  className = ""
}) => {
  const { isFormValid, validationIssues, dayAdjustmentInfo } = useFormValidation(formData);

  console.log('🔍 FormValidationHelper render:', {
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    isFormValid,
    validationIssues,
    timestamp: new Date().toISOString()
  });

  // FIXED: Always show validation issues when form is not complete, regardless of day adjustment
  if (validationIssues.length > 0) {
    console.log('🚨 Showing validation issues:', validationIssues);
    return (
      <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-800 mb-2">
              Please complete the form:
            </h4>
            <ul className="space-y-1">
              {validationIssues.map((issue, index) => (
                <li key={index} className="text-sm text-red-700">
                  • {issue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default FormValidationHelper;
