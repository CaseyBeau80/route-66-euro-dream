
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

  // Show day adjustment notice if present - NOW WITH RED BACKGROUND
  if (dayAdjustmentInfo) {
    return (
      <div className={`rounded-lg border-4 border-red-600 bg-red-100 p-8 shadow-xl ${className}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <AlertCircle className="h-10 w-10 text-red-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-red-900 mb-4">
              🚨 ATTENTION: Trip Duration Changed!
            </h3>
            <div className="space-y-4">
              <div className="bg-red-200 p-6 rounded-lg border-2 border-red-400 shadow-md">
                <p className="text-xl font-bold text-red-900 mb-3">
                  Your trip has been automatically extended:
                </p>
                <div className="flex items-center gap-6 text-lg">
                  <span className="px-4 py-2 bg-red-600 text-white rounded-full font-bold text-xl">
                    You requested: {dayAdjustmentInfo.requested} days
                  </span>
                  <span className="text-red-700 font-black text-2xl">→</span>
                  <span className="px-4 py-2 bg-green-600 text-white rounded-full font-bold text-xl">
                    Adjusted to: {dayAdjustmentInfo.minimum} days
                  </span>
                </div>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg border-2 border-red-300">
                <div className="flex items-start gap-3">
                  <Info className="h-6 w-6 text-red-700 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-red-900 mb-2 text-lg">Why was this changed?</p>
                    <p className="text-red-800 text-base leading-relaxed font-medium">
                      {dayAdjustmentInfo.reason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-600 text-white p-4 rounded-lg border-2 border-red-700">
                <p className="text-lg font-bold flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
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
