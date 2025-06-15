
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Calendar, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useCostEstimator } from '../hooks/useCostEstimator';
import TripStatsGrid from './TripStatsGrid';
import TripActionBar from './TripActionBar';

interface TripOverviewCardProps {
  tripPlan: TripPlan;
  shareUrl?: string | null;
  tripStartDate?: Date;
  showCostEstimator: boolean;
  setShowCostEstimator: (show: boolean) => void;
  formatTime: (hours: number) => string;
  formatDate: (date: Date) => string;
  handleShare: () => void;
  onShowMap?: () => void;
}

const TripOverviewCard: React.FC<TripOverviewCardProps> = ({
  tripPlan,
  shareUrl,
  tripStartDate,
  showCostEstimator,
  setShowCostEstimator,
  formatTime,
  formatDate,
  handleShare,
  onShowMap
}) => {
  const { costEstimate } = useCostEstimator(tripPlan);
  
  // Calculate end date
  const calculateEndDate = () => {
    if (tripStartDate && tripPlan.segments.length > 0) {
      return addDays(tripStartDate, tripPlan.segments.length - 1);
    }
    return null;
  };

  const endDate = calculateEndDate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700">
        <CardTitle className="font-route66 text-xl flex items-center gap-2 text-white">
          <MapPin className="h-6 w-6" />
          YOUR ROUTE 66 ADVENTURE
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <TripStatsGrid
          tripPlan={tripPlan}
          formatTime={formatTime}
        />

        {/* Cost Estimator Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowCostEstimator(!showCostEstimator)}
            className="w-full border border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
          >
            <DollarSign className="h-4 w-4" />
            {showCostEstimator ? 'Hide' : 'Show'} Cost Estimator
            {showCostEstimator ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
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

        {/* Action Bar */}
        <TripActionBar
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          shareUrl={shareUrl}
          onShowMap={onShowMap}
        />
      </CardContent>
    </Card>
  );
};

export default TripOverviewCard;
