
import React from 'react';
import { Calendar, Users, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormValidation } from '../../TripCalculator/hooks/useFormValidation';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';
import ActionableDayAdjustmentMessage from '../../TripCalculator/components/ActionableDayAdjustmentMessage';

interface TripDetailsSectionProps {
  tripStartDate?: Date;
  travelDays: number;
  onStartDateChange: (date: Date | undefined) => void;
  onTravelDaysChange: (days: number) => void;
  formData?: TripFormData;
}

const TripDetailsSection: React.FC<TripDetailsSectionProps> = ({
  tripStartDate,
  travelDays,
  onStartDateChange,
  onTravelDaysChange,
  formData
}) => {
  const MIN_DAYS = 1;
  const MAX_DAYS = 14;
  
  // Get validation result if formData is provided
  const validationResult = formData ? useFormValidation(formData) : { dayAdjustmentInfo: null, isFormValid: true };
  const { dayAdjustmentInfo, isFormValid } = validationResult;
  
  // Generate array of day options from 1 to 14
  const dayOptions = Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }, (_, i) => MIN_DAYS + i);

  const handleDaysChange = (value: string) => {
    const numValue = parseInt(value, 10);
    console.log('📅 Travel days dropdown selection:', { value, numValue, range: `${MIN_DAYS}-${MAX_DAYS}` });
    
    // Only allow values within the 1-14 range
    if (!isNaN(numValue) && numValue >= MIN_DAYS && numValue <= MAX_DAYS) {
      onTravelDaysChange(numValue);
      console.log(`✅ Successfully set travel days to: ${numValue}`);
    } else {
      console.log(`❌ Invalid value rejected: ${numValue} (must be between ${MIN_DAYS}-${MAX_DAYS})`);
    }
  };

  // FIXED: Compare minimum required against CURRENT travel days value, not the originally requested value
  const shouldShowActionableMessage = dayAdjustmentInfo && 
    dayAdjustmentInfo.minimum > travelDays &&
    formData?.startLocation && 
    formData?.endLocation;

  console.log('🔍 TripDetailsSection: Actionable message check:', {
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    minimumRequired: dayAdjustmentInfo?.minimum,
    currentTravelDays: travelDays,
    originalRequestedDays: dayAdjustmentInfo?.requested,
    shouldShow: shouldShowActionableMessage,
    comparison: `${dayAdjustmentInfo?.minimum} > ${travelDays} = ${dayAdjustmentInfo?.minimum > travelDays}`,
    hasStartLocation: !!formData?.startLocation,
    hasEndLocation: !!formData?.endLocation
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-route66-text-primary">
          <Calendar className="inline w-4 h-4 mr-1" />
          Trip Start Date
        </label>
        <input
          type="date"
          value={tripStartDate?.toISOString().split('T')[0] || ''}
          onChange={(e) => onStartDateChange(e.target.value ? new Date(e.target.value) : undefined)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-3 border border-route66-border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-route66-text-primary">
          <Users className="inline w-4 h-4 mr-1" />
          Travel Days ({MIN_DAYS}-{MAX_DAYS} days)
          {dayAdjustmentInfo && (
            <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
              <Info className="h-3 w-3" />
              <span className="text-xs">(Will be adjusted for safety)</span>
            </span>
          )}
        </label>
        <Select
          value={travelDays > 0 ? travelDays.toString() : ""}
          onValueChange={handleDaysChange}
        >
          <SelectTrigger className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-route66-primary focus:border-transparent bg-white ${
            dayAdjustmentInfo ? 'border-amber-400 bg-amber-50' : 'border-route66-border'
          }`}>
            <SelectValue placeholder={`Select ${MIN_DAYS}-${MAX_DAYS} days`} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-[9999] max-h-60 overflow-y-auto">
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
        
        {/* Actionable Message - Show when day adjustment is needed for immediate feedback */}
        {shouldShowActionableMessage && (
          <ActionableDayAdjustmentMessage 
            currentDays={travelDays}
            requiredDays={dayAdjustmentInfo.minimum}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default TripDetailsSection;
