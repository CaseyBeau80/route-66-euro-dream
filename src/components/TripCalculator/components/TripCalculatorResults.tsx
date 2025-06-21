
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
      
      {/* RESTORED: The original share button that was working */}
      <div className="flex justify-center">
        <Button
          onClick={handleShare}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Trip
        </Button>
      </div>
    </div>
  );
};

export default TripCalculatorResults;
