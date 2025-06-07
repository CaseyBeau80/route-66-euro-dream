
import React from 'react';
import { TripPlanningResult } from '../../TripCalculator/services/planning/UnifiedTripPlanningService';
import { getTripStyleDisplayName, getTripStyleDescription } from '../utils/tripStyleUtils';

interface TripStyleIndicatorProps {
  planningResult: TripPlanningResult;
}

const TripStyleIndicator: React.FC<TripStyleIndicatorProps> = ({ planningResult }) => {
  return (
    <div className="mb-4 p-4 bg-route66-background-alt rounded-lg border border-route66-border">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-medium text-route66-text-primary">
            Trip Style: {getTripStyleDisplayName(planningResult.tripStyle)}
          </span>
          <p className="text-xs text-route66-text-secondary mt-1">
            {getTripStyleDescription(planningResult.tripStyle)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripStyleIndicator;
