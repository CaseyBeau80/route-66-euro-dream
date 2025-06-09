
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
  console.log('🎯 TripDetailsContent: Rendering shared trip', {
    trip,
    tripData: trip.trip_data,
    shareUrl
  });

  // Extract trip plan and start date from the saved trip data
  const tripPlan = trip.trip_data;
  
  // Use the correct property name from TripPlan interface
  const tripStartDate = tripPlan.startDate || undefined;
  
  console.log('🎯 TripDetailsContent: Extracted data', {
    tripPlan,
    tripStartDate,
    hasSegments: !!(tripPlan.segments || tripPlan.dailySegments),
    segmentsCount: (tripPlan.segments || tripPlan.dailySegments || []).length
  });

  // Ensure we have valid trip data
  if (!tripPlan || (!tripPlan.segments && !tripPlan.dailySegments)) {
    console.error('❌ TripDetailsContent: Invalid trip data', { tripPlan });
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Data Not Available</h2>
        <p className="text-gray-600">The trip data could not be loaded. Please try refreshing the page.</p>
      </div>
    );
  }

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
