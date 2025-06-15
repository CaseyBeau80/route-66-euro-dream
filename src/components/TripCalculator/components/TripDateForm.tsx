
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { TripFormData } from '../types/tripCalculator';
import SimpleTripCalendar from './SimpleTripCalendar';

interface TripDateFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
}

const TripDateForm: React.FC<TripDateFormProps> = ({
  formData,
  setFormData
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Simple date handling - use the date as-is
  const selectedDate = formData.tripStartDate;

  // Calculate end date
  const endDate = React.useMemo(() => {
    if (selectedDate && formData.travelDays > 0) {
      try {
        const calculated = addDays(selectedDate, formData.travelDays - 1);
        console.log('🗓️ End date calculation:', {
          startDate: selectedDate.toISOString(),
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
  }, [selectedDate, formData.travelDays]);

  // Handle date selection
  const handleDateSelect = React.useCallback((date: Date) => {
    console.log('🗓️ NEW CALENDAR: Date selected:', {
      selectedDate: date.toISOString(),
      selectedLocal: date.toLocaleDateString(),
      isToday: date.toDateString() === new Date().toDateString()
    });
    
    setFormData({ 
      ...formData, 
      tripStartDate: date 
    });
    setIsCalendarOpen(false);
  }, [formData, setFormData]);

  // Simple date disabling - only disable past dates (before today)
  const isDateDisabled = React.useCallback((date: Date): boolean => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return checkDate.getTime() < todayStart.getTime();
  }, []);

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
              !selectedDate && "text-muted-foreground border-red-300"
            )}
            onClick={() => setIsCalendarOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              "Select your trip start date"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
          <SimpleTripCalendar
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="border-0"
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
