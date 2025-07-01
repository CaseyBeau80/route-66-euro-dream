
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

  // CRITICAL: Show day adjustment notice PROMINENTLY - this is the most important message
  if (dayAdjustmentInfo) {
    return (
      <div className={`rounded-xl border-4 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 p-8 shadow-2xl ${className}`}>
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 mt-1">
            <div className="relative">
              <AlertCircle className="h-20 w-20 text-red-600 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-4xl font-black text-red-900 mb-8 flex items-center gap-4 animate-pulse">
              🚨 IMPORTANT: Your Trip Duration Has Been Changed! 🚨
            </h3>
            
            {/* MASSIVE, IMPOSSIBLE TO MISS COMPARISON */}
            <div className="bg-white p-8 rounded-xl border-4 border-red-400 shadow-lg mb-8">
              <div className="text-center mb-6">
                <p className="text-3xl font-black text-gray-800 mb-4">WHAT HAPPENED TO YOUR TRIP:</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
                {/* What you entered */}
                <div className="text-center">
                  <div className="bg-red-100 border-4 border-red-500 rounded-xl p-8 shadow-lg">
                    <p className="text-xl font-bold text-red-800 mb-4">YOU REQUESTED:</p>
                    <div className="text-8xl font-black text-red-600 mb-4">{dayAdjustmentInfo.requested}</div>
                    <p className="text-2xl font-bold text-red-700">DAYS</p>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="text-center">
                  <ArrowRight className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
                  <p className="text-xl font-bold text-red-600 mt-4">AUTOMATICALLY CHANGED TO</p>
                </div>
                
                {/* What we changed it to */}
                <div className="text-center">
                  <div className="bg-green-100 border-4 border-green-500 rounded-xl p-8 shadow-lg">
                    <p className="text-xl font-bold text-green-800 mb-4">NOW PLANNED AS:</p>
                    <div className="text-8xl font-black text-green-600 mb-4">{dayAdjustmentInfo.minimum}</div>
                    <p className="text-2xl font-bold text-green-700">DAYS</p>
                  </div>
                </div>
              </div>

              {/* Clear explanation */}
              <div className="bg-blue-50 border-4 border-blue-300 rounded-xl p-8 mb-6">
                <div className="flex items-start gap-6">
                  <Clock className="h-12 w-12 text-blue-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900 mb-6">WHY WE HAD TO CHANGE YOUR TRIP DURATION:</p>
                    <div className="text-xl text-blue-800 leading-relaxed font-semibold space-y-4">
                      <p className="bg-white p-4 rounded-lg border-2 border-blue-200">
                        📍 <strong>Your route from {formData.startLocation} to {formData.endLocation}</strong> covers approximately {Math.round(dayAdjustmentInfo.minimum * 300)} miles of driving.
                      </p>
                      <p className="bg-white p-4 rounded-lg border-2 border-blue-200">
                        ⏰ <strong>Safety Limit:</strong> We keep daily driving under 10 hours (maximum 300 miles per day) for your safety and comfort.
                      </p>
                      <p className="bg-white p-4 rounded-lg border-2 border-blue-200">
                        🧮 <strong>The Math:</strong> Your {dayAdjustmentInfo.requested}-day trip would require {Math.round((dayAdjustmentInfo.minimum * 300) / dayAdjustmentInfo.requested)} miles per day, which exceeds our 300-mile safety limit.
                      </p>
                      <p className="bg-white p-4 rounded-lg border-2 border-blue-200">
                        ✅ <strong>Solution:</strong> {dayAdjustmentInfo.minimum} days keeps you under 300 miles per day for a safe, enjoyable journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits message */}
              <div className="bg-green-600 text-white p-8 rounded-xl border-4 border-green-700">
                <p className="text-2xl font-bold flex items-center gap-4 mb-4">
                  <Route className="h-8 w-8" />
                  Your {dayAdjustmentInfo.minimum}-Day Trip Will Be Perfect!
                </p>
                <div className="text-lg space-y-2">
                  <p>✅ Safe daily driving times (under 10 hours per day)</p>
                  <p>✅ More time to enjoy Route 66 attractions</p>
                  <p>✅ Comfortable pace without rushing</p>
                  <p>✅ Better rest stops and photo opportunities</p>
                </div>
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
