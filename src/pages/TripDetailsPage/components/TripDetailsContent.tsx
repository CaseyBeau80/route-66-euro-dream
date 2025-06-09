
import React from 'react';
import { SavedTrip } from '@/components/TripCalculator/services/TripService';
import SharedTripContentRenderer from '@/components/TripCalculator/components/share/SharedTripContentRenderer';

interface TripDetailsContentProps {
  trip: SavedTrip;
  shareUrl: string;
}

const TripDetailsContent: React.FC<TripDetailsContentProps> = ({
  trip,
  shareUrl
}) => {
  console.log('🎯 TripDetailsContent: Rendering shared trip using SharedTripContentRenderer');

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <SharedTripContentRenderer
        tripPlan={trip.tripPlan}
        tripStartDate={trip.tripStartDate}
        shareUrl={shareUrl}
        isSharedView={true}
      />
    </div>
  );
};

export default TripDetailsContent;
