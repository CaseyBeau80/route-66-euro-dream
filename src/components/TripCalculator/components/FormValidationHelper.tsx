
import React from 'react';
import { AlertCircle, Info, MapPin, Clock, Route } from 'lucide-react';
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

  // CRITICAL: Show day adjustment notice PROMINENTLY - this is the most important message
  if (dayAdjustmentInfo) {
    return (
      <div className={`rounded-xl border-4 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 p-8 shadow-2xl animate-pulse ${className}`}>
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 mt-1">
            <div className="relative">
              <AlertCircle className="h-16 w-16 text-red-600 animate-bounce" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-black text-red-900 mb-6 flex items-center gap-3">
              🚨 TRIP DURATION AUTOMATICALLY CHANGED! 🚨
            </h3>
            
            {/* HUGE, IMPOSSIBLE TO MISS COMPARISON */}
            <div className="bg-white p-8 rounded-xl border-4 border-red-400 shadow-lg mb-6">
              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-gray-800 mb-4">HERE'S WHAT HAPPENED:</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* What you entered */}
                <div className="text-center">
                  <div className="bg-red-100 border-4 border-red-400 rounded-xl p-6">
                    <p className="text-lg font-bold text-red-800 mb-2">YOU ENTERED:</p>
                    <div className="text-6xl font-black text-red-600 mb-2">{dayAdjustmentInfo.requested}</div>
                    <p className="text-xl font-bold text-red-700">DAYS</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="text-center">
                  <div className="text-6xl text-red-500 font-black">→</div>
                  <p className="text-lg font-bold text-red-600 mt-2">CHANGED TO</p>
                </div>
                
                {/* What we changed it to */}
                <div className="text-center">
                  <div className="bg-green-100 border-4 border-green-400 rounded-xl p-6">
                    <p className="text-lg font-bold text-green-800 mb-2">WE CHANGED TO:</p>
                    <div className="text-6xl font-black text-green-600 mb-2">{dayAdjustmentInfo.minimum}</div>
                    <p className="text-xl font-bold text-green-700">DAYS</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple explanation */}
            <div className="bg-blue-50 p-6 rounded-xl border-3 border-blue-300 mb-4">
              <div className="flex items-start gap-4">
                <Clock className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xl font-bold text-blue-900 mb-3">WHY DID WE CHANGE YOUR TRIP?</p>
                  <p className="text-lg text-blue-800 leading-relaxed font-medium">
                    {dayAdjustmentInfo.reason}
                  </p>
                </div>
              </div>
            </div>

            {/* Safety message */}
            <div className="bg-green-600 text-white p-6 rounded-xl border-3 border-green-700">
              <p className="text-xl font-bold flex items-center gap-4">
                <Route className="h-6 w-6" />
                Your {dayAdjustmentInfo.minimum}-day trip will be safe, comfortable, and enjoyable with reasonable daily driving times.
              </p>
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
