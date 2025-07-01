
import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, ArrowRight, Clock, Shield, Info } from 'lucide-react';
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

  // PRIORITY 1: Day Adjustment Notice - Always show when available (MOST IMPORTANT)
  const showDayAdjustment = !!dayAdjustmentInfo;
  
  // PRIORITY 2: Form validation issues when form is invalid and no day adjustment
  const showValidationIssues = !isFormValid && validationIssues.length > 0 && !showDayAdjustment;
  
  // PRIORITY 3: Success message when form is valid and no day adjustment
  const showSuccessMessage = isFormValid && !showDayAdjustment;

  // Don't render anything if no messages to show
  if (!showDayAdjustment && !showValidationIssues && !showSuccessMessage) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* DAY ADJUSTMENT NOTICE - LARGE, IMPOSSIBLE TO MISS */}
      {showDayAdjustment && dayAdjustmentInfo && (
        <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-4 border-red-400 rounded-2xl p-8 shadow-2xl animate-pulse">
          <div className="flex items-start gap-6">
            <div className="bg-red-500 rounded-full p-4 animate-bounce">
              <AlertTriangle className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-black text-red-800 mb-6 flex items-center gap-3">
                <Shield className="h-8 w-8" />
                🚨 TRIP DAYS AUTOMATICALLY ADJUSTED 🚨
              </h2>
              
              {/* GIANT BEFORE/AFTER DISPLAY */}
              <div className="bg-white rounded-2xl p-6 mb-6 border-4 border-red-200 shadow-lg">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <div className="bg-red-500 text-white px-8 py-6 rounded-2xl shadow-lg">
                      <div className="text-4xl font-black">{dayAdjustmentInfo.requested}</div>
                      <div className="text-lg font-bold">DAYS</div>
                      <div className="text-sm">You Selected</div>
                    </div>
                  </div>
                  <ArrowRight className="h-12 w-12 text-red-600 animate-bounce" />
                  <div className="text-center">
                    <div className="bg-green-500 text-white px-8 py-6 rounded-2xl shadow-lg">
                      <div className="text-4xl font-black">{dayAdjustmentInfo.minimum}</div>
                      <div className="text-lg font-bold">DAYS</div>
                      <div className="text-sm">Required Minimum</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DETAILED EXPLANATION */}
              <div className="space-y-4">
                <div className="bg-blue-100 border-l-8 border-blue-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-blue-800 mb-2">
                        🛡️ WHY WAS THIS CHANGED?
                      </h3>
                      <p className="text-lg text-blue-800 leading-relaxed font-semibold">
                        Your selected <strong>{dayAdjustmentInfo.requested} days</strong> would require 
                        driving <strong>more than 10 hours per day</strong>, which is unsafe and exhausting. 
                        We automatically increased it to <strong>{dayAdjustmentInfo.minimum} days</strong> 
                        to keep daily driving under 10 hours maximum.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-100 border-l-8 border-green-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">
                        ✅ YOUR TRIP NOW INCLUDES:
                      </h3>
                      <ul className="text-lg text-green-800 space-y-2 font-semibold">
                        <li>• Safe daily driving (maximum 8-10 hours per day)</li>
                        <li>• Comfortable time at each destination</li>
                        <li>• All major Route 66 heritage cities</li>
                        <li>• Enjoyable, not exhausting, travel experience</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-full text-xl font-black shadow-lg">
                  <Shield className="h-6 w-6" />
                  TRIP OPTIMIZED FOR SAFETY & ENJOYMENT
                  <Shield className="h-6 w-6" />
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
