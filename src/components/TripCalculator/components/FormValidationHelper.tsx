
import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
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
  const { validationIssues, dayAdjustmentInfo } = useFormValidation(formData);

  console.log('🔍 FormValidationHelper render:', {
    isFormValid,
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    dayAdjustmentDetails: dayAdjustmentInfo,
    validationIssues: validationIssues.length
  });

  // Show day adjustment notice when available (always show if present)
  const showDayAdjustment = !!dayAdjustmentInfo;
  
  // Show form validation issues when form is invalid
  const showValidationIssues = !isFormValid && validationIssues.length > 0 && !showDayAdjustment;
  
  // Show success message when form is valid and no day adjustment
  const showSuccessMessage = isFormValid && !showDayAdjustment;

  // Don't render anything if no messages to show
  if (!showDayAdjustment && !showValidationIssues && !showSuccessMessage) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Day Adjustment Notice - Clear and Simple */}
      {showDayAdjustment && dayAdjustmentInfo && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-amber-500 rounded-full p-3 flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-amber-800 mb-3">
                ⚠️ Trip Duration Adjusted
              </h3>
              
              {/* Clear Before/After Display */}
              <div className="bg-white/90 rounded-lg p-4 mb-4 border border-amber-200">
                <div className="flex items-center justify-center gap-4 text-lg">
                  <div className="text-center">
                    <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-bold">
                      {dayAdjustmentInfo.requested} days
                    </div>
                    <div className="text-sm text-gray-600 mt-1">You selected</div>
                  </div>
                  <ArrowRight className="text-amber-600 h-6 w-6" />
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold">
                      {dayAdjustmentInfo.minimum} days
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Minimum required</div>
                  </div>
                </div>
              </div>

              {/* Simple Explanation */}
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 font-semibold mb-2">Why was this adjusted?</p>
                  <p className="text-blue-700 text-sm">
                    Your route is too long for safe {dayAdjustmentInfo.requested}-day travel. 
                    With {dayAdjustmentInfo.minimum} days, you'll have comfortable driving days (8-10 hours max) 
                    and time to enjoy Route 66 attractions.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Your trip planning will use {dayAdjustmentInfo.minimum} days for the best experience
                  </div>
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
