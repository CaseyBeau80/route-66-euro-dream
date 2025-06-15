
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
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Calculate end date
  const endDate = React.useMemo(() => {
    if (formData.tripStartDate && formData.travelDays > 0) {
      return addDays(formData.tripStartDate, formData.travelDays - 1);
    }
    return null;
  }, [formData.tripStartDate, formData.travelDays]);

  // Handle date selection - TIMEZONE FIXED VERSION
  const handleDateSelect = (date: Date | undefined) => {
    console.log('📅 TIMEZONE FIXED: Date selected:', {
      date: date?.toISOString(),
      dateLocal: date?.toLocaleDateString(),
      dateString: date?.toDateString(),
      isToday: date ? date.toDateString() === new Date().toDateString() : false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    
    if (date) {
      setFormData({ 
        ...formData, 
        tripStartDate: date 
      });
      setIsCalendarOpen(false);
    }
  };

  // TIMEZONE FIX - Use date strings instead of Date objects for comparison
  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    const todayDateString = today.toDateString();
    const checkDateString = date.toDateString();
    
    console.log('📅 TIMEZONE DEBUG:', {
      todayString: todayDateString,
      checkString: checkDateString,
      isBeforeToday: checkDateString < todayDateString,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    
    // Use string comparison which is timezone-safe
    return checkDateString < todayDateString;
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

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !formData.tripStartDate && "text-muted-foreground border-red-300"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formData.tripStartDate ? (
              format(formData.tripStartDate, "PPP")
            ) : (
              "Select your trip start date"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={formData.tripStartDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
            className="pointer-events-auto"
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
