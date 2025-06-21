
import React from 'react';
import { TripPlan } from '../services/planning/TripPlanTypes';
import { TripCompletionAnalysis } from '../services/planning/TripCompletionService';
import TripResultsPreview from './TripResultsPreview';
import { Button } from '@/components/ui/button';
import { Share2, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TripCalculatorResultsProps {
  tripPlan: TripPlan | null;
  calculation: any | null;
  shareUrl: string | null;
  tripStartDate?: Date;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
  onShareTrip?: () => void;
  onDateRequired?: () => void;
}

const TripCalculatorResults: React.FC<TripCalculatorResultsProps> = ({
  tripPlan,
  calculation,
  shareUrl,
  tripStartDate,
  completionAnalysis,
  originalRequestedDays,
  onShareTrip,
  onDateRequired
}) => {
  // IMPROVED: Provide smart default date logic with better UX
  const getEffectiveStartDate = React.useMemo(() => {
    if (tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())) {
      console.log('✅ TripCalculatorResults: Using provided valid tripStartDate:', {
        date: tripStartDate.toISOString(),
        localDate: tripStartDate.toLocaleDateString()
      });
      return tripStartDate;
    }

    // Auto-assign today as default with user-friendly messaging
    const today = new Date();
    today.setHours(12, 0, 0, 0); // Normalize to noon
    console.log('🔄 TripCalculatorResults: Auto-assigning today as default start date:', {
      defaultDate: today.toISOString(),
      reason: tripStartDate ? 'invalid_date_provided' : 'no_date_provided'
    });
    return today;
  }, [tripStartDate]);

  const hasExplicitStartDate = tripStartDate instanceof Date && !isNaN(tripStartDate.getTime());

  // Enhanced share handler
  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      
      toast({
        title: "Trip Link Copied!",
        description: "Your Route 66 trip link has been copied to the clipboard. Share it with friends and family!",
        variant: "default"
      });
    } catch (error) {
      console.error('Share failed:', error);
      toast({
        title: "Share Failed",
        description: "Could not copy link. Please copy the URL manually from your browser.",
        variant: "destructive"
      });
    }
  };

  // DEBUG: Log what we're rendering
  console.log('🎯 TripCalculatorResults: Component state debug:', {
    hasTripPlan: !!tripPlan,
    hasExplicitStartDate,
    effectiveStartDate: getEffectiveStartDate?.toISOString() || 'null',
    willAutoAssignDate: !hasExplicitStartDate
  });

  if (!tripPlan) {
    console.log('⚠️ TripCalculatorResults: No trip plan, showing empty state');
    return (
      <div className="text-center p-8">
        <div className="text-gray-400 text-4xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to Plan Your Route 66 Adventure</h3>
        <p className="text-gray-500">Enter your trip details above to get started with your personalized itinerary</p>
      </div>
    );
  }

  console.log('✅ TripCalculatorResults: Rendering trip plan with smart date handling');

  return (
    <div className="space-y-6">
      {/* Smart Date Notice - Only show if using auto-assigned date */}
      {!hasExplicitStartDate && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 rounded-full p-2">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800">📅 Trip Start Date</h3>
              <p className="text-sm text-blue-700">Using today's date as your trip start</p>
            </div>
          </div>
          
          <div className="bg-white/70 rounded-lg p-4 border border-blue-200 mb-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Current start date:</strong> {getEffectiveStartDate.toLocaleDateString()}
            </p>
            <p className="text-xs text-blue-700">
              Weather forecasts and calendar exports are calculated from this date. You can customize it anytime!
            </p>
          </div>

          {onDateRequired && (
            <Button
              onClick={onDateRequired}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Choose Different Start Date
            </Button>
          )}
        </div>
      )}

      {/* Enhanced Share Section - Always functional */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-3 rounded-2xl shadow-2xl mb-6">
        <div className="bg-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🎯 SHARE YOUR TRIP 🎯</h2>
          <Button
            onClick={handleShare}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-20 py-8 text-2xl font-bold shadow-xl rounded-xl gap-4 transform hover:scale-105 transition-all duration-300"
          >
            <Share2 className="w-8 h-8" />
            SHARE THIS TRIP NOW!
          </Button>
          <p className="text-gray-600 mt-6 text-xl font-bold">
            Click above to copy your shareable trip link!
          </p>
        </div>
      </div>

      <TripResultsPreview
        tripPlan={tripPlan}
        tripStartDate={getEffectiveStartDate}
      />
      
      {/* Bottom Share Section */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-3 rounded-2xl shadow-2xl mt-6">
        <div className="bg-white rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">💫 LOVE THIS TRIP PLAN? 💫</h2>
          <Button
            onClick={handleShare}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-20 py-8 text-2xl font-bold shadow-xl rounded-xl gap-4 transform hover:scale-105 transition-all duration-300"
          >
            <Share2 className="w-8 h-8" />
            SHARE YOUR ADVENTURE!
          </Button>
          <p className="text-gray-600 mt-6 text-xl font-bold">
            Share your Route 66 adventure with friends and family!
          </p>
          <p className="text-green-600 mt-2 text-sm font-semibold">
            ✅ Calendar export ready with {hasExplicitStartDate ? 'your chosen' : 'auto-assigned'} start date
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripCalculatorResults;
