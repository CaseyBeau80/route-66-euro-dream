
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
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Trip Duration: {formData.travelDays} days</Label>
      <Input
        type="number"
        min="1"
        max="30"
        value={formData.travelDays || ''}
        onChange={(e) => {
          const days = parseInt(e.target.value) || 0;
          console.log('⏱️ Travel days changed:', days);
          setFormData({ ...formData, travelDays: days });
        }}
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
