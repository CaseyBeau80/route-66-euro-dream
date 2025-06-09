
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
  console.log('🎯 TripDetailsContent: Starting render', {
    trip,
    tripData: trip.trip_data,
    shareUrl,
    hasTrip: !!trip,
    hasTripData: !!trip.trip_data,
    tripDataType: typeof trip.trip_data
  });

  // Extract trip plan and start date from the saved trip data
  const tripPlan = trip.trip_data;
  
  // Use the correct property name from TripPlan interface
  const tripStartDate = tripPlan.startDate || undefined;
  
  console.log('🎯 TripDetailsContent: Extracted data', {
    tripPlan,
    tripStartDate,
    hasSegments: !!(tripPlan.segments || tripPlan.dailySegments),
    segmentsCount: (tripPlan.segments || tripPlan.dailySegments || []).length,
    tripPlanKeys: Object.keys(tripPlan || {}),
    segments: tripPlan.segments,
    dailySegments: tripPlan.dailySegments
  });

  // Ensure we have valid trip data
  if (!tripPlan) {
    console.error('❌ TripDetailsContent: No trip plan data', { tripPlan });
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center w-full min-h-[400px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Data Not Available</h2>
        <p className="text-gray-600">The trip data could not be loaded. Please try refreshing the page.</p>
      </div>
    );
  }

  if (!tripPlan.segments && !tripPlan.dailySegments) {
    console.error('❌ TripDetailsContent: No segments found', { 
      tripPlan,
      hasSegments: !!tripPlan.segments,
      hasDailySegments: !!tripPlan.dailySegments,
      segmentsLength: tripPlan.segments?.length,
      dailySegmentsLength: tripPlan.dailySegments?.length
    });
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center w-full min-h-[400px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Data Not Available</h2>
        <p className="text-gray-600">The trip data could not be loaded. Please try refreshing the page.</p>
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm text-left">
          <strong>Debug Info:</strong>
          <pre>{JSON.stringify(tripPlan, null, 2)}</pre>
        </div>
      </div>
    );
  }

  console.log('🎯 TripDetailsContent: About to render SharedTripContentRenderer');

  try {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
        <SharedTripContentRenderer
          tripPlan={tripPlan}
          tripStartDate={tripStartDate}
          shareUrl={shareUrl}
          isSharedView={true}
        />
      </div>
    );
  } catch (error) {
    console.error('❌ TripDetailsContent: Error rendering SharedTripContentRenderer', error);
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 text-center w-full min-h-[400px]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rendering Error</h2>
        <p className="text-gray-600">There was an error displaying the trip content.</p>
        <div className="mt-4 p-4 bg-red-100 rounded text-sm text-left">
          <strong>Error:</strong> {error instanceof Error ? error.message : String(error)}
        </div>
      </div>
    );
  }
};

export default TripDetailsContent;
