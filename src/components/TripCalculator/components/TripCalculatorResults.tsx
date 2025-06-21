
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
  // FIXED: Ensure valid tripStartDate with fallback to today
  const validTripStartDate = React.useMemo(() => {
    if (tripStartDate && !isNaN(tripStartDate.getTime())) {
      console.log('✅ FIXED CALCULATOR: Using provided tripStartDate:', tripStartDate.toISOString());
      return tripStartDate;
    }
    
    // If no date provided, use today as default for weather calculations
    const today = new Date();
    today.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    console.log('🔄 FIXED CALCULATOR: Using today as fallback tripStartDate:', today.toISOString());
    return today;
  }, [tripStartDate]);

  console.log('🎯 FIXED TripCalculatorResults render:', {
    hasTripPlan: !!tripPlan,
    hasCalculation: !!calculation,
    validTripStartDate: validTripStartDate.toISOString(),
    hasCompletionAnalysis: !!completionAnalysis,
    originalRequestedDays,
    fixedDateHandling: true
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
