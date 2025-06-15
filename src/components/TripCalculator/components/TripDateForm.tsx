
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
  // FIXED: Simplified date validation and conversion
  const tripStartDate = React.useMemo(() => {
    console.log('🔧 FIXED: TripDateForm date validation:', {
      originalTripStartDate: formData.tripStartDate,
      type: typeof formData.tripStartDate,
      isDate: formData.tripStartDate instanceof Date,
      timestamp: new Date().toISOString()
    });

    if (!formData.tripStartDate) {
      return undefined;
    }
    
    if (formData.tripStartDate instanceof Date) {
      const isValid = !isNaN(formData.tripStartDate.getTime());
      console.log('🔧 FIXED: Date object validation:', {
        isValid,
        dateString: isValid ? formData.tripStartDate.toISOString() : 'Invalid',
        localString: isValid ? formData.tripStartDate.toLocaleDateString() : 'Invalid'
      });
      return isValid ? formData.tripStartDate : undefined;
    }
    
    if (typeof formData.tripStartDate === 'string') {
      const parsed = new Date(formData.tripStartDate);
      const isValid = !isNaN(parsed.getTime());
      console.log('🔧 FIXED: String to Date conversion:', {
        original: formData.tripStartDate,
        parsed: isValid ? parsed.toISOString() : 'Invalid',
        isValid
      });
      return isValid ? parsed : undefined;
    }
    
    return undefined;
  }, [formData.tripStartDate]);

  // Calculate end date if start date and travel days are available
  const endDate = React.useMemo(() => {
    if (tripStartDate && formData.travelDays > 0) {
      try {
        const calculated = addDays(tripStartDate, formData.travelDays - 1);
        console.log('🔧 FIXED: End date calculation:', {
          startDate: tripStartDate.toISOString(),
          travelDays: formData.travelDays,
          endDate: calculated.toISOString()
        });
        return calculated;
      } catch (error) {
        console.error('❌ Error calculating end date:', error);
        return null;
      }
    }
    return null;
  }, [tripStartDate, formData.travelDays]);

  // FIXED: Simplified date selection handler
  const handleDateSelect = React.useCallback((date: Date | undefined) => {
    console.log('🔧 FIXED: Calendar date selection:', {
      selectedDate: date?.toISOString(),
      selectedLocal: date?.toLocaleDateString(),
      isToday: date ? (date.toDateString() === new Date().toDateString()) : false
    });
    
    if (date) {
      // Normalize to start of day in local timezone
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      console.log('🔧 FIXED: Normalized date for storage:', {
        original: date.toISOString(),
        normalized: normalizedDate.toISOString(),
        normalizedLocal: normalizedDate.toLocaleDateString(),
        components: {
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
  }, [formData, setFormData]);

  // FIXED: Simplified date disabling logic
  const isDateDisabled = React.useCallback((date: Date): boolean => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkDateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const shouldDisable = checkDateStart < todayStart;
    
    console.log('🔧 FIXED: Date disable check:', {
      checkingDate: date.toDateString(),
      todayDate: today.toDateString(),
      disabled: shouldDisable,
      isToday: checkDateStart.getTime() === todayStart.getTime(),
      isFuture: checkDateStart > todayStart
    });
    
    return shouldDisable;
  }, []);

  console.log('🔧 FIXED: TripDateForm render state:', {
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString(),
    tripStartDateLocal: tripStartDate?.toLocaleDateString(),
    hasEndDate: !!endDate,
    endDate: endDate?.toISOString()
  });

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
              !tripStartDate && "text-muted-foreground border-red-300"
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
            selected={tripStartDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
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
