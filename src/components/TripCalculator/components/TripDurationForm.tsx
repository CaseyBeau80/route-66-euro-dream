
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
    
    // Block invalid numbers completely
    if (isNaN(days) || days < 0) {
      console.log('🚫 Invalid number blocked:', days);
      return;
    }
    
    // HARD BLOCK: Do not allow values over MAX_DAYS
    if (days > MAX_DAYS) {
      console.log(`🚫 HARD BLOCK: ${days} days exceeds maximum of ${MAX_DAYS} days`);
      // Show error but don't update the value
      return;
    }
    
    // Allow valid values
    setFormData({ ...formData, travelDays: days });
    console.log(`✅ Updated travel days to ${days}`);
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
  const isInvalidValue = isOverLimit || isUnderLimit;

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
            isInvalidValue ? 'border-red-500 focus:border-red-500 bg-red-50' : ''
          }`}
        />
        
        {/* Validation Icon */}
        {hasRouteInfo && validation && !isInvalidValue && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>

      {/* CRITICAL ERROR: Hard limit validation messages */}
      {isOverLimit && (
        <div className="p-3 bg-red-100 border-2 border-red-500 rounded-lg">
          <div className="text-red-800 font-semibold flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-600" />
            <div>
              <div className="font-bold">⚠️ MAXIMUM LIMIT EXCEEDED</div>
              <div className="mt-1">
                Our trip planner supports a maximum of {MAX_DAYS} days. Please enter {MAX_DAYS} days or fewer to plan your Route 66 adventure.
              </div>
            </div>
          </div>
        </div>
      )}

      {isUnderLimit && (
        <div className="p-3 bg-red-100 border-2 border-red-500 rounded-lg">
          <div className="text-red-800 font-semibold flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-600" />
            <div>
              <div className="font-bold">⚠️ MINIMUM REQUIREMENT NOT MET</div>
              <div className="mt-1">
                Minimum {MIN_DAYS} days required for Route 66 trips to ensure a quality experience.
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Validation Feedback - only show if within valid range */}
      {hasRouteInfo && validation && !isInvalidValue && (
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
