
import React from 'react';
import { TripPlan } from '../services/planning/TripPlanTypes';
import { TripCompletionAnalysis } from '../services/planning/TripCompletionService';
import EnhancedTripResults from '@/components/Route66TripCalculator/components/TripResults';

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
      <EnhancedTripResults
        tripPlan={tripPlan}
        tripStartDate={validTripStartDate}
        completionAnalysis={completionAnalysis}
        originalRequestedDays={originalRequestedDays}
        onShareTrip={onShareTrip}
      />
    </div>
  );
};

export default TripCalculatorResults;
