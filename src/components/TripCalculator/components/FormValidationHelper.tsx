
import React from 'react';
import { AlertCircle, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
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
  const { dayAdjustmentInfo, recommendedDays, MAX_DAYS, MIN_DAYS } = useFormValidation(formData);
  
  // Check for critical blocking errors
  const isOverLimit = formData.travelDays > MAX_DAYS;
  const isUnderLimit = formData.travelDays > 0 && formData.travelDays < MIN_DAYS;
  const hasBlockingError = isOverLimit || isUnderLimit;

  console.log('🔍 DEBUGGING FormValidationHelper render:', {
    travelDays: formData.travelDays,
    startLocation: formData.startLocation,
    endLocation: formData.endLocation,
    dayAdjustmentInfo,
    recommendedDays,
    hasBlockingError,
    isFormValid,
    'dayAdjustmentInfo exists': !!dayAdjustmentInfo,
    'should show adjustment notice': !!(dayAdjustmentInfo && formData.startLocation && formData.endLocation)
  });

  // Show blocking error for over/under limit - this takes precedence over everything
  if (hasBlockingError) {
    return (
      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-800 mb-2">
              🚫 Cannot Plan Trip - Invalid Duration
            </h4>
            {isOverLimit && (
              <div className="text-red-700 space-y-1">
                <p className="font-semibold">Trip duration exceeds maximum limit</p>
                <p>You entered <strong>{formData.travelDays} days</strong>, but our planner supports a maximum of <strong>{MAX_DAYS} days</strong>.</p>
                <p className="text-sm">Please reduce your trip duration to {MAX_DAYS} days or fewer to continue.</p>
              </div>
            )}
            {isUnderLimit && (
              <div className="text-red-700 space-y-1">
                <p className="font-semibold">Trip duration below minimum requirement</p>
                <p>You entered <strong>{formData.travelDays} days</strong>, but you must select at least <strong>{MIN_DAYS} day</strong>.</p>
                <p className="text-sm">Please select at least {MIN_DAYS} day for your trip.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const validationChecks = [
    {
      id: 'start-location',
      label: 'Start location selected',
      isValid: !!formData.startLocation,
      value: formData.startLocation || 'Not selected'
    },
    {
      id: 'end-location',
      label: 'Destination selected',
      isValid: !!formData.endLocation,
      value: formData.endLocation || 'Not selected'
    },
    {
      id: 'travel-days',
      label: `Trip duration set (${MIN_DAYS}-${MAX_DAYS} days)`,
      isValid: formData.travelDays > 0 && formData.travelDays >= MIN_DAYS && formData.travelDays <= MAX_DAYS,
      value: formData.travelDays > 0 ? `${formData.travelDays} days` : 'Not selected',
      isBlocking: hasBlockingError
    },
    {
      id: 'start-date',
      label: 'Start date selected (required for weather)',
      isValid: !!formData.tripStartDate,
      value: formData.tripStartDate 
        ? formData.tripStartDate.toLocaleDateString()
        : 'Not selected'
    }
  ];

  const incompleteChecks = validationChecks.filter(check => !check.isValid);

  // SEPARATE RENDERING: Show day adjustment notice when applicable
  const dayAdjustmentSection = dayAdjustmentInfo && formData.startLocation && formData.endLocation ? (
    <div className="bg-amber-100 border-2 border-amber-500 rounded-lg p-6 animate-pulse">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-7 w-7 text-amber-600 mt-0.5 animate-bounce" />
        <div>
          <h4 className="font-bold text-amber-800 mb-3 text-lg">
            ⚠️ Trip Duration Automatically Adjusted
          </h4>
          <div className="text-amber-700 space-y-3">
            <div className="flex items-center gap-3 text-xl font-bold bg-white/50 p-3 rounded-lg">
              <span className="bg-red-200 text-red-800 px-3 py-2 rounded-lg shadow-sm">
                {dayAdjustmentInfo.requested} days (your selection)
              </span>
              <ArrowRight className="h-6 w-6 text-amber-600" />
              <span className="bg-green-200 text-green-800 px-3 py-2 rounded-lg shadow-sm">
                {dayAdjustmentInfo.minimum} days (required minimum)
              </span>
            </div>
            <div className="bg-white/70 p-4 rounded-lg border border-amber-200">
              <p className="font-semibold mb-2 text-amber-800">
                📋 Why was this adjusted?
              </p>
              <p className="text-sm leading-relaxed">
                <strong>Safety Requirement:</strong> {dayAdjustmentInfo.reason}
              </p>
              <p className="text-sm leading-relaxed mt-2">
                Your trip will be automatically extended to <strong>{dayAdjustmentInfo.minimum} days</strong> to ensure:
              </p>
              <ul className="text-sm mt-2 ml-4 space-y-1">
                <li>• Maximum 10 hours of driving per day</li>
                <li>• Proper time to enjoy destinations</li>
                <li>• Safe and comfortable travel experience</li>
              </ul>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-amber-800 bg-yellow-100 px-3 py-2 rounded-full inline-block">
                ✅ This adjustment will happen automatically when you plan your trip
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  // SEPARATE RENDERING: Show form validation status
  const formValidationSection = isFormValid ? (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center gap-2 text-green-700">
        <CheckCircle className="h-5 w-5" />
        <div className="flex-1">
          <span className="font-medium">
            Ready to plan your Route 66 adventure! 
            {formData.tripStyle === 'destination-focused' && 
              ' Destination-focused style will prioritize canonical Route 66 heritage cities.'}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-2 mb-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-amber-800 mb-1">
            Complete these steps to plan your trip:
          </h4>
          <ul className="space-y-1 text-sm text-amber-700">
            {incompleteChecks.map((check) => (
              <li key={check.id} className="flex items-center gap-2">
                {check.id === 'start-date' && <Calendar className="h-4 w-4" />}
                <span>• {check.label}</span>
                {check.isBlocking && (
                  <span className="text-red-600 font-semibold">(REQUIRED)</span>
                )}
              </li>
            ))}
          </ul>
          {formData.tripStyle === 'destination-focused' && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              💡 <strong>Destination-Focused Mode:</strong> Your trip will prioritize major Route 66 heritage cities 
              and canonical destinations for an authentic Mother Road experience. Maximum {MAX_DAYS} days for optimal planning.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ALWAYS RENDER BOTH SECTIONS INDEPENDENTLY
  return (
    <div className="space-y-6">
      {/* Day Adjustment Notice - Independent rendering */}
      {dayAdjustmentSection}
      
      {/* Form Validation Status - Independent rendering */}
      {formValidationSection}
    </div>
  );
};

export default FormValidationHelper;
