
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
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
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    
    return undefined;
  };

  const tripStartDate = ensureDateObject(formData.tripStartDate);

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

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Trip Start Date (Optional)</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !tripStartDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {tripStartDate ? (
              format(tripStartDate, "PPP")
            ) : (
              "Pick a start date for weather forecasts"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={tripStartDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      
      {/* Display calculated end date */}
      {endDate && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-800">
            Trip End Date: {format(endDate, 'EEEE, MMMM do, yyyy')}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Your {formData.travelDays}-day adventure will end on this date
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-600">
        Set a start date to see accurate weather forecasts for each day of your trip
      </p>
    </div>
  );
};

export default TripDateForm;
