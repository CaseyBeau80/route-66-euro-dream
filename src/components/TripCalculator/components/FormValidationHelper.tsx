
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

  console.log('🎯 FormValidationHelper render:', {
    dayAdjustmentInfo,
    isFormValid,
    validationIssues,
    formData: {
      startLocation: formData.startLocation,
      endLocation: formData.endLocation,
      travelDays: formData.travelDays,
      tripStartDate: formData.tripStartDate
    }
  });

  // CRITICAL: Day adjustment message ALWAYS takes priority over everything else
  if (dayAdjustmentInfo) {
    console.log('🚨 SHOWING DAY ADJUSTMENT MESSAGE:', dayAdjustmentInfo);
    
    return (
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`}>
        <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="rounded-xl border-4 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 p-8 shadow-2xl">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-4xl font-black text-red-900 mb-6 text-center">
                  🚨 IMPORTANT: Your Trip Duration Was Changed!
                </h3>
                
                {/* MASSIVE, CLEAR COMPARISON */}
                <div className="bg-white rounded-xl border-4 border-red-400 p-8 mb-6 shadow-lg">
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">Here's What Happened:</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                    {/* What you entered */}
                    <div className="bg-red-100 rounded-xl p-6 border-4 border-red-400 shadow-md">
                      <p className="text-lg font-bold text-red-700 mb-2">YOU ENTERED:</p>
                      <div className="text-6xl font-black text-red-600 mb-2">{dayAdjustmentInfo.requested}</div>
                      <p className="text-2xl font-bold text-red-700">DAYS</p>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex justify-center">
                      <div className="bg-orange-100 rounded-full p-4">
                        <ArrowRight className="h-12 w-12 text-orange-600" />
                      </div>
                    </div>
                    
                    {/* What we changed it to */}
                    <div className="bg-green-100 rounded-xl p-6 border-4 border-green-400 shadow-md">
                      <p className="text-lg font-bold text-green-700 mb-2">WE CHANGED IT TO:</p>
                      <div className="text-6xl font-black text-green-600 mb-2">{dayAdjustmentInfo.minimum}</div>
                      <p className="text-2xl font-bold text-green-700">DAYS</p>
                    </div>
                  </div>
                </div>

                {/* SIMPLE, CLEAR EXPLANATION */}
                <div className="bg-blue-50 rounded-xl border-4 border-blue-300 p-6 mb-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <Clock className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-2xl font-bold text-blue-900 mb-4">
                        Why We Changed Your {dayAdjustmentInfo.requested}-Day Trip to {dayAdjustmentInfo.minimum} Days:
                      </h4>
                      <div className="text-lg text-blue-800 space-y-3">
                        <p className="leading-relaxed">
                          <strong>Your route from {formData.startLocation} to {formData.endLocation}</strong> is approximately <strong>{Math.round(dayAdjustmentInfo.minimum * 300)} miles long</strong>.
                        </p>
                        <p className="leading-relaxed">
                          With only {dayAdjustmentInfo.requested} days, you would need to drive <strong>{Math.round((dayAdjustmentInfo.minimum * 300) / dayAdjustmentInfo.requested)} miles per day</strong> - that's more than 10 hours of driving each day!
                        </p>
                        <p className="leading-relaxed font-semibold text-blue-900">
                          🛡️ For your safety and enjoyment, we limit daily driving to 300 miles (about 10 hours).
                        </p>
                        <p className="leading-relaxed font-semibold text-green-800">
                          ✅ With {dayAdjustmentInfo.minimum} days, you'll drive a comfortable 300 miles per day.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-green-50 rounded-xl border-4 border-green-300 p-6 mb-6 shadow-lg">
                  <h4 className="text-xl font-bold text-green-800 mb-4">
                    🎉 Your {dayAdjustmentInfo.minimum}-Day Trip Will Be BETTER Because:
                  </h4>
                  <ul className="text-lg text-green-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Safe daily driving times (under 10 hours per day)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>More time to enjoy Route 66 attractions and stops</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Less rushing, more relaxing and memorable experiences</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      <span>Better photo opportunities and time to explore each city</span>
                    </li>
                  </ul>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-800 mb-4">
                    Continue below to see your optimized {dayAdjustmentInfo.minimum}-day Route 66 adventure! 🚗
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    I Understand - Close This Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show regular validation issues ONLY if there's no day adjustment
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
