
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { addDays, format } from 'date-fns';
import { TripFormData } from '../types/tripCalculator';

interface TripDurationFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
}

const TripDurationForm: React.FC<TripDurationFormProps> = ({
  formData,
  setFormData
}) => {
  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const days = value === '' ? 0 : parseInt(value, 10);
    
    console.log('⏱️ Travel days input changed:', { value, days, isValid: !isNaN(days) });
    
    if (!isNaN(days) && days >= 0) {
      setFormData({ ...formData, travelDays: days });
    }
  };

  // Calculate end date if start date and travel days are available
  const calculateEndDate = () => {
    if (formData.tripStartDate && formData.travelDays > 0) {
      return addDays(formData.tripStartDate, formData.travelDays - 1);
    }
    return null;
  };

  const endDate = calculateEndDate();

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Trip Duration: {formData.travelDays > 0 ? `${formData.travelDays} days` : 'Not set'}
      </Label>
      <Input
        type="number"
        min="1"
        max="30"
        value={formData.travelDays > 0 ? formData.travelDays : ''}
        onChange={handleDaysChange}
        placeholder="Enter number of days (1-30)"
        className="w-full"
      />
      
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
      
      <p className="text-xs text-blue-600">
        How many days do you want to spend on your Route 66 adventure?
      </p>
    </div>
  );
};

export default TripDurationForm;
