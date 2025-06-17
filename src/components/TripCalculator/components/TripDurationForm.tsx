
import React, { useState, useEffect } from 'react';
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

  // Local input value state to control exactly what appears in the input
  const [inputValue, setInputValue] = useState(
    formData.travelDays > 0 ? formData.travelDays.toString() : ''
  );

  // Sync input value when formData changes from external sources
  useEffect(() => {
    const newValue = formData.travelDays > 0 ? formData.travelDays.toString() : '';
    if (inputValue !== newValue) {
      setInputValue(newValue);
    }
  }, [formData.travelDays]);

  // CRITICAL: Handle input event for immediate validation as user types
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    let value = target.value;
    
    console.log('🔥 IMMEDIATE INPUT VALIDATION:', { value });
    
    // Allow empty input
    if (value === '') {
      setInputValue('');
      setFormData({ ...formData, travelDays: 0 });
      return;
    }
    
    // Strip non-numeric characters immediately
    value = value.replace(/\D/g, '');
    
    // If nothing left after stripping, make it empty
    if (value === '') {
      setInputValue('');
      setFormData({ ...formData, travelDays: 0 });
      return;
    }
    
    const days = parseInt(value, 10);
    
    // ABSOLUTE ENFORCEMENT: Never allow more than MAX_DAYS to appear in input
    if (days > MAX_DAYS) {
      console.log(`🚫 IMMEDIATE BLOCK: ${days} blocked, setting to ${MAX_DAYS}`);
      const maxValue = MAX_DAYS.toString();
      setInputValue(maxValue);
      setFormData({ ...formData, travelDays: MAX_DAYS });
      // Force the input value to be MAX_DAYS
      target.value = maxValue;
      return;
    }
    
    // Update with valid value
    setInputValue(value);
    setFormData({ ...formData, travelDays: days });
    console.log(`✅ IMMEDIATE UPDATE: ${days} days`);
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    console.log('⏱️ CHANGE EVENT: Travel days input changed:', { value, currentFormData: formData.travelDays });
    
    // This is a backup - the onInput handler should catch most cases
    // Allow empty input for better UX while typing
    if (value === '') {
      setInputValue('');
      setFormData({ ...formData, travelDays: 0 });
      return;
    }
    
    // Only allow numeric characters
    if (!/^\d+$/.test(value)) {
      console.log('🚫 CHANGE EVENT: Non-numeric input blocked:', value);
      return;
    }
    
    const days = parseInt(value, 10);
    
    // Block invalid numbers completely
    if (isNaN(days) || days < 0) {
      console.log('🚫 CHANGE EVENT: Invalid number blocked:', days);
      return;
    }
    
    // ABSOLUTE MAXIMUM ENFORCEMENT: Never allow more than 14
    if (days > MAX_DAYS) {
      console.log(`🚫 CHANGE EVENT BLOCK: ${days} days blocked - maximum is ${MAX_DAYS} days`);
      setInputValue(MAX_DAYS.toString());
      setFormData({ ...formData, travelDays: MAX_DAYS });
      return;
    }
    
    // Update both input value and form data with the valid value
    setInputValue(value);
    setFormData({ ...formData, travelDays: days });
    console.log(`✅ CHANGE EVENT: Updated travel days to ${days}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block non-numeric characters completely
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
      console.log('🚫 KEY PRESS BLOCKED:', e.key);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    
    // Block non-numeric paste
    if (!/^\d+$/.test(pastedText)) {
      e.preventDefault();
      console.log('🚫 PASTE BLOCKED: Non-numeric:', pastedText);
      return;
    }
    
    const pastedNumber = parseInt(pastedText, 10);
    
    if (isNaN(pastedNumber) || pastedNumber > MAX_DAYS || pastedNumber < 0) {
      e.preventDefault();
      console.log('🚫 PASTE BLOCKED: Invalid or over limit:', pastedText);
    }
  };

  // Prevent mouse wheel from changing values
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('🚫 MOUSE WHEEL BLOCKED');
  };

  // Handle blur to ensure we always have a valid state
  const handleBlur = () => {
    if (inputValue === '' || parseInt(inputValue) === 0) {
      setInputValue('');
      setFormData({ ...formData, travelDays: 0 });
    }
  };

  // Check if current value exceeds maximum (should never happen with new logic)
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
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onInput={handleInput}
          onChange={handleDaysChange}
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
          onWheel={handleWheel}
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
