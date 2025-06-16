
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, RotateCcw, Sparkles } from 'lucide-react';

interface ActionButtonsSectionProps {
  isFormValid: boolean;
  isPlanning: boolean;
  onPlanTrip: () => void;
  onResetTrip: () => void;
}

const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  isFormValid,
  isPlanning,
  onPlanTrip,
  onResetTrip
}) => {
  return (
    <div className="space-y-4">
      {/* Primary Action Button */}
      <div className="relative">
        {/* Enhanced Plan Button */}
        <Button
          onClick={onPlanTrip}
          disabled={!isFormValid || isPlanning}
          className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white py-6 text-xl font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0"
        >
          {isPlanning ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              <span className="animate-pulse">Planning Your Route 66 Adventure...</span>
              <Sparkles className="h-6 w-6 animate-pulse" />
            </>
          ) : (
            <>
              <MapPin className="h-6 w-6" />
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-black tracking-wide">
                Plan My Route 66 Adventure
              </span>
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </>
          )}
        </Button>
        
        {/* Floating sparkle effects */}
        {!isPlanning && isFormValid && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}
      </div>

      {/* Secondary Actions */}
      <div className="flex justify-center">
        <Button
          onClick={onResetTrip}
          variant="outline"
          size="sm"
          className="border-route66-border text-route66-text-secondary hover:bg-route66-background-alt"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Form
        </Button>
      </div>

      {/* Call-to-action text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-blue-700">
          ✨ Start Your Epic Journey on America's Most Famous Highway! ✨
        </p>
        <p className="text-sm text-route66-text-secondary mt-1">
          Free planning • Instant results • Customizable itinerary
        </p>
      </div>
    </div>
  );
};

export default ActionButtonsSection;
