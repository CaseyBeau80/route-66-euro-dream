
import React from 'react';
import { Calendar, Users, AlertTriangle, Info, CheckCircle } from 'lucide-react';
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
        
        {/* Enhanced Day Adjustment Explanation */}
        {dayAdjustmentInfo && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 rounded-full p-3 animate-pulse">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                  🚨 Your Trip Duration Has Been Automatically Adjusted
                </h3>
                
                <div className="bg-white/90 rounded-lg p-4 mb-4 border border-amber-200">
                  <div className="grid grid-cols-3 gap-4 items-center text-center mb-4">
                    <div>
                      <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg shadow-sm border-2 border-red-200">
                        <div className="text-3xl font-black">{dayAdjustmentInfo.requested}</div>
                        <div className="text-sm font-semibold">Days You Selected</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-amber-600 font-bold text-2xl mb-1">→</div>
                      <div className="text-xs text-amber-700 font-medium">ADJUSTED TO</div>
                    </div>
                    <div>
                      <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow-sm border-2 border-green-200">
                        <div className="text-3xl font-black">{dayAdjustmentInfo.minimum}</div>
                        <div className="text-sm font-semibold">Days Required</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                      <Info className="h-4 w-4" />
                      Your trip planning will use {dayAdjustmentInfo.minimum} days instead of {dayAdjustmentInfo.requested} days
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/70 rounded-lg p-4 border border-amber-200">
                    <h4 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Why was this changed?
                    </h4>
                    <p className="text-amber-800 leading-relaxed mb-3">
                      <strong>Safety First:</strong> {dayAdjustmentInfo.reason}
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm">
                        <strong>With {dayAdjustmentInfo.requested} days:</strong> You would need to drive more than 10 hours per day, 
                        which exceeds our safety recommendations and could make your trip exhausting rather than enjoyable.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      What you get with {dayAdjustmentInfo.minimum} days:
                    </h4>
                    <ul className="text-green-800 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span><strong>Safe daily drives:</strong> Maximum 8-10 hours of driving per day</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span><strong>More enjoyable:</strong> Time to actually visit attractions and take photos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span><strong>Less stress:</strong> No rushing between destinations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span><strong>Better memories:</strong> Quality time at each heritage city</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 px-6 py-3 rounded-full text-sm font-bold border-2 border-green-300">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Your trip is now optimized for the best Route 66 experience!
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-xs text-amber-700 italic">
                    💡 You can still select {dayAdjustmentInfo.minimum}+ days from the dropdown above, but your trip will automatically use the safe minimum of {dayAdjustmentInfo.minimum} days.
                  </p>
                </div>
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
