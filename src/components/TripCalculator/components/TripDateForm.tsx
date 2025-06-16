
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

  // CRITICAL FIX: Clean date selection using local date components only
  const handleDateSelect = (date: Date) => {
    console.log('📅 CRITICAL FIX: TripDateForm handleDateSelect - TODAY IS NOW SELECTABLE:', {
      selectedDate: date.toISOString(),
      selectedDateLocal: date.toLocaleDateString(),
      selectedComponents: {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate()
      },
      fixedVersion: 'TODAY_SELECTABLE'
    });
    
    // CRITICAL FIX: Create absolutely clean local date
    const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    console.log('📅 CRITICAL FIX: Setting form data with perfectly clean date - TODAY WORKS:', {
      cleanDate: cleanDate.toISOString(),
      cleanDateLocal: cleanDate.toLocaleDateString(),
      cleanComponents: {
        year: cleanDate.getFullYear(),
        month: cleanDate.getMonth(),
        date: cleanDate.getDate()
      },
      fixedVersion: 'PROPER_DATE_SETTING'
    });
    
    setFormData({ 
      ...formData, 
      tripStartDate: cleanDate 
    });
  };

  // CRITICAL FIX: Fixed date disability - TODAY IS NOW SELECTABLE
  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // CRITICAL FIX: Only disable dates that are BEFORE today, NOT today itself
    const shouldDisable = checkDate.getTime() < todayNormalized.getTime();
    
    console.log('📅 CRITICAL FIX: Date validation - TODAY IS NOW SELECTABLE:', {
      inputDate: date.toLocaleDateString(),
      todayDate: today.toLocaleDateString(),
      todayNormalized: todayNormalized.toLocaleDateString(),
      checkDate: checkDate.toLocaleDateString(),
      shouldDisable,
      isToday: checkDate.getTime() === todayNormalized.getTime(),
      reason: shouldDisable ? 'DISABLED: Date is before today' : checkDate.getTime() === todayNormalized.getTime() ? 'ENABLED: Today is now selectable ✨' : 'ENABLED: Future date',
      fixedVersion: 'TODAY_ENABLED'
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-green-600 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">✨ You can now start your trip TODAY!</p>
            <p className="text-green-700">
              Today's date is now selectable and will provide live weather forecasts for your Route 66 journey. 
              <strong className="text-green-800"> Start today for the most accurate weather data!</strong>
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

      {/* CRITICAL FIX: Calendar with Today Selection ENABLED */}
      <SimpleTripCalendar
        selected={formData.tripStartDate}
        onSelect={handleDateSelect}
        disabled={isDateDisabled}
        className="w-full"
      />
      
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
        <strong className="text-green-700"> ✨ Today's date now works perfectly for live weather!</strong>
      </p>
    </div>
  );
};

export default TripDateForm;
