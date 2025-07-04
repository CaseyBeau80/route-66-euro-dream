
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, RotateCcw, AlertCircle } from 'lucide-react';

interface ActionButtonsSectionProps {
  isFormValid: boolean;
  isPlanning: boolean;
  onPlanTrip: () => void;
  onResetTrip: () => void;
  needsAdjustmentAcknowledgment?: boolean;
}

const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  isFormValid,
  isPlanning,
  onPlanTrip,
  onResetTrip,
  needsAdjustmentAcknowledgment = false
}) => {
  console.log('🎯 ActionButtonsSection render:', {
    isFormValid,
    isPlanning,
    needsAdjustmentAcknowledgment
  });

  // FIXED: Button should be enabled when form is valid, regardless of day adjustment (blocking approach handles that)
  const canPlan = isFormValid && !isPlanning;

  return (
    <div className="space-y-4">
      
      {/* Trip Planning Button */}
      <div className="relative">
        <Button
          onClick={onPlanTrip}
          disabled={!canPlan}
          className={`w-full min-h-[56px] py-4 md:py-6 text-lg md:text-xl font-bold rounded-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            canPlan
              ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          {isPlanning ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              <span className="animate-pulse text-center">Planning Your Route 66 Adventure...</span>
            </>
          ) : (
            <>
              <MapPin className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
              <span className="text-center">Plan My Route 66 Adventure</span>
            </>
          )}
        </Button>
      </div>

      {/* Warning when acknowledgment is needed */}
      {needsAdjustmentAcknowledgment && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800">Please confirm the trip duration adjustment above</p>
              <p className="text-sm text-yellow-700 mt-1">
                You need to acknowledge the day adjustment before we can plan your trip
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <Button
        onClick={onResetTrip}
        variant="outline"
        className="w-full min-h-[44px] py-3 text-lg font-medium border-2 border-route66-border hover:bg-route66-background-alt transition-colors duration-200"
      >
        <RotateCcw className="h-5 w-5 mr-2 flex-shrink-0" />
        Reset Trip
      </Button>

    </div>
  );
};

export default ActionButtonsSection;
