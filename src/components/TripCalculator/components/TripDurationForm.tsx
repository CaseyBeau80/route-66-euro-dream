
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
      <p className="text-xs text-blue-600">
        How many days do you want to spend on your Route 66 adventure?
      </p>
    </div>
  );
};

export default TripDurationForm;
