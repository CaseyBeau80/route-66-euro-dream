
import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { TripFormData } from '../types/tripCalculator';
import { TravelDayValidator } from '../services/validation/TravelDayValidator';
import { TripStyleLogic } from '../services/planning/TripStyleLogic';
import { TripValidationService } from '../services/validation/TripValidationService';
import TripValidationFeedback from './TripValidationFeedback';

interface TripDurationFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
}

const TripDurationForm: React.FC<TripDurationFormProps> = ({
  formData,
  setFormData
}) => {
  const MAX_DAYS = 14;
  const MIN_DAYS = 1;

  // Generate array of day options from 1 to 14
  const dayOptions = Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }, (_, i) => MIN_DAYS + i);

  // Enhanced validation using the new service
  const validation = useMemo(() => {
    if (!formData.startLocation || !formData.endLocation || formData.travelDays <= 0) {
      return null;
    }

    return TripValidationService.validateTrip(
      formData.startLocation,
      formData.endLocation,
      formData.travelDays
    );
  }, [formData.startLocation, formData.endLocation, formData.travelDays]);

  const handleDaysChange = (value: string) => {
    const numValue = parseInt(value, 10);
    console.log('📅 ENHANCED: Dropdown selection changed:', { value, numValue, maxDays: MAX_DAYS });
    
    // STRICT validation - only allow values within the 1-14 range
    if (!isNaN(numValue) && numValue >= MIN_DAYS && numValue <= MAX_DAYS) {
      setFormData({ ...formData, travelDays: numValue });
      console.log(`✅ ENHANCED: Successfully set travel days to: ${numValue} (within ${MIN_DAYS}-${MAX_DAYS} range)`);
    } else {
      console.log(`❌ ENHANCED: Invalid value rejected: ${numValue} (must be between ${MIN_DAYS}-${MAX_DAYS})`);
    }
  };

  // Handle optimization suggestions
  const handleOptimizationClick = (suggestion: any) => {
    console.log('🎯 Applying optimization suggestion:', suggestion);
    
    switch (suggestion.type) {
      case 'increase_days':
      case 'decrease_days':
      case 'optimize_route':
        if (suggestion.actionValue && suggestion.actionValue >= MIN_DAYS && suggestion.actionValue <= MAX_DAYS) {
          setFormData({ ...formData, travelDays: suggestion.actionValue });
        }
        break;
      case 'change_cities':
        // This would trigger a UI state change to highlight location selection
        console.log('💡 User should choose different cities');
        break;
    }
  };

  // Get legacy validation info for backward compatibility
  const getLegacyValidationInfo = () => {
    if (!formData.startLocation || !formData.endLocation || !formData.tripStyle) {
      return null;
    }

    const styleConfig = TripStyleLogic.getStyleConfig(formData.tripStyle);
    return TravelDayValidator.validateTravelDays(
      formData.startLocation,
      formData.endLocation,
      formData.travelDays,
      styleConfig
    );
  };

  const legacyValidation = getLegacyValidationInfo();
  const hasRouteInfo = !!(formData.startLocation && formData.endLocation);
  const isWithinBounds = formData.travelDays >= MIN_DAYS && formData.travelDays <= MAX_DAYS;
  const currentValue = isWithinBounds ? formData.travelDays.toString() : "";

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Clock className="h-4 w-4 text-route66-primary" />
        Trip Duration: {isWithinBounds
          ? `${formData.travelDays} days` 
          : `Select days (${MIN_DAYS}-${MAX_DAYS})`}
        {validation?.suggestedDays && validation.suggestedDays !== formData.travelDays && (
          <span className="text-xs text-blue-600 font-normal">
            (Suggested: {validation.suggestedDays} days)
          </span>
        )}
      </Label>
      
      <div className="relative">
        <Select
          value={currentValue}
          onValueChange={handleDaysChange}
        >
          <SelectTrigger className="w-full bg-white border-2 relative z-10">
            <SelectValue placeholder={`Select number of days (${MIN_DAYS}-${MAX_DAYS})`} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg relative z-[9999] max-h-60 overflow-y-auto">
            {dayOptions.map((days) => (
              <SelectItem 
                key={days} 
                value={days.toString()}
                className="hover:bg-gray-50 cursor-pointer px-3 py-2 relative z-[9999]"
              >
                {days} {days === 1 ? 'day' : 'days'}
                {validation?.suggestedDays === days && (
                  <span className="ml-2 text-xs text-blue-600 font-semibold">✨ Recommended</span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Validation status indicator */}
        {formData.travelDays > 0 && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none z-20">
            {validation?.isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {/* Enhanced validation feedback */}
      {validation && hasRouteInfo && isWithinBounds && (
        <TripValidationFeedback
          validation={validation}
          onOptimizationClick={handleOptimizationClick}
        />
      )}
      
      {/* Fallback for invalid bounds */}
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
      
      {/* Legacy validation for compatibility */}
      {hasRouteInfo && legacyValidation && isWithinBounds && !validation && (
        <div className="space-y-2">
          <div className="text-xs text-blue-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              Minimum {legacyValidation.minDaysRequired} days recommended for this route ({formData.tripStyle} style)
            </span>
          </div>
          
          {legacyValidation.issues.length > 0 && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
              {legacyValidation.issues.map((issue, index) => (
                <div key={index} className="text-red-700 flex items-start gap-1">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Enhanced description */}
      <div className="text-xs text-route66-text-secondary space-y-1">
        <p>How many days do you want to spend on your Route 66 adventure? Choose between {MIN_DAYS} and {MAX_DAYS} days for optimal trip planning.</p>
        {formData.tripStyle === 'destination-focused' && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded">
            <p className="text-amber-700">
              🏛️ <strong>Destination-Focused:</strong> Your trip will prioritize canonical Route 66 heritage cities 
              and major destinations. The validation system will ensure optimal daily driving times (max 10 hours) 
              and suggest the best duration for your selected route.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDurationForm;
