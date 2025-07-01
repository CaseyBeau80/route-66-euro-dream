
import React from 'react';
import { AlertTriangle, Clock, MapPin, ArrowRight, X } from 'lucide-react';
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

  console.log('🔥 FULL DEBUG FormValidationHelper render:', {
    dayAdjustmentInfo,
    dayAdjustmentExists: !!dayAdjustmentInfo,
    isFormValid,
    validationIssues,
    formData: {
      startLocation: formData.startLocation,
      endLocation: formData.endLocation,
      travelDays: formData.travelDays,
      tripStartDate: formData.tripStartDate?.toISOString()
    },
    timestamp: new Date().toISOString()
  });

  // CRITICAL: Day adjustment message ALWAYS takes priority and is UNMISSABLE
  if (dayAdjustmentInfo) {
    console.log('🔥 FULL DEBUG: SHOWING UNMISSABLE DAY ADJUSTMENT MESSAGE:', dayAdjustmentInfo);
    
    return (
      <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-4 border-red-500">
          {/* HUGE RED HEADER BAR */}
          <div className="bg-red-600 text-white p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <AlertTriangle className="h-12 w-12" />
              <h1 className="text-4xl font-black">IMPORTANT CHANGE MADE</h1>
              <AlertTriangle className="h-12 w-12" />
            </div>
            <p className="text-2xl font-bold">We had to adjust your trip duration for safety</p>
          </div>

          {/* MAIN CONTENT */}
          <div className="p-8">
            {/* MASSIVE BEFORE/AFTER COMPARISON */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Here's What We Changed:
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* WHAT YOU ENTERED */}
                <div className="text-center">
                  <div className="bg-red-100 border-4 border-red-400 rounded-xl p-6 mb-4">
                    <p className="text-lg font-bold text-red-700 mb-2">YOU ENTERED:</p>
                    <div className="text-7xl font-black text-red-600">{dayAdjustmentInfo.requested}</div>
                    <p className="text-2xl font-bold text-red-700">DAYS</p>
                  </div>
                </div>
                
                {/* ARROW */}
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full p-4 inline-block">
                    <ArrowRight className="h-12 w-12 text-yellow-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-700 mt-2">CHANGED TO</p>
                </div>
                
                {/* WHAT WE CHANGED IT TO */}
                <div className="text-center">
                  <div className="bg-green-100 border-4 border-green-400 rounded-xl p-6 mb-4">
                    <p className="text-lg font-bold text-green-700 mb-2">WE CHANGED TO:</p>
                    <div className="text-7xl font-black text-green-600">{dayAdjustmentInfo.minimum}</div>
                    <p className="text-2xl font-bold text-green-700">DAYS</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CLEAR EXPLANATION */}
            <div className="bg-blue-50 border-4 border-blue-300 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <Clock className="h-10 w-10 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">
                    Why We Changed Your {dayAdjustmentInfo.requested}-Day Trip:
                  </h3>
                  <div className="text-lg text-blue-800 space-y-4">
                    <p className="leading-relaxed">
                      🗺️ <strong>Your route from {formData.startLocation} to {formData.endLocation}</strong> is approximately <strong>{Math.round(dayAdjustmentInfo.minimum * 300)} miles</strong>.
                    </p>
                    <p className="leading-relaxed">
                      ⚠️ With only <strong>{dayAdjustmentInfo.requested} days</strong>, you would need to drive <strong className="text-red-700">{Math.round((dayAdjustmentInfo.minimum * 300) / dayAdjustmentInfo.requested)} miles per day</strong>.
                    </p>
                    <p className="leading-relaxed">
                      🚗 That's over <strong className="text-red-700">{Math.round(((dayAdjustmentInfo.minimum * 300) / dayAdjustmentInfo.requested) / 50)} hours of driving per day</strong> - which is unsafe and exhausting!
                    </p>
                    <p className="leading-relaxed font-bold text-green-800">
                      ✅ With <strong>{dayAdjustmentInfo.minimum} days</strong>, you'll drive a comfortable <strong>300 miles (6 hours) per day</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BENEFITS OF THE CHANGE */}
            <div className="bg-green-50 border-4 border-green-300 rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <MapPin className="h-8 w-8" />
                Your {dayAdjustmentInfo.minimum}-Day Trip Will Be MUCH Better:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-lg text-green-700">
                  <span className="text-2xl">🛡️</span>
                  <span><strong>Safe driving times</strong> (6 hours/day max)</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-green-700">
                  <span className="text-2xl">🎯</span>
                  <span><strong>More time at attractions</strong> and stops</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-green-700">
                  <span className="text-2xl">😌</span>
                  <span><strong>Relaxed pace</strong> - no rushing</span>
                </div>
                <div className="flex items-center gap-3 text-lg text-green-700">
                  <span className="text-2xl">📸</span>
                  <span><strong>Better photo opportunities</strong></span>
                </div>
              </div>
            </div>

            {/* CALL TO ACTION */}
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 mb-6">
                Continue below to plan your amazing {dayAdjustmentInfo.minimum}-day Route 66 adventure! 🚗✨
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <X className="h-6 w-6" />
                I Understand - Close This Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    console.log('🔍 FULL DEBUG: No day adjustment info - showing regular validation or nothing');
  }

  // Show regular validation issues ONLY if there's no day adjustment
  if (!isFormValid && validationIssues.length > 0) {
    console.log('🔍 FULL DEBUG: Showing regular validation issues:', validationIssues);
    return (
      <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
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

  console.log('🔍 FULL DEBUG: Not showing anything - form is valid');
  return null;
};

export default FormValidationHelper;
