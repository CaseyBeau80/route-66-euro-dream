
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
  // Calculate end date if start date and travel days are available
  const calculateEndDate = () => {
    if (formData.tripStartDate && formData.travelDays > 0) {
      try {
        // Ensure we have a valid Date object
        let startDate: Date;
        if (formData.tripStartDate instanceof Date) {
          startDate = formData.tripStartDate;
        } else {
          startDate = new Date(formData.tripStartDate);
        }
        
        // Validate the date
        if (isNaN(startDate.getTime())) {
          console.error('❌ TripDateForm: Invalid start date', formData.tripStartDate);
          return null;
        }
        
        return addDays(startDate, formData.travelDays - 1);
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
              !formData.tripStartDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formData.tripStartDate ? (
              (() => {
                try {
                  const displayDate = formData.tripStartDate instanceof Date 
                    ? formData.tripStartDate 
                    : new Date(formData.tripStartDate);
                  
                  if (isNaN(displayDate.getTime())) {
                    return "Invalid date selected";
                  }
                  
                  return format(displayDate, "PPP");
                } catch (error) {
                  console.error('❌ Error formatting date:', error);
                  return "Invalid date selected";
                }
              })()
            ) : (
              "Pick a start date for weather forecasts"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={formData.tripStartDate instanceof Date ? formData.tripStartDate : undefined}
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
