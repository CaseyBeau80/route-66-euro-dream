
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useUnits } from '@/contexts/UnitContext';
import ItineraryCardHeader from './ItineraryCardHeader';
import ItineraryCardStats from './ItineraryCardStats';
import ItineraryCardDates from './ItineraryCardDates';
import ItineraryCardActions from './ItineraryCardActions';
import { formatTime } from './utils/itineraryCardUtils';

interface ItineraryCardProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  tripStyle?: string;
  onViewDetails?: () => void;
  className?: string;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({
  tripPlan,
  tripStartDate,
  tripStyle = 'balanced',
  onViewDetails,
  className = ''
}) => {
  const { formatDistance } = useUnits();

  return (
    <div className={className} data-testid="itinerary-card">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <ItineraryCardHeader tripPlan={tripPlan} tripStyle={tripStyle} />

        <CardContent className="p-6">
          <ItineraryCardStats tripPlan={tripPlan} />
          
          <ItineraryCardDates tripPlan={tripPlan} tripStartDate={tripStartDate} />

          <ItineraryCardActions onViewDetails={onViewDetails} />

          {/* ARIA Live Region for Dynamic Updates */}
          <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
            Trip summary updated: {tripPlan.totalDays} day journey from {tripPlan.startCity} to {tripPlan.endCity}, 
            covering {formatDistance(tripPlan.totalDistance)} with {formatTime(tripPlan.totalDrivingTime)} of driving time.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItineraryCard;
