
import React from 'react';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { TripFormData } from '../types/tripCalculator';
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
  // Simple date handling - no complex timezone logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Simple date selection handler
  const handleDateSelect = (date: Date | undefined) => {
    console.log('📅 Simple date selected:', date?.toLocaleDateString());
    setFormData({ ...formData, tripStartDate: date });
  };

  // Simple today button handler
  const handleTodayClick = () => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    console.log('📅 Today button clicked:', todayDate.toLocaleDateString());
    handleDateSelect(todayDate);
  };

  // CRITICAL FIX: Completely disable date restrictions - allow ALL dates
  const isDateDisabled = (date: Date): boolean => {
    // Never disable any date - this ensures June 15th is always clickable
    return false;
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        Trip Start Date
        <span className="text-red-500 text-xs">(Required)</span>
      </Label>
      
      {/* Simple info message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          Select your trip start date. All dates are available.
        </p>
      </div>

      {/* Current selection display */}
      <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
        <div className="text-sm font-medium text-gray-700 mb-1">Selected Start Date:</div>
        <div className="text-lg font-semibold text-gray-900">
          {formData.tripStartDate ? (
            format(formData.tripStartDate, "EEEE, MMMM do, yyyy")
          ) : (
            <span className="text-gray-500 italic">No date selected</span>
          )}
        </div>
      </div>

      {/* FIXED Calendar picker with pointer-events-auto */}
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
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Today button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleTodayClick}
          className="w-full border-green-500 text-green-800 bg-green-50 hover:bg-green-100"
        >
          Select Today ({today.toLocaleDateString()})
        </Button>
      </div>
      
      <p className="text-xs text-gray-600">
        A start date is required to provide accurate weather forecasts for each destination.
      </p>
    </div>
  );
};

export default TripDateForm;
