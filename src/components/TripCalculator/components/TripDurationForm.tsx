
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { TripFormData } from '../types/tripCalculator';
import { TravelDayValidator } from '../services/validation/TravelDayValidator';
import { TripStyleLogic } from '../services/planning/TripStyleLogic';

interface TripDurationFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
}

const TripDurationForm: React.FC<TripDurationFormProps> = ({
  formData,
  setFormData
}) => {
  const MAX_DAYS = 14;
  const MIN_DAYS = 2;

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const days = value === '' ? 0 : parseInt(value, 10);
    
    console.log('⏱️ Travel days input changed:', { value, days, isValid: !isNaN(days) });
    
    // Allow empty input for better UX while typing
    if (value === '') {
      setFormData({ ...formData, travelDays: 0 });
      return;
    }
    
    // Only update if it's a valid number
    if (!isNaN(days) && days >= 0) {
      // Clamp the value between MIN_DAYS and MAX_DAYS
      const clampedDays = Math.min(Math.max(days, 0), MAX_DAYS);
      setFormData({ ...formData, travelDays: clampedDays });
      
      // Log if value was clamped
      if (days !== clampedDays) {
        console.log(`🔒 Travel days clamped from ${days} to ${clampedDays}`);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const days = value === '' ? 0 : parseInt(value, 10);
    
    // On blur, ensure we have a valid value within range
    if (isNaN(days) || days < MIN_DAYS) {
      // If invalid or too low, set to minimum
      setFormData({ ...formData, travelDays: MIN_DAYS });
      console.log(`🔒 Travel days set to minimum ${MIN_DAYS} on blur`);
    } else if (days > MAX_DAYS) {
      // If too high, clamp to maximum
      setFormData({ ...formData, travelDays: MAX_DAYS });
      console.log(`🔒 Travel days clamped to maximum ${MAX_DAYS} on blur`);
    }
  };

  // Check if current value exceeds maximum
  const isOverLimit = formData.travelDays > MAX_DAYS;
  const isUnderLimit = formData.travelDays > 0 && formData.travelDays < MIN_DAYS;

  // Get validation info when we have route information
  const getValidationInfo = () => {
    if (!formData.startLocation || !formData.endLocation || !formData.tripStyle) {
      return null;
    }

    const styleConfig = TripStyleLogic.getStyleConfig(formData.tripStyle);
    const validation = TravelDayValidator.validateTravelDays(
      formData.startLocation,
      formData.endLocation,
      formData.travelDays,
      styleConfig
    );

    return validation;
  };

  const validation = getValidationInfo();
  const hasRouteInfo = !!(formData.startLocation && formData.endLocation);
  const isValid = validation?.isValid ?? true;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Clock className="h-4 w-4 text-route66-primary" />
        Trip Duration: {formData.travelDays > 0 ? `${formData.travelDays} days` : 'Not set'}
      </Label>
      
      <div className="relative">
        <Input
          type="number"
          min={MIN_DAYS}
          max={MAX_DAYS}
          value={formData.travelDays > 0 ? formData.travelDays : ''}
          onChange={handleDaysChange}
          onBlur={handleBlur}
          placeholder={`Enter number of days (${MIN_DAYS}-${MAX_DAYS})`}
          className={`w-full ${
            !isValid || isOverLimit || isUnderLimit ? 'border-red-300 focus:border-red-500' : ''
          }`}
        />
        
        {/* Validation Icon */}
        {hasRouteInfo && validation && !isOverLimit && !isUnderLimit && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>

      {/* Hard limit validation messages */}
      {isOverLimit && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
          <div className="text-red-700 flex items-start gap-1">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>Maximum {MAX_DAYS} days supported. Value has been clamped to {MAX_DAYS} days.</span>
          </div>
        </div>
      )}

      {isUnderLimit && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
          <div className="text-red-700 flex items-start gap-1">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>Minimum {MIN_DAYS} days required for Route 66 trips.</span>
          </div>
        </div>
      )}
      
      {/* Validation Feedback */}
      {hasRouteInfo && validation && !isOverLimit && !isUnderLimit && (
        <div className="space-y-2">
          {/* Show minimum days info */}
          <div className="text-xs text-blue-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              Minimum {validation.minDaysRequired} days recommended for this route ({formData.tripStyle} style)
            </span>
          </div>
          
          {/* Show issues */}
          {validation.issues.length > 0 && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
              {validation.issues.map((issue, index) => (
                <div key={index} className="text-red-700 flex items-start gap-1">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Show recommendations */}
          {validation.recommendations.length > 0 && validation.issues.length === 0 && (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
              {validation.recommendations.map((rec, index) => (
                <div key={index} className="text-blue-700">
                  💡 {rec}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Enhanced description with destination-focused context */}
      <div className="text-xs text-route66-text-secondary space-y-1">
        <p>How many days do you want to spend on your Route 66 adventure? Maximum {MAX_DAYS} days supported for optimal trip planning.</p>
        {formData.tripStyle === 'destination-focused' && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded">
            <p className="text-amber-700">
              🏛️ <strong>Destination-Focused:</strong> Your trip will prioritize canonical Route 66 heritage cities 
              and major destinations. Longer trips allow for more comprehensive coverage of iconic Route 66 locations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDurationForm;
