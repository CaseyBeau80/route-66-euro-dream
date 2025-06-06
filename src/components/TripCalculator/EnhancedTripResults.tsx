
import React, { useState } from 'react';
import { TripPlan } from './services/planning/TripPlanBuilder';
import TripOverviewCard from './components/TripOverviewCard';
import TripItinerary from './components/TripItinerary';
import CostEstimatorForm from './components/CostEstimatorForm';
import CostBreakdownDisplay from './components/CostBreakdownDisplay';
import TripAdjustmentNotice from './components/TripAdjustmentNotice';
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
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  const { costData, setCostData, costEstimate } = useCostEstimator(tripPlan);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleShare = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        console.log('📋 Trip URL copied to clipboard');
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Trip Adjustment Notice */}
      {tripPlan.wasAdjusted && tripPlan.originalDays && (
        <TripAdjustmentNotice
          originalDays={tripPlan.originalDays}
          adjustedDays={tripPlan.totalDays}
          driveTimeBalance={tripPlan.driveTimeBalance}
        />
      )}

      {/* Trip Overview Card */}
      <TripOverviewCard
        tripPlan={tripPlan}
        shareUrl={shareUrl}
        tripStartDate={tripStartDate}
        costEstimate={costEstimate}
        showCostEstimator={showCostEstimator}
        setShowCostEstimator={setShowCostEstimator}
        formatTime={formatTime}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        handleShare={handleShare}
      />

      {/* Cost Estimator Section */}
      {showCostEstimator && (
        <div className="space-y-6">
          <CostEstimatorForm 
            costData={costData}
            setCostData={setCostData}
          />
          
          {costEstimate && (
            <CostBreakdownDisplay 
              costEstimate={costEstimate}
              groupSize={costData.groupSize}
            />
          )}
        </div>
      )}

      {/* Daily Itinerary */}
      <TripItinerary
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        formatTime={formatTime}
      />
    </div>
  );
};

export default EnhancedTripResults;
