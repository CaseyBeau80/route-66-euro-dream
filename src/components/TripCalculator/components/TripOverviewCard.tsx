
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar, DollarSign, ChevronDown, ChevronUp, Cloud } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useCostEstimator } from '../hooks/useCostEstimator';
import TripStatsGrid from './TripStatsGrid';
import ShareAndExportDropdown from './ShareAndExportDropdown';
import SegmentWeatherWidget from './SegmentWeatherWidget';

interface TripOverviewCardProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
  showCostEstimator: boolean;
  setShowCostEstimator: (show: boolean) => void;
  formatTime: (hours: number) => string;
  formatDate: (date: Date) => string;
  handleShare: () => void;
}

const TripOverviewCard: React.FC<TripOverviewCardProps> = ({
  tripPlan,
  shareUrl,
  tripStartDate,
  showCostEstimator,
  setShowCostEstimator,
  formatTime,
  formatDate,
  handleShare
}) => {
  console.log("🌤️ TripOverviewCard: Rendering with weather data for trip:", tripPlan.segments.length, "segments");
  
  const { costEstimate } = useCostEstimator(tripPlan);
  
  // Calculate end date
  const calculateEndDate = () => {
    if (tripStartDate && tripPlan.segments.length > 0) {
      return addDays(tripStartDate, tripPlan.segments.length - 1);
    }
    return null;
  };

  const endDate = calculateEndDate();

  // Get the last segment for destination weather
  const lastSegment = tripPlan.segments[tripPlan.segments.length - 1];

  // FIXED: Remove any header logic from TripOverviewCard - let SegmentWeatherWidget handle it entirely
  console.log('🔧 FIXED: TripOverviewCard completely removed weather header logic:', {
    lastSegmentCity: lastSegment?.endCity,
    hasTripStartDate: !!tripStartDate,
    willShowWeatherWidget: !!(tripStartDate && lastSegment)
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tripTitle = tripPlan.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Adventure`;

  return (
    <Card className="vintage-paper-texture border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center justify-between">
          <CardTitle className="font-route66 text-xl flex items-center gap-2 text-white">
            <MapPin className="h-6 w-6" />
            YOUR ROUTE 66 ADVENTURE
          </CardTitle>
          <ShareAndExportDropdown
            tripPlan={tripPlan}
            shareUrl={shareUrl}
            tripTitle={tripTitle}
            tripStartDate={tripStartDate}
            variant="secondary"
            size="sm"
            className="flex-shrink-0"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <TripStatsGrid
          tripPlan={tripPlan}
          formatTime={formatTime}
        />

        {/* FIXED: Weather Information Section - Static title only */}
        {tripStartDate && lastSegment && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Destination Weather</h3>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
              <SegmentWeatherWidget 
                segment={lastSegment}
                tripStartDate={tripStartDate}
                cardIndex={0}
                tripId="overview"
                sectionKey="destination-weather"
                forceExpanded={true}
              />
            </div>
          </div>
        )}

        {/* Cost Estimator Toggle */}
        <div className="mb-6">
          <Button
            onClick={() => setShowCostEstimator(!showCostEstimator)}
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            {showCostEstimator ? 'Hide' : 'Show'} Cost Estimator
            {showCostEstimator ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        {/* Route Summary */}
        <div className="text-center mb-6">
          <h3 className="font-travel font-bold text-route66-text-primary text-lg mb-2">
            Your Journey: {tripPlan.startCity} → {tripPlan.endCity}
          </h3>
          <div className="flex justify-center items-center gap-4 text-sm text-route66-text-secondary flex-wrap">
            {tripStartDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Starts {formatDate(tripStartDate)}</span>
              </div>
            )}
            {endDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Ends {formatDate(endDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(tripPlan.totalDrivingTime)} driving</span>
            </div>
            {costEstimate && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{formatCurrency(costEstimate.breakdown.totalCost)} estimated</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripOverviewCard;
