
import React from 'react';
import { AlertTriangle, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormValidation } from '../../TripCalculator/hooks/useFormValidation';
import { TripFormData } from '../../TripCalculator/types/tripCalculator';

interface InlineDayAdjustmentNoticeProps {
  formData: TripFormData;
  onAcknowledge: () => void;
  isAcknowledged: boolean;
  className?: string;
}

const InlineDayAdjustmentNotice: React.FC<InlineDayAdjustmentNoticeProps> = ({
  formData,
  onAcknowledge,
  isAcknowledged,
  className = ""
}) => {
  const { dayAdjustmentInfo } = useFormValidation(formData);

  console.log('🎯 InlineDayAdjustmentNotice render (SIMPLE APPROACH):', {
    dayAdjustmentInfo,
    isAcknowledged,
    formData: {
      startLocation: formData.startLocation,
      endLocation: formData.endLocation,
      travelDays: formData.travelDays
    }
  });

  // Only show if day adjustment is needed
  if (!dayAdjustmentInfo) {
    return null;
  }

  console.log('🚨 SHOWING INLINE DAY ADJUSTMENT NOTICE (SIMPLE APPROACH):', dayAdjustmentInfo);

  return (
    <div className={`bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6 shadow-lg ${className}`}>
      {/* Header with warning icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`rounded-full p-2 ${isAcknowledged ? 'bg-green-500' : 'bg-red-500'}`}>
          {isAcknowledged ? (
            <CheckCircle className="h-6 w-6 text-white" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-white" />
          )}
        </div>
        <div>
          <h3 className={`text-xl font-bold ${isAcknowledged ? 'text-green-800' : 'text-red-800'}`}>
            {isAcknowledged ? 'Trip Duration Confirmed' : 'Trip Duration Adjusted'}
          </h3>
          <p className={`text-sm ${isAcknowledged ? 'text-green-700' : 'text-red-700'}`}>
            {isAcknowledged ? 'Ready to plan your trip' : 'We had to change your trip length for safety'}
          </p>
        </div>
      </div>

      {/* Clear before/after comparison */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-red-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* What you entered */}
          <div className="text-center">
            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3 mb-2">
              <p className="text-sm font-semibold text-red-700 mb-1">YOU ENTERED:</p>
              <div className="text-3xl font-black text-red-600">{dayAdjustmentInfo.requested}</div>
              <p className="text-sm font-bold text-red-700">DAYS</p>
            </div>
          </div>
          
          {/* Arrow */}
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full p-2 inline-block">
              <ArrowRight className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 mt-1">CHANGED TO</p>
          </div>
          
          {/* What we changed it to */}
          <div className="text-center">
            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3 mb-2">
              <p className="text-sm font-semibold text-green-700 mb-1">WE CHANGED TO:</p>
              <div className="text-3xl font-black text-green-600">{dayAdjustmentInfo.minimum}</div>
              <p className="text-sm font-bold text-green-700">DAYS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">
              Why We Changed Your {dayAdjustmentInfo.requested}-Day Trip:
            </h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                🗺️ Your route from <strong>{formData.startLocation}</strong> to <strong>{formData.endLocation}</strong> is approximately <strong>{Math.round(dayAdjustmentInfo.minimum * 300)} miles</strong>.
              </p>
              <p>
                ⚠️ With only <strong>{dayAdjustmentInfo.requested} days</strong>, you would need to drive <strong className="text-red-700">{Math.round((dayAdjustmentInfo.minimum * 300) / dayAdjustmentInfo.requested)} miles per day</strong>.
              </p>
              <p>
                ✅ With <strong>{dayAdjustmentInfo.minimum} days</strong>, you'll drive a comfortable <strong className="text-green-700">300 miles per day</strong> (our safety limit).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <h4 className="font-bold text-green-800 mb-3">Your {dayAdjustmentInfo.minimum}-Day Trip Will Be Better:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <span>🛡️</span>
            <span><strong>Safe driving times</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700">
            <span>🎯</span>
            <span><strong>More time at attractions</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700">
            <span>😌</span>
            <span><strong>Relaxed pace</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700">
            <span>📸</span>
            <span><strong>Better photo opportunities</strong></span>
          </div>
        </div>
      </div>

      {/* Acknowledgment Button */}
      {!isAcknowledged && (
        <div className="text-center">
          <Button
            onClick={onAcknowledge}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            I Understand - Use {dayAdjustmentInfo.minimum} Days
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Click to confirm and enable trip planning
          </p>
        </div>
      )}

      {/* Confirmed State */}
      {isAcknowledged && (
        <div className="text-center bg-green-100 border border-green-300 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span className="font-bold">Confirmed: {dayAdjustmentInfo.minimum}-day trip</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            You can now proceed to plan your Route 66 adventure
          </p>
        </div>
      )}
    </div>
  );
};

export default InlineDayAdjustmentNotice;
