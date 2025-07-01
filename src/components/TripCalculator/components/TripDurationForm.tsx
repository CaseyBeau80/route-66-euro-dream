
import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TripFormData } from '../types/tripCalculator';
import { useFormValidation } from '../hooks/useFormValidation';

interface TripDurationFormProps {
  formData: TripFormData;
  setFormData: (data: TripFormData) => void;
}

const TripDurationForm: React.FC<TripDurationFormProps> = ({
  formData,
  setFormData
}) => {
  const { dayAdjustmentInfo } = useFormValidation(formData);

  const handleDurationChange = (value: string) => {
    setFormData({
      ...formData,
      travelDays: parseInt(value)
    });
  };

  // Generate dropdown options
  const durationOptions = Array.from({ length: 14 }, (_, i) => i + 1);

  // Determine what to display based on day adjustment
  const getDisplayText = () => {
    if (dayAdjustmentInfo) {
      return `${formData.travelDays} days (requires ${dayAdjustmentInfo.minimum} days minimum)`;
    }
    return formData.travelDays > 0 ? `${formData.travelDays} days` : 'Select travel days';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-route66-primary" />
        <h3 className="text-lg font-semibold text-route66-text">Travel Days (1-14 days)</h3>
      </div>
      
      <div className="space-y-2">
        <Select
          value={formData.travelDays > 0 ? formData.travelDays.toString() : ""}
          onValueChange={handleDurationChange}
        >
          <SelectTrigger className={`w-full ${dayAdjustmentInfo ? 'border-amber-400 bg-amber-50' : ''}`}>
            <SelectValue>
              {getDisplayText()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map((days) => (
              <SelectItem key={days} value={days.toString()}>
                {days} {days === 1 ? 'day' : 'days'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {dayAdjustmentInfo && (
          <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
            ⚠️ Your selected {dayAdjustmentInfo.requested} days requires adjustment to {dayAdjustmentInfo.minimum} days for safe daily driving limits (max 10 hours/day)
          </p>
        )}
        
        <p className="text-sm text-route66-text-secondary">
          Choose how many days you want to spend on your Route 66 adventure
        </p>
      </div>
    </div>
  );
};

export default TripDurationForm;
