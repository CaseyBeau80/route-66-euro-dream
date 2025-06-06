
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar, Share2, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import TripStatsGrid from './TripStatsGrid';

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
  return (
    <Card className="vintage-paper-texture border-2 border-route66-border">
      <CardHeader className="bg-gradient-to-r from-route66-primary to-route66-primary-light">
        <CardTitle className="font-route66 text-xl text-center flex items-center justify-center gap-2 text-white">
          <MapPin className="h-6 w-6" />
          YOUR ROUTE 66 ADVENTURE
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <TripStatsGrid
          tripPlan={tripPlan}
          costEstimate={costEstimate}
          formatTime={formatTime}
          formatCurrency={formatCurrency}
        />

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
          <div className="flex justify-center items-center gap-4 text-sm text-route66-text-secondary">
            {tripStartDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Starts {formatDate(tripStartDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(tripPlan.totalDrivingTime)} driving</span>
            </div>
          </div>
        </div>

        {shareUrl && (
          <div className="text-center">
            <Button 
              onClick={handleShare}
              className="bg-route66-primary hover:bg-route66-primary-dark text-white"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Trip Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripOverviewCard;
