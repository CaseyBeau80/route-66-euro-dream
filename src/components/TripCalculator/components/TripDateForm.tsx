
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { TripFormData } from '../types/tripCalculator';

interface TripDateFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
}

const TripDateForm: React.FC<TripDateFormProps> = ({
  formData,
  setFormData
}) => {
  // FIXED: Ensure tripStartDate is always a Date object or undefined
  const ensureDateObject = (date: Date | string | undefined): Date | undefined => {
    if (!date) return undefined;
    
    if (date instanceof Date) {
      return isNaN(date.getTime()) ? undefined : date;
    }
    
    if (typeof date === 'string') {
      console.log('📅 TripDateForm: Converting string to Date:', date);
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    
    return undefined;
  };

  // FIXED: Default to today's date if no date is set, with proper normalization
  const getTripStartDate = (): Date => {
    const currentDate = ensureDateObject(formData.tripStartDate);
    if (currentDate) {
      console.log('🗓️ FIXED: Using existing tripStartDate:', {
        original: formData.tripStartDate,
        processed: currentDate.toISOString(),
        local: currentDate.toLocaleDateString(),
        components: {
          year: currentDate.getFullYear(),
          month: currentDate.getMonth(),
          date: currentDate.getDate()
        }
      });
      return currentDate;
    }
    
    // FIXED: Default to today's date with proper normalization
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    console.log('🗓️ FIXED: Using normalized today as default:', {
      originalToday: today.toISOString(),
      normalizedToday: normalizedToday.toISOString(),
      local: normalizedToday.toLocaleDateString(),
      components: {
        year: normalizedToday.getFullYear(),
        month: normalizedToday.getMonth(),
        date: normalizedToday.getDate()
      }
    });
    return normalizedToday;
  };

  const tripStartDate = getTripStartDate();

  console.log('🚨 FIXED DEBUG: TripDateForm comprehensive state:', {
    formDataTripStartDate: formData.tripStartDate,
    formDataType: typeof formData.tripStartDate,
    processedTripStartDate: tripStartDate.toISOString(),
    processedLocal: tripStartDate.toLocaleDateString(),
    processedComponents: {
      year: tripStartDate.getFullYear(),
      month: tripStartDate.getMonth(),
      date: tripStartDate.getDate()
    },
    isValidDate: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime()),
    hasFormDataDate: !!formData.tripStartDate,
    isUsingDefault: !formData.tripStartDate
  });

  // Calculate end date if start date and travel days are available
  const calculateEndDate = () => {
    if (tripStartDate && formData.travelDays > 0) {
      try {
        return addDays(tripStartDate, formData.travelDays - 1);
      } catch (error) {
        console.error('❌ TripDateForm: Error calculating end date:', error);
        return null;
      }
    }
    return null;
  };

  const endDate = calculateEndDate();

  const handleDateSelect = (date: Date | undefined) => {
    console.log('🗓️ FIXED: Date selection handler called:', {
      selectedDate: date?.toISOString(),
      selectedLocal: date?.toLocaleDateString(),
      selectedComponents: date ? {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate()
      } : null
    });
    
    if (date) {
      // FIXED: Normalize the selected date to start of day
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      console.log('🗓️ FIXED: Normalized selected date:', {
        original: date.toISOString(),
        normalized: normalizedDate.toISOString(),
        normalizedLocal: normalizedDate.toLocaleDateString(),
        normalizedComponents: {
          year: normalizedDate.getFullYear(),
          month: normalizedDate.getMonth(),
          date: normalizedDate.getDate()
        }
      });
      
      setFormData({ 
        ...formData, 
        tripStartDate: normalizedDate 
      });
    }
  };

  // FIXED: Completely new date disabling logic - only disable dates BEFORE today
  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkDateNormalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Only disable if date is before today (yesterday and earlier)
    const shouldDisable = checkDateNormalized.getTime() < todayNormalized.getTime();
    
    console.log('🗓️ FIXED: Date disable check (COMPREHENSIVE):', {
      checkingDate: date.toDateString(),
      checkingLocal: date.toLocaleDateString(),
      checkDateNormalized: checkDateNormalized.toISOString(),
      checkDateNormalizedLocal: checkDateNormalized.toLocaleDateString(),
      todayOriginal: today.toISOString(),
      todayNormalized: todayNormalized.toISOString(),
      todayNormalizedLocal: todayNormalized.toLocaleDateString(),
      checkTime: checkDateNormalized.getTime(),
      todayTime: todayNormalized.getTime(),
      disabled: shouldDisable,
      isToday: checkDateNormalized.getTime() === todayNormalized.getTime(),
      isTomorrow: checkDateNormalized.getTime() === (todayNormalized.getTime() + 24 * 60 * 60 * 1000),
      isYesterday: checkDateNormalized.getTime() === (todayNormalized.getTime() - 24 * 60 * 60 * 1000),
      daysDifference: Math.floor((checkDateNormalized.getTime() - todayNormalized.getTime()) / (24 * 60 * 60 * 1000))
    });
    
    return shouldDisable;
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        Trip Start Date
        <span className="text-red-500 text-xs">(Required)</span>
      </Label>
      
      {/* Required notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Start date required for weather forecasts</p>
            <p className="text-blue-700">
              Setting a start date enables accurate weather predictions for each day of your Route 66 journey.
            </p>
          </div>
        </div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !formData.tripStartDate && "text-muted-foreground border-red-300"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {tripStartDate ? (
              format(tripStartDate, "PPP")
            ) : (
              "Select your trip start date"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={formData.tripStartDate ? tripStartDate : undefined}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
            defaultMonth={tripStartDate}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      {/* Display calculated end date */}
      {endDate && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm font-medium text-green-800">
            Trip End Date: {format(endDate, 'EEEE, MMMM do, yyyy')}
          </div>
          <div className="text-xs text-green-600 mt-1">
            Your {formData.travelDays}-day adventure will end on this date
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-600">
        A start date is required to provide accurate weather forecasts for each destination
      </p>
    </div>
  );
};

export default TripDateForm;
