
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

  console.log('🎯 TripCalculatorResults: Final render state:', {
    hasTripPlan: !!tripPlan,
    validTripStartDate: validTripStartDate.toISOString(),
    validTripStartDateLocal: validTripStartDate.toLocaleDateString(),
    willPassToResults: true
  });

  if (!tripPlan) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-400 text-4xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to Plan Your Route 66 Adventure</h3>
        <p className="text-gray-500">Enter your trip details above to get started with your personalized itinerary</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TripResultsPreview
        tripPlan={tripPlan}
        tripStartDate={validTripStartDate}
      />
      
      {/* Additional prominent share button at the bottom */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-4 border-blue-300 rounded-2xl p-8 text-center shadow-xl">
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            Share Your Route 66 Adventure!
          </h3>
        </div>
        
        <p className="text-gray-700 mb-6 text-lg max-w-2xl mx-auto">
          Love this trip plan? Share it with friends and family! They'll get the complete itinerary with weather forecasts and attractions.
        </p>
        
        <Button
          onClick={handleShare}
          variant="default"
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 gap-3"
        >
          <Share2 className="w-6 h-6" />
          Share This Amazing Trip!
        </Button>
        
        <p className="text-gray-600 mt-4">
          🎯 Click above to copy your shareable trip link!
        </p>
      </div>
    </div>
  );
};

export default TripCalculatorResults;
