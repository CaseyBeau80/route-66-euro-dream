
import React from 'react';
import { TripPlan } from '../services/planning/TripPlanTypes';
import { TripCompletionAnalysis } from '../services/planning/TripCompletionService';
import TripResultsPreview from './TripResultsPreview';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TripCalculatorResultsProps {
  tripPlan: TripPlan | null;
  calculation: any | null;
  shareUrl: string | null;
  tripStartDate?: Date;
  completionAnalysis?: TripCompletionAnalysis;
  originalRequestedDays?: number;
  onShareTrip?: () => void;
}

const TripCalculatorResults: React.FC<TripCalculatorResultsProps> = ({
  tripPlan,
  calculation,
  shareUrl,
  tripStartDate,
  completionAnalysis,
  originalRequestedDays,
  onShareTrip
}) => {
  // CRITICAL FIX: Ensure we have a valid date
  const validTripStartDate = React.useMemo(() => {
    if (tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())) {
      console.log('✅ TripCalculatorResults: Using provided valid tripStartDate:', {
        date: tripStartDate.toISOString(),
        localDate: tripStartDate.toLocaleDateString()
      });
      return tripStartDate;
    }

    // Fall back to today
    const today = new Date();
    console.log('🔄 TripCalculatorResults: Using today as fallback date:', {
      today: today.toISOString(),
      localDate: today.toLocaleDateString(),
      reason: tripStartDate ? 'invalid_date' : 'no_date_provided'
    });
    return today;
  }, [tripStartDate]);

  // Simple share handler
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

  // DEBUG: Log what we're receiving
  console.log('🎯 TripCalculatorResults: Component state debug:', {
    hasTripPlan: !!tripPlan,
    tripPlanType: typeof tripPlan,
    tripPlanTitle: tripPlan?.title || 'no title',
    tripPlanSegments: tripPlan?.segments?.length || 0,
    validTripStartDate: validTripStartDate.toISOString(),
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

  console.log('✅ TripCalculatorResults: Rendering trip plan with share buttons');

  return (
    <div className="space-y-6">
      {/* MASSIVE SHARE BUTTON AT THE TOP - IMPOSSIBLE TO MISS */}
      <div className="bg-gradient-to-r from-red-500 via-blue-500 to-green-500 p-3 rounded-2xl shadow-2xl mb-6">
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
          <p className="text-gray-600 mt-6 text-xl font-bold">Click above to copy your shareable trip link!</p>
        </div>
      </div>

      <TripResultsPreview
        tripPlan={tripPlan}
        tripStartDate={validTripStartDate}
      />
      
      {/* ANOTHER HUGE SHARE BUTTON AT THE BOTTOM */}
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
          <p className="text-gray-600 mt-6 text-xl font-bold">Share your Route 66 adventure with friends and family!</p>
        </div>
      </div>
    </div>
  );
};

export default TripCalculatorResults;
