
import React from 'react';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
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
  // Calculate end date
  const endDate = React.useMemo(() => {
    if (formData.tripStartDate && formData.travelDays > 0) {
      return addDays(formData.tripStartDate, formData.travelDays - 1);
    }
    return null;
  }, [formData.tripStartDate, formData.travelDays]);

  // ULTRA SIMPLE DATE SELECTION: Just create a clean local date
  const handleDateSelect = (date: Date) => {
    console.log('🚨 ULTRA SIMPLE: TripDateForm handleDateSelect:', {
      selectedDate: date.toISOString(),
      selectedDateLocal: date.toLocaleDateString(),
      selectedDateString: date.toDateString()
    });
    
    // Create a completely clean date in local timezone
    const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    console.log('🚨 ULTRA SIMPLE: Setting form data with clean date:', {
      cleanDate: cleanDate.toISOString(),
      cleanDateLocal: cleanDate.toLocaleDateString(),
      cleanDateString: cleanDate.toDateString()
    });
    
    setFormData({ 
      ...formData, 
      tripStartDate: cleanDate 
    });
  };

  // ULTRA SIMPLE DATE VALIDATION: Only disable dates that are clearly in the past
  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const shouldDisable = checkDate.getTime() < todayMidnight.getTime();
    
    console.log('🚨 ULTRA SIMPLE DATE VALIDATION:', {
      inputDate: date.toDateString(),
      todayDate: today.toDateString(),
      shouldDisable,
      reason: shouldDisable ? 'DISABLED: Date is before today' : 'ENABLED: Date is today or future'
    });
    
    return shouldDisable;
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        Trip Start Date
        <span className="text-red-500 text-xs">(Required)</span>
      </Label>
      
      {/* Required notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
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

      {/* Ultra Simple Calendar */}
      <SimpleTripCalendar
        selected={formData.tripStartDate}
        onSelect={handleDateSelect}
        disabled={isDateDisabled}
        className="w-full"
      />
      
      {/* Display calculated end date */}
      {endDate && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
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
