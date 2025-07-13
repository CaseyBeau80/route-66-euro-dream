import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from '../hooks/useFormValidation';
import { TravelDayValidator } from '../services/validation/TravelDayValidator';
import ActionableDayAdjustmentMessage from './ActionableDayAdjustmentMessage';

interface TripDurationFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
}

const TripDurationForm: React.FC<TripDurationFormProps> = ({
  formData,
  setFormData
}) => {
  const { dayAdjustmentInfo, isFormValid } = useFormValidation(formData);
  const [maxDaysForRoute, setMaxDaysForRoute] = useState<number>(14); // Default fallback
  const [isLoadingMaxDays, setIsLoadingMaxDays] = useState<boolean>(false);

  // Get maximum days based on destination cities for this specific route
  useEffect(() => {
    const getMaxDaysForRoute = async () => {
      if (formData.startLocation && formData.endLocation) {
        setIsLoadingMaxDays(true);
        try {
          const maxDays = await TravelDayValidator.getMaxDaysFromDestinationCities(
            formData.startLocation,
            formData.endLocation
          );
          setMaxDaysForRoute(maxDays);
          console.log(`🏛️ Maximum days for ${formData.startLocation} → ${formData.endLocation}: ${maxDays}`);
          
          // Auto-adjust if current selection exceeds maximum
          if (formData.travelDays > maxDays) {
            console.log(`📅 Auto-adjusting days from ${formData.travelDays} to ${maxDays} (route limit)`);
            setFormData({
              ...formData,
              travelDays: maxDays
            });
          }
        } catch (error) {
          console.error('Error getting max days for route:', error);
          setMaxDaysForRoute(14); // Conservative fallback
        } finally {
          setIsLoadingMaxDays(false);
        }
      } else {
        setMaxDaysForRoute(14); // Reset to default when no route selected
      }
    };

    getMaxDaysForRoute();
  }, [formData.startLocation, formData.endLocation]);

  const handleDurationChange = (value: string) => {
    const days = parseInt(value);
    console.log(`📅 Travel days selection: ${days} (max allowed: ${maxDaysForRoute})`);
    setFormData({
      ...formData,
      travelDays: days
    });
  };

  // Generate dropdown options - FIXED: Limited by actual destination cities
  const durationOptions = Array.from({ length: maxDaysForRoute }, (_, i) => i + 1);

  // FIXED: Compare minimum required against CURRENT form value, not the originally requested value
  const shouldShowActionableMessage = dayAdjustmentInfo && 
    dayAdjustmentInfo.minimum > formData.travelDays &&
    formData.startLocation && 
    formData.endLocation;

  console.log('🔍 TripDurationForm: Actionable message check:', {
    dayAdjustmentInfo: !!dayAdjustmentInfo,
    minimumRequired: dayAdjustmentInfo?.minimum,
    currentFormDays: formData.travelDays,
    originalRequestedDays: dayAdjustmentInfo?.requested,
    shouldShow: shouldShowActionableMessage,
    maxDaysForRoute,
    comparison: `${dayAdjustmentInfo?.minimum} > ${formData.travelDays} = ${dayAdjustmentInfo?.minimum > formData.travelDays}`
  });

  // Determine what to display based on day adjustment
  const getDisplayText = () => {
    if (dayAdjustmentInfo) {
      return `${formData.travelDays} days (adjusted to ${dayAdjustmentInfo.minimum} days)`;
    }
    return formData.travelDays > 0 ? `${formData.travelDays} days` : 'Select travel days';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-route66-primary" />
        <h3 className="text-lg font-semibold text-route66-text">
          Travel Days (1-{maxDaysForRoute} days)
          {isLoadingMaxDays && <span className="text-sm text-gray-500 ml-2">calculating...</span>}
        </h3>
      </div>
      
      <div className="space-y-2">
        <Select
          value={formData.travelDays > 0 ? formData.travelDays.toString() : ""}
          onValueChange={handleDurationChange}
        >
          <SelectTrigger className={`w-full ${dayAdjustmentInfo ? 'border-amber-400 bg-amber-50' : ''}`}>
            <SelectValue>
              {getDisplayText()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            {durationOptions.map((days) => (
              <SelectItem key={days} value={days.toString()} className="hover:bg-gray-100">
                {days} {days === 1 ? 'day' : 'days'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Actionable Message - Show when day adjustment is needed */}
        {shouldShowActionableMessage && (
          <ActionableDayAdjustmentMessage 
            currentDays={formData.travelDays}
            requiredDays={dayAdjustmentInfo.minimum}
            className="mt-2"
          />
        )}
        
        <p className="text-sm text-route66-text-secondary">
          Choose how many days you want to spend on your Route 66 adventure
          {formData.startLocation && formData.endLocation && (
            <span className="block text-xs text-gray-500 mt-1">
              Maximum {maxDaysForRoute} days available for {formData.startLocation} → {formData.endLocation}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default TripDurationForm;