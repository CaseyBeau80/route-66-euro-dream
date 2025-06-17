
import React from 'react';
import { AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { TripFormData } from '../types/tripCalculator';

interface FormValidationHelperProps {
  formData: TripFormData;
  isFormValid: boolean;
}

const FormValidationHelper: React.FC<FormValidationHelperProps> = ({
  formData,
  isFormValid
}) => {
  const MAX_DAYS = 14;
  const MIN_DAYS = 1; // FIXED: Changed from 2 to 1
  
  // Check for critical blocking errors
  const isOverLimit = formData.travelDays > MAX_DAYS;
  const isUnderLimit = formData.travelDays > 0 && formData.travelDays < MIN_DAYS;
  const hasBlockingError = isOverLimit || isUnderLimit;

  console.log('🔍 FIXED: FormValidationHelper check:', {
    travelDays: formData.travelDays,
    isOverLimit,
    isUnderLimit,
    hasBlockingError,
    maxDays: MAX_DAYS,
    minDays: MIN_DAYS
  });

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
      // FIXED: Updated validation to allow 1-14 range
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

  // Show blocking error for over/under limit
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

  if (isFormValid) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">
            Ready to plan your Route 66 adventure! 
            {formData.tripStyle === 'destination-focused' && 
              ' Destination-focused style will prioritize canonical Route 66 heritage cities.'}
          </span>
        </div>
      </div>
    );
  }

  return (
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
};

export default FormValidationHelper;
