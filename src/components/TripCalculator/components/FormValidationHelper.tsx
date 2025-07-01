
import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, ArrowRight, Clock, Shield, Info, Car, Route } from 'lucide-react';
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
      {/* CRITICAL DAY ADJUSTMENT NOTICE - GIANT, IMPOSSIBLE TO MISS */}
      {showDayAdjustment && dayAdjustmentInfo && (
        <div className="relative">
          {/* Pulsing border animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-red-400 rounded-3xl animate-pulse blur-sm"></div>
          
          {/* Main notice container */}
          <div className="relative bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-8 border-red-500 rounded-3xl p-10 shadow-2xl">
            
            {/* MASSIVE HEADER */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="bg-red-600 rounded-full p-6 animate-bounce shadow-xl">
                  <AlertTriangle className="h-16 w-16 text-white" />
                </div>
                <div className="bg-orange-600 rounded-full p-6 animate-pulse shadow-xl">
                  <Clock className="h-16 w-16 text-white" />
                </div>
                <div className="bg-red-600 rounded-full p-6 animate-bounce shadow-xl" style={{ animationDelay: '0.5s' }}>
                  <Car className="h-16 w-16 text-white" />
                </div>
              </div>
              
              <h1 className="text-6xl font-black text-red-800 mb-4 animate-pulse">
                🚨 TRIP AUTOMATICALLY ADJUSTED 🚨
              </h1>
              
              <p className="text-2xl font-bold text-red-700 mb-6">
                Your trip duration has been changed for your safety
              </p>
            </div>

            {/* GIANT BEFORE/AFTER COMPARISON */}
            <div className="bg-white rounded-3xl p-8 mb-8 border-8 border-red-300 shadow-2xl">
              <h2 className="text-4xl font-black text-center text-gray-800 mb-8">
                HERE'S WHAT HAPPENED:
              </h2>
              
              <div className="flex items-center justify-center gap-12">
                {/* What you entered */}
                <div className="text-center">
                  <div className="bg-red-500 text-white p-8 rounded-3xl shadow-2xl border-4 border-red-600">
                    <div className="text-7xl font-black mb-2">{dayAdjustmentInfo.requested}</div>
                    <div className="text-2xl font-bold">DAYS</div>
                    <div className="text-lg mt-2 bg-red-600 rounded-lg px-4 py-2">
                      What You Entered
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center">
                  <ArrowRight className="h-20 w-20 text-red-600 animate-bounce mb-4" />
                  <div className="text-2xl font-black text-red-800">CHANGED TO</div>
                </div>

                {/* What we changed it to */}
                <div className="text-center">
                  <div className="bg-green-500 text-white p-8 rounded-3xl shadow-2xl border-4 border-green-600">
                    <div className="text-7xl font-black mb-2">{dayAdjustmentInfo.minimum}</div>
                    <div className="text-2xl font-bold">DAYS</div>
                    <div className="text-lg mt-2 bg-green-600 rounded-lg px-4 py-2">
                      Required Minimum
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILED EXPLANATION - CRYSTAL CLEAR */}
            <div className="space-y-6">
              <div className="bg-blue-100 border-8 border-blue-500 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <Route className="h-12 w-12 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-3xl font-black text-blue-800 mb-4">
                      🔍 WHY DID THIS HAPPEN?
                    </h3>
                    <div className="text-xl text-blue-800 leading-relaxed space-y-3">
                      <p className="font-bold">
                        Your Route 66 trip from <span className="bg-blue-200 px-2 py-1 rounded">{formData.startLocation}</span> to <span className="bg-blue-200 px-2 py-1 rounded">{formData.endLocation}</span> is longer than you think!
                      </p>
                      <p>
                        <strong>With only {dayAdjustmentInfo.requested} days, you would need to drive MORE THAN 10 HOURS PER DAY</strong> - which is:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4 font-semibold">
                        <li>❌ UNSAFE (driver fatigue)</li>
                        <li>❌ EXHAUSTING (no time to enjoy stops)</li>
                        <li>❌ RUSHED (missing the Route 66 experience)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-100 border-8 border-green-500 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-12 w-12 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-3xl font-black text-green-800 mb-4">
                      ✅ WITH {dayAdjustmentInfo.minimum} DAYS YOU GET:
                    </h3>
                    <ul className="text-xl text-green-800 space-y-3 font-bold">
                      <li className="flex items-center gap-3">
                        <Clock className="h-6 w-6" />
                        SAFE daily driving (8-10 hours maximum per day)
                      </li>
                      <li className="flex items-center gap-3">
                        <Car className="h-6 w-6" />
                        Time to actually ENJOY Route 66 attractions
                      </li>
                      <li className="flex items-center gap-3">
                        <MapPin className="h-6 w-6" />
                        Comfortable stops at heritage cities
                      </li>
                      <li className="flex items-center gap-3">
                        <Shield className="h-6 w-6" />
                        A memorable, NOT exhausting, adventure
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* FINAL REASSURANCE */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-6 rounded-full text-2xl font-black shadow-2xl">
                <Shield className="h-8 w-8" />
                YOUR TRIP IS NOW OPTIMIZED FOR SUCCESS!
                <Shield className="h-8 w-8" />
              </div>
              <p className="text-lg text-gray-700 mt-4 font-semibold">
                This change ensures you have an amazing, safe Route 66 experience
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message - Shows when form is valid */}
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
