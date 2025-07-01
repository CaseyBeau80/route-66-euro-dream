
import React from 'react';
import { AlertCircle, Info, MapPin, Clock, Route, ArrowRight } from 'lucide-react';
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

  // CRITICAL: Show day adjustment notice PROMINENTLY when days are changed
  if (dayAdjustmentInfo) {
    return (
      <div className={`rounded-xl border-4 border-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50 p-6 shadow-xl ${className}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-12 w-12 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-orange-900 mb-4">
              ⚠️ Your Trip Duration Was Automatically Changed
            </h3>
            
            {/* MASSIVE, CLEAR COMPARISON */}
            <div className="bg-white rounded-lg border-2 border-orange-300 p-6 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center">
                {/* What you entered */}
                <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300">
                  <p className="text-sm font-semibold text-red-700 mb-1">YOU ENTERED:</p>
                  <div className="text-4xl font-black text-red-600">{dayAdjustmentInfo.requested}</div>
                  <p className="text-lg font-bold text-red-700">DAYS</p>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center">
                  <ArrowRight className="h-8 w-8 text-orange-500" />
                </div>
                
                {/* What we changed it to */}
                <div className="bg-green-100 rounded-lg p-4 border-2 border-green-300">
                  <p className="text-sm font-semibold text-green-700 mb-1">CHANGED TO:</p>
                  <div className="text-4xl font-black text-green-600">{dayAdjustmentInfo.minimum}</div>
                  <p className="text-lg font-bold text-green-700">DAYS</p>
                </div>
              </div>
            </div>

            {/* SIMPLE, CLEAR EXPLANATION */}
            <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-blue-900 mb-2">
                    Why did we change your trip from {dayAdjustmentInfo.requested} to {dayAdjustmentInfo.minimum} days?
                  </p>
                  <p className="text-blue-800 leading-relaxed">
                    Your route from <strong>{formData.startLocation}</strong> to <strong>{formData.endLocation}</strong> is approximately <strong>{Math.round(dayAdjustmentInfo.minimum * 300)} miles</strong>. 
                    With {dayAdjustmentInfo.requested} days, you'd need to drive <strong>{Math.round((dayAdjustmentInfo.minimum * 300) / dayAdjustmentInfo.requested)} miles per day</strong>.
                  </p>
                  <p className="text-blue-800 mt-2 font-semibold">
                    ✅ Our safety limit is 300 miles per day (about 10 hours of driving)
                  </p>
                  <p className="text-blue-800">
                    ✅ With {dayAdjustmentInfo.minimum} days, you'll drive a comfortable {Math.round((dayAdjustmentInfo.minimum * 300) / dayAdjustmentInfo.minimum)} miles per day
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-4 bg-green-50 rounded-lg border-2 border-green-200 p-4">
              <p className="text-green-800 font-semibold mb-2">
                🎉 Your {dayAdjustmentInfo.minimum}-day trip will be better because:
              </p>
              <ul className="text-green-700 space-y-1">
                <li>• Safe daily driving times (under 10 hours per day)</li>
                <li>• More time to enjoy Route 66 attractions</li>
                <li>• Less rushing, more relaxing</li>
                <li>• Better photo opportunities at each stop</li>
              </ul>
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
