
import React from 'react';
import { Label } from '@/components/ui/label';
import { AlertCircle, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { TripFormData } from '../types/tripCalculator';
import { UnifiedDateService } from '../services/UnifiedDateService';
import { Button } from '@/components/ui/button';
import { Calendar as ShadcnCalendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TripDateFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
}

const TripDateForm: React.FC<TripDateFormProps> = ({
  formData,
  setFormData
}) => {
  // Calculate end date using unified service
  const endDate = React.useMemo(() => {
    if (formData.tripStartDate && formData.travelDays > 0) {
      return addDays(formData.tripStartDate, formData.travelDays - 1);
    }
    return null;
  }, [formData.tripStartDate, formData.travelDays]);

  // Get today's date properly
  const today = UnifiedDateService.getToday();

  // Handle date selection with proper local date handling
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setFormData({ ...formData, tripStartDate: undefined });
      return;
    }

    console.log('📅 EMERGENCY FIX: TripDateForm date selected:', {
      selectedDate: date.toLocaleDateString(),
      isToday: UnifiedDateService.isToday(date),
      service: 'UnifiedDateService - EMERGENCY FIX'
    });
    
    // Use unified service to create clean local date
    const cleanDate = UnifiedDateService.normalizeToLocalMidnight(date);
    
    console.log('📅 EMERGENCY FIX: TripDateForm normalized date:', {
      original: date.toLocaleDateString(),
      normalized: cleanDate.toLocaleDateString(),
      service: 'UnifiedDateService - EMERGENCY FIX'
    });
    
    setFormData({ 
      ...formData, 
      tripStartDate: cleanDate 
    });
  };

  // Handle today button click
  const handleTodayClick = () => {
    console.log('📅 EMERGENCY FIX: Today button clicked:', {
      today: today.toLocaleDateString(),
      service: 'UnifiedDateService - EMERGENCY FIX'
    });
    
    handleDateSelect(today);
  };

  // EMERGENCY FIX: Create a more robust disabled function with absolute today override
  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    
    // ABSOLUTE OVERRIDE: Never disable today's date
    const isTodayAbsolute = (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
    
    if (isTodayAbsolute) {
      console.log('🚨 EMERGENCY FIX: TODAY DETECTED - NEVER DISABLED:', {
        date: date.toLocaleDateString(),
        today: today.toLocaleDateString(),
        disabled: false,
        rule: 'ABSOLUTE_TODAY_OVERRIDE'
      });
      return false; // NEVER disable today
    }
    
    // For all other dates, check if they're actually in the past
    const isPast = UnifiedDateService.isPastDate(date);
    
    console.log('🚨 EMERGENCY FIX: Calendar date check:', {
      date: date.toLocaleDateString(),
      today: today.toLocaleDateString(),
      isTodayAbsolute,
      isPast,
      disabled: isPast,
      rule: isPast ? 'PAST_DATE_DISABLED' : 'FUTURE_DATE_ENABLED'
    });
    
    return isPast;
  };

  console.log('📅 EMERGENCY FIX: TripDateForm rendering with Shadcn calendar');

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        Trip Start Date
        <span className="text-red-500 text-xs">(Required)</span>
      </Label>
      
      {/* Enhanced today notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-green-600 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">✨ Start your Route 66 journey TODAY!</p>
            <p className="text-green-700">
              Today's date is now selectable and will provide live weather forecasts for your entire adventure. 
              <strong className="text-green-800"> Choose today for the most accurate weather data and start planning immediately!</strong>
            </p>
            <p className="text-green-600 text-xs mt-1 font-medium">
              🎯 EMERGENCY FIX: Today ({today.toLocaleDateString()}) is guaranteed clickable
            </p>
          </div>
        </div>
      </div>

      {/* Current selection display */}
      <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
        <div className="text-sm font-medium text-gray-700 mb-1">Selected Start Date:</div>
        <div className="text-lg font-semibold text-gray-900">
          {formData.tripStartDate ? (
            <div>
              {format(formData.tripStartDate, "EEEE, MMMM do, yyyy")}
              {UnifiedDateService.isToday(formData.tripStartDate) && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                  TODAY ✨
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-500 italic">No date selected</span>
          )}
        </div>
      </div>

      {/* EMERGENCY FIX: Shadcn Calendar with absolute today override */}
      <div className="space-y-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.tripStartDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {formData.tripStartDate ? (
                format(formData.tripStartDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <ShadcnCalendar
              mode="single"
              selected={formData.tripStartDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Today button for quick selection */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleTodayClick}
          className="w-full border-green-500 text-green-800 bg-green-50 hover:bg-green-100 hover:border-green-600"
        >
          ✨ Select Today ({today.toLocaleDateString()}) ✨
        </Button>
      </div>
      
      {/* Display calculated end date */}
      {endDate && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-800">
            Trip End Date: {format(endDate, 'EEEE, MMMM do, yyyy')}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Your {formData.travelDays}-day adventure will end on this date
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-600">
        A start date is required to provide accurate weather forecasts for each destination.
        <strong className="text-green-700"> ✨ EMERGENCY FIX: Today guaranteed selectable!</strong>
      </p>
    </div>
  );
};

export default TripDateForm;
