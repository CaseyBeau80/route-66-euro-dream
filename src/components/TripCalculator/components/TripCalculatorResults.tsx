
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
  // CRITICAL FIX: Provide default date logic with user guidance
  const getEffectiveStartDate = React.useMemo(() => {
    if (tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())) {
      console.log('✅ TripCalculatorResults: Using provided valid tripStartDate:', {
        date: tripStartDate.toISOString(),
        localDate: tripStartDate.toLocaleDateString()
      });
      return tripStartDate;
    }

    // Don't auto-assign a date - instead guide user to set one
    console.log('⚠️ TripCalculatorResults: No valid start date provided, requiring user input');
    return null;
  }, [tripStartDate]);

  const hasValidStartDate = getEffectiveStartDate !== null;

  // Enhanced share handler with date validation
  const handleShare = async () => {
    if (!hasValidStartDate && onDateRequired) {
      toast({
        title: "Start Date Required",
        description: "Please set your trip start date first to enable full sharing and calendar features.",
        variant: "default"
      });
      onDateRequired();
      return;
    }

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

  // DEBUG: Log what we're receiving
  console.log('🎯 TripCalculatorResults: Component state debug:', {
    hasTripPlan: !!tripPlan,
    tripPlanType: typeof tripPlan,
    tripPlanTitle: tripPlan?.title || 'no title',
    tripPlanSegments: tripPlan?.segments?.length || 0,
    hasValidStartDate,
    effectiveStartDate: getEffectiveStartDate?.toISOString() || 'null',
    componentWillRender: !!tripPlan ? 'TripResultsPreview' : 'empty state'
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

  console.log('✅ TripCalculatorResults: Rendering trip plan with enhanced sharing');

  return (
    <div className="space-y-6">
      {/* Date Requirement Notice - Show prominently if no valid start date */}
      {!hasValidStartDate && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-500 rounded-full p-2">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-800">Start Date Required</h3>
              <p className="text-sm text-amber-700">Set your trip start date to unlock calendar export and enhanced sharing features</p>
            </div>
          </div>
          
          <div className="bg-white/70 rounded-lg p-4 border border-amber-200">
            <p className="text-sm text-amber-800 mb-3">
              📅 <strong>Why do I need a start date?</strong>
            </p>
            <ul className="text-xs text-amber-700 space-y-1 ml-4">
              <li>• Enable calendar export to Google Calendar or iCalendar</li>
              <li>• Provide accurate weather forecasts for each destination</li>
              <li>• Create shareable itinerary with specific dates</li>
              <li>• Optimize timing for seasonal attractions and events</li>
            </ul>
          </div>

          {onDateRequired && (
            <Button
              onClick={onDateRequired}
              className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Set Start Date Now
            </Button>
          )}
        </div>
      )}

      {/* Enhanced Share Section */}
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
            {hasValidStartDate 
              ? "Click above to copy your shareable trip link!" 
              : "Set your start date first to unlock full sharing features!"
            }
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
          {!hasValidStartDate && (
            <p className="text-amber-600 mt-2 text-sm font-semibold">
              ⚠️ Calendar export available after setting start date
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCalculatorResults;
