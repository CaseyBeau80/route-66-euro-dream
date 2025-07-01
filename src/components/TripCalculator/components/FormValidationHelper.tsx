
import React from 'react';
import { AlertCircle, CheckCircle, Clock, Info, MapPin } from 'lucide-react';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from '../hooks/useFormValidation';

interface FormValidationHelperProps {
  formData: TripFormData;
  isFormValid: boolean;
}

const FormValidationHelper: React.FC<FormValidationHelperProps> = ({
  formData,
  isFormValid
}) => {
  const { validationIssues, dayAdjustmentInfo, recommendedDays } = useFormValidation(formData);

  console.log('🔍 FormValidationHelper render:', {
    isFormValid,
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    dayAdjustmentDetails: dayAdjustmentInfo,
    recommendedDays,
    validationIssues: validationIssues.length,
    'both should show': !!dayAdjustmentInfo && isFormValid
  });

  // Show day adjustment notice when available (always show if present)
  const showDayAdjustment = !!dayAdjustmentInfo;
  
  // Show form validation issues when form is invalid
  const showValidationIssues = !isFormValid && validationIssues.length > 0;
  
  // Show success message when form is valid and no day adjustment
  const showSuccessMessage = isFormValid && !showDayAdjustment;

  console.log('🎯 FormValidationHelper display logic:', {
    showDayAdjustment,
    showValidationIssues,
    showSuccessMessage,
    'will show both day adjustment and success': showDayAdjustment && isFormValid
  });

  // Don't render anything if no messages to show
  if (!showDayAdjustment && !showValidationIssues && !showSuccessMessage) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Day Adjustment Notice - Always shows when present */}
      {showDayAdjustment && dayAdjustmentInfo && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-4 shadow-md animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500 rounded-full p-2 animate-pulse">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Trip Duration Adjusted for Safety
              </h3>
              
              <div className="bg-white/70 rounded-lg p-3 mb-3 border border-amber-200">
                <div className="flex items-center justify-center gap-3 text-sm">
                  <div className="text-center">
                    <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg shadow-sm">
                      <div className="text-xl font-bold">{dayAdjustmentInfo.requested}</div>
                      <div className="text-xs">days requested</div>
                    </div>
                  </div>
                  <div className="text-amber-600 font-bold">→</div>
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg shadow-sm">
                      <div className="text-xl font-bold">{dayAdjustmentInfo.minimum}</div>
                      <div className="text-xs">days required</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-amber-800">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Why was this adjusted?</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      {dayAdjustmentInfo.reason}
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <h4 className="font-semibold text-blue-800 mb-1 text-sm">✅ Your trip now includes:</h4>
                  <ul className="text-xs text-blue-700 space-y-0.5">
                    <li>• Maximum 10 hours of driving per day</li>
                    <li>• Comfortable time at each destination</li>
                    <li>• Safe and enjoyable travel experience</li>
                    <li>• All major Route 66 heritage cities</li>
                  </ul>
                </div>
              </div>

              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  <CheckCircle className="h-3 w-3" />
                  Trip automatically optimized for safety and enjoyment
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message - Shows when form is valid (can show with day adjustment) */}
      {isFormValid && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-green-500 rounded-full p-2">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-800 mb-1">Ready to Plan!</h3>
              <p className="text-sm text-green-700">
                All trip details are complete. Click the plan button to generate your Route 66 adventure!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Validation Issues - Shows when form is invalid */}
      {showValidationIssues && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="bg-red-500 rounded-full p-2">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-800 mb-2">Complete Your Trip Details</h3>
              <div className="space-y-2">
                {validationIssues.map((issue, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-red-700">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormValidationHelper;
