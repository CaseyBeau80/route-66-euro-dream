
import React from 'react';
import { AlertCircle, Info, MapPin } from 'lucide-react';
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

  // Show day adjustment notice if present
  if (dayAdjustmentInfo) {
    return (
      <div className={`rounded-lg border-2 border-amber-400 bg-amber-50 p-6 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-amber-800 mb-3">
              🚨 Important: Trip Duration Adjusted
            </h3>
            <div className="space-y-3">
              <div className="bg-white/70 p-4 rounded-lg border border-amber-200">
                <p className="text-lg font-semibold text-amber-800 mb-2">
                  Your trip has been automatically extended:
                </p>
                <div className="flex items-center gap-4 text-base">
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                    Requested: {dayAdjustmentInfo.requested} days
                  </span>
                  <span className="text-amber-600 font-bold">→</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    Adjusted to: {dayAdjustmentInfo.minimum} days
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-800 mb-1">Why was this changed?</p>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      {dayAdjustmentInfo.reason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Your trip itinerary will be planned for {dayAdjustmentInfo.minimum} days to ensure safe and enjoyable travel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show validation issues if form is not valid
  if (!isFormValid && validationIssues.length > 0) {
    return (
      <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
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
