
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar, DollarSign, ChevronDown, ChevronUp, Cloud } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import TripStatsGrid from './TripStatsGrid';
import ShareTripButton from './ShareTripButton';
import SegmentWeatherWidget from './SegmentWeatherWidget';

interface TripOverviewCardProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
  costEstimate: any;
  showCostEstimator: boolean;
  setShowCostEstimator: (show: boolean) => void;
  formatTime: (hours: number) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  handleShare: () => void;
}

const TripOverviewCard: React.FC<TripOverviewCardProps> = ({
  tripPlan,
  shareUrl,
  tripStartDate,
  costEstimate,
  showCostEstimator,
  setShowCostEstimator,
  formatTime,
  formatCurrency,
  formatDate,
  handleShare
}) => {
  console.log("🌤️ TripOverviewCard: Rendering with weather data for trip:", tripPlan.segments.length, "segments");
  
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

  return (
    <Card className="vintage-paper-texture border-2 border-route66-border">
      <CardHeader className="bg-gradient-to-r from-route66-primary to-route66-primary-light">
        <div className="flex items-center justify-between">
          <CardTitle className="font-route66 text-xl flex items-center gap-2 text-white">
            <MapPin className="h-6 w-6" />
            YOUR ROUTE 66 ADVENTURE
          </CardTitle>
          <ShareTripButton
            tripPlan={tripPlan}
            shareUrl={shareUrl}
            tripStartDate={tripStartDate}
            variant="primary"
            size="sm"
            className="flex-shrink-0"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <TripStatsGrid
          tripPlan={tripPlan}
          costEstimate={costEstimate}
          formatTime={formatTime}
          formatCurrency={formatCurrency}
        />

        {/* Weather Information Section - Now prominently displayed and always visible */}
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
            className="w-full border-route66-accent-success text-route66-accent-success hover:bg-route66-accent-success hover:text-white"
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripOverviewCard;
