
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  // Generate array of day options from 2 to 14
  const dayOptions = Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }, (_, i) => MIN_DAYS + i);

  const handleDaysChange = (value: string) => {
    const numValue = parseInt(value, 10);
    console.log('📅 FIXED: Dropdown selection changed:', { value, numValue, maxDays: MAX_DAYS });
    
    // STRICT validation - only allow values within the 2-14 range
    if (!isNaN(numValue) && numValue >= MIN_DAYS && numValue <= MAX_DAYS) {
      setFormData({ ...formData, travelDays: numValue });
      console.log(`✅ FIXED: Successfully set travel days to: ${numValue} (within ${MIN_DAYS}-${MAX_DAYS} range)`);
    } else {
      console.log(`❌ FIXED: Invalid value rejected: ${numValue} (must be between ${MIN_DAYS}-${MAX_DAYS})`);
    }
  };

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

  // FIXED: Ensure we have a valid current value for the dropdown
  const currentValue = formData.travelDays >= MIN_DAYS && formData.travelDays <= MAX_DAYS 
    ? formData.travelDays.toString() 
    : "";

  // FIXED: Show clear validation status
  const isWithinBounds = formData.travelDays >= MIN_DAYS && formData.travelDays <= MAX_DAYS;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Clock className="h-4 w-4 text-route66-primary" />
        Trip Duration: {isWithinBounds
          ? `${formData.travelDays} days` 
          : `Select days (${MIN_DAYS}-${MAX_DAYS})`}
      </Label>
      
      <div className="relative">
        <Select
          value={currentValue}
          onValueChange={handleDaysChange}
        >
          <SelectTrigger className="w-full bg-white border-2">
            <SelectValue placeholder={`Select number of days (${MIN_DAYS}-${MAX_DAYS})`} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-60">
            {dayOptions.map((days) => (
              <SelectItem 
                key={days} 
                value={days.toString()}
                className="hover:bg-gray-50 cursor-pointer px-3 py-2"
              >
                {days} {days === 1 ? 'day' : 'days'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* FIXED: Clear validation feedback */}
        {formData.travelDays > 0 && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {isWithinBounds ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {/* FIXED: Show validation status */}
      {formData.travelDays > 0 && !isWithinBounds && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
          <div className="text-red-700 flex items-start gap-1">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>
              Invalid selection: {formData.travelDays} days. Please select between {MIN_DAYS} and {MAX_DAYS} days.
            </span>
          </div>
        </div>
      )}
      
      {/* Validation Feedback */}
      {hasRouteInfo && validation && isWithinBounds && (
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
        <p>How many days do you want to spend on your Route 66 adventure? Choose between {MIN_DAYS} and {MAX_DAYS} days for optimal trip planning.</p>
        {formData.tripStyle === 'destination-focused' && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded">
            <p className="text-amber-700">
              🏛️ <strong>Destination-Focused:</strong> Your trip will prioritize canonical Route 66 heritage cities 
              and major destinations. Longer trips allow for more comprehensive coverage of iconic Route 66 locations.
              <br />
              <strong>Maximum {MAX_DAYS} days supported.</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDurationForm;
