
import React from 'react';
import { Calendar, Users, AlertTriangle } from 'lucide-react';
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
        
        {/* Prominent Day Adjustment Message */}
        {dayAdjustmentInfo && (
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-400 rounded-lg p-4 shadow-md animate-pulse">
            <div className="flex items-start gap-3">
              <div className="bg-amber-500 rounded-full p-2">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-amber-800 mb-2">
                  🚨 Days Adjustment Required
                </h4>
                <div className="bg-white/80 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg font-bold">
                        {dayAdjustmentInfo.requested} days
                      </div>
                      <div className="text-xs text-red-600 mt-1">Requested</div>
                    </div>
                    <div className="text-amber-600 font-bold text-xl">→</div>
                    <div className="text-center">
                      <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-bold">
                        {dayAdjustmentInfo.minimum} days
                      </div>
                      <div className="text-xs text-green-600 mt-1">Required</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>Why:</strong> {dayAdjustmentInfo.reason}
                </p>
                <p className="text-xs text-amber-700 mt-2 italic">
                  💡 Please select {dayAdjustmentInfo.minimum} or more days to continue planning your trip
                </p>
              </div>
            </div>
          </div>
        )}
        
        <p className="text-sm text-route66-text-secondary">
          Choose how many days you want to spend on your Route 66 adventure
        </p>
      </div>
    </div>
  );
};

export default TripDurationForm;
