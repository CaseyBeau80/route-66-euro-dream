
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

  // Extract trip plan and start date from the saved trip data
  const tripPlan = trip.trip_data;
  const tripStartDate = tripPlan.startDate;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <SharedTripContentRenderer
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
        shareUrl={shareUrl}
        isSharedView={true}
      />
    </div>
  );
};

export default TripDetailsContent;
