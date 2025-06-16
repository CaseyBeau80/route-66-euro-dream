
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar, DollarSign } from 'lucide-react';
import { TripPlan } from './services/planning/TripPlanTypes';
import TripItinerary from './components/TripItinerary';
import TripActionBar from './components/TripActionBar';
import ItineraryPreLoader from './components/ItineraryPreLoader';
import { format, addDays } from 'date-fns';
import { useUnits } from '@/contexts/UnitContext';
import { useCostEstimator } from './hooks/useCostEstimator';

interface EnhancedTripResultsProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
  loadingState?: {
    isPreLoading: boolean;
    progress: number;
    currentStep: string;
    totalSegments: number;
    loadedSegments: number;
    isReady: boolean;
  };
}

const EnhancedTripResults: React.FC<EnhancedTripResultsProps> = ({
  tripPlan,
  shareUrl,
  tripStartDate,
  loadingState
}) => {
  const { formatDistance } = useUnits();
  
  // Add safety check for tripPlan
  if (!tripPlan) {
    console.error('❌ EnhancedTripResults: tripPlan is null or undefined');
    return null;
  }

  const { costEstimate } = useCostEstimator(tripPlan);

  // Safely convert tripStartDate to a valid Date object
  const validTripStartDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    
    if (tripStartDate instanceof Date) {
      return isNaN(tripStartDate.getTime()) ? undefined : tripStartDate;
    }
    
    if (typeof tripStartDate === 'string') {
      const parsed = new Date(tripStartDate);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    
    return undefined;
  }, [tripStartDate]);

  // Show pre-loader if loading
  if (loadingState?.isPreLoading) {
    return (
      <div id="trip-results" className="space-y-6 trip-content" data-trip-content="true">
        <ItineraryPreLoader
          progress={loadingState.progress}
          currentStep={loadingState.currentStep}
          totalSegments={loadingState.totalSegments}
          loadedSegments={loadingState.loadedSegments}
        />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatStartDate = (date?: Date): string => {
    if (!date) return 'Not specified';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const calculateEndDate = (): Date | null => {
    if (!validTripStartDate) return null;
    return addDays(validTripStartDate, tripPlan.totalDays - 1);
  };

  const endDate = calculateEndDate();

  // PREVIEW FORM LOGIC: Calculate total drive time using preview form logic
  const getPreviewFormTotalDriveTime = (): number => {
    if (!tripPlan.segments?.length) return 0;
    
    return tripPlan.segments.reduce((total, segment) => {
      const miles = segment.approximateMiles || segment.distance || 0;
      const hours = miles / 60; // Same calculation as preview form
      return total + hours;
    }, 0);
  };
  
  const totalDrivingTime = getPreviewFormTotalDriveTime();
  
  // PREVIEW FORM LOGIC: Use same formatTime function as preview form
  const formatTime = (hours?: number): string => {
    if (!hours) return 'N/A';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };
  
  console.log('🚗 PREVIEW FORM: Drive time check in EnhancedTripResults:', {
    totalDrivingTime,
    formatted: formatTime(totalDrivingTime),
    segmentCount: tripPlan.segments?.length,
    usingPreviewFormLogic: true
  });

  return (
    <div id="trip-results" className="space-y-6 trip-content" data-trip-content="true">
      {/* Trip Overview Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6" />
            Your Route 66 Adventure
          </CardTitle>
          <div className="text-blue-100 mt-2 space-y-1 text-center">
            <p>{tripPlan.startCity} → {tripPlan.endCity}</p>
            {validTripStartDate && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 text-sm">
                <span>Starts: {formatStartDate(validTripStartDate)}</span>
                {endDate && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>Ends: {formatStartDate(endDate)}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Four-Column Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-gray-800">{tripPlan.totalDays} Days</div>
              <div className="text-xs text-gray-600">Duration</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-gray-800">{formatDistance(tripPlan.totalDistance)}</div>
              <div className="text-xs text-gray-600">Total Distance</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-gray-800">{formatTime(totalDrivingTime)}</div>
              <div className="text-xs text-gray-600">Drive Time</div>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <DollarSign className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-gray-800">
                {costEstimate ? formatCurrency(costEstimate.breakdown.totalCost) : '--'}
              </div>
              <div className="text-xs text-gray-600">Est. Cost</div>
            </div>
          </div>

          {/* Action Bar with Google Calendar, .ics download, Email sharing */}
          <TripActionBar
            tripPlan={tripPlan}
            tripStartDate={validTripStartDate}
            shareUrl={shareUrl}
          />
        </CardContent>
      </Card>

      {/* Daily Itinerary with Weather Integration */}
      <TripItinerary 
        tripPlan={tripPlan} 
        tripStartDate={validTripStartDate}
        loadingState={loadingState}
      />
    </div>
  );
};

export default EnhancedTripResults;
