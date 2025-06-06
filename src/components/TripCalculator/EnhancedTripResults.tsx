
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar, DollarSign } from 'lucide-react';
import { TripPlan } from './services/planning/TripPlanBuilder';
import TripItinerary from './components/TripItinerary';
import ShareAndExportDropdown from './components/ShareAndExportDropdown';
import { format, addDays } from 'date-fns';
import { useUnits } from '@/contexts/UnitContext';
import { useCostEstimator } from './hooks/useCostEstimator';

interface EnhancedTripResultsProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
}

const EnhancedTripResults: React.FC<EnhancedTripResultsProps> = ({
  tripPlan,
  shareUrl,
  tripStartDate
}) => {
  const { formatDistance } = useUnits();
  const { costEstimate } = useCostEstimator(tripPlan);

  console.log("🌤️ EnhancedTripResults: Rendering with cost data:", {
    segmentsCount: tripPlan.segments.length,
    hasStartDate: !!tripStartDate,
    hasCostEstimate: !!costEstimate,
    startDate: tripStartDate?.toISOString()
  });

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatStartDate = (date?: Date): string => {
    if (!date) return 'Not specified';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const calculateEndDate = (): Date | null => {
    if (!tripStartDate) return null;
    return addDays(tripStartDate, tripPlan.totalDays - 1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const endDate = calculateEndDate();
  const tripTitle = tripPlan.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Adventure`;

  return (
    <div className="space-y-6 trip-content" data-trip-content="true">
      {/* Trip Overview Header - Updated to Blue Theme */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-white">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-blue-700 flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6" />
            Your Route 66 Adventure
          </CardTitle>
          <div className="text-gray-600 mt-2 space-y-1">
            <p>{tripPlan.startCity} → {tripPlan.endCity}</p>
            {tripStartDate && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 text-sm">
                <span>Starts: {formatStartDate(tripStartDate)}</span>
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
        <CardContent>
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
              <div className="text-sm font-semibold text-gray-800">{formatTime(tripPlan.totalDrivingTime)}</div>
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

          {/* Share and Export Actions */}
          <div className="flex justify-center mt-4">
            <ShareAndExportDropdown
              shareUrl={shareUrl}
              tripTitle={tripTitle}
              tripPlan={tripPlan}
              tripStartDate={tripStartDate}
              variant="primary"
              size="default"
            />
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary with Weather Integration */}
      <TripItinerary 
        tripPlan={tripPlan} 
        tripStartDate={tripStartDate}
      />
    </div>
  );
};

export default EnhancedTripResults;
