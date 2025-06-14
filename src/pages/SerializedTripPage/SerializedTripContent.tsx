
import React from 'react';
import { SerializedTripData } from '@/components/TripCalculator/services/TripDataSerializer';
import SerializedTripOverview from './SerializedTripOverview';
import SerializedDailyItinerary from './SerializedDailyItinerary';

interface SerializedTripContentProps {
  tripData: SerializedTripData;
  shareUrl?: string;
}

const SerializedTripContent: React.FC<SerializedTripContentProps> = ({
  tripData,
  shareUrl
}) => {
  const segments = tripData.tripPlan.segments || [];

  return (
    <div className="bg-white text-black font-sans">
      <SerializedTripOverview 
        tripPlan={tripData.tripPlan}
        tripStartDate={tripData.tripStartDate}
        weatherDataCount={Object.keys(tripData.weatherData).length}
      />

      <SerializedDailyItinerary 
        segments={segments}
        tripStartDate={tripData.tripStartDate}
        weatherData={tripData.weatherData}
      />

      {/* Share URL section */}
      {shareUrl && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
            🌤️ Share This Weather-Enabled Trip
          </h4>
          <p className="text-sm text-blue-600 mb-2">
            This link includes live weather forecasts for each day of your trip.
          </p>
          <p className="text-xs text-blue-600 break-all font-mono">{shareUrl}</p>
        </div>
      )}
    </div>
  );
};

export default SerializedTripContent;
