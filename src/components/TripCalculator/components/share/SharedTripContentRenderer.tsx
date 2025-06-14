
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { useCostEstimator } from '../../hooks/useCostEstimator';
import SharedTripOverview from './SharedTripOverview';
import SharedDailyItinerary from './SharedDailyItinerary';

interface SharedTripContentRendererProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  shareUrl?: string | null;
  isSharedView?: boolean;
}

const SharedTripContentRenderer: React.FC<SharedTripContentRendererProps> = ({
  tripPlan,
  tripStartDate,
  shareUrl,
  isSharedView = false
}) => {
  const { costEstimate } = useCostEstimator(tripPlan);
  const segments = tripPlan.segments || [];

  return (
    <div className="bg-white text-black font-sans">
      <SharedTripOverview 
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        costEstimate={costEstimate}
      />

      <SharedDailyItinerary 
        segments={segments}
        tripStartDate={tripStartDate}
      />

      {/* Share URL section for shared view */}
      {isSharedView && shareUrl && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-700 mb-2">Share This Trip</h4>
          <p className="text-sm text-blue-600 break-all font-mono">{shareUrl}</p>
        </div>
      )}
    </div>
  );
};

export default SharedTripContentRenderer;
