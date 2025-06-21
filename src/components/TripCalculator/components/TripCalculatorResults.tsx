
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
  console.log('🔧 TripCalculatorResults: Received props:', {
    hasTripPlan: !!tripPlan,
    hasCalculation: !!calculation,
    tripStartDate: tripStartDate?.toISOString(),
    tripStartDateType: typeof tripStartDate,
    tripStartDateValid: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime()),
    originalRequestedDays
  });

  // CRITICAL FIX: Ensure valid tripStartDate with comprehensive validation and fallback
  const validTripStartDate = React.useMemo(() => {
    console.log('🔧 TripCalculatorResults: Validating tripStartDate:', {
      inputDate: tripStartDate,
      inputType: typeof tripStartDate,
      isDate: tripStartDate instanceof Date,
      isValidDate: tripStartDate instanceof Date && !isNaN(tripStartDate.getTime()),
      timestamp: Date.now()
    });

    // Check if we have a valid Date object
    if (tripStartDate instanceof Date && !isNaN(tripStartDate.getTime())) {
      // Normalize to prevent timezone issues
      const normalized = new Date(
        tripStartDate.getFullYear(),
        tripStartDate.getMonth(),
        tripStartDate.getDate(),
        12, 0, 0, 0
      );
      console.log('✅ TripCalculatorResults: Using provided tripStartDate:', {
        original: tripStartDate.toISOString(),
        normalized: normalized.toISOString(),
        localDate: normalized.toLocaleDateString()
      });
      return normalized;
    }
    
    // Fallback to today with proper normalization
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0, 0);
    console.log('🔄 TripCalculatorResults: Using today as fallback:', {
      today: today.toISOString(),
      normalized: normalizedToday.toISOString(),
      localDate: normalizedToday.toLocaleDateString(),
      reason: tripStartDate ? 'invalid_date' : 'no_date_provided'
    });
    return normalizedToday;
  }, [tripStartDate]);

  console.log('🎯 TripCalculatorResults rendering with valid date:', {
    hasTripPlan: !!tripPlan,
    hasCalculation: !!calculation,
    validTripStartDate: validTripStartDate.toISOString(),
    validTripStartLocal: validTripStartDate.toLocaleDateString(),
    hasCompletionAnalysis: !!completionAnalysis,
    originalRequestedDays,
    weatherSystemFixed: true
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
