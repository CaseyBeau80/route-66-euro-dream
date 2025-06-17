
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

  // CRITICAL: Centralized value setting function that NEVER allows over MAX_DAYS
  const setValidValue = (newValue: string) => {
    console.log('🔒 setValidValue called with:', newValue);
    
    if (newValue === '') {
      setInputValue('');
      setFormData({ ...formData, travelDays: 0 });
      return;
    }
    
    // Strip non-numeric characters
    const cleanValue = newValue.replace(/\D/g, '');
    
    if (cleanValue === '') {
      setInputValue('');
      setFormData({ ...formData, travelDays: 0 });
      return;
    }
    
    const numValue = parseInt(cleanValue, 10);
    
    // ABSOLUTE MAXIMUM ENFORCEMENT
    if (numValue > MAX_DAYS) {
      console.log(`🚫 setValidValue: ${numValue} exceeds max, clamping to ${MAX_DAYS}`);
      setInputValue(MAX_DAYS.toString());
      setFormData({ ...formData, travelDays: MAX_DAYS });
      return;
    }
    
    setInputValue(cleanValue);
    setFormData({ ...formData, travelDays: numValue });
    console.log(`✅ setValidValue: Set to ${numValue}`);
  };

  // CRITICAL: Handle input event for immediate validation as user types
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    
    console.log('🔥 IMMEDIATE INPUT VALIDATION:', { value });
    setValidValue(value);
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('⏱️ CHANGE EVENT: Travel days input changed:', { value });
    setValidValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control keys
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter',
      'Home', 'End', 'Escape'
    ];
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    // Block non-numeric characters completely
    if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
      console.log('🚫 KEY DOWN BLOCKED:', e.key);
      return;
    }
    
    // CRITICAL: For numeric keys, check if the resulting value would exceed MAX_DAYS
    if (/^\d$/.test(e.key)) {
      const currentValue = (e.target as HTMLInputElement).value;
      const cursorPosition = (e.target as HTMLInputElement).selectionStart || 0;
      const selectionEnd = (e.target as HTMLInputElement).selectionEnd || 0;
      
      // Build the potential new value by inserting the typed digit at cursor position
      let potentialValue = currentValue.slice(0, cursorPosition) + e.key + currentValue.slice(selectionEnd);
      
      // Remove non-numeric characters
      potentialValue = potentialValue.replace(/\D/g, '');
      
      if (potentialValue.length > 0) {
        const potentialNumber = parseInt(potentialValue, 10);
        if (potentialNumber > MAX_DAYS) {
          e.preventDefault();
          console.log(`🚫 KEY DOWN BLOCK: Would create ${potentialNumber}, blocked`);
          return;
        }
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    
    console.log('📋 PASTE EVENT:', { pastedText });
    
    // Always prevent default paste and handle manually
    e.preventDefault();
    setValidValue(pastedText);
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
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onWheel={handleWheel}
          onBlur={handleBlur}
          placeholder={`Enter number of days (${MIN_DAYS}-${MAX_DAYS})`}
          className={`w-full ${
            isInvalidValue ? 'border-red-500 focus:border-red-500 bg-red-50' : ''
          }`}
          maxLength={2}
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
