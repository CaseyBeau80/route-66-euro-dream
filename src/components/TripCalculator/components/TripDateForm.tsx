
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
  // Ensure tripStartDate is always a Date object or undefined
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

  const tripStartDate = ensureDateObject(formData.tripStartDate);

  console.log('📅 TripDateForm: Date validation:', {
    originalValue: formData.tripStartDate,
    originalType: typeof formData.tripStartDate,
    processedValue: tripStartDate,
    isValidDate: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())
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
    console.log('📅 Trip start date changed:', date);
    
    // Ensure we're setting a proper Date object or undefined
    const validDate = date instanceof Date && !isNaN(date.getTime()) ? date : undefined;
    
    setFormData({ 
      ...formData, 
      tripStartDate: validDate 
    });
  };

  // Get yesterday's date for comparison - now allows today to be selected
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

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
            disabled={(date) => {
              const checkDate = new Date(date);
              checkDate.setHours(0, 0, 0, 0);
              return checkDate < yesterday; // Changed from today to yesterday - now allows today
            }}
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
